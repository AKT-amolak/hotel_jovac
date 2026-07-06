import { formatCurrency, renderStars } from '../utils.js';

/**
 * LuxeStay HotelCard Component
 * Renders a grid card element for a single hotel listing
 */
export class HotelCard {
  /**
   * Render hotel card HTML element
   * @param {object} hotel - Hotel object
   * @param {object} actions - Callback functions for actions (onView, onEdit, onDelete)
   * @returns {HTMLElement} Card element
   */
  static render(hotel, { onView, onEdit, onDelete }) {
    const card = document.createElement('div');
    card.className = 'hotel-card animate-fade-in';
    card.dataset.id = hotel.id;

    // Use placeholder image if thumbnail is broken or missing
    const fallbackImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60';
    const thumbnailSrc = hotel.thumbnail || fallbackImage;

    card.innerHTML = `
      <div class="hotel-img-wrapper">
        <img class="hotel-img" src="${thumbnailSrc}" alt="${hotel.name}" loading="lazy">
        <span class="hotel-card-badge">${hotel.location}</span>
        
        <div class="hotel-card-actions-overlay">
          <button class="card-action-btn btn-edit" title="Edit Hotel" aria-label="Edit Hotel">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="card-action-btn btn-delete" title="Delete Hotel" aria-label="Delete Hotel">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>
      
      <div class="hotel-card-body">
        <div class="hotel-card-rating">
          <div class="star-rating">${renderStars(hotel.rating)}</div>
          <span>${parseFloat(hotel.rating).toFixed(1)}</span>
        </div>
        
        <h3 class="hotel-card-title">${hotel.name}</h3>
        
        <div class="hotel-card-location">
          <i class="bi bi-geo-alt-fill"></i>
          <span>${hotel.location}</span>
        </div>
        
        <div class="hotel-card-footer">
          <div>
            <div class="hotel-price-label">Price / Night</div>
            <div class="hotel-price-value">${formatCurrency(hotel.price)}</div>
          </div>
          <button class="btn btn-primary btn-sm btn-view">
            View Details <i class="bi bi-arrow-right-short"></i>
          </button>
        </div>
      </div>
    `;

    // Handle image load error
    const imgElement = card.querySelector('.hotel-img');
    imgElement.addEventListener('error', () => {
      imgElement.src = fallbackImage;
    });

    // Add event bindings
    const viewBtn = card.querySelector('.btn-view');
    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onView) onView(hotel);
    });

    // Edit and Delete buttons should stop propagation and execute respective functions
    const editBtn = card.querySelector('.btn-edit');
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onEdit) onEdit(hotel);
    });

    const deleteBtn = card.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onDelete) onDelete(hotel);
    });

    // Clicking the card itself also views details
    card.addEventListener('click', () => {
      if (onView) onView(hotel);
    });

    return card;
  }
}
