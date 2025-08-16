import React from 'react';
import { Link } from 'react-router-dom';
import { getUserRole } from '../services/api';
import './Home.css';

const Home = () => {
  const userRole = getUserRole();
  const userName = localStorage.getItem('userName');

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1>Welcome to Citizen Resolution</h1>
          <p className="hero-subtitle">
            Your voice matters. Submit complaints and track their resolution progress.
          </p>
          
          {userName && (
            <div className="welcome-message">
              <p>Welcome back, <strong>{userName}</strong>!</p>
            </div>
          )}
        </div>

        <div className="features-section">
          <h2>What you can do here</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Submit Complaints</h3>
              <p>Report issues in your community with detailed descriptions and categories.</p>
              <Link to="/submit-complaint" className="feature-link">
                Submit a Complaint
              </Link>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👁️</div>
              <h3>Track Progress</h3>
              <p>Monitor the status of your complaints from submission to resolution.</p>
              <Link to="/my-complaints" className="feature-link">
                View My Complaints
              </Link>
            </div>

            {userRole === 'admin' && (
              <div className="feature-card admin-feature">
                <div className="feature-icon">⚙️</div>
                <h3>Admin Dashboard</h3>
                <p>Manage all complaints, update statuses, and oversee the resolution process.</p>
                <Link to="/admin-dashboard" className="feature-link">
                  Admin Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>

        {!userRole && (
          <div className="cta-section">
            <h2>Get Started Today</h2>
            <p>Join thousands of citizens who are making their communities better.</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-btn primary">
                Create Account
              </Link>
              <Link to="/login" className="cta-btn secondary">
                Login
              </Link>
            </div>
          </div>
        )}

        <div className="info-section">
          <h2>How it works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Submit</h4>
              <p>Fill out a simple form with your complaint details</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Review</h4>
              <p>Administrators review and categorize your complaint</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Resolve</h4>
              <p>Track progress as your complaint moves toward resolution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
