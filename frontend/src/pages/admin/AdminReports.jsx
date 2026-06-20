import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { formatPrice } from '../../utils/helpers';

export default function AdminReports() {
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

  const statusEntries = Object.entries(summary.statusBreakdown);
  const revenueEntries = Object.entries(summary.revenueByService).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Reports</h2>
          <p>Total bookings and revenue, broken down for a quick read.</p>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-label">Revenue Collected (Completed Jobs)</div>
          <div className="stat-value">{formatPrice(summary.revenueGenerated)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Projected Revenue (Pending + Approved)</div>
          <div className="stat-value">{formatPrice(summary.projectedRevenue)}</div>
        </div>
      </div>

      <h3>Bookings by Status</h3>
      <div className="list-card" style={{ marginBottom: 32 }}>
        {statusEntries.length === 0 && <p style={{ padding: 20 }}>No bookings yet.</p>}
        {statusEntries.map(([status, count]) => (
          <div key={status} className="booking-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <span>{status}</span>
            <span className="mono">{count}</span>
          </div>
        ))}
      </div>

      <h3>Revenue by Service (Completed Jobs)</h3>
      <div className="list-card">
        {revenueEntries.length === 0 && <p style={{ padding: 20 }}>No completed bookings yet.</p>}
        {revenueEntries.map(([service, revenue]) => (
          <div key={service} className="booking-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <span>{service}</span>
            <span className="mono">{formatPrice(revenue)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
