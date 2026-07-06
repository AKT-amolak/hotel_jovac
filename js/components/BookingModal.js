import { formatCurrency, generateBookingId } from '../utils.js';
import { Toast } from './Toast.js';

/**
 * LuxeStay BookingModal Component
 * Manages the mock booking simulation form and receipt presentation
 */
export class BookingModal {
  /**
   * Open the booking modal overlay for a specific hotel
   * @param {object} hotel - Hotel object
   */
  static open(hotel) {
    let overlay = document.getElementById('booking-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'booking-modal-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    // Set today and tomorrow for default dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const minCheckIn = formatDate(today);
    const minCheckOut = formatDate(tomorrow);

    overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">Book Stay at ${hotel.name}</h2>
          <button class="modal-close-btn" id="close-booking-modal" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="booking-form" class="modal-form-grid">
            <div class="grid-col-span-2">
              <label class="filter-label">Full Name</label>
              <input type="text" id="booking-name" class="form-control" placeholder="John Doe" required>
            </div>
            
            <div class="grid-col-span-2">
              <label class="filter-label">Email Address</label>
              <input type="email" id="booking-email" class="form-control" placeholder="john.doe@example.com" required>
            </div>

            <div>
              <label class="filter-label">Check-in Date</label>
              <input type="date" id="booking-checkin" class="form-control" min="${minCheckIn}" value="${minCheckIn}" required>
            </div>
            
            <div>
              <label class="filter-label">Check-out Date</label>
              <input type="date" id="booking-checkout" class="form-control" min="${minCheckOut}" value="${minCheckOut}" required>
            </div>

            <div>
              <label class="filter-label">Room Category</label>
              <select id="booking-room" class="form-control">
                <option value="standard" data-multiplier="1.0">Standard Suite (1.0x)</option>
                <option value="deluxe" data-multiplier="1.3">Deluxe Oceanfront (1.3x)</option>
                <option value="villa" data-multiplier="1.8">Signature Luxury Villa (1.8x)</option>
              </select>
            </div>

            <div>
              <label class="filter-label">Guests</label>
              <select id="booking-guests" class="form-control">
                <option value="1">1 Guest</option>
                <option value="2" selected>2 Guests</option>
                <option value="3">3 Guests (+₹500/N)</option>
                <option value="4">4 Guests (+₹1000/N)</option>
              </select>
            </div>

            <!-- Booking Summary Output Card -->
            <div class="grid-col-span-2 booking-card" id="booking-summary-panel">
              <h4 style="margin-bottom: 12px; font-weight: 700;">Rate Summary</h4>
              <div class="booking-summary-row">
                <span>Base Nightly Rate:</span>
                <span id="rate-base">${formatCurrency(hotel.price)}</span>
              </div>
              <div class="booking-summary-row">
                <span>Room Premium Multiplier:</span>
                <span id="rate-multiplier">1.0x</span>
              </div>
              <div class="booking-summary-row">
                <span>Total Nights:</span>
                <span id="rate-nights">1 night</span>
              </div>
              <div class="booking-summary-row" id="rate-extra-row" style="display: none;">
                <span>Extra Guests Fee:</span>
                <span id="rate-extra-value">₹0</span>
              </div>
              <div class="booking-summary-total">
                <span>Estimated Total:</span>
                <span id="rate-total-price">${formatCurrency(hotel.price)}</span>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" id="btn-cancel-booking">Cancel</button>
          <button class="btn btn-primary" id="btn-submit-booking">Confirm BookingStay</button>
        </div>
      </div>
    `;

    // Add show animation
    overlay.classList.add('active');

    // UI Bindings
    const closeBtn = overlay.querySelector('#close-booking-modal');
    const cancelBtn = overlay.querySelector('#btn-cancel-booking');
    const form = overlay.querySelector('#booking-form');
    const confirmBtn = overlay.querySelector('#btn-submit-booking');

    const checkInInput = overlay.querySelector('#booking-checkin');
    const checkOutInput = overlay.querySelector('#booking-checkout');
    const roomSelect = overlay.querySelector('#booking-room');
    const guestsSelect = overlay.querySelector('#booking-guests');

    const closeModal = () => {
      overlay.classList.remove('active');
      // Wait for animation to finish
      setTimeout(() => overlay.remove(), 300);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Real-time calculation logic
    const calculateCost = () => {
      const baseVal = parseFloat(hotel.price);
      const checkinDate = new Date(checkInInput.value);
      const checkoutDate = new Date(checkOutInput.value);
      
      // Calculate nights
      let nights = 0;
      if (!isNaN(checkinDate) && !isNaN(checkoutDate)) {
        const diffTime = checkoutDate - checkinDate;
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      if (nights <= 0) nights = 0;

      // Room Type Multiplier
      const selectedOpt = roomSelect.options[roomSelect.selectedIndex];
      const multiplier = parseFloat(selectedOpt.dataset.multiplier) || 1.0;

      // Guests addition: extra guests above 2 cost ₹500 per night per extra guest
      const guests = parseInt(guestsSelect.value);
      const extraGuests = Math.max(0, guests - 2);
      const extraFeePerNight = extraGuests * 500;
      const totalExtraFee = extraFeePerNight * nights;

      // Calculations
      const baseNightlyWithPremium = baseVal * multiplier;
      const totalBaseStay = baseNightlyWithPremium * nights;
      const totalStayCost = totalBaseStay + totalExtraFee;

      // Update UI Panel
      overlay.querySelector('#rate-multiplier').innerText = `${multiplier.toFixed(1)}x`;
      overlay.querySelector('#rate-nights').innerText = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
      
      if (totalExtraFee > 0) {
        overlay.querySelector('#rate-extra-row').style.display = 'flex';
        overlay.querySelector('#rate-extra-value').innerText = formatCurrency(totalExtraFee);
      } else {
        overlay.querySelector('#rate-extra-row').style.display = 'none';
      }

      overlay.querySelector('#rate-total-price').innerText = formatCurrency(totalStayCost);
      return { totalStayCost, nights, roomLabel: selectedOpt.text };
    };

    // Listeners for calculator
    checkInInput.addEventListener('change', () => {
      // CheckOut minimum date should adjust automatically
      const nextDay = new Date(checkInInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkOutInput.min = formatDate(nextDay);
      if (new Date(checkOutInput.value) <= new Date(checkInInput.value)) {
        checkOutInput.value = formatDate(nextDay);
      }
      calculateCost();
    });

    checkOutInput.addEventListener('change', calculateCost);
    roomSelect.addEventListener('change', calculateCost);
    guestsSelect.addEventListener('change', calculateCost);

    // Initial calculation run
    calculateCost();

    // Confirm booking submission
    confirmBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Check validation
      if (!form.checkValidity()) {
        form.reportValidity();
        const container = overlay.querySelector('.modal-container');
        container.classList.add('animate-shake');
        setTimeout(() => container.classList.remove('animate-shake'), 400);
        return;
      }

      const name = overlay.querySelector('#booking-name').value;
      const email = overlay.querySelector('#booking-email').value;
      const checkin = checkInInput.value;
      const checkout = checkOutInput.value;
      const summary = calculateCost();

      if (summary.nights <= 0) {
        Toast.error('Check-out date must be after check-in date');
        return;
      }

      // Successful Booking UI Transition
      const bookingId = generateBookingId();
      
      // Update body with a beautiful digital ticket receipt
      overlay.querySelector('.modal-body').innerHTML = `
        <div class="animate-scale-up text-center" style="padding: 10px 0;">
          <div style="font-size: 3.5rem; color: var(--success); margin-bottom: 16px;">
            <i class="bi bi-patch-check-fill"></i>
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Reservation Confirmed!</h3>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">Your stay has been successfully booked. A confirmation email has been sent to <strong>${email}</strong>.</p>
          
          <div class="booking-card" style="text-align: left; background-color: var(--bg-secondary);">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-color); padding-bottom: 10px; margin-bottom: 12px;">
              <span style="font-weight: 600; color: var(--text-secondary);">Booking ID:</span>
              <strong style="color: var(--primary-accent); font-family: var(--font-heading);">${bookingId}</strong>
            </div>
            
            <div style="margin-bottom: 8px; font-size: 0.95rem;">
              <strong>Guest Name:</strong> ${name}
            </div>
            <div style="margin-bottom: 8px; font-size: 0.95rem;">
              <strong>Hotel:</strong> ${hotel.name}
            </div>
            <div style="margin-bottom: 8px; font-size: 0.95rem;">
              <strong>Category:</strong> ${summary.roomLabel}
            </div>
            <div style="display: flex; gap: 20px; font-size: 0.95rem; margin-bottom: 8px;">
              <div><strong>Check-in:</strong> ${checkin}</div>
              <div><strong>Check-out:</strong> ${checkout}</div>
            </div>
            <div style="border-top: 1px solid var(--border-color); padding-top: 10px; margin-top: 12px; display: flex; justify-content: space-between; font-weight: 750;">
              <span>Amount Paid:</span>
              <span style="color: var(--text-primary);">${formatCurrency(summary.totalStayCost)}</span>
            </div>
          </div>
        </div>
      `;

      // Hide footers and show a close ticket button
      const footer = overlay.querySelector('.modal-footer');
      footer.innerHTML = `
        <button class="btn btn-primary" id="btn-close-ticket" style="width: 100%;">Close Booking</button>
      `;

      overlay.querySelector('#btn-close-ticket').addEventListener('click', closeModal);
      Toast.success(`Reservation ${bookingId} confirmed!`);
    });
  }
}
