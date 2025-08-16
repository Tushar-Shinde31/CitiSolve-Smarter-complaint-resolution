import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ComplaintForm from './components/ComplaintForm';
import MyComplaints from './components/MyComplaints';
import AdminDashboard from './components/AdminDashboard';
import { getToken, getUserRole } from './services/api';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = getToken();
  const userRole = getUserRole();

  console.log('ProtectedRoute check:', { 
    hasToken: !!token, 
    tokenLength: token ? token.length : 0,
    userRole, 
    allowedRoles,
    pathname: window.location.pathname
  });

  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log('Insufficient role, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Access granted to protected route');
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/submit-complaint" 
              element={
                <ProtectedRoute>
                  <ComplaintForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-complaints" 
              element={
                <ProtectedRoute>
                  <MyComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
