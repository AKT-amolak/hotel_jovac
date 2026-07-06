/**
 * LuxeStay Application State Manager
 * Tracks local state (hotels, loading, active filters, current theme)
 * and dispatches updates to registered render listeners.
 */
export class StateManager {
  constructor() {
    this.state = {
      hotels: [],
      filteredHotels: [], // Local search results if needed, or fetched lists
      loading: false,
      theme: localStorage.getItem('luxestay-theme') || 'dark',
      selectedHotel: null, // For detail view
      editingHotel: null,  // For form inputs (edit mode)
      activeFilters: {
        search: '',
        location: '',
        min_price: '',
        max_price: '',
        min_rating: '',
        max_rating: '',
        limit: 12,
        skip: 0,
        order_by: '-rating' // Default sort: highest rated first
      },
      hasMore: true
    };

    this.listeners = [];
    this.initTheme();
  }

  /**
   * Register a callback listener to run when state changes
   * @param {Function} callback 
   */
  subscribe(callback) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Update state properties and notify listeners
   * @param {object} newStateProps 
   */
  setState(newStateProps) {
    this.state = {
      ...this.state,
      ...newStateProps
    };
    this.notify();
  }

  /**
   * Trigger all subscribed listeners
   */
  notify() {
    this.listeners.forEach(callback => callback(this.state));
  }

  /**
   * Reset active filters to default
   */
  resetFilters() {
    this.setState({
      activeFilters: {
        search: '',
        location: '',
        min_price: '',
        max_price: '',
        min_rating: '',
        max_rating: '',
        limit: 12,
        skip: 0,
        order_by: '-rating'
      },
      hasMore: true
    });
  }

  /**
   * Update specific filter properties
   * @param {object} filterProps 
   */
  updateFilters(filterProps) {
    this.setState({
      activeFilters: {
        ...this.state.activeFilters,
        ...filterProps
      }
    });
  }

  /**
   * Toggle between dark and light themes
   */
  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('luxestay-theme', nextTheme);
    this.setState({ theme: nextTheme });
    this.applyThemeClass(nextTheme);
  }

  /**
   * Initialize theme on load
   */
  initTheme() {
    this.applyThemeClass(this.state.theme);
  }

  /**
   * Apply body class for theme styling
   * @param {string} theme 
   */
  applyThemeClass(theme) {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }
}

// Export single instance for global use
export const appState = new StateManager();
