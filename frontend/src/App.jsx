import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MyComplaints from "./pages/MyComplaints";

function App() {
  return (  
    <div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/mycomplaints" element={<MyComplaints />} />
      </Routes>
    </div>
  )
}

export default App