// API service for Cloud SQL backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  // Generic request handler
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // RSVP operations
  async getRSVPs() {
    return this.request('/rsvps');
  }

  async createRSVP(rsvpData) {
    return this.request('/rsvps', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
  }

  async deleteRSVP(id) {
    return this.request(`/rsvps/${id}`, {
      method: 'DELETE',
    });
  }

  // Message operations
  async getMessages() {
    return this.request('/messages');
  }

  async createMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async deleteMessage(id) {
    return this.request(`/messages/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
