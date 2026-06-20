import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">⚙️ Admin Panel</div>
        <nav className="admin-nav">
          <NavLink to="/admin" end>Overview</NavLink>
          <NavLink to="/admin/bookings">Bookings</NavLink>
          <NavLink to="/admin/services">Services</NavLink>
          <NavLink to="/admin/workers">Workers</NavLink>
          <NavLink to="/admin/reports">Reports</NavLink>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
