/**
 * LuxeStay Utility Functions
 */

/**
 * Format a number/string price into Indian Rupees (INR) format
 * @param {number|string} amount 
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(parsed);
}

/**
 * Generate bootstrap-icons HTML string for a rating (out of 5)
 * @param {number} rating 
 * @returns {string} HTML string containing stars
 */
export function renderStars(rating) {
  const starsHtml = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml.push('<i class="bi bi-star-fill"></i>');
  }

  // Add half star
  if (hasHalfStar) {
    starsHtml.push('<i class="bi bi-star-half"></i>');
  } else if (rating % 1 > 0.75) {
    // If rating is close to 1, make it full star
    starsHtml.push('<i class="bi bi-star-fill"></i>');
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml.push('<i class="bi bi-star"></i>');
  }

  return starsHtml.join('');
}

/**
 * Standard debounce to delay execution of search callbacks
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate a random luxury-styled booking reference code
 * @returns {string} booking ID
 */
export function generateBookingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'LS-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

/**
 * Basic image URL validator
 * @param {string} url 
 * @returns {boolean}
 */
export function isValidImageUrl(url) {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}
