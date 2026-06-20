import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import BookingCard from '../components/BookingCard';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { TIME_SLOTS } from '../utils/helpers';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [cancelTarget, setCancelTarget] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', timeSlot: '' });
  const [actionError, setActionError] = useState('');

  const loadBookings = () => {
    setLoading(true);
    api
      .get('/bookings/my')
      .then(({ data }) => setBookings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadBookings, []);

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  const confirmCancel = async () => {
    try {
      await api.put(`/bookings/${cancelTarget._id}/cancel`);
      setCancelTarget(null);
      loadBookings();
    } catch (err) {
      setActionError(err.message);
      setCancelTarget(null);
    }
  };

  const openReschedule = (booking) => {
    setRescheduleTarget(booking);
    setRescheduleForm({ date: booking.date, timeSlot: booking.timeSlot });
  };

  const submitReschedule = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/bookings/${rescheduleTarget._id}/reschedule`, rescheduleForm);
      setRescheduleTarget(null);
      loadBookings();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const active = bookings.filter((b) => ['Pending', 'Approved'].includes(b.status));
  const past = bookings.filter((b) => !['Pending', 'Approved'].includes(b.status));

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>My Bookings</h2>
            <p>Track, reschedule, or cancel your service appointments.</p>
          </div>
        </div>

        {actionError && <div className="form-error">{actionError}</div>}
        {loading && <Spinner />}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && bookings.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🗓️</div>
            <p>You haven't booked any services yet.</p>
            <a href="/dashboard" className="btn btn-primary">Book Your First Service</a>
          </div>
        )}

        {!loading && active.length > 0 && (
          <>
            <h3 style={{ marginTop: 8 }}>Active</h3>
            <div className="grid grid-2" style={{ marginBottom: 36 }}>
              {active.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onCancel={setCancelTarget}
                  onReschedule={openReschedule}
                />
              ))}
            </div>
          </>
        )}

        {!loading && past.length > 0 && (
          <>
            <h3>History</h3>
            <div className="grid grid-2">
              {past.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>

      {cancelTarget && (
        <Modal
          title="Cancel this booking?"
          message={`This will cancel your ${cancelTarget.serviceNameSnapshot} appointment on ${cancelTarget.date}. This can't be undone.`}
          confirmLabel="Yes, Cancel It"
          danger
          onConfirm={confirmCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}

      {rescheduleTarget && (
        <div className="modal-overlay" onClick={() => setRescheduleTarget(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Reschedule Booking</h3>
            <p>Choose a new date and time for {rescheduleTarget.serviceNameSnapshot}.</p>
            <form onSubmit={submitReschedule}>
              <div className="form-group">
                <label htmlFor="reschedule-date">New date</label>
                <input
                  id="reschedule-date"
                  type="date"
                  className="form-control"
                  min={minDate}
                  value={rescheduleForm.date}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reschedule-slot">New time slot</label>
                <select
                  id="reschedule-slot"
                  className="form-control"
                  value={rescheduleForm.timeSlot}
                  onChange={(e) => setRescheduleForm({ ...rescheduleForm, timeSlot: e.target.value })}
                  required
                >
                  <option value="">Select a slot</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline btn-block" onClick={() => setRescheduleTarget(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-block">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
