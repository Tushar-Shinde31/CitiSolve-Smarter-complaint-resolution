import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css';
import Navbar from './Navbar';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'citizen' // Default role set to citizen
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save user data and token to local storage
      localStorage.setItem('user', JSON.stringify(data));
      
      // Redirect based on selected role
      if (formData.role === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/citizendashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="login-container">
      <h2>Welcome Back</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Login As</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="role-select"
            required
          >
            <option value="citizen">Citizen</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
    </div>
  );
};

export default Login;
