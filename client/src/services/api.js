const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async signup({ fullName, email, password }) {
    console.log("sdas",fullName,email,password);
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });

    console.log("response",response);

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async logout() {
    this.clearToken();
    return this.request('/auth/logout', { method: 'POST' });
  }

  async updateProfile(fullName, email) {
    return this.request('/auth/updateprofile', {
      method: 'PUT',
      body: JSON.stringify({ fullName, email }),
    });
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = this.getToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/auth/upload-avatar`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  }

  // Company endpoints
  async getAllCompanies(search = '', city = '', sortBy = 'name') {
    let query = '/companies?';
    if (search) query += `search=${encodeURIComponent(search)}&`;
    if (city) query += `city=${encodeURIComponent(city)}&`;
    if (sortBy) query += `sortBy=${encodeURIComponent(sortBy)}`;

    return this.request(query);
  }

  async getCompany(id) {
    return this.request(`/companies/${id}`);
  }

  async getCompanyReviews(id) {
    return this.request(`/companies/${id}/reviews`);
  }

  async createCompanyReview(id, reviewData) {
    return this.request(`/companies/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async createCompany(companyData, logoFile = null) {
    const formData = new FormData();

    Object.keys(companyData).forEach((key) => {
      if (companyData[key]) {
        formData.append(key, companyData[key]);
      }
    });

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    const token = this.getToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create company');
    }

    return data;
  }

  async updateCompany(id, companyData, logoFile = null) {
    const formData = new FormData();

    Object.keys(companyData).forEach((key) => {
      if (companyData[key]) {
        formData.append(key, companyData[key]);
      }
    });

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    const token = this.getToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: 'PUT',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update company');
    }

    return data;
  }

  async deleteCompany(id) {
    return this.request(`/companies/${id}`, { method: 'DELETE' });
  }

  async getUserCompanies() {
    return this.request('/companies/user/mycompanies');
  }
}

export default new ApiService();
