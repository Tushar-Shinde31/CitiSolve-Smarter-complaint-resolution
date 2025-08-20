import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Register.css';

const Register = () => {
  // State to hold form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen' // default role
  });

  // State to store validation errors for each field
  const [errors, setErrors] = useState({});

  // Loading state to disable button & show "Creating Account..."
  const [isLoading, setIsLoading] = useState(false);

  // Global error message (API failure, etc.)
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  /**
   * Handle input field changes
   * Updates formData and clears error for that specific field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Register field ${name} changed to:`, value); // Debug log

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error message for that field as soon as user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form fields before submission
   * Returns true if valid, false if any errors found
   */
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  /**
   * Handle form submission
   * Calls API, stores JWT & user info in localStorage, then redirects
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset previous error message

    // Validate before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API to register user
      const response = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role
      });

      // Store JWT and user info in localStorage for session persistence
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userName', response.name);
      localStorage.setItem('userId', response._id);

      // Redirect user based on role
      if (response.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/my-complaints');
      }
    } catch (error) {
      // Handle error from API
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="register-subtitle">Join our citizen resolution system</p>
        
        {/* Show global error message if API fails */}
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Name field */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${errors.name ? 'error' : ''} ${formData.name ? 'has-value' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${errors.email ? 'error' : ''} ${formData.email ? 'has-value' : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Role selection */}
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`${errors.role ? 'error' : ''} ${formData.role ? 'has-value' : ''}`}
            >
              <option value="citizen">Citizen</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <span className="error-text">{errors.role}</span>}
            <small className="role-hint">
              {formData.role === 'admin' 
                ? 'Admin role has access to manage all complaints' 
                : 'Citizen role can submit and view their own complaints'
              }
            </small>
          </div>

          {/* Password field */}
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

          {/* Confirm Password field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${errors.confirmPassword ? 'error' : ''} ${formData.confirmPassword ? 'has-value' : ''}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="register-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Redirect to login if already registered */}
        <div className="login-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
