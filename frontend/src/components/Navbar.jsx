import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // 'citizen' or 'admin'

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo" onClick={() => navigate("/")}>
          🏛️ Citizen Complaint
        </h2>
      </div>

      <div className="navbar-links">
        {!token && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

        {token && role === "citizen" && (
          <>
            <Link to="/submit-complaint" className="nav-link">Submit Complaint</Link>
            <Link to="/my-complaints" className="nav-link">My Complaints</Link>
          </>
        )}

        {token && role === "admin" && (
          <>
            <Link to="/admin-dashboard" className="nav-link">Dashboard</Link>
          </>
        )}

        {token && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
