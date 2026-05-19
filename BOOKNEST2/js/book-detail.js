// ════════════════════════════════════════════
//  issue-return.js — Issue & Return page JS
//  Depends on: books-data.js (load first)
// ════════════════════════════════════════════

// ── HELPERS ──
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let toastTimer;
const showToast = (msg, isErr = false) => {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast' + (isErr ? ' err' : '');
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
};

const today = new Date();
const due7  = new Date();
due7.setDate(today.getDate() + 7);

const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

$('#dueDateDisplay').textContent = fmtDate(due7);

const getIssued   = () => JSON.parse(localStorage.getItem('issuedBooks')   || '[]');
const saveIssued  = d  => localStorage.setItem('issuedBooks', JSON.stringify(d));
const getHistory  = () => JSON.parse(localStorage.getItem('returnHistory') || '[]');
const saveHistory = d  => localStorage.setItem('returnHistory', JSON.stringify(d));

// ── POPULATE DROPDOWN ──
const populateSelect = () => {
  const sel = $('#issueBookSelect');
  while (sel.options.length > 1) sel.remove(1);
  Array.from(sel.querySelectorAll('optgroup')).forEach(g => g.remove());

  const issuedIds = getIssued().filter(r => r.status === 'issued').map(r => r.bookId);
  const genres    = [...new Set(BOOKS.map(b => b.genre))];

  genres.forEach(genre => {
    const grp = document.createElement('optgroup');
    grp.label = `── ${genre} ──`;
    BOOKS.filter(b => b.genre === genre).forEach(b => {
      const alreadyIssued = issuedIds.includes(b.id) || b.status === 'issued';
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.textContent = alreadyIssued
        ? `${b.title}  (Currently Issued)`
        : `${b.title} — ${b.author}`;
      opt.disabled = alreadyIssued;
      if (alreadyIssued) opt.style.color = '#9a9a7a';
      grp.appendChild(opt);
    });
    sel.appendChild(grp);
  });
};

// ── BOOK PREVIEW ──
$('#issueBookSelect').addEventListener('change', () => {
  const id   = parseInt($('#issueBookSelect').value);
  if (!id) { $('#bookPreview').classList.remove('visible'); return; }
  const book = BOOKS.find(b => b.id === id);
  if (!book) return;

  $('#previewCover').style.background = book.cover;
  $('#previewCover').textContent = book.title;
  $('#previewTitle').textContent = book.title;
  $('#previewAuthor').textContent = `by ${book.author}`;
  $('#previewGenre').textContent = book.genre;
  const sb = $('#previewStatus');
  sb.textContent = 'Available';
  sb.className = 'badge badge-available';
  $('#bookPreview').classList.add('visible');
});

// ── ISSUE SUBMIT ──
$('#issueSubmitBtn').addEventListener('click', () => {
  const name   = $('#issueName').value.trim();
  const roll   = $('#issueRoll').value.trim();
  const bookId = parseInt($('#issueBookSelect').value);
  let valid    = true;

  [$('#issueName'), $('#issueRoll'), $('#issueBookSelect')].forEach(el => el.classList.remove('error'));
  [$('#issueNameErr'), $('#issueRollErr'), $('#issueBookErr')].forEach(el => el.classList.remove('show'));

  if (!name)   { $('#issueName').classList.add('error');       $('#issueNameErr').classList.add('show'); valid = false; }
  if (!roll)   { $('#issueRoll').classList.add('error');        $('#issueRollErr').classList.add('show'); valid = false; }
  if (!bookId) { $('#issueBookSelect').classList.add('error'); $('#issueBookErr').classList.add('show'); valid = false; }
  if (!valid)  return;

  const book      = BOOKS.find(b => b.id === bookId);
  const issuedIds = getIssued().filter(r => r.status === 'issued').map(r => r.bookId);
  if (issuedIds.includes(bookId)) { showToast('This book is already issued!', true); return; }

  const dueStr = fmtDate(due7);
  const record = { bookId, title: book.title, author: book.author, student: name, roll, issuedOn: fmtDate(today), dueDate: dueStr, status: 'issued', issuedTimestamp: today.getTime() };
  const issued = getIssued();
  issued.push(record);
  saveIssued(issued);

  $('#issueName').value = '';
  $('#issueRoll').value = '';
  $('#issueBookSelect').value = '';
  $('#bookPreview').classList.remove('visible');

  populateSelect();
  renderIssuedTable();
  renderReturnTable();
  renderStats();
  showToast(`✦ "${book.title}" issued to ${name}! Due: ${dueStr}`);
});

// ── ISSUED TABLE ──
const renderIssuedTable = () => {
  const active = getIssued().filter(r => r.status === 'issued');
  const tbody  = $('#issuedTableBody');

  if (!active.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-table"><div class="ei">📖</div><p>No books currently issued.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = active.map(r => {
    const isOD = today > new Date(r.dueDate);
    const days = isOD ? Math.ceil((today - new Date(r.dueDate)) / 86400000) : 0;
    return `<tr>
      <td class="book-name">${r.title}</td>
      <td>${r.student}<br><span style="font-size:10px;color:var(--text-light)">${r.roll}</span></td>
      <td class="${isOD ? 'overdue-text' : ''}">${r.dueDate}${isOD ? ` <span class="fine-pill">+${days}d</span>` : ''}</td>
      <td><span class="badge badge-issued">Issued</span></td>
    </tr>`;
  }).join('');
};

// ── STATS ──
const renderStats = () => {
  const active  = getIssued().filter(r => r.status === 'issued');
  const overdue = active.filter(r => today > new Date(r.dueDate));
  $('#statTotal').textContent   = active.length;
  $('#statActive').textContent  = active.length - overdue.length;
  $('#statOverdue').textContent = overdue.length;
};

