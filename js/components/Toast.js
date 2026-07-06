/**
 * LuxeStay Toast Notification System
 * Renders auto-dismissing toast alerts
 */
export class Toast {
  /**
   * Show a toast message
   * @param {string} message - Message text
   * @param {'success'|'error'|'warning'|'info'} type - Toast type
   * @param {number} duration - Time before auto-hide in ms
   */
  static show(message, type = 'success', duration = 4000) {
    let container = document.getElementById('toast-container');
    
    // Create container if it doesn't exist
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    // Get matching icon based on type
    let iconClass = 'bi-info-circle-fill';
    if (type === 'success') iconClass = 'bi-check-circle-fill';
    if (type === 'error') iconClass = 'bi-exclamation-triangle-fill';
    if (type === 'warning') iconClass = 'bi-exclamation-circle-fill';

    toast.innerHTML = `
      <span class="toast-icon"><i class="bi ${iconClass}"></i></span>
      <span class="toast-message">${message}</span>
      <button class="toast-close"><i class="bi bi-x-lg"></i></button>
    `;

    // Append to container
    container.appendChild(toast);

    // Trigger slide-in animation in next frame
    requestAnimationFrame(() => {
      toast.classList.add('active');
    });

    // Close on button click
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.dismiss(toast));

    // Auto dismiss
    const timeoutId = setTimeout(() => {
      this.dismiss(toast);
    }, duration);

    // Store timeout ID to clear if dismissed manually
    toast.dataset.timeoutId = timeoutId;
  }

  /**
   * Slide out and remove toast from DOM
   * @param {HTMLElement} toast 
   */
  static dismiss(toast) {
    if (toast.dataset.timeoutId) {
      clearTimeout(parseInt(toast.dataset.timeoutId));
    }
    
    toast.classList.remove('active');
    
    // Remove element after transition completes
    toast.addEventListener('transitionend', () => {
      toast.remove();
      
      // Clean up container if empty
      const container = document.getElementById('toast-container');
      if (container && container.children.length === 0) {
        container.remove();
      }
    });
  }

  // Convenience methods
  static success(msg, dur) { this.show(msg, 'success', dur); }
  static error(msg, dur) { this.show(msg, 'error', dur); }
  static warning(msg, dur) { this.show(msg, 'warning', dur); }
  static info(msg, dur) { this.show(msg, 'info', dur); }
}
