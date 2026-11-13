// ════════════════════════════════════════════
//  my-shelf.js — My Shelf Page JavaScript
//  Depends on: books-data.js (load first)
// ════════════════════════════════════════════

// ── DOM HELPER FUNCTIONS ──
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

// ── CURRENT LOGGED-IN STUDENT ──
const DEFAULT_STUDENT = {
  name: 'Garima Sharma',
  roll: '2025CSE042'
};

const getCurrentUser = () => {
  const stored = localStorage.getItem('booknest_current_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing user:', e);
    }
  }
  return DEFAULT_STUDENT;
};

const saveCurrentUser = (user) => {
  localStorage.setItem('booknest_current_user', JSON.stringify(user));
};

// ── STORAGE KEYS SCOPED BY STUDENT ROLL ──
const getCollectionKey = (roll) => `booknest_collection_${roll}`;
const getWishlistKey   = (roll) => `booknest_wishlist_${roll}`;
const getFavouritesKey = (roll) => `booknest_favourites_${roll}`;
const REVIEWS_KEY      = 'booknest_reviews';

// ── DATA GETTERS & SETTERS ──
const getCollection = (roll) => {
  return JSON.parse(localStorage.getItem(getCollectionKey(roll)) || '[]');
};

const saveCollection = (roll, data) => {
  localStorage.setItem(getCollectionKey(roll), JSON.stringify(data));
};

const getWishlist = (roll) => {
  return JSON.parse(localStorage.getItem(getWishlistKey(roll)) || '[]');
};

const saveWishlist = (roll, data) => {
  localStorage.setItem(getWishlistKey(roll), JSON.stringify(data));
};

const getFavourites = (roll) => {
  return JSON.parse(localStorage.getItem(getFavouritesKey(roll)) || '[]');
};

const saveFavourites = (roll, data) => {
  localStorage.setItem(getFavouritesKey(roll), JSON.stringify(data));
};

const getAllReviews = () => {
  return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
};

const saveAllReviews = (data) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(data));
};

const getUserReviews = (roll) => {
  return getAllReviews().filter(r => r.roll === roll);
};

// ── SEED INITIAL DATA FOR FIRST-TIME USERS ──
const seedInitialDataIfEmpty = (user) => {
  const seedKey = `booknest_seeded_${user.roll}`;
  if (localStorage.getItem(seedKey)) return;

  // Initialize Collection: 4 books across the 3 reading stages
  const initialCollection = [
    { bookId: 1,  status: 'reading', dateAdded: '12 May 2026' }, // The Alchemist
    { bookId: 4,  status: 'read',    dateAdded: '25 Apr 2026' }, // Pride and Prejudice
    { bookId: 18, status: 'read',    dateAdded: '02 May 2026' }, // Atomic Habits
    { bookId: 5,  status: 'want',    dateAdded: '10 May 2026' }  // Powerless
  ];
  saveCollection(user.roll, initialCollection);

  // Initialize Wishlist: 3 saved books
  const initialWishlist = [
    { bookId: 2,  dateAdded: '08 May 2026' }, // To Kill a Mockingbird
    { bookId: 8,  dateAdded: '11 May 2026' }, // The Hobbit
    { bookId: 22, dateAdded: '13 May 2026' }  // The Psychology of Money
  ];
  saveWishlist(user.roll, initialWishlist);

  // Initialize Favourites: 3 books
  const initialFavourites = [
    { bookId: 1,  dateAdded: '12 May 2026' }, // The Alchemist
    { bookId: 4,  dateAdded: '25 Apr 2026' }, // Pride and Prejudice
    { bookId: 18, dateAdded: '02 May 2026' }  // Atomic Habits
  ];
  saveFavourites(user.roll, initialFavourites);

  // Initialize Reviews: 2 student reviews
  const existingReviews = getAllReviews();
  const sampleReviews = [
    {
      id: Date.now() - 100000,
      bookId: 18,
      student: user.name,
      roll: user.roll,
      rating: 5,
      text: 'A truly transformative book. James Clear presents micro-habits in such a clear, practical way that making small 1% improvements every single day feels completely achievable.',
      date: '10 May 2026'
    },
    {
      id: Date.now() - 50000,
      bookId: 4,
      student: user.name,
      roll: user.roll,
      rating: 5,
      text: "Jane Austen's timeless wit, memorable characters, and sparkling dialogue make this an absolute masterpiece that I can re-read anytime without getting bored.",
      date: '28 Apr 2026'
    }
  ];

  // Merge sample reviews without duplicate IDs
  const combined = [...existingReviews, ...sampleReviews];
  saveAllReviews(combined);

  localStorage.setItem(seedKey, 'true');
};

