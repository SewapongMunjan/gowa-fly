import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';
import BookingManagement from '../components/admin/BookingManagement';
import FlightManagement from '../components/admin/FlightManagement';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  return (
    <div className="admin-dashboard-page">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/bookings" element={<BookingManagement />} />
        <Route path="/flights" element={<FlightManagement />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default AdminDashboardPage;