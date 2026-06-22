import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">🔧</span>
          AutoCare
        </Link>

        <nav className={`navbar-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/workers" onClick={() => setOpen(false)}>Our Technicians</NavLink>

          {user?.role === 'user' && (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>Book a Service</NavLink>
              <NavLink to="/my-bookings" onClick={() => setOpen(false)}>My Bookings</NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => setOpen(false)}>Admin Panel</NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {user && <span className="navbar-user">Hi, {user.name.split(' ')[0]}</span>}
          {user ? (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              {/* Cleanly added Admin Login link right next to standard Login button */}
              <Link 
                to="/login?role=admin" //  
                className="admin-nav-link"
                style={{ 
                  fontSize: '13px', 
                  color: '#6c757d', 
                  textDecoration: 'none', 
                  fontWeight: '500',
                  marginRight: '8px'
                }}
                onMouseEnter={(e) => e.target.style.color = '#0f4c5c'}
                onMouseLeave={(e) => e.target.style.color = '#6c757d'}
              >
                Admin Login
              </Link>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
          <button className="navbar-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}