// ── LIBRARY AVAILABILITY HELPER ──
const checkLibraryAvailability = (bookId) => {
  const book = BOOKS.find(b => b.id === bookId);
  if (!book) return { available: false, copies: 0 };

  const issuedList = JSON.parse(localStorage.getItem('issuedBooks') || '[]');
  const currentlyIssuedCount = issuedList.filter(r => r.bookId === bookId && r.status === 'issued').length;
  const copiesRemaining = Math.max(0, book.copies - currentlyIssuedCount);

  const isAvail = book.status === 'available' && copiesRemaining > 0;
  return {
    available: isAvail,
    copies: copiesRemaining
  };
};

// ── BOOK COVER GENERATOR (SECTION 9) ──
// Uses elegant placeholders with book icon, title, author, soft pastel gradient.
// Automatically displays real cover if added to images/covers/ or images/.
const renderBookCover = (book) => {
  const gradient = book.cover || 'linear-gradient(135deg, #eef7ea, #fdfae8)';
  return `
    <div class="shelf-cover-wrapper">
      <img class="shelf-cover-img"
           src="images/covers/${book.id}.jpg"
           alt="${book.title}"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
           style="display:none;" />
      <div class="shelf-cover-placeholder" style="background:${gradient}">
        <div class="shelf-cover-icon">📖</div>
        <div class="shelf-cover-title">${book.title}</div>
        <div class="shelf-cover-author">by ${book.author}</div>
      </div>
    </div>
  `;
};

