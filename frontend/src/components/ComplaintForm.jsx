import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import './ComplaintForm.css';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    ward: '',
    location: '',
    category: '',
    description: '',
    photo: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: 'Please select an image file'
        }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: 'Image size should be less than 5MB'
        }));
        return;
      }
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.ward.trim()) {
      newErrors.ward = 'Ward is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('ward', formData.ward.trim());
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description.trim());
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      await complaintAPI.createComplaint(formDataToSend);
      
      setSuccessMessage('Complaint submitted successfully! Redirecting to your complaints...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/my-complaints');
      }, 2000);
    } catch (error) {
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

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="complaint-form">
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

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

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
