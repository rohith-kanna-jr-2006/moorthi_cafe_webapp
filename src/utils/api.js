const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = {
  // Auth endpoints
  authLogin: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  authMe: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Categories endpoints
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createCategory: async (categoryData, token) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  updateCategory: async (id, categoryData, token) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  deleteCategory: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Foods endpoints
  getFoods: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams
      ? `${API_BASE_URL}/foods?${queryParams}`
      : `${API_BASE_URL}/foods`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getFoodById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createFood: async (foodData, token) => {
    const response = await fetch(`${API_BASE_URL}/foods`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodData),
    });
    return response.json();
  },

  updateFood: async (id, foodData, token) => {
    const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foodData),
    });
    return response.json();
  },

  deleteFood: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/foods/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Admin endpoints
  getAdminDashboard: async (token) => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getAdminOrders: async (params = {}, token) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams
      ? `${API_BASE_URL}/admin/orders?${queryParams}`
      : `${API_BASE_URL}/admin/orders`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  updateOrderStatus: async (id, statusData, token) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData),
    });
    return response.json();
  },
};

export default api;