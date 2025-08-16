import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const response = await complaintAPI.getAllComplaints();
      setComplaints(response.complaints || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch complaints. Please try again.');
      console.error('Error fetching complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      setUpdatingStatus(complaintId);
      await complaintAPI.updateComplaintStatus(complaintId, newStatus);
      
      // Update local state
      setComplaints(prev => prev.map(complaint => 
        complaint._id === complaintId 
          ? { ...complaint, status: newStatus }
          : complaint
      ));
    } catch (err) {
      alert('Failed to update status. Please try again.');
      console.error('Error updating status:', err);
    } finally {
      setUpdatingStatus(null);
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
    const matchesFilter = filter === 'all' || complaint.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.citizen.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusCounts = () => {
    const counts = { open: 0, 'in progress': 0, resolved: 0, total: complaints.length };
    complaints.forEach(complaint => {
      const status = complaint.status.toLowerCase();
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
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
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage and monitor all citizen complaints</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{statusCounts.total}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="stat-card open">
          <div className="stat-number">{statusCounts.open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card progress">
          <div className="stat-number">{statusCounts['in progress']}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-number">{statusCounts.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="search-filter">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
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
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="no-complaints">
          <div className="no-complaints-icon">📝</div>
          <h3>No complaints found</h3>
          <p>
            {searchTerm 
              ? `No complaints match "${searchTerm}" with status "${filter}"`
              : `No complaints with status "${filter}" found.`
            }
          </p>
        </div>
      ) : (
        <div className="complaints-table-container">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Citizen</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(complaint => (
                <tr key={complaint._id}>
                  <td className="citizen-info">
                    <div className="citizen-name">{complaint.citizen.name}</div>
                    <div className="citizen-email">{complaint.citizen.email}</div>
                  </td>
                  <td className="complaint-title">
                    <div className="title-text">{complaint.title}</div>
                    <div className="description-preview">
                      {complaint.description.substring(0, 100)}
                      {complaint.description.length > 100 && '...'}
                    </div>
                  </td>
                  <td>
                    <span className={`category-badge ${getCategoryBadgeClass(complaint.category)}`}>
                      {complaint.category}
                    </span>
                  </td>
                  <td className="location">{complaint.location}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="date">{formatDate(complaint.createdAt)}</td>
                  <td className="actions">
                    <select
                      value={complaint.status}
                      onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                      disabled={updatingStatus === complaint._id}
                      className="status-update-select"
                    >
                      <option value="open">Open</option>
                      <option value="in progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    {updatingStatus === complaint._id && (
                      <div className="updating-indicator">Updating...</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
