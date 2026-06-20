import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { formatPrice } from '../../utils/helpers';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/reports/summary')
      .then(({ data }) => setSummary(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Overview</h2>
          <p>A quick snapshot of how the workshop is doing.</p>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{summary.totalBookings}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Revenue Collected</div>
          <div className="stat-value">{formatPrice(summary.revenueGenerated)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Projected Revenue</div>
          <div className="stat-value">{formatPrice(summary.projectedRevenue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Approval</div>
          <div className="stat-value">{summary.statusBreakdown.Pending || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Workers</div>
          <div className="stat-value">{summary.totalWorkers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Services</div>
          <div className="stat-value">{summary.totalServices}</div>
        </div>
      </div>

      <div className="section-head">
        <h3 style={{ margin: 0 }}>Quick Actions</h3>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/admin/bookings" className="btn btn-primary">Review Bookings</Link>
        <Link to="/admin/services" className="btn btn-outline">Manage Services</Link>
        <Link to="/admin/workers" className="btn btn-outline">Manage Workers</Link>
      </div>
    </div>
  );
}
