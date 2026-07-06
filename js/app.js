import { appState } from './state.js';
import { HotelAPI } from './api.js';
import { debounce } from './utils.js';
import { HotelCard } from './components/HotelCard.js';
import { HotelDetail } from './components/HotelDetail.js';
import { HotelForm } from './components/HotelForm.js';
import { Toast } from './components/Toast.js';

// Elements Selectors
const hotelGrid = document.getElementById('hotel-grid');
const searchInput = document.getElementById('search-input');
const priceSlider = document.getElementById('price-slider');
const priceDisplay = document.getElementById('price-display');
const ratingSlider = document.getElementById('rating-slider');
const ratingDisplay = document.getElementById('rating-display');
const sortSelect = document.getElementById('sort-select');
const cityBadgesContainer = document.getElementById('city-badges');
const resultsTitle = document.getElementById('results-count-title');
const resultsSubtitle = document.getElementById('results-count-subtitle');
const loadMoreBtn = document.getElementById('btn-load-more');
const paginationWrapper = document.getElementById('pagination-wrapper');
const resetBtn = document.getElementById('btn-reset-filters');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const addHotelBtn = document.getElementById('btn-add-hotel-trigger');

// Initialize Hero Auto-Slider
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;
  
  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000);
}

// Render skeleton loaders during API calls
function renderSkeletons() {
  hotelGrid.innerHTML = '';
  const limit = appState.state.activeFilters.limit;
  
  for (let i = 0; i < limit; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-card-img skeleton-box"></div>
      <div class="skeleton-card-body">
        <div class="skeleton-text-short skeleton-box"></div>
        <div class="skeleton-title skeleton-box"></div>
        <div class="skeleton-text skeleton-box"></div>
        <div class="skeleton-footer">
          <div class="skeleton-price skeleton-box"></div>
          <div class="skeleton-btn skeleton-box"></div>
        </div>
      </div>
    `;
    hotelGrid.appendChild(skeleton);
  }
}

// Fetch hotels from API and update state
async function loadHotels(append = false) {
  appState.setState({ loading: true });
  
  if (!append) {
    renderSkeletons();
  }

  try {
    const filters = appState.state.activeFilters;
    const { hotels, count } = await HotelAPI.fetchHotels(filters);

    if (append) {
      const allHotels = [...appState.state.hotels, ...hotels];
      appState.setState({
        hotels: allHotels,
        hasMore: hotels.length === filters.limit,
        loading: false
      });
    } else {
      appState.setState({
        hotels: hotels,
        hasMore: hotels.length === filters.limit,
        loading: false
      });
    }
  } catch (error) {
    console.error('Failed to load hotels:', error);
    Toast.error('Could not connect to hotels API. Please try again.');
    appState.setState({ loading: false, hotels: [], hasMore: false });
  }
}

// Render the active hotel listings
function renderListings(state) {
  const { hotels, loading, hasMore } = state;

  if (loading && hotels.length === 0) {
    // Skeletons are already rendering
    resultsSubtitle.innerText = 'Searching matching properties...';
    return;
  }

  // Handle empty state
  if (hotels.length === 0) {
    hotelGrid.innerHTML = `
      <div class="empty-state animate-scale-up">
        <div class="empty-state-icon">
          <i class="bi bi-emoji-frown"></i>
        </div>
        <h3 class="empty-state-title">No Stays Found</h3>
        <p class="empty-state-desc">We couldn't find any hotels matching your current search options. Try loosening your filters.</p>
        <button class="btn btn-primary" id="btn-empty-reset">Reset All Filters</button>
      </div>
    `;
    
    document.getElementById('btn-empty-reset')?.addEventListener('click', () => {
      resetAllFilters();
    });

    resultsSubtitle.innerText = '0 properties found';
    paginationWrapper.style.display = 'none';
    return;
  }

  // Clear grid if we are overwriting (skip === 0)
  if (state.activeFilters.skip === 0) {
    hotelGrid.innerHTML = '';
  } else {
    // Remove skeleton loaders if they exist
    const skeletons = hotelGrid.querySelectorAll('.skeleton-card');
    skeletons.forEach(s => s.remove());
  }

  // Render cards
  hotels.forEach(hotel => {
    // Check if card already exists in grid (to prevent duplicate renders in append modes)
    if (hotelGrid.querySelector(`.hotel-card[data-id="${hotel.id}"]`)) return;

    const card = HotelCard.render(hotel, {
      onView: (selected) => {
        HotelDetail.open(selected, {
          onEdit: (h) => editHotelListing(h),
          onDelete: (h) => deleteHotelListing(h)
        });
      },
      onEdit: (selected) => editHotelListing(selected),
      onDelete: (selected) => deleteHotelListing(selected)
    });
    
    hotelGrid.appendChild(card);
  });

  // Update counts
  const totalCount = hotels.length;
  resultsSubtitle.innerText = `${totalCount} ${totalCount === 1 ? 'property' : 'properties'} shown`;

  // Update Pagination Button visibility
  if (hasMore) {
    paginationWrapper.style.display = 'flex';
  } else {
    paginationWrapper.style.display = 'none';
  }
}

// Edit a hotel
function editHotelListing(hotel) {
  HotelForm.open(hotel, (updatedHotel) => {
    // Reload active hotel list
    appState.updateFilters({ skip: 0 });
    loadHotels(false);
  });
}

// Delete a hotel listing
async function deleteHotelListing(hotel) {
  const confirmDelete = confirm(`Are you sure you want to remove "${hotel.name}" from LuxeStay? This action is permanent.`);
  if (!confirmDelete) return;

  try {
    await HotelAPI.deleteHotel(hotel.id);
    Toast.success(`"${hotel.name}" has been successfully deleted.`);
    
    // Refresh listings
    appState.updateFilters({ skip: 0 });
    loadHotels(false);
  } catch (error) {
    Toast.error(error.message || 'Failed to delete hotel. Please try again.');
  }
}

// Reset filters to default state
function resetAllFilters() {
  appState.resetFilters();

  // Reset UI components
  searchInput.value = '';
  priceSlider.value = priceSlider.max;
  priceDisplay.innerText = `₹${parseInt(priceSlider.max).toLocaleString('en-IN')}`;
  ratingSlider.value = ratingSlider.min;
  ratingDisplay.innerText = 'All Ratings';
  sortSelect.value = '-rating';

  // Reset Badges active state
  const badges = cityBadgesContainer.querySelectorAll('.badge');
  badges.forEach(b => {
    if (b.dataset.city === '') {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  loadHotels(false);
}

// Listen to Theme state updates
function updateThemeIcon(state) {
  if (state.theme === 'dark') {
    themeIcon.className = 'bi bi-sun-fill';
    themeToggleBtn.title = 'Switch to Light Theme';
  } else {
    themeIcon.className = 'bi bi-moon-stars-fill';
    themeToggleBtn.title = 'Switch to Dark Theme';
  }
}

// Initialize listeners & bindings
function initEventListeners() {
  
  // Search Input (Debounced)
  searchInput.addEventListener('input', debounce((e) => {
    appState.updateFilters({ search: e.target.value.trim(), skip: 0 });
    loadHotels(false);
  }, 400));

  // Price Slider (Debounced on slider drag, or input update)
  priceSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    priceDisplay.innerText = `₹${val.toLocaleString('en-IN')}`;
  });

  priceSlider.addEventListener('change', (e) => {
    appState.updateFilters({ max_price: e.target.value, skip: 0 });
    loadHotels(false);
  });

  // Rating Slider
  ratingSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    ratingDisplay.innerText = val === 1 ? 'All Ratings' : `${val.toFixed(1)}+ ★`;
  });

  ratingSlider.addEventListener('change', (e) => {
    const val = parseFloat(e.target.value);
    // If rating is 1, ignore min_rating filter
    const minRating = val === 1 ? '' : val;
    appState.updateFilters({ min_rating: minRating, skip: 0 });
    loadHotels(false);
  });

  // Sort Selector
  sortSelect.addEventListener('change', (e) => {
    appState.updateFilters({ order_by: e.target.value, skip: 0 });
    loadHotels(false);
  });

  // City Badge Clicks
  cityBadgesContainer.addEventListener('click', (e) => {
    const badge = e.target.closest('.badge');
    if (!badge) return;

    // Toggle active classes
    cityBadgesContainer.querySelectorAll('.badge').forEach(b => b.classList.remove('active'));
    badge.classList.add('active');

    const city = badge.dataset.city;
    appState.updateFilters({ location: city, skip: 0 });
    loadHotels(false);
  });

  // Load More Button
  loadMoreBtn.addEventListener('click', () => {
    const nextSkip = appState.state.activeFilters.skip + appState.state.activeFilters.limit;
    appState.updateFilters({ skip: nextSkip });
    loadHotels(true);
  });

  // Reset Filters Button
  resetBtn.addEventListener('click', resetAllFilters);

  // Theme Toggle Button
  themeToggleBtn.addEventListener('click', () => {
    appState.toggleTheme();
  });

  // Add Hotel Button Trigger
  addHotelBtn.addEventListener('click', () => {
    HotelForm.open(null, () => {
      // Reload on success
      appState.updateFilters({ skip: 0 });
      loadHotels(false);
    });
  });

  // Header Brand Logo click (reloads homepage)
  document.getElementById('brand-logo').addEventListener('click', () => {
    resetAllFilters();
  });
}

// App bootstrapping
function initApp() {
  initHeroSlider();
  initEventListeners();

  // Register main state subscriber for rendering
  appState.subscribe(renderListings);
  appState.subscribe(updateThemeIcon);

  // Initial load
  loadHotels(false);
  updateThemeIcon(appState.state);
}

// Launch app on load
document.addEventListener('DOMContentLoaded', initApp);
