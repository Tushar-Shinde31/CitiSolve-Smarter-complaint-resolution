import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import './MyComplaints.css';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await complaintAPI.getMyComplaints();
      setComplaints(response.complaints || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch complaints. Please try again.');
      console.error('Error fetching complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'status-open';
      case 'in progress':
        return 'status-progress';
      case 'resolved':
        return 'status-resolved';
      default:
        return 'status-default';
    }
  };

  const getCategoryBadgeClass = (category) => {
    const categoryMap = {
      'Infrastructure': 'infrastructure',
      'Public Safety': 'safety',
      'Environmental': 'environmental',
      'Transportation': 'transportation',
      'Utilities': 'utilities',
      'Noise Complaint': 'noise',
      'Other': 'other'
    };
    return categoryMap[category] || 'other';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status.toLowerCase() === filter.toLowerCase();
  });

  if (isLoading) {
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
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Complaints</h3>
          <p>{error}</p>
          <button onClick={fetchComplaints} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-complaints-container">
      <div className="my-complaints-header">
        <h1>My Complaints</h1>
        <p>Track the progress of your submitted complaints</p>
        
        <div className="header-actions">
          <div className="filter-controls">
            <label htmlFor="status-filter">Filter by status:</label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <Link to="/submit-complaint" className="new-complaint-btn">
            + Submit New Complaint
          </Link>
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="no-complaints">
          <div className="no-complaints-icon">📝</div>
          <h3>No complaints found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't submitted any complaints yet. Start by submitting your first complaint!"
              : `No complaints with status "${filter}" found.`
            }
          </p>
          {filter === 'all' && (
            <Link to="/submit-complaint" className="submit-first-btn">
              Submit Your First Complaint
            </Link>
          )}
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map(complaint => (
            <div key={complaint._id} className="complaint-card">
              <div className="complaint-header">
                <h3 className="complaint-title">{complaint.title}</h3>
                <div className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                  {complaint.status}
                </div>
              </div>
              
              <div className="complaint-meta">
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className={`category-badge ${getCategoryBadgeClass(complaint.category)}`}>
                    {complaint.category}
                  </span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Location:</span>
                  <span className="meta-value">{complaint.location}</span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Submitted:</span>
                  <span className="meta-value">{formatDate(complaint.createdAt)}</span>
                </div>
                
                {complaint.updatedAt !== complaint.createdAt && (
                  <div className="meta-item">
                    <span className="meta-label">Last Updated:</span>
                    <span className="meta-value">{formatDate(complaint.updatedAt)}</span>
                  </div>
                )}
              </div>
              
              <div className="complaint-description">
                <p>{complaint.description}</p>
              </div>
              
              {complaint.adminNotes && (
                <div className="admin-notes">
                  <h4>Admin Notes:</h4>
                  <p>{complaint.adminNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
