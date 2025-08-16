import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  // Remove the shared statusUpdateData and replace with individual edit states
  const [editStates, setEditStates] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterComplaints();
  }, [complaints, searchTerm, statusFilter, categoryFilter]);

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
    let filtered = complaints;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.complaintId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === categoryFilter);
    }

    setFilteredComplaints(filtered);
  };

  // Initialize edit state for a complaint
  const initializeEditState = (complaintId) => {
    if (!editStates[complaintId]) {
      const complaint = complaints.find(c => c._id === complaintId);
      setEditStates(prev => ({
        ...prev,
        [complaintId]: {
          status: complaint?.status || '',
          resolutionNote: complaint?.resolutionNote || ''
        }
      }));
    }
  };

  // Update edit state for a specific complaint
  const updateEditState = (complaintId, field, value) => {
    setEditStates(prev => ({
      ...prev,
      [complaintId]: {
        ...prev[complaintId],
        [field]: value
      }
    }));
  };

  const handleStatusUpdate = async (complaintId) => {
    const editState = editStates[complaintId];
    if (!editState || !editState.status) {
      alert('Please select a status');
      return;
    }

    if (editState.status === 'Resolved' && !editState.resolutionNote.trim()) {
      alert('Resolution note is required when status is Resolved');
      return;
    }

    try {
      setUpdatingStatus(complaintId);
      await complaintAPI.updateComplaintStatus(complaintId, editState);
      
      // Update local state
      setComplaints(prev => prev.map(complaint => 
        complaint._id === complaintId 
          ? { 
              ...complaint, 
              status: editState.status,
              resolutionNote: editState.resolutionNote,
              updatedAt: new Date().toISOString()
            }
          : complaint
      ));
      
      // Reset edit state for this specific complaint
      setEditStates(prev => ({
        ...prev,
        [complaintId]: {
          status: '',
          resolutionNote: ''
        }
      }));
      setUpdatingStatus(null);
    } catch (error) {
      alert('Failed to update status: ' + error.message);
      setUpdatingStatus(null);
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

  const getStats = () => {
    const total = complaints.length;
    const open = complaints.filter(c => c.status === 'Open').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    
    return { total, open, inProgress, resolved };
  };

  const stats = getStats();
  const categories = [...new Set(complaints.map(c => c.category))];

  if (loading) {
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
          <p className="error-message">{error}</p>
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
        <div className="stat-card total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="stat-card open">
          <div className="stat-number">{stats.open}</div>
          <div className="stat-label">Open</div>
        </div>
        <div className="stat-card progress">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card resolved">
          <div className="stat-number">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="search-filter">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search complaints by ID, name, description, location, or ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="complaints-table-container">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Citizen</th>
              <th>Ward</th>
              <th>Location</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr key={complaint._id}>
                <td className="complaint-id">{complaint.complaintId}</td>
                <td className="citizen-info">
                  <div className="citizen-name">{complaint.name}</div>
                  <div className="citizen-email">{complaint.user?.email}</div>
                </td>
                <td>{complaint.ward}</td>
                <td>{complaint.location}</td>
                <td>
                  <span className={`category-badge ${getCategoryColor(complaint.category)}`}>
                    {complaint.category}
                  </span>
                </td>
                <td className="description-cell">
                  <div className="description-text">{complaint.description}</div>
                  {complaint.photoUrl && (
                    <div className="photo-indicator">📷</div>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </td>
                <td>{formatDate(complaint.createdAt)}</td>
                <td>{formatDate(complaint.updatedAt)}</td>
                <td className="actions-cell">
                  <div className="status-update-form">
                    <select
                      className="status-select"
                      value={editStates[complaint._id]?.status || ''}
                      onChange={(e) => updateEditState(complaint._id, 'status', e.target.value)}
                      onFocus={() => initializeEditState(complaint._id)}
                    >
                      <option value="">Select Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    
                    {editStates[complaint._id]?.status === 'Resolved' && (
                      <textarea
                        className="resolution-note-input"
                        placeholder="Enter resolution note..."
                        value={editStates[complaint._id]?.resolutionNote || ''}
                        onChange={(e) => updateEditState(complaint._id, 'resolutionNote', e.target.value)}
                        onFocus={() => initializeEditState(complaint._id)}
                        rows="3"
                      />
                    )}
                    
                    <button
                      className="update-status-btn"
                      onClick={() => handleStatusUpdate(complaint._id)}
                      disabled={updatingStatus === complaint._id}
                    >
                      {updatingStatus === complaint._id ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                  
                  {complaint.resolutionNote && (
                    <div className="resolution-note-display">
                      <strong>Resolution:</strong> {complaint.resolutionNote}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredComplaints.length === 0 && (
          <div className="no-complaints">
            <p>No complaints found matching the current filters.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }} 
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
