import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { formatDate, formatPrice, statusBadgeClass } from '../../utils/helpers';

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Completed', 'Rejected', 'Cancelled'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = () => {
    setLoading(true);
    const query = filter === 'All' ? '' : `?status=${filter}`;
    Promise.all([api.get(`/bookings${query}`), api.get('/workers')])
      .then(([bookingsRes, workersRes]) => {
        setBookings(bookingsRes.data);
        setWorkers(workersRes.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [filter]);

  const updateStatus = async (booking, status) => {
    setUpdatingId(booking._id);
    try {
      await api.put(`/bookings/${booking._id}/status`, { status });
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const assignWorker = async (booking, workerId) => {
    if (!workerId) return;
    setUpdatingId(booking._id);
    try {
      await api.put(`/bookings/${booking._id}/status`, { workerId });
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Bookings</h2>
          <p>Approve, reject, complete, and assign a technician to each job.</p>
        </div>
        <select className="form-control" style={{ width: 180 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <div className="form-error">{error}</div>}
      {loading && <Spinner />}

      {!loading && bookings.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No bookings match this filter.</p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="list-card">
          <div className="booking-row booking-row-head" style={{ gridTemplateColumns: '1.6fr 1fr 1fr 1.2fr 1.4fr' }}>
            <span>Service / Customer</span>
            <span>Vehicle</span>
            <span>Date / Time</span>
            <span>Worker</span>
            <span>Status & Actions</span>
          </div>

          {bookings.map((booking) => (
            <div key={booking._id} className="booking-row" style={{ gridTemplateColumns: '1.6fr 1fr 1fr 1.2fr 1.4fr' }}>
              <div>
                <strong>{booking.serviceNameSnapshot}</strong>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {booking.user?.name} · {booking.user?.phone}
                </div>
                <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--color-primary)' }}>
                  {formatPrice(booking.priceSnapshot)}
                </div>
              </div>

              <div>
                {booking.vehicleType}
                {booking.vehicleModel && <div className="text-muted" style={{ fontSize: '0.78rem' }}>{booking.vehicleModel}</div>}
              </div>

              <div>
                {formatDate(booking.date)}
                <div className="mono text-muted" style={{ fontSize: '0.78rem' }}>{booking.timeSlot}</div>
              </div>

              <div>
                <select
                  className="form-control"
                  style={{ fontSize: '0.8rem', padding: '7px 8px' }}
                  value={booking.worker?._id || ''}
                  onChange={(e) => assignWorker(booking, e.target.value)}
                  disabled={updatingId === booking._id}
                >
                  <option value="">Unassigned</option>
                  {workers.map((w) => (
                    <option key={w._id} value={w._id}>{w.name} — {w.expertise}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className={statusBadgeClass(booking.status)} style={{ marginBottom: 8, display: 'inline-flex' }}>
                  {booking.status}
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {booking.status === 'Pending' && (
                    <>
                      <button className="btn btn-primary btn-sm" disabled={updatingId === booking._id} onClick={() => updateStatus(booking, 'Approved')}>
                        Approve
                      </button>
                      <button className="btn btn-danger-outline btn-sm" disabled={updatingId === booking._id} onClick={() => updateStatus(booking, 'Rejected')}>
                        Reject
                      </button>
                    </>
                  )}
                  {booking.status === 'Approved' && (
                    <button className="btn btn-primary btn-sm" disabled={updatingId === booking._id} onClick={() => updateStatus(booking, 'Completed')}>
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
