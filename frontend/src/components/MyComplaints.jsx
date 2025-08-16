import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import './MyComplaints.css';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, statusFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintAPI.getComplaints();
      setComplaints(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch complaints. Please try again.');
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = () => {
    if (statusFilter === 'all') {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(complaints.filter(complaint => complaint.status === statusFilter));
    }
  };

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

  const getCategoryColor = (category) => {
    const colors = {
      'Roads & Infrastructure': 'category-infrastructure',
      'Water Supply': 'category-water',
      'Sanitation & Waste': 'category-sanitation',
      'Street Lighting': 'category-lighting',
      'Public Safety': 'category-safety',
      'Environmental Issues': 'category-environmental',
      'Noise Pollution': 'category-noise',
      'Other': 'category-other'
    };
    return colors[category] || 'category-other';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (complaints.length === 0) {
    return (
      <div className="my-complaints-container">
        <div className="no-complaints">
          <div className="no-complaints-icon">📝</div>
          <h2>No Complaints Yet</h2>
          <p>You haven't submitted any complaints yet. Start by reporting an issue in your community.</p>
          <Link to="/submit-complaint" className="new-complaint-btn">
            Submit Your First Complaint
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-complaints-container">
      <div className="my-complaints-header">
        <h1>My Complaints</h1>
        <p>Track the status of your submitted complaints</p>
        
        <div className="header-actions">
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
          
          <Link to="/submit-complaint" className="new-complaint-btn">
            Submit New Complaint
          </Link>
        </div>
      </div>

      <div className="complaints-grid">
        {filteredComplaints.map((complaint) => (
          <div key={complaint._id} className="complaint-card">
            <div className="complaint-header">
              <div className="complaint-id">
                ID: {complaint.complaintId}
              </div>
              <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
            
            <div className="complaint-content">
              <h3 className="complaint-name">{complaint.name}</h3>
              
              <div className="complaint-details">
                <div className="detail-item">
                  <span className="detail-label">Ward:</span>
                  <span className="detail-value">{complaint.ward}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{complaint.location}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className={`category-badge ${getCategoryColor(complaint.category)}`}>
                    {complaint.category}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Submitted:</span>
                  <span className="detail-value">{formatDate(complaint.createdAt)}</span>
                </div>
                
                {complaint.updatedAt !== complaint.createdAt && (
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">{formatDate(complaint.updatedAt)}</span>
                  </div>
                )}
              </div>
              
              <div className="complaint-description">
                <span className="detail-label">Description:</span>
                <p>{complaint.description}</p>
              </div>
              
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
