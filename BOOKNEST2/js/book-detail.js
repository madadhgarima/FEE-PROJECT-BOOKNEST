// ════════════════════════════════════════════
//  book-detail.js — Individual Book Detail Page
//  Depends on: books-data.js (load first)
// ════════════════════════════════════════════

// ── DOM HELPERS ──
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ── TOAST NOTIFICATION ──
let toastTimer;
const showToast = (message, isError = false) => {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast' + (isError ? ' err' : '');
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
};

// ── STORAGE HELPERS ──
const getCurrentUser = () => {
  const stored = localStorage.getItem('booknest_current_user');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return { name: 'Garima Sharma', roll: '2025CSE042' };
};

const getIssued   = () => JSON.parse(localStorage.getItem('issuedBooks')   || '[]');
const saveIssued  = (data) => localStorage.setItem('issuedBooks', JSON.stringify(data));
const getAllReviews = () => JSON.parse(localStorage.getItem('booknest_reviews') || '[]');
const saveAllReviews = (data) => localStorage.setItem('booknest_reviews', JSON.stringify(data));

const getCollection = (roll) => JSON.parse(localStorage.getItem(`booknest_collection_${roll}`) || '[]');
const saveCollection = (roll, data) => localStorage.setItem(`booknest_collection_${roll}`, JSON.stringify(data));

// ── GET BOOK BY ID FROM URL QUERY ──
const getBookFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const found = BOOKS.find(b => b.id === id);
  return found || BOOKS[0]; // fallback to first book if not found
};

// ── CHECK LIVE LIBRARY AVAILABILITY ──
const checkAvailability = (book) => {
  const issuedList = getIssued();
  const currentlyIssuedCount = issuedList.filter(r => r.bookId === book.id && r.status === 'issued').length;
  const copiesRemaining = Math.max(0, book.copies - currentlyIssuedCount);
  const isAvailable = book.status === 'available' && copiesRemaining > 0;

  return {
    isAvailable,
    copiesRemaining
  };
};

// ── RENDER BOOK DETAILS ──
const renderBookDetails = (book) => {
  // Page Title & Breadcrumbs
  document.title = `BookNest — ${book.title}`;
  if ($('#breadcrumbTitle')) $('#breadcrumbTitle').textContent = book.title;

  // Header info
  if ($('#bookTitle'))       $('#bookTitle').textContent = book.title;
  if ($('#bookAuthor'))      $('#bookAuthor').textContent = `by ${book.author}`;
  if ($('#bookGenreTag'))    $('#bookGenreTag').textContent = book.genre;
  if ($('#bookStars'))       $('#bookStars').textContent = renderStars(book.rating);

  // FULL ENGAGING DESCRIPTION (SECTION 5)
  if ($('#bookDescription')) {
    $('#bookDescription').textContent = book.description;
  }

  // Cover image / placeholder
  const coverEl = $('#bookCover');
  if (coverEl) {
    coverEl.style.background = book.cover || 'linear-gradient(135deg, #eef7ea, #fdfae8)';
    coverEl.innerHTML = `
      <img src="images/covers/${book.id}.jpg"
           alt="${book.title}"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
           style="display:none;width:100%;height:100%;object-fit:cover;border-radius:var(--radius);" />
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:20px;text-align:center;">
        <span style="font-size:36px;margin-bottom:12px;">📖</span>
        <span style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;line-height:1.2;color:var(--text-dark);">${book.title}</span>
        <span style="font-size:13px;font-style:italic;color:var(--text-mid);margin-top:6px;">by ${book.author}</span>
      </div>
    `;
  }

  // Status & Copies
  const avail = checkAvailability(book);
  if ($('#statusBadge')) {
    $('#statusBadge').textContent = avail.isAvailable ? 'Available' : 'Issued';
    $('#statusBadge').className = `badge badge-${avail.isAvailable ? 'available' : 'issued'}`;
  }
  if ($('#statusGenre'))  $('#statusGenre').textContent  = book.genre;
  if ($('#statusCopies')) $('#statusCopies').textContent = `${avail.copiesRemaining} copies`;

  // Issue Button state
  const issueBtn = $('#issueBtn');
  if (issueBtn) {
    if (!avail.isAvailable) {
      issueBtn.disabled = true;
      issueBtn.textContent = 'Currently Issued';
      issueBtn.style.opacity = '0.6';
      issueBtn.style.cursor = 'not-allowed';
    } else {
      issueBtn.disabled = false;
      issueBtn.textContent = 'Issue Now';
      issueBtn.style.opacity = '1';
      issueBtn.style.cursor = 'pointer';
    }
  }

  // Highlight Current Shelf Status if book is in user's personal collection
  const user = getCurrentUser();
  const collection = getCollection(user.roll);
  const shelfEntry = collection.find(item => item.bookId === book.id);

  $$('.shelf-btn').forEach(btn => btn.classList.remove('active'));
  if (shelfEntry) {
    const activeBtnType = shelfEntry.status === 'read' ? 'done' : shelfEntry.status;
    const matchBtn = $(`.shelf-btn[data-type="${activeBtnType}"]`);
    if (matchBtn) matchBtn.classList.add('active');
  }
};