// ── RETURN TABLE ──
let selectedReturnIdx = null;

const renderReturnTable = () => {
  const active = getIssued().filter(r => r.status === 'issued');
  const tbody  = $('#returnTableBody');

  if (!active.length) {
    tbody.innerHTML = `<tr><td colspan="3"><div class="empty-table"><div class="ei">📖</div><p>No books currently issued.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = active.map((r, i) => {
    const isOD = today > new Date(r.dueDate);
    return `<tr class="clickable-row" data-idx="${i}" onclick="selectReturn(${i})">
      <td class="book-name">${r.title}</td>
      <td>${r.student}<br><span style="font-size:10px;color:var(--text-light)">${r.roll}</span></td>
      <td class="${isOD ? 'overdue-text' : ''}">${r.dueDate}</td>
    </tr>`;
  }).join('');
};

// ── SELECT RETURN ──
const selectReturn = (idx) => {
  const active = getIssued().filter(r => r.status === 'issued');
  const rec    = active[idx];
  if (!rec) return;
  selectedReturnIdx = idx;

  $$('.clickable-row').forEach((tr, i) => tr.classList.toggle('selected', i === idx));

  const isOD = today > new Date(rec.dueDate);
  const days = isOD ? Math.ceil((today - new Date(rec.dueDate)) / 86400000) : 0;
  const fine = days * 5;

  $('#rrTitle').textContent    = rec.title;
  $('#rrSub').textContent      = `by ${rec.author || '—'}`;
  $('#rrStudent').textContent  = rec.student;
  $('#rrRoll').textContent     = rec.roll;
  $('#rrIssuedOn').textContent = rec.issuedOn;
  $('#rrDue').textContent      = rec.dueDate;

  const badge = $('#rrStatusBadge');
  badge.textContent = isOD ? 'Overdue' : 'Issued';
  badge.className   = `badge ${isOD ? 'badge-issued' : 'badge-available'}`;

  const fd = $('#fineDisplay');
  if (isOD) { $('#fineAmount').textContent = `₹${fine}`; $('#fineDays').textContent = days; fd.classList.add('visible'); }
  else fd.classList.remove('visible');

  $('#returnResult').classList.add('visible');
  $('#returnSubmitBtn').disabled    = false;
  $('#returnSubmitBtn').textContent = `Return "${rec.title}" →`;
};

// ── LOOKUP BY ROLL ──
$('#lookupBtn').addEventListener('click', () => {
  const roll   = $('#lookupRoll').value.trim().toLowerCase();
  if (!roll) { showToast('Enter a roll number to look up.', true); return; }
  const active = getIssued().filter(r => r.status === 'issued');
  const idx    = active.findIndex(r => r.roll.toLowerCase() === roll);
  if (idx === -1) { showToast('No active record found for that roll number.', true); return; }
  document.querySelector('[data-tab="return"]').click();
  selectReturn(idx);
});
$('#lookupRoll').addEventListener('keydown', e => { if (e.key === 'Enter') $('#lookupBtn').click(); });

// ── RETURN SUBMIT ──
$('#returnSubmitBtn').addEventListener('click', () => {
  if (selectedReturnIdx === null) return;
  const active = getIssued().filter(r => r.status === 'issued');
  const rec    = active[selectedReturnIdx];
  if (!rec) return;

  const isOD = today > new Date(rec.dueDate);
  const days = isOD ? Math.ceil((today - new Date(rec.dueDate)) / 86400000) : 0;
  const fine = days * 5;

  const all  = getIssued();
  const fIdx = all.findIndex(r => r.bookId === rec.bookId && r.roll === rec.roll && r.status === 'issued');
  if (fIdx !== -1) { all[fIdx].status = 'returned'; all[fIdx].returnedOn = fmtDate(today); all[fIdx].fine = fine; saveIssued(all); }

  const hist = getHistory();
  hist.unshift({ ...rec, status: 'returned', returnedOn: fmtDate(today), fine });
  saveHistory(hist);

  selectedReturnIdx = null;
  $('#returnResult').classList.remove('visible');
  $('#returnSubmitBtn').disabled    = true;
  $('#returnSubmitBtn').textContent = 'Select a Record to Return';
  $('#lookupRoll').value = '';

  populateSelect();
  renderIssuedTable();
  renderReturnTable();
  renderStats();
  showToast(fine > 0 ? `✦ "${rec.title}" returned! Fine: ₹${fine}` : `✦ "${rec.title}" returned! No fine.`);
});

// ── HISTORY TABLE ──
const renderHistory = () => {
  const hist  = getHistory();
  const tbody = $('#historyTableBody');
  if (!hist.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-table"><div class="ei">📋</div><p>No transactions yet.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = hist.map(r => `
    <tr>
      <td class="book-name">${r.title}</td>
      <td>${r.student}</td><td>${r.roll}</td>
      <td>${r.issuedOn}</td><td>${r.dueDate}</td>
      <td>${r.returnedOn || '—'}</td>
      <td>${r.fine > 0 ? `<span class="fine-pill">₹${r.fine}</span>` : '—'}</td>
      <td><span class="badge ${r.status === 'returned' ? 'badge-available' : 'badge-issued'}">${r.status}</span></td>
    </tr>`).join('');
};

// ── TABS ──
$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $$('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $(`#tab-${btn.dataset.tab}`).classList.add('active');
    if (btn.dataset.tab === 'history') renderHistory();
    if (btn.dataset.tab === 'return')  renderReturnTable();
  });
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  populateSelect();
  renderIssuedTable();
  renderReturnTable();
  renderStats();
  const tab = new URLSearchParams(window.location.search).get('tab');
  if (tab) { const b = document.querySelector(`[data-tab="${tab}"]`); if (b) b.click(); }
});