// ── USER PROFILE HEADER DISPLAY ──
const renderStudentProfile = () => {
  const user = getCurrentUser();
  $('#studentNameDisplay').textContent = user.name;
  $('#studentRollDisplay').textContent = `Roll No: ${user.roll}`;

  // Generate Initials
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map(p => p[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'ST';
  $('#studentAvatar').textContent = initials;
};

// ── 1. READING OVERVIEW CARDS (SECTION 4) ──
const renderOverviewCards = () => {
  const user = getCurrentUser();
  const wishlist   = getWishlist(user.roll);
  const favourites = getFavourites(user.roll);
  const reviews    = getUserReviews(user.roll);

  $('#overviewWishlistCount').textContent   = wishlist.length;
  $('#overviewFavouritesCount').textContent = favourites.length;
  $('#overviewReviewsCount').textContent    = reviews.length;
};

// ── 2. MY READING COLLECTION (SECTION 5) ──
let currentCollectionTab = 'want'; // 'want', 'reading', 'read'

const renderCollection = () => {
  const user = getCurrentUser();
  const collection = getCollection(user.roll);

  // Tab Counts
  const countWant    = collection.filter(item => item.status === 'want').length;
  const countReading = collection.filter(item => item.status === 'reading').length;
  const countRead    = collection.filter(item => item.status === 'read').length;

  $('#countWant').textContent    = countWant;
  $('#countReading').textContent = countReading;
  $('#countRead').textContent    = countRead;

  // Filtered Items for active tab
  const filtered = collection.filter(item => item.status === currentCollectionTab);
  const grid = $('#collectionGrid');

  if (filtered.length === 0) {
    const tabLabels = {
      want: 'Want to Read',
      reading: 'Currently Reading',
      read: 'Read'
    };
    grid.innerHTML = `
      <div class="empty-shelf-box">
        <div class="empty-shelf-icon">📖</div>
        <div class="empty-shelf-title">No books in "${tabLabels[currentCollectionTab]}"</div>
        <p class="empty-shelf-desc">Start adding books from the library to organize your personal reading journey.</p>
        <button class="btn btn-primary" onclick="openAddBookModal('collection_${currentCollectionTab}')">+ Add a Book</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const book = BOOKS.find(b => b.id === item.bookId);
    if (!book) return '';

    const statusBadgeText = {
      want: '📌 Want to Read',
      reading: '📖 Currently Reading',
      read: '✅ Read'
    }[item.status];

    const statusBadgeClass = `status-${item.status}`;

    return `
      <div class="shelf-book-card fade-in">
        ${renderBookCover(book)}
        <div class="shelf-card-body">
          <div class="shelf-card-genre">${book.genre}</div>
          <div class="shelf-card-title">${book.title}</div>
          <div class="shelf-card-author">by ${book.author}</div>

          <div class="shelf-card-meta">
            <span class="reading-status-pill ${statusBadgeClass}">${statusBadgeText}</span>
            <span class="stars">${renderStars(book.rating)}</span>
          </div>

          <!-- Update Reading Status Selector -->
          <div class="status-updater-row">
            <span class="status-select-label">Status:</span>
            <select class="status-update-select" onchange="updateCollectionStatus(${book.id}, this.value)">
              <option value="want"    ${item.status === 'want' ? 'selected' : ''}>Want to Read</option>
              <option value="reading" ${item.status === 'reading' ? 'selected' : ''}>Currently Reading</option>
              <option value="read"    ${item.status === 'read' ? 'selected' : ''}>Read</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="shelf-card-actions">
            <a href="book-detail.html?id=${book.id}" class="card-action-link">View Details →</a>
            <button class="card-action-remove" onclick="removeFromCollection(${book.id})" title="Remove from Collection">
              🗑 Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

// Update a book's personal reading status
const updateCollectionStatus = (bookId, newStatus) => {
  const user = getCurrentUser();
  const collection = getCollection(user.roll);
  const target = collection.find(item => item.bookId === bookId);

  if (target) {
    target.status = newStatus;
    saveCollection(user.roll, collection);
    renderCollection();
    renderReadingActivity();
    const statusLabels = { want: 'Want to Read', reading: 'Currently Reading', read: 'Read' };
    showToast(`✦ Updated status to "${statusLabels[newStatus]}"`);
  }
};

// Remove a book from personal reading collection
const removeFromCollection = (bookId) => {
  const user = getCurrentUser();
  let collection = getCollection(user.roll);
  const book = BOOKS.find(b => b.id === bookId);
  const title = book ? book.title : 'Book';

  collection = collection.filter(item => item.bookId !== bookId);
  saveCollection(user.roll, collection);

  renderCollection();
  renderOverviewCards();
  renderReadingActivity();
  showToast(`Removed "${title}" from your collection.`);
};

// ── 3. MY WISHLIST (SECTION 6) ──
const renderWishlist = () => {
  const user = getCurrentUser();
  const wishlist = getWishlist(user.roll);
  const grid = $('#wishlistGrid');

  if (wishlist.length === 0) {
    grid.innerHTML = `
      <div class="empty-shelf-box">
        <div class="empty-shelf-icon">🔖</div>
        <div class="empty-shelf-title">Your Wishlist is Empty</div>
        <p class="empty-shelf-desc">Found books you would love to borrow or read later? Save them here to keep track.</p>
        <button class="btn btn-primary" onclick="openAddBookModal('wishlist')">+ Add to Wishlist</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = wishlist.map(item => {
    const book = BOOKS.find(b => b.id === item.bookId);
    if (!book) return '';

    const avail = checkLibraryAvailability(book.id);
    const availClass = avail.available ? 'avail-available' : 'avail-issued';
    const availText  = avail.available
      ? `● Available (${avail.copies} left)`
      : `○ Currently Issued`;

    return `
      <div class="shelf-book-card fade-in">
        ${renderBookCover(book)}
        <div class="shelf-card-body">
          <div class="shelf-card-genre">${book.genre}</div>
          <div class="shelf-card-title">${book.title}</div>
          <div class="shelf-card-author">by ${book.author}</div>

          <div class="shelf-card-meta">
            <span class="avail-pill ${availClass}">${availText}</span>
            <span class="stars">${renderStars(book.rating)}</span>
          </div>

          <div class="shelf-card-actions">
            <a href="book-detail.html?id=${book.id}" class="card-action-link">View Details →</a>
            <div style="display:flex;gap:6px;align-items:center;">
              ${avail.available
                ? `<a href="issue-return.html?bookId=${book.id}" class="card-action-issue">Issue Book →</a>`
                : `<button class="card-action-issue disabled" disabled title="Currently borrowed by other students">Issued</button>`
              }
              <button class="card-action-remove" onclick="removeFromWishlist(${book.id})" title="Remove from Wishlist">
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

const removeFromWishlist = (bookId) => {
  const user = getCurrentUser();
  let wishlist = getWishlist(user.roll);
  const book = BOOKS.find(b => b.id === bookId);
  const title = book ? book.title : 'Book';

  wishlist = wishlist.filter(item => item.bookId !== bookId);
  saveWishlist(user.roll, wishlist);

  renderWishlist();
  renderOverviewCards();
  showToast(`Removed "${title}" from your wishlist.`);
};

// ── 4. MY FAVOURITES (SECTION 7) ──
let favSearchQuery = '';
let favGenreFilter = 'all';

const renderFavourites = () => {
  const user = getCurrentUser();
  const favourites = getFavourites(user.roll);
  const grid = $('#favouritesGrid');

  // Filter based on search query & genre
  const filtered = favourites.filter(item => {
    const book = BOOKS.find(b => b.id === item.bookId);
    if (!book) return false;

    const matchesSearch = book.title.toLowerCase().includes(favSearchQuery) ||
                          book.author.toLowerCase().includes(favSearchQuery);
    const matchesGenre  = favGenreFilter === 'all' || book.genre === favGenreFilter;

    return matchesSearch && matchesGenre;
  });

  if (favourites.length === 0) {
    grid.innerHTML = `
      <div class="empty-shelf-box">
        <div class="empty-shelf-icon">💖</div>
        <div class="empty-shelf-title">No Favourites Added Yet</div>
        <p class="empty-shelf-desc">Mark books as favourites to curate your all-time top reads in one spot.</p>
        <button class="btn btn-primary" onclick="openAddBookModal('favourites')">+ Add a Favourite</button>
      </div>
    `;
    return;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-shelf-box">
        <div class="empty-shelf-icon">🔍</div>
        <div class="empty-shelf-title">No Matching Favourites Found</div>
        <p class="empty-shelf-desc">Try clearing your search term or selecting a different genre.</p>
        <button class="btn btn-outline" onclick="clearFavFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const book = BOOKS.find(b => b.id === item.bookId);
    if (!book) return '';

    return `
      <div class="shelf-book-card fade-in">
        ${renderBookCover(book)}
        <div class="shelf-card-body">
          <div class="shelf-card-genre">${book.genre}</div>
          <div class="shelf-card-title">${book.title}</div>
          <div class="shelf-card-author">by ${book.author}</div>

          <div class="shelf-card-meta">
            <span class="reading-status-pill status-reading">💖 Favourite</span>
            <span class="stars">${renderStars(book.rating)}</span>
          </div>

          <div class="shelf-card-actions">
            <a href="book-detail.html?id=${book.id}" class="card-action-link">View Details →</a>
            <button class="card-action-remove" onclick="removeFromFavourites(${book.id})" title="Remove from Favourites">
              💔 Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

const removeFromFavourites = (bookId) => {
  const user = getCurrentUser();
  let favourites = getFavourites(user.roll);
  const book = BOOKS.find(b => b.id === bookId);
  const title = book ? book.title : 'Book';

  favourites = favourites.filter(item => item.bookId !== bookId);
  saveFavourites(user.roll, favourites);

  renderFavourites();
  renderOverviewCards();
  showToast(`Removed "${title}" from favourites.`);
};

const clearFavFilters = () => {
  favSearchQuery = '';
  favGenreFilter = 'all';
  $('#favSearchInput').value = '';
  $('#favGenreSelect').value = 'all';
  renderFavourites();
};

// ── 5. MY REVIEWS & RATINGS (SECTION 8) ──
const renderReviews = () => {
  const user = getCurrentUser();
  const reviews = getUserReviews(user.roll);
  const container = $('#reviewsList');

  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="empty-shelf-box">
        <div class="empty-shelf-icon">✍️</div>
        <div class="empty-shelf-title">No Reviews Written Yet</div>
        <p class="empty-shelf-desc">Share your perspectives and star ratings on books you have read to help other students.</p>
        <button class="btn btn-primary" onclick="openWriteReviewModal()">✍️ Write Your First Review</button>
      </div>
    `;
    return;
  }

  container.innerHTML = reviews.map(rev => {
    const book = BOOKS.find(b => b.id === rev.bookId);
    const bookTitle  = book ? book.title  : 'Unknown Book';
    const bookAuthor = book ? book.author : 'Unknown Author';
    const starsHtml  = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);

    return `
      <div class="review-item-card fade-in">
        <div class="review-cover-col">
          <div class="review-mini-cover" style="background:${book ? book.cover : 'var(--butter-soft)'}">
            <div style="font-size:16px;margin-bottom:4px;">📖</div>
            <div style="font-size:9px;line-height:1.2;">${bookTitle}</div>
          </div>
        </div>

        <div class="review-content-col">
          <div class="review-card-header">
            <div>
              <div class="review-book-title">${bookTitle}</div>
              <div class="review-book-author">by ${bookAuthor}</div>
            </div>
            <div class="review-rating-block">
              <span class="review-stars-text">${starsHtml}</span>
              <span class="review-date-badge">${rev.date}</span>
            </div>
          </div>

          <div class="review-body-text">"${rev.text}"</div>

          <div class="review-card-footer">
            <a href="book-detail.html?id=${rev.bookId}" class="card-action-link">View Book →</a>
            <button class="btn btn-outline btn-small" onclick="openEditReviewModal(${rev.id})">✎ Edit</button>
            <button class="btn btn-danger-outline btn-small" onclick="deleteReview(${rev.id})">🗑 Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

const deleteReview = (reviewId) => {
  if (!confirm('Are you sure you want to delete this review?')) return;

  let allReviews = getAllReviews();
  allReviews = allReviews.filter(r => r.id !== reviewId);
  saveAllReviews(allReviews);

  renderReviews();
  renderOverviewCards();
  renderReadingActivity();
  showToast('Review deleted successfully.');
};

// ── 6. MY READING ACTIVITY (SECTION 10) ──
const renderReadingActivity = () => {
  const user = getCurrentUser();
  const collection = getCollection(user.roll);
  const reviews    = getUserReviews(user.roll);

  // 1. Books Read (Collection items with status = 'read')
  const readBooks = collection.filter(item => item.status === 'read');
  $('#activityBooksRead').textContent = readBooks.length;

  // 2. Reviews Written
  $('#activityReviewsWritten').textContent = reviews.length;

  // 3. Most-read genre
  if (readBooks.length === 0) {
    $('#activityTopGenre').textContent = '—';
  } else {
    const genreCounts = {};
    readBooks.forEach(item => {
      const b = BOOKS.find(bk => bk.id === item.bookId);
      if (b && b.genre) {
        genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
      }
    });

    let topGenre = '—';
    let maxCount = 0;
    for (const [genre, count] of Object.entries(genreCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topGenre = genre;
      }
    }
    $('#activityTopGenre').textContent = topGenre;
  }

  // 4. Average rating given
  if (reviews.length === 0) {
    $('#activityAvgRating').textContent = '—';
  } else {
    const totalStars = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    const avg = (totalStars / reviews.length).toFixed(1);
    $('#activityAvgRating').textContent = `${avg} ★`;
  }
};

// ── MODAL: ADD BOOK TO SHELF ──
const openAddBookModal = (defaultDestination = 'collection_want') => {
  const modal = $('#addBookModal');
  const select = $('#addBookSelect');
  const destSelect = $('#addDestinationSelect');

  // Populate book dropdown if not already done
  if (select.options.length <= 1) {
    BOOKS.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.textContent = `${b.title} — ${b.author} (${b.genre})`;
      select.appendChild(opt);
    });
  }

  select.value = '';
  destSelect.value = defaultDestination;
  $('#modalBookPreview').style.display = 'none';

  modal.classList.add('open');
};

const closeAddBookModal = () => {
  $('#addBookModal').classList.remove('open');
};

$('#addBookSelect').addEventListener('change', () => {
  const bookId = parseInt($('#addBookSelect').value);
  const preview = $('#modalBookPreview');

  if (!bookId) {
    preview.style.display = 'none';
    return;
  }

  const book = BOOKS.find(b => b.id === bookId);
  if (!book) return;

  $('#modalPreviewCover').style.background = book.cover;
  $('#modalPreviewCover').textContent = book.title;
  $('#modalPreviewTitle').textContent = book.title;
  $('#modalPreviewAuthor').textContent = `by ${book.author}`;
  $('#modalPreviewGenre').textContent = book.genre;
  preview.style.display = 'flex';
});

$('#confirmAddBookBtn').addEventListener('click', () => {
  const bookId = parseInt($('#addBookSelect').value);
  if (!bookId) {
    showToast('Please select a book from the list.', true);
    return;
  }

  const destination = $('#addDestinationSelect').value;
  const user = getCurrentUser();
  const book = BOOKS.find(b => b.id === bookId);
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (destination.startsWith('collection_')) {
    const status = destination.replace('collection_', ''); // 'want', 'reading', 'read'
    let collection = getCollection(user.roll);

    const existing = collection.find(item => item.bookId === bookId);
    if (existing) {
      existing.status = status;
      showToast(`Updated "${book.title}" in your collection.`);
    } else {
      collection.push({ bookId, status, dateAdded: dateStr });
      showToast(`Added "${book.title}" to your reading collection!`);
    }

    saveCollection(user.roll, collection);
    currentCollectionTab = status;
    $$('.coll-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === status);
    });
    renderCollection();
    renderReadingActivity();
  } else if (destination === 'wishlist') {
    let wishlist = getWishlist(user.roll);
    if (wishlist.some(item => item.bookId === bookId)) {
      showToast('This book is already in your wishlist.', true);
      return;
    }
    wishlist.push({ bookId, dateAdded: dateStr });
    saveWishlist(user.roll, wishlist);
    renderWishlist();
    showToast(`Added "${book.title}" to your wishlist!`);
  } else if (destination === 'favourites') {
    let favourites = getFavourites(user.roll);
    if (favourites.some(item => item.bookId === bookId)) {
      showToast('This book is already in your favourites.', true);
      return;
    }
    favourites.push({ bookId, dateAdded: dateStr });
    saveFavourites(user.roll, favourites);
    renderFavourites();
    showToast(`Added "${book.title}" to favourites!`);
  }

  renderOverviewCards();
  closeAddBookModal();
});

// ── MODAL: WRITE / EDIT REVIEW ──
let currentStarRating = 5;

const setStarPickerRating = (val) => {
  currentStarRating = Number(val);
  $('#reviewRatingValue').value = currentStarRating;
  $$('#modalStarPicker .star-item').forEach(star => {
    const sVal = Number(star.dataset.value);
    star.classList.toggle('active', sVal <= currentStarRating);
  });
};

$$('#modalStarPicker .star-item').forEach(star => {
  star.addEventListener('click', () => {
    setStarPickerRating(star.dataset.value);
  });
});

const openWriteReviewModal = () => {
  $('#reviewModalTitle').textContent = '✍️ Write a Review';
  $('#reviewEditId').value = '';
  $('#reviewBookSelectGroup').style.display = 'flex';
  $('#reviewBookFixedInfo').style.display = 'none';

  const select = $('#reviewBookSelect');
  if (select.options.length <= 1) {
    BOOKS.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.textContent = `${b.title} — ${b.author}`;
      select.appendChild(opt);
    });
  }
  select.value = '';
  $('#reviewTextInput').value = '';
  setStarPickerRating(5);

  $('#reviewModal').classList.add('open');
};

const openEditReviewModal = (reviewId) => {
  const reviews = getAllReviews();
  const review = reviews.find(r => r.id === reviewId);
  if (!review) return;

  const book = BOOKS.find(b => b.id === review.bookId);

  $('#reviewModalTitle').textContent = '✎ Edit Your Review';
  $('#reviewEditId').value = review.id;
  $('#reviewBookSelectGroup').style.display = 'none';
  $('#reviewBookFixedInfo').style.display = 'block';

  $('#reviewFixedTitle').textContent = book ? book.title : 'Book';
  $('#reviewFixedAuthor').textContent = book ? `by ${book.author}` : '';

  $('#reviewTextInput').value = review.text;
  setStarPickerRating(review.rating);

  $('#reviewModal').classList.add('open');
};

const closeReviewModal = () => {
  $('#reviewModal').classList.remove('open');
};

$('#submitReviewModalBtn').addEventListener('click', () => {
  const editId = $('#reviewEditId').value;
  const rating = Number($('#reviewRatingValue').value) || 5;
  const text   = $('#reviewTextInput').value.trim();

  if (!text) {
    showToast('Please enter your review text.', true);
    return;
  }

  const user = getCurrentUser();
  let allReviews = getAllReviews();
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (editId) {
    // Edit existing review
    const target = allReviews.find(r => r.id === Number(editId));
    if (target) {
      target.rating = rating;
      target.text   = text;
      target.date   = `${dateStr} (edited)`;
      saveAllReviews(allReviews);
      showToast('✦ Review updated successfully!');
    }
  } else {
    // New review
    const bookId = parseInt($('#reviewBookSelect').value);
    if (!bookId) {
      showToast('Please select a book to review.', true);
      return;
    }

    const newRev = {
      id: Date.now(),
      bookId,
      student: user.name,
      roll: user.roll,
      rating,
      text,
      date: dateStr
    };
    allReviews.unshift(newRev);
    saveAllReviews(allReviews);
    showToast('✦ Your review was published!');
  }

  closeReviewModal();
  renderReviews();
  renderOverviewCards();
  renderReadingActivity();
});

// ── MODAL: STUDENT SWITCH ──
const openStudentModal = () => {
  const user = getCurrentUser();
  $('#inputStudentName').value = user.name;
  $('#inputStudentRoll').value = user.roll;
  $('#studentModal').classList.add('open');
};

const closeStudentModal = () => {
  $('#studentModal').classList.remove('open');
};

$('#saveStudentBtn').addEventListener('click', () => {
  const name = $('#inputStudentName').value.trim();
  const roll = $('#inputStudentRoll').value.trim();

  if (!name || !roll) {
    showToast('Please enter both student name and roll number.', true);
    return;
  }

  const user = { name, roll };
  saveCurrentUser(user);
  seedInitialDataIfEmpty(user);

  closeStudentModal();
  renderStudentProfile();
  renderOverviewCards();
  renderCollection();
  renderWishlist();
  renderFavourites();
  renderReviews();
  renderReadingActivity();

  showToast(`Switched active profile to ${name} (${roll})`);
});

// ── ATTACH EVENT LISTENERS ──
const setupEventListeners = () => {
  // Collection Tabs
  $$('.coll-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.coll-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCollectionTab = btn.dataset.status;
      renderCollection();
    });
  });

  // Favourites Search & Genre Filter
  $('#favSearchInput').addEventListener('input', (e) => {
    favSearchQuery = e.target.value.toLowerCase().trim();
    renderFavourites();
  });

  $('#favGenreSelect').addEventListener('change', (e) => {
    favGenreFilter = e.target.value;
    renderFavourites();
  });

  // Modal open / close triggers
  $('#openQuickAddBtn').addEventListener('click', () => openAddBookModal());
  $('#addBookToCollectionBtn').addEventListener('click', () => openAddBookModal(`collection_${currentCollectionTab}`));
  $('#addBookToWishlistBtn').addEventListener('click', () => openAddBookModal('wishlist'));
  $('#addBookToFavouritesBtn').addEventListener('click', () => openAddBookModal('favourites'));
  $('#writeReviewBtn').addEventListener('click', () => openWriteReviewModal());
  $('#openStudentModalBtn').addEventListener('click', openStudentModal);

  // Modal close buttons
  $('#closeAddBookModal').addEventListener('click', closeAddBookModal);
  $('#cancelAddBookBtn').addEventListener('click', closeAddBookModal);
  $('#closeReviewModal').addEventListener('click', closeReviewModal);
  $('#cancelReviewBtn').addEventListener('click', closeReviewModal);
  $('#closeStudentModal').addEventListener('click', closeStudentModal);
  $('#cancelStudentBtn').addEventListener('click', closeStudentModal);

  // Close modals on clicking backdrop
  $$('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  // Sticky sub-nav highlighting on scroll
  const navLinks = $$('.shelf-nav-item');
  const sections = Array.from(navLinks).map(link => {
    const id = link.getAttribute('href');
    return document.querySelector(id);
  }).filter(Boolean);

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 160;
    sections.forEach((sec, idx) => {
      if (sec.offsetTop <= scrollPos && (sec.offsetTop + sec.offsetHeight) > scrollPos) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (navLinks[idx]) navLinks[idx].classList.add('active');
      }
    });
  });
};

// ── INITIALIZATION ──
document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  seedInitialDataIfEmpty(user);

  renderStudentProfile();
  renderOverviewCards();
  renderCollection();
  renderWishlist();
  renderFavourites();
  renderReviews();
  renderReadingActivity();

  setupEventListeners();
});
