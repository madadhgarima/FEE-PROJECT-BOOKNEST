// ════════════════════════════════════════════
//  index.js — Homepage JavaScript
//  Depends on: books-data.js (load first)
// ════════════════════════════════════════════

// ── FEATURED BOOKS ──
const featuredIds   = [1, 2, 3, 4];
const featuredBooks = featuredIds.map(id => getBookById(id));

const featuredGrid = document.querySelector('#featuredGrid');
featuredGrid.innerHTML = featuredBooks.map((b, i) => `
  <div class="book-card fade-in" style="animation-delay:${i * 0.12}s"
       onclick="goToBook(${b.id})">
    <div class="book-cover" style="background:${b.cover}">
      <div class="book-cover-overlay"></div>
      ${b.title}
    </div>
    <div class="book-info">
      <div class="book-title">${b.title}</div>
      <div class="book-author">${b.author}</div>
      <div class="book-footer">
        <span class="badge badge-${b.status}">
          ${b.status === 'available' ? 'Available' : 'Issued'}
        </span>
        <span class="stars">${renderStars(b.rating)}</span>
      </div>
    </div>
  </div>
`).join('');

// ── HERO STACKED CARDS ──
const heroBooks = [getBookById(1), getBookById(2), getBookById(4)];
const heroStack = document.querySelector('#heroStack');
heroStack.innerHTML = heroBooks.map((b) => `
  <div class="stacked-card" onclick="goToBook(${b.id})">
    <span class="stacked-card-badge">${b.genre}</span>
    <div class="stacked-card-title">${b.title}</div>
    <div class="stacked-card-author">${b.author}</div>
  </div>
`).join('');