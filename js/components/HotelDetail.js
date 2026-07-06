import { formatCurrency, renderStars } from '../utils.js';
import { BookingModal } from './BookingModal.js';

/**
 * LuxeStay HotelDetail Component
 * Renders a full details overlay page containing image slider, description, metadata, and booking action trigger.
 */
export class HotelDetail {
  /**
   * Open the detailed view for a single hotel
   * @param {object} hotel - Hotel object
   * @param {object} actions - Callbacks (onEdit, onDelete)
   */
  static open(hotel, { onEdit, onDelete }) {
    let overlay = document.getElementById('hotel-detail-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hotel-detail-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    // Prepare photos list (combining thumbnail and other photos)
    const fallbackImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80';
    let allPhotos = [];
    if (hotel.thumbnail) allPhotos.push(hotel.thumbnail);
    if (hotel.photos && Array.isArray(hotel.photos)) {
      allPhotos = [...allPhotos, ...hotel.photos];
    }
    // Filter duplicates and invalid links
    allPhotos = [...new Set(allPhotos)].filter(url => url && url.startsWith('http'));
    
    if (allPhotos.length === 0) {
      allPhotos.push(fallbackImage);
    }

    overlay.innerHTML = `
      <div class="modal-container modal-large animate-scale-up">
        <div class="modal-header">
          <h2 class="modal-title">${hotel.name}</h2>
          <button class="modal-close-btn" id="close-detail-modal" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          
          <!-- Image Gallery Carousel -->
          <div class="hotel-gallery">
            <div class="gallery-slides" id="detail-slides">
              ${allPhotos.map(url => `
                <div class="gallery-slide">
                  <img src="${url}" alt="${hotel.name} View" class="gallery-img">
                </div>
              `).join('')}
            </div>
            
            ${allPhotos.length > 1 ? `
              <button class="gallery-btn gallery-btn-prev" id="gallery-prev" aria-label="Previous image">
                <i class="bi bi-chevron-left"></i>
              </button>
              <button class="gallery-btn gallery-btn-next" id="gallery-next" aria-label="Next image">
                <i class="bi bi-chevron-right"></i>
              </button>
              <div class="gallery-dots" id="gallery-dots">
                ${allPhotos.map((_, i) => `
                  <button class="gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to image ${i + 1}"></button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Information Grid -->
          <div class="detail-info-grid">
            
            <div>
              <div class="hotel-card-rating" style="font-size: 1.05rem;">
                <div class="star-rating">${renderStars(hotel.rating)}</div>
                <span>${parseFloat(hotel.rating).toFixed(1)} / 5.0 Rating</span>
              </div>
              
              <div class="detail-desc">
                <h3 style="margin-bottom: 12px; font-weight: 700;">About the Property</h3>
                <p>${hotel.description}</p>
              </div>
              
              <div class="detail-meta-list">
                <div class="detail-meta-item">
                  <i class="bi bi-shield-fill-check detail-meta-icon"></i>
                  <span>Free high-speed Wi-Fi and parking available</span>
                </div>
                <div class="detail-meta-item">
                  <i class="bi bi-clock-fill detail-meta-icon"></i>
                  <span>24-Hour front desk & concierge assistance</span>
                </div>
                <div class="detail-meta-item">
                  <i class="bi bi-geo-alt-fill detail-meta-icon"></i>
                  <span>Located in Prime Area of ${hotel.location}</span>
                </div>
              </div>
            </div>

            <!-- Booking Sidebar Column -->
            <div class="detail-sidebar">
              <div class="booking-card">
                <div class="hotel-price-label">Price / Night</div>
                <div class="hotel-price-value" style="font-size: 1.8rem; margin-bottom: 20px;">
                  ${formatCurrency(hotel.price)}
                </div>
                
                <button class="btn btn-primary" id="btn-book-stay" style="width: 100%; padding: 14px 20px; font-size: 1.05rem;">
                  <i class="bi bi-calendar-check-fill me-2"></i> Book Stay Now
                </button>
              </div>

              <!-- Quick action links for management -->
              <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="btn btn-secondary" id="btn-detail-edit" style="flex: 1;">
                  <i class="bi bi-pencil-square"></i> Edit
                </button>
                <button class="btn btn-secondary btn-outline" id="btn-detail-delete" style="flex: 1; border-color: rgba(239, 68, 68, 0.2); color: var(--danger);">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    // Add active styling
    overlay.classList.add('active');

    // Handle Image Load Errors
    const images = overlay.querySelectorAll('.gallery-img');
    images.forEach(img => {
      img.addEventListener('error', () => {
        img.src = fallbackImage;
      });
    });

    // Close functionality
    const closeBtn = overlay.querySelector('#close-detail-modal');
    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Gallery Carousel logic
    if (allPhotos.length > 1) {
      let currentIdx = 0;
      const slides = overlay.querySelector('#detail-slides');
      const dots = overlay.querySelectorAll('.gallery-dot');
      const prevBtn = overlay.querySelector('#gallery-prev');
      const nextBtn = overlay.querySelector('#gallery-next');

      const updateGallery = (index) => {
        currentIdx = index;
        slides.style.transform = `translateX(-${currentIdx * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
          if (i === currentIdx) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      };

      prevBtn.addEventListener('click', () => {
        const nextIdx = currentIdx === 0 ? allPhotos.length - 1 : currentIdx - 1;
        updateGallery(nextIdx);
      });

      nextBtn.addEventListener('click', () => {
        const nextIdx = currentIdx === allPhotos.length - 1 ? 0 : currentIdx + 1;
        updateGallery(nextIdx);
      });

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const targetIdx = parseInt(dot.dataset.index);
          updateGallery(targetIdx);
        });
      });
    }

    // Trigger edit and delete events
    const editBtn = overlay.querySelector('#btn-detail-edit');
    editBtn.addEventListener('click', () => {
      closeModal();
      if (onEdit) onEdit(hotel);
    });

    const deleteBtn = overlay.querySelector('#btn-detail-delete');
    deleteBtn.addEventListener('click', () => {
      closeModal();
      if (onDelete) onDelete(hotel);
    });

    // Trigger booking modal
    const bookBtn = overlay.querySelector('#btn-book-stay');
    bookBtn.addEventListener('click', () => {
      closeModal();
      BookingModal.open(hotel);
    });
  }
}
