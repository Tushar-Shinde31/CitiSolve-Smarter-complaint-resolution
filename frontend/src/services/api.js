const API_BASE_URL = 'https://citisolve-smarter-complaint-resolution.onrender.com/api';

const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('getToken called, token:', token ? 'exists' : 'not found');
  return token;
};

const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  console.log('getUserRole called, role:', role);
  return role;
};

const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
    }
  };

  // Add JWT token if available
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },
};

// Complaint API
export const complaintAPI = {
  createComplaint: async (complaintData) => {
    // Handle FormData for file uploads
    if (complaintData instanceof FormData) {
      return apiCall('/complaints', {
        method: 'POST',
        body: complaintData, // Don't set Content-Type for FormData
      });
    }
    
    // Handle regular JSON data
    return apiCall('/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });
  },

  getComplaints: async () => {
    return apiCall('/complaints');
  },

  updateComplaintStatus: async (complaintId, updateData) => {
    return apiCall(`/complaints/${complaintId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
  },

  deleteComplaint: async (complaintId) => {
    return apiCall(`/complaints/${complaintId}`, {
      method: 'DELETE',
    });
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiCall('/users/profile');
  },

  updateProfile: async (profileData) => {
    return apiCall('/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
  },
};

export { getToken, getUserRole };
