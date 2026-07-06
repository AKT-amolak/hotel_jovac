import { Toast } from './Toast.js';
import { HotelAPI } from '../api.js';

/**
 * LuxeStay HotelForm Component
 * Renders Create/Edit forms inside a modal and handles API submissions
 */
export class HotelForm {
  /**
   * Open the hotel management form in a modal
   * @param {object|null} hotel - Hotel data if editing, or null if creating a new hotel
   * @param {Function} onSuccess - Callback when creation/edition succeeds
   */
  static open(hotel = null, onSuccess) {
    const isEdit = !!hotel;
    
    let overlay = document.getElementById('hotel-form-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'hotel-form-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const defaultPhotos = isEdit && hotel.photos ? hotel.photos.join('\n') : '';

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">${isEdit ? 'Edit Hotel Details' : 'Add New Luxury Hotel'}</h2>
          <button class="modal-close-btn" id="close-form-modal" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="hotel-upsert-form" class="modal-form-grid">
            <div class="grid-col-span-2">
              <label class="filter-label">Hotel Name</label>
              <input type="text" id="form-hotel-name" class="form-control" 
                placeholder="e.g. The Ritz-Carlton Crest" value="${isEdit ? hotel.name : ''}" required>
            </div>

            <div>
              <label class="filter-label">Price per Night (₹)</label>
              <input type="number" id="form-hotel-price" class="form-control" min="1" step="0.01"
                placeholder="e.g. 7500" value="${isEdit ? hotel.price : ''}" required>
            </div>

            <div>
              <label class="filter-label">Rating (0 - 5.0)</label>
              <input type="number" id="form-hotel-rating" class="form-control" min="0" max="5" step="0.1"
                placeholder="e.g. 4.5" value="${isEdit ? hotel.rating : ''}" required>
            </div>

            <div class="grid-col-span-2">
              <label class="filter-label">Location (City)</label>
              <select id="form-hotel-location" class="form-control" required>
                <option value="">Select City...</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
                <option value="Delhi">Delhi</option>
                <option value="Goa">Goa</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Noida">Noida</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <div class="grid-col-span-2">
              <label class="filter-label">Thumbnail Image URL</label>
              <input type="url" id="form-hotel-thumbnail" class="form-control" 
                placeholder="https://images.unsplash.com/..." value="${isEdit ? hotel.thumbnail : ''}" required>
            </div>

            <div class="grid-col-span-2">
              <label class="filter-label">Additional Photo URLs (One URL per line)</label>
              <textarea id="form-hotel-photos" class="form-control" rows="3" 
                placeholder="https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2...">${defaultPhotos}</textarea>
            </div>

            <div class="grid-col-span-2">
              <label class="filter-label">Description</label>
              <textarea id="form-hotel-description" class="form-control" rows="3" 
                placeholder="Describe this stunning property..." required>${isEdit ? hotel.description : ''}</textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="btn-cancel-form">Cancel</button>
          <button class="btn btn-primary" id="btn-submit-form">
            ${isEdit ? 'Save Changes' : 'Create Hotel'}
          </button>
        </div>
      </div>
    `;

    // Select prefilled option for city
    if (isEdit) {
      const select = overlay.querySelector('#form-hotel-location');
      select.value = hotel.location;
    }

    // Add active styling
    overlay.classList.add('active');

    // Element references
    const closeBtn = overlay.querySelector('#close-form-modal');
    const cancelBtn = overlay.querySelector('#btn-cancel-form');
    const form = overlay.querySelector('#hotel-upsert-form');
    const submitBtn = overlay.querySelector('#btn-submit-form');

    const closeModal = () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        const container = overlay.querySelector('.modal-container');
        container.classList.add('animate-shake');
        setTimeout(() => container.classList.remove('animate-shake'), 400);
        return;
      }

      // Collect values
      const name = overlay.querySelector('#form-hotel-name').value.trim();
      const price = parseFloat(overlay.querySelector('#form-hotel-price').value);
      const rating = parseFloat(overlay.querySelector('#form-hotel-rating').value);
      const location = overlay.querySelector('#form-hotel-location').value;
      const thumbnail = overlay.querySelector('#form-hotel-thumbnail').value.trim();
      const description = overlay.querySelector('#form-hotel-description').value.trim();
      
      const photosRaw = overlay.querySelector('#form-hotel-photos').value;
      const photos = photosRaw
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const payload = {
        name,
        price,
        rating,
        location,
        thumbnail,
        description,
        photos
      };

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<div class="spinner"></div> Processing...`;

        let result;
        if (isEdit) {
          result = await HotelAPI.updateHotel(hotel.id, payload);
          Toast.success(`Successfully updated listing for "${name}"!`);
        } else {
          result = await HotelAPI.createHotel(payload);
          Toast.success(`Successfully added "${name}" to directory!`);
        }

        closeModal();
        if (onSuccess) onSuccess(result);
      } catch (err) {
        Toast.error(err.message || 'Error processing request');
        submitBtn.disabled = false;
        submitBtn.innerHTML = isEdit ? 'Save Changes' : 'Create Hotel';
      }
    });
  }
}
