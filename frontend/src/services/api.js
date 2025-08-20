// Base URL for backend API
const API_BASE_URL = 'https://citisolve-smarter-complaint-resolution.onrender.com/api';

/**
 * Helper function: Get JWT token from localStorage
 * This is used for authenticating API calls.
 */
const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('getToken called, token:', token ? 'exists' : 'not found');
  return token;
};

/**
 * Helper function: Get logged-in user role (citizen/admin) from localStorage
 */
const getUserRole = () => {
  const role = localStorage.getItem('userRole');
  console.log('getUserRole called, role:', role);
  return role;
};

/**
 * Generic API call function
 * - Handles token injection in headers (Authorization Bearer token)
 * - Provides unified error handling
 */
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  // Build request configuration
  const config = {
    ...options,
    headers: {
      ...options.headers,
    }
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    // Make API call
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // If response is not OK, throw error with server message
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Return parsed JSON response
    return await response.json();
  } catch (error) {
    // Catch network or parsing errors
    throw new Error(error.message || 'Network error occurred');
  }
};

/* ===================== AUTHENTICATION API ===================== */
export const authAPI = {
  /**
   * Login user with email & password
   */
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Register a new user
   */
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  },

  /**
   * Fetch details of currently logged-in user
   */
  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },
};

/* ===================== COMPLAINT API ===================== */
export const complaintAPI = {
  /**
   * Create a new complaint
   * - Handles both JSON data & FormData (for file uploads like images)
   */
  createComplaint: async (complaintData) => {
    if (complaintData instanceof FormData) {
      // For FormData: Don't set Content-Type (browser sets it automatically)
      return apiCall('/complaints', {
        method: 'POST',
        body: complaintData,
      });
    }
    
    // For JSON body
    return apiCall('/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaintData),
    });
  },

  /**
   * Get all complaints (based on user role - citizen/admin)
   */
  getComplaints: async () => {
    return apiCall('/complaints');
  },

  /**
   * Update complaint status (only admin usually)
   */
  updateComplaintStatus: async (complaintId, updateData) => {
    return apiCall(`/complaints/${complaintId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Delete a complaint by ID
   */
  deleteComplaint: async (complaintId) => {
    return apiCall(`/complaints/${complaintId}`, {
      method: 'DELETE',
    });
  },
};

/* ===================== USER API ===================== */
export const userAPI = {
  /**
   * Get profile details of logged-in user
   */
  getProfile: async () => {
    return apiCall('/users/profile');
  },

  /**
   * Update logged-in user profile
   */
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

// Export helpers for global use
export { getToken, getUserRole };
