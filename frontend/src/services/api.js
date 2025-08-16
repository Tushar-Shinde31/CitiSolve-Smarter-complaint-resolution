const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get JWT token from localStorage
const getToken = () => {
  return localStorage.getItem('jwt');
};

// Helper function to get user role from localStorage
const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Generic API call function with JWT authentication
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
};

// Complaint API calls
export const complaintAPI = {
  // Get all complaints (admin only)
  getAllComplaints: () => apiCall('/complaints'),
  
  // Get complaints for logged-in user
  getMyComplaints: () => apiCall('/complaints/my-complaints'),
  
  // Submit new complaint
  submitComplaint: (complaintData) => apiCall('/complaints', {
    method: 'POST',
    body: JSON.stringify(complaintData),
  }),
  
  // Update complaint status (admin only)
  updateComplaintStatus: (complaintId, status) => apiCall(`/complaints/${complaintId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  // Get complaint by ID
  getComplaintById: (complaintId) => apiCall(`/complaints/${complaintId}`),
};

// User API calls
export const userAPI = {
  getProfile: () => apiCall('/users/profile'),
};

export { getToken, getUserRole };
