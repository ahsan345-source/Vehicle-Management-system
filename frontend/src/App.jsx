import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WorkerAuthProvider } from './worker/context/WorkerAuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workers from './pages/Workers';
import Dashboard from './pages/Dashboard';
import BookingHistory from './pages/BookingHistory';

// =========================================================
// ⚙️ WORKER PORTAL IMPORTS (ADDITIONS)
// =========================================================
import WorkerLogin from './worker/pages/WorkerLogin';
import WorkerDashboard from './worker/pages/WorkerDashboard';
import WorkerProtectedRoute from './worker/components/WorkerProtectedRoute';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminBookings from './pages/admin/AdminBookings';
import AdminWorkers from './pages/admin/AdminWorkers';
import AdminWorkerSchedule from './pages/admin/AdminWorkerSchedule';
import AdminReports from './pages/admin/AdminReports';

export default function App() {
  return (
    <WorkerAuthProvider>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/workers" element={<Workers />} />

          {/* 🛠️ Worker Portal Secure Routes */}
          <Route path="/worker/login" element={<WorkerLogin />} />
          <Route 
            path="/worker/dashboard" 
            element={
              <WorkerProtectedRoute>
                <WorkerDashboard />
              </WorkerProtectedRoute>
            } 
          />

          {/* Customer-only routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="workers" element={<AdminWorkers />} />
            <Route path="workers/:id/schedule" element={<AdminWorkerSchedule />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </WorkerAuthProvider>
  );
}

function NotFound() {
  return (
    <div className="empty-state" style={{ padding: '80px 20px' }}>
      <div className="empty-icon">🔍</div>
      <h2>Page not found</h2>
      <a href="/" className="btn btn-primary">Back to Home</a>
    </div>
  );
}