import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUserRole } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getUserRole();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    
    // Redirect to home page
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🏛️</span>
            <span className="brand-text">Citizen Resolution</span>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          
          {userRole && (
            <>
              <Link 
                to="/submit-complaint" 
                className={`nav-link ${isActive('/submit-complaint') ? 'active' : ''}`}
              >
                Submit Complaint
              </Link>
              
              <Link 
                to="/my-complaints" 
                className={`nav-link ${isActive('/my-complaints') ? 'active' : ''}`}
              >
                My Complaints
              </Link>
              
              {userRole === 'admin' && (
                <Link 
                  to="/admin-dashboard" 
                  className={`nav-link admin-link ${isActive('/admin-dashboard') ? 'active' : ''}`}
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </div>

        <div className="navbar-auth">
          {userRole ? (
            <div className="user-menu">
              <span className="user-name">Welcome, {userName}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login-btn">
                Login
              </Link>
              <Link to="/register" className="auth-btn register-btn">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
