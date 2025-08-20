import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import './MyComplaints.css';

const MyComplaints = () => {
  // State variables
  const [complaints, setComplaints] = useState([]); // All complaints fetched from backend
  const [filteredComplaints, setFilteredComplaints] = useState([]); // Complaints after applying filter
  const [loading, setLoading] = useState(true); // Loading state while fetching complaints
  const [error, setError] = useState(''); // Store error message if API call fails
  const [statusFilter, setStatusFilter] = useState('all'); // Current filter option (Open, In Progress, Resolved, etc.)

  // Fetch complaints when component mounts
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Apply filtering whenever complaints or statusFilter changes
  useEffect(() => {
    filterComplaints();
  }, [complaints, statusFilter]);

  // API call to fetch complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintAPI.getComplaints(); // Call API
      setComplaints(data); // Save complaints
      setError('');
    } catch (err) {
      setError('Failed to fetch complaints. Please try again.');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter complaints based on selected status
  const filterComplaints = () => {
    if (statusFilter === 'all') {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(
        complaints.filter((complaint) => complaint.status === statusFilter)
      );
    }
  };

  // Utility function: get CSS class based on complaint status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'status-open';
      case 'In Progress':
        return 'status-progress';
      case 'Resolved':
        return 'status-resolved';
      default:
        return '';
    }
  };

  // Utility function: get CSS class based on category
  const getCategoryColor = (category) => {
    const colors = {
      'Roads & Infrastructure': 'category-infrastructure',
      'Water Supply': 'category-water',
      'Sanitation & Waste': 'category-sanitation',
      'Street Lighting': 'category-lighting',
      'Public Safety': 'category-safety',
      'Environmental Issues': 'category-environmental',
      'Noise Pollution': 'category-noise',
      Other: 'category-other',
    };
    return colors[category] || 'category-other';
  };

  // Format date for display (e.g., Jan 12, 2025, 10:30 AM)
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="my-complaints-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your complaints...</p>
        </div>
      </div>
    );
  }

  // Show error message if API call failed
  if (error) {
    return (
      <div className="my-complaints-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchComplaints} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If user has not submitted any complaints yet
  if (complaints.length === 0) {
    return (
      <div className="my-complaints-container">
        <div className="no-complaints">
          <div className="no-complaints-icon">📝</div>
          <h2>No Complaints Yet</h2>
          <p>
            You haven't submitted any complaints yet. Start by reporting an
            issue in your community.
          </p>
          <Link to="/submit-complaint" className="new-complaint-btn">
            Submit Your First Complaint
          </Link>
        </div>
      </div>
    );
  }

  // Main complaints display
  return (
    <div className="my-complaints-container">
      {/* Header section */}
      <div className="my-complaints-header">
        <h1>My Complaints</h1>
        <p>Track the status of your submitted complaints</p>

        {/* Actions: filter + submit new complaint */}
        <div className="header-actions">
          {/* Status filter dropdown */}
          <div className="filter-controls">
            <label htmlFor="status-filter">Filter by status:</label>
            <select
              id="status-filter"
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* New complaint button */}
          <Link to="/submit-complaint" className="new-complaint-btn">
            Submit New Complaint
          </Link>
        </div>
      </div>

      {/* Complaints list grid */}
      <div className="complaints-grid">
        {filteredComplaints.map((complaint) => (
          <div key={complaint._id} className="complaint-card">
            {/* Complaint header (ID + status badge) */}
            <div className="complaint-header">
              <div className="complaint-id">
                ID: {complaint.complaintId}
              </div>
              <span
                className={`status-badge ${getStatusColor(complaint.status)}`}
              >
                {complaint.status}
              </span>
            </div>

            {/* Complaint details */}
            <div className="complaint-content">
              <h3 className="complaint-name">{complaint.name}</h3>

              <div className="complaint-details">
                {/* Ward */}
                <div className="detail-item">
                  <span className="detail-label">Ward:</span>
                  <span className="detail-value">{complaint.ward}</span>
                </div>

                {/* Location */}
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{complaint.location}</span>
                </div>

                {/* Category */}
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span
                    className={`category-badge ${getCategoryColor(
                      complaint.category
                    )}`}
                  >
                    {complaint.category}
                  </span>
                </div>

                {/* Created Date */}
                <div className="detail-item">
                  <span className="detail-label">Submitted:</span>
                  <span className="detail-value">
                    {formatDate(complaint.createdAt)}
                  </span>
                </div>

                {/* Updated Date (if different from created date) */}
                {complaint.updatedAt !== complaint.createdAt && (
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">
                      {formatDate(complaint.updatedAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="complaint-description">
                <span className="detail-label">Description:</span>
                <p>{complaint.description}</p>
              </div>

              {/* Attached photo (if available) */}
              {complaint.photoUrl && (
                <div className="complaint-photo">
                  <span className="detail-label">Photo:</span>
                  <img
                    src={complaint.photoUrl}
                    alt="Complaint photo"
                    className="photo-thumbnail"
                  />
                </div>
              )}

              {/* Resolution Note (if available) */}
              {complaint.resolutionNote && (
                <div className="resolution-note">
                  <span className="detail-label">Resolution Note:</span>
                  <p className="note-content">{complaint.resolutionNote}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message when filter returns no results */}
      {filteredComplaints.length === 0 && complaints.length > 0 && (
        <div className="no-results">
          <p>No complaints found with the selected status.</p>
          <button
            onClick={() => setStatusFilter('all')}
            className="clear-filter-btn"
          >
            Show All Complaints
          </button>
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
