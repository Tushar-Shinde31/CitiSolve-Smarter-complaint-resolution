import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import './ComplaintForm.css';

const ComplaintForm = () => {
  // State to store form field values
  const [formData, setFormData] = useState({
    name: '',
    ward: '',
    location: '',
    category: '',
    description: '',
    photo: null
  });

  // State for validation errors
  const [errors, setErrors] = useState({});
  // State for loading spinner
  const [isLoading, setIsLoading] = useState(false);
  // State for error/success messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Categories for dropdown
  const categories = [
    'Roads & Infrastructure',
    'Water Supply',
    'Sanitation & Waste',
    'Street Lighting',
    'Public Safety',
    'Environmental Issues',
    'Noise Pollution',
    'Other'
  ];

  // Handle text input & select field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value); // Debug log
    
    // Update state dynamically
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error message for that field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle photo upload (file validation)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Ensure file is an image
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: 'Please select an image file'
        }));
        return;
      }
      // Ensure file is less than 5MB
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: 'Image size should be less than 5MB'
        }));
        return;
      }
      // If valid, update state
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      setErrors(prev => ({
        ...prev,
        photo: ''
      }));
    }
  };

  // Validate inputs before submitting
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    // Ward validation
    if (!formData.ward.trim()) {
      newErrors.ward = 'Ward is required';
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    // Update error state
    setErrors(newErrors);

    // If no errors → form is valid
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Run validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData object to send text + file
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('ward', formData.ward.trim());
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description.trim());
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      // Call API to submit complaint
      await complaintAPI.createComplaint(formDataToSend);
      
      // Show success message
      setSuccessMessage('Complaint submitted successfully! Redirecting to your complaints...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/my-complaints');
      }, 2000);
    } catch (error) {
      // Handle API error
      setErrorMessage(error.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="complaint-form-container">
      <div className="complaint-form-card">
        <h2>Submit a Complaint</h2>
        <p className="form-subtitle">
          Help us improve your community by reporting issues that need attention
        </p>

        {/* Show error or success messages */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {/* Complaint Form */}
        <form onSubmit={handleSubmit} className="complaint-form">
          
          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Ward Input */}
          <div className="form-group">
            <label htmlFor="ward">Ward *</label>
            <input
              type="text"
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className={errors.ward ? 'error' : ''}
              placeholder="Enter your ward number or name"
            />
            {errors.ward && <span className="error-text">{errors.ward}</span>}
          </div>

          {/* Location Input */}
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
              placeholder="Enter specific location (street, landmark, etc.)"
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${errors.category ? 'error' : ''} ${formData.category ? 'has-value' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Show selected category */}
            {formData.category && (
              <div className="selected-category">
                Selected: <strong>{formData.category}</strong>
              </div>
            )}

            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              placeholder="Describe the issue in detail..."
              rows="5"
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          {/* Photo Upload */}
          <div className="form-group">
            <label htmlFor="photo">Photo (Optional)</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="file-input"
            />
            {errors.photo && <span className="error-text">{errors.photo}</span>}
            <small className="photo-hint">
              Upload a photo to help us better understand the issue. 
              Supported formats: JPG, PNG, GIF. Max size: 5MB.
            </small>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/my-complaints')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
