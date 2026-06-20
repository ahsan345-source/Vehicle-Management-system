import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { formatDate, formatPrice, statusBadgeClass } from '../../utils/helpers';

/**
 * Workers don't have their own login portal. Instead, when the admin
 * assigns a worker to a booking, that booking is flagged
 * (workerNotified) and shows up here — the admin opens this screen
 * (or prints/relays it) so the worker knows their schedule for the day.
 */
export default function AdminWorkerSchedule() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/workers/${id}/schedule`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="form-error">{error}</p>;

  const { worker, bookings } = data;

  return (
    <div>
      <Link to="/admin/workers" className="text-muted" style={{ fontSize: '0.85rem' }}>
        ← Back to Workers
      </Link>

      <div className="section-head" style={{ marginTop: 16 }}>
        <div>
          <h2>{worker.name}'s Schedule</h2>
          <p>{worker.expertise} · {worker.phone}</p>
        </div>
        <span className={`status-dot ${worker.status}`} style={{ display: 'inline-block' }} />
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No jobs have been assigned to this worker yet.</p>
        </div>
      ) : (
        <div className="list-card">
          <div className="booking-row booking-row-head">
            <span>Service</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Time Slot</span>
            <span>Status</span>
          </div>
          {bookings.map((b) => (
            <div key={b._id} className="booking-row">
              <div>
                <strong>{b.serviceNameSnapshot}</strong>
                <div className="text-muted" style={{ fontSize: '0.78rem' }}>{formatPrice(b.priceSnapshot)}</div>
              </div>
              <div>
                {b.user?.name}
                <div className="text-muted mono" style={{ fontSize: '0.76rem' }}>{b.user?.phone}</div>
              </div>
              <div>{formatDate(b.date)}</div>
              <div className="mono" style={{ fontSize: '0.8rem' }}>{b.timeSlot}</div>
              <div><span className={statusBadgeClass(b.status)}>{b.status}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
