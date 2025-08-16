import React from 'react';
import { Link } from 'react-router-dom';
import { getUserRole } from '../services/api';
import './Home.css';

const Home = () => {
  const userRole = getUserRole();
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  // Debug localStorage
  console.log('Home page localStorage check:', {
    userRole,
    userName,
    hasToken: !!token,
    tokenLength: token ? token.length : 0
  });

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1>Citizen Resolution System</h1>
          <p className="hero-subtitle">
            Report and track community issues efficiently. Your voice matters in building a better community.
          </p>
          
          {userRole && userName ? (
            <div className="welcome-message">
              <p>Welcome back, {userName}! ({userRole})</p>
              <p>Token: {token ? `${token.substring(0, 20)}...` : 'None'}</p>
            </div>
          ) : (
            <div className="cta-buttons">
              <Link to="/login" className="cta-btn primary">Login</Link>
              <Link to="/register" className="cta-btn secondary">Register</Link>
            </div>
          )}
        </div>

        {userRole ? (
          <div className="features-section">
            <h2>Quick Actions</h2>
            <div className="features-grid">
              {userRole === 'citizen' && (
                <>
                  <div className="feature-card">
                    <div className="feature-icon">📝</div>
                    <h3>Submit Complaint</h3>
                    <p>Report a new issue in your community</p>
                    <Link to="/submit-complaint" className="feature-link">Submit Now</Link>
                  </div>
                  
                  <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>My Complaints</h3>
                    <p>Track the status of your submitted complaints</p>
                    <Link to="/my-complaints" className="feature-link">View Complaints</Link>
                  </div>
                </>
              )}
              
              {userRole === 'admin' && (
                <div className="feature-card admin-feature">
                  <div className="feature-icon">⚙️</div>
                  <h3>Admin Dashboard</h3>
                  <p>Manage and monitor all citizen complaints</p>
                  <Link to="/admin-dashboard" className="feature-link">Go to Dashboard</Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="features-section">
            <h2>How It Works</h2>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number">1</div>
                <h4>Register</h4>
                <p>Create your account as a citizen</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h4>Submit</h4>
                <p>Report issues with details and photos</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h4>Track</h4>
                <p>Monitor progress and status updates</p>
              </div>
            </div>
          </div>
        )}

        {!userRole && (
          <div className="cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Join our community and help make a difference</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">Create Account</Link>
              <Link to="/login" className="cta-btn secondary">Sign In</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
