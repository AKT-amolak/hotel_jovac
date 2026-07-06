/**
 * LuxeStay API Client Wrapper
 * Handles all requests to the Demo Hotels API
 */
export class HotelAPI {
  static get BASE_URL() {
    const origin = window.location.origin;
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return '/api/hotels';
    }
    return 'https://demohotelsapi.pythonanywhere.com/hotels';
  }

  /**
   * Helper to perform fetch requests with error handling
   * @param {string} url - Target URL
   * @param {object} options - Fetch options
   * @returns {Promise<any>}
   */
  static async _request(url, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle 204 No Content for DELETE
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || `API request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  /**
   * Fetch all hotels based on filters, pagination, and sorting
   * @param {object} params - Filter and pagination options
   * @returns {Promise<{hotels: Array, count: number}>} List of hotels and total count
   */
  static async fetchHotels(params = {}) {
    const url = new URL(this.BASE_URL + '/', window.location.origin);
    
    // Append queries if they are present
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await this._request(url.toString());

    // API returns { status, count, returned, message, data: [...] }
    if (response && Array.isArray(response.data)) {
      return { hotels: response.data, count: response.count || response.data.length };
    }
    // Fallback if raw array is returned
    if (Array.isArray(response)) {
      return { hotels: response, count: response.length };
    }
    return { hotels: [], count: 0 };
  }

  /**
   * Fetch a single hotel by ID
   * @param {number|string} id - Hotel ID
   * @returns {Promise<object>} Hotel detail data
   */
  static async fetchHotelById(id) {
    const url = `${this.BASE_URL}/${id}/`;
    return await this._request(url);
  }

  /**
   * Create a new hotel
   * @param {object} hotelData - Hotel data object
   * @returns {Promise<object>} Created hotel object
   */
  static async createHotel(hotelData) {
    const url = `${this.BASE_URL}/`;
    return await this._request(url, {
      method: 'POST',
      body: JSON.stringify(hotelData),
    });
  }

  /**
   * Update an existing hotel completely (PUT)
   * @param {number|string} id - Hotel ID
   * @param {object} hotelData - Hotel data object
   * @returns {Promise<object>} Updated hotel object
   */
  static async updateHotel(id, hotelData) {
    const url = `${this.BASE_URL}/${id}/`;
    return await this._request(url, {
      method: 'PUT',
      body: JSON.stringify(hotelData),
    });
  }

  /**
   * Delete a hotel by ID
   * @param {number|string} id - Hotel ID
   * @returns {Promise<object>} Success status
   */
  static async deleteHotel(id) {
    const url = `${this.BASE_URL}/${id}/`;
    return await this._request(url, {
      method: 'DELETE',
    });
  }
}