// ── SHELF BUTTONS (Want to Read / Currently Reading / Finished) ──
const setupShelfButtons = (book) => {
  $$('.shelf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const user = getCurrentUser();
      let collection = getCollection(user.roll);
      const type = btn.dataset.type; // 'want', 'reading', 'done'
      const status = type === 'done' ? 'read' : type;

      const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      const existing = collection.find(item => item.bookId === book.id);

      if (existing) {
        existing.status = status;
      } else {
        collection.push({ bookId: book.id, status, dateAdded: dateStr });
      }

      saveCollection(user.roll, collection);

      $$('.shelf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const labels = {
        want: 'Want to Read',
        reading: 'Currently Reading',
        done: 'Finished (Read)'
      };
      showToast(`✦ Added to your shelf under "${labels[type]}"!`);
    });
  });
};

// ── ISSUE BOOK SECTION ──
const setupIssueForm = (book) => {
  const user = getCurrentUser();
  if ($('#studentName')) $('#studentName').value = user.name;
  if ($('#rollNumber'))  $('#rollNumber').value  = user.roll;

  const issueBtn = $('#issueBtn');
  if (!issueBtn) return;

  issueBtn.addEventListener('click', () => {
    const name = $('#studentName').value.trim();
    const roll = $('#rollNumber').value.trim();
    let valid = true;

    $('#nameError').classList.remove('show');
    $('#rollError').classList.remove('show');
    $('#studentName').classList.remove('error');
    $('#rollNumber').classList.remove('error');

    if (!name) {
      $('#nameError').classList.add('show');
      $('#studentName').classList.add('error');
      valid = false;
    }
    if (!roll) {
      $('#rollError').classList.add('show');
      $('#rollNumber').classList.add('error');
      valid = false;
    }
    if (!valid) return;

    const avail = checkAvailability(book);
    if (!avail.isAvailable) {
      showToast('This book is currently out of stock in the library.', true);
      return;
    }

    const today = new Date();
    const due7  = new Date();
    due7.setDate(today.getDate() + 7);
    const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const issuedList = getIssued();
    const record = {
      bookId: book.id,
      title: book.title,
      author: book.author,
      student: name,
      roll: roll,
      issuedOn: fmtDate(today),
      dueDate: fmtDate(due7),
      status: 'issued',
      issuedTimestamp: today.getTime()
    };

    issuedList.push(record);
    saveIssued(issuedList);

    // Save profile if updated
    saveCurrentUser({ name, roll });

    renderBookDetails(book);
    showToast(`✦ "${book.title}" successfully issued to ${name}! Due: ${fmtDate(due7)}`);
  });
};

// ── REVIEWS SYSTEM ──
let selectedReviewRating = 5;

const renderReviews = (book) => {
  const allReviews = getAllReviews();
  const bookReviews = allReviews.filter(r => r.bookId === book.id);

  if ($('#reviewCountTop'))    $('#reviewCountTop').textContent    = bookReviews.length;
  if ($('#reviewCountBottom')) $('#reviewCountBottom').textContent = `${bookReviews.length} reviews`;

  const reviewsList = $('#reviewsList');
  if (!reviewsList) return;

  if (bookReviews.length === 0) {
    reviewsList.innerHTML = `
      <div style="background:#fefcf2;border:1px dashed rgba(168,207,160,0.5);border-radius:12px;padding:28px 20px;text-align:center;color:var(--text-light);margin-bottom:20px;">
        <span style="font-size:24px;display:block;margin-bottom:6px;">✍️</span>
        <p style="font-size:13px;font-style:italic;">No reviews written for this book yet. Be the first student to review it!</p>
      </div>
    `;
    return;
  }

  reviewsList.innerHTML = bookReviews.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const initials = (r.student || 'S')
      .split(' ')
      .filter(Boolean)
      .map(p => p[0].toUpperCase())
      .slice(0, 2)
      .join('');

    return `
      <div class="review-card fade-in">
        <div class="review-top">
          <div class="review-meta">
            <div class="review-avatar" style="background:var(--pista-text);">${initials}</div>
            <div>
              <div class="review-name">${r.student} <span style="font-size:10px;color:var(--text-light);">(${r.roll})</span></div>
              <div class="review-date">${r.date}</div>
            </div>
          </div>
          <div class="review-stars">${stars}</div>
        </div>
        <p class="review-text">"${r.text}"</p>
      </div>
    `;
  }).join('');
};

const setupReviewForm = (book) => {
  // Star picker
  $$('.star-pick').forEach(star => {
    star.addEventListener('click', () => {
      selectedReviewRating = parseInt(star.dataset.val);
      $$('.star-pick').forEach(s => {
        const val = parseInt(s.dataset.val);
        s.classList.toggle('active', val <= selectedReviewRating);
      });
    });
  });

  // Default to 5 stars active
  $$('.star-pick').forEach(s => s.classList.add('active'));

  // Submit review button
  const submitBtn = $('#reviewSubmitBtn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const text = $('#reviewText').value.trim();
    if (!text) {
      $('#reviewText').classList.add('error');
      showToast('Please write a few words for your review.', true);
      return;
    }
    $('#reviewText').classList.remove('error');

    const user = getCurrentUser();
    const allReviews = getAllReviews();
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const newReview = {
      id: Date.now(),
      bookId: book.id,
      student: user.name,
      roll: user.roll,
      rating: selectedReviewRating,
      text: text,
      date: dateStr
    };

    allReviews.unshift(newReview);
    saveAllReviews(allReviews);

    $('#reviewText').value = '';
    renderReviews(book);
    showToast('✦ Thank you! Your review has been published.');
  });
};

// ── INITIALIZE ON DOM LOAD ──
document.addEventListener('DOMContentLoaded', () => {
  const book = getBookFromURL();

  renderBookDetails(book);
  setupShelfButtons(book);
  setupIssueForm(book);
  renderReviews(book);
  setupReviewForm(book);
});
