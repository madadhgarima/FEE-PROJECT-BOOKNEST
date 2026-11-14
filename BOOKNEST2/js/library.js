// ════════════════════════════════════════════
//  library.js — Library page JavaScript
//  Depends on: books-data.js (load first)
// ════════════════════════════════════════════

// ── STATE ──
let currentFiltered = [...BOOKS];

// ── RENDER BOOKS ──
const renderBooks = (list) => {
  const grid  = document.querySelector('#booksGrid');
  const empty = document.querySelector('#emptyState');
  document.querySelector('#resultCount').textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = list.map((b, i) => `
    <div class="book-card" style="animation-delay:${i * 0.05}s"
         onclick="goToBook(${b.id})">
      <div class="book-cover" style="background:${b.cover}">
        <div class="book-cover-overlay"></div>
        ${b.title}
      </div>
      <div class="book-info">
        <div class="book-genre">${b.genre}</div>
        <div class="book-title">${b.title}</div>
        <div class="book-author">${b.author}</div>
        <p class="book-card-desc">${b.shortDescription}</p>
        <div class="book-footer">
          <span class="badge badge-${b.status}">
            ${b.status === 'available' ? 'Available' : 'Issued'}
          </span>
          <span class="stars">${renderStars(b.rating)}</span>
        </div>
      </div>
    </div>
  `).join('');
};

// ── FILTER BOOKS ──
const filterBooks = () => {
  const q      = document.querySelector('#searchInput').value.toLowerCase().trim();
  const genre  = document.querySelector('#genreFilter').value;
  const status = document.querySelector('#statusFilter').value;

  currentFiltered = BOOKS.filter(b => {
    const matchQ      = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const matchGenre  = genre  === 'all' || b.genre  === genre;
    const matchStatus = status === 'all' || b.status === status;
    return matchQ && matchGenre && matchStatus;
  });

  applySortAndRender();
};

// ── SORT ──
const applySortAndRender = () => {
  const by   = document.querySelector('#sortSelect').value;
  let sorted = [...currentFiltered];

  if (by === 'title')     sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (by === 'rating')    sorted.sort((a, b) => b.rating - a.rating);
  if (by === 'available') sorted.sort((a) => a.status === 'available' ? -1 : 1);

  renderBooks(sorted);
};

// ── GENRE PILL CLICK ──
document.querySelector('#genreStrip').addEventListener('click', (e) => {
  const pill = e.target.closest('.genre-pill');
  if (!pill) return;

  document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');

  document.querySelector('#genreFilter').value = pill.dataset.genre;
  filterBooks();
});

// ── SEARCH & FILTER LISTENERS ──
document.querySelector('#searchInput').addEventListener('input', filterBooks);
document.querySelector('#genreFilter').addEventListener('change', filterBooks);
document.querySelector('#statusFilter').addEventListener('change', filterBooks);
document.querySelector('#searchBtn').addEventListener('click', filterBooks);
document.querySelector('#sortSelect').addEventListener('change', applySortAndRender);

// ── CHECK URL FOR GENRE PARAM ──
const checkURLGenre = () => {
  const params = new URLSearchParams(window.location.search);
  const genre  = params.get('genre');
  if (genre) {
    document.querySelector('#genreFilter').value = genre;
    document.querySelectorAll('.genre-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.genre === genre);
    });
    filterBooks();
  }
};

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  renderBooks(BOOKS);
  checkURLGenre();
});