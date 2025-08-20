import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  // State for form input values
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State for form validation errors
  const [errors, setErrors] = useState({});

  // Loading state for login button
  const [isLoading, setIsLoading] = useState(false);

  // State for login errors (API errors)
  const [loginError, setLoginError] = useState('');
  
  const navigate = useNavigate();

  // Handle input changes (email/password)
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Login field ${name} changed to:`, value); // Debug log

    // Update formData state dynamically
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form before submit
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default page reload
    setLoginError('');  // Clear previous error messages
    
    // Validate form inputs
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true); // Start loading state
    
    try {
      console.log('Attempting login with:', formData);

      // API call to login
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      
      // Save user data and token to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userName', response.user.name);
      localStorage.setItem('userId', response.user._id);
      
      console.log('Stored in localStorage:', {
        token: localStorage.getItem('token'),
        userRole: localStorage.getItem('userRole'),
        userName: localStorage.getItem('userName'),
        userId: localStorage.getItem('userId')
      });
      
      // Redirect user based on role
      if (response.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/my-complaints');
      }
    } catch (error) {
      // Handle API login error
      console.error('Login error:', error);
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Citizen Resolution</h2>
        
        {/* Show error from API if login fails */}
        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${errors.email ? 'error' : ''} ${formData.email ? 'has-value' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${errors.password ? 'error' : ''} ${formData.password ? 'has-value' : ''}`}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Footer link to Register page */}
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
