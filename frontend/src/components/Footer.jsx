import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        
        {/* Column 1: Brand / Description */}
        <div className="footer-column footer-brand">
          <strong>AutoCare</strong>
          <p>Professional Vehicle Service & Repair Booking. Quality maintenance you can trust.</p>
        </div>

        {/* Column 2: Workshop Address */}
        <div className="footer-column footer-address">
          <h4>Our Workshop</h4>
          <p>12-A, Main Boulevard, Gulberg III, Lahore, Pakistan</p>
        </div>

        {/* Column 3: Timings & Payment */}
        <div className="footer-column footer-info">
          <h4>Working Hours</h4>
          <p>Mon - Sat: 09:00 AM - 07:00 PM</p>
          <p>Sunday: Closed</p>
          <small style={{ display: 'block', marginTop: '10px', color: '#888' }}>
            Pay on Service · Cash on Delivery only
          </small>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} AutoCare Workshop. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}