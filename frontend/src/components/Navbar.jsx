import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUserRole } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();   // React Router hook for navigation
  const location = useLocation();   // React Router hook for current route
  const userRole = getUserRole();   // Get role of the logged-in user (citizen/admin/null)
  const userName = localStorage.getItem('userName'); // Fetch stored username

  // Handle user logout
  const handleLogout = () => {
    // Clear all stored data from localStorage
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    
    // Redirect user to home page after logout
    navigate('/');
  };

  // Utility function to check if a given path matches current URL
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Brand / Logo */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🏛️</span>
            <span className="brand-text">CitiSolve</span>
          </Link>
        </div>

        {/* Menu Links - Show depending on user role */}
        <div className="navbar-menu">

          {userRole && (
            <>
              {/* Citizen-specific menu options */}
              {userRole === 'citizen' && (
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
                </>
              )}
              
            </>
          )}
        </div>

        {/* Authentication / User section */}
        <div className="navbar-auth">
          {userRole ? (
            // If logged in → show user menu
            <div className="user-menu">
              <span className="user-name">Welcome, {userName}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            // If not logged in → show Login/Register buttons
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
