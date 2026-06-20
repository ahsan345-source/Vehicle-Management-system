import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { formatPrice, TIME_SLOTS, VEHICLE_TYPES } from '../utils/helpers';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    serviceId: location.state?.preselectedServiceId || '',
    vehicleType: 'Car',
    vehicleModel: '',
    date: '',
    timeSlot: '',
    notes: '',
  });

  // Earliest selectable date is tomorrow — same-day slots aren't offered.
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    api
      .get('/services')
      .then(({ data }) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingServices(false));
  }, []);

  const selectedService = services.find((s) => s._id === form.serviceId);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.serviceId) return setError('Please select a service');
    if (!form.date) return setError('Please select a preferred date');
    if (!form.timeSlot) return setError('Please select a time slot');

    setSubmitting(true);
    try {
      await api.post('/bookings', form);
      setSuccess('Booking submitted! The workshop will confirm it shortly. Pay on service — cash only.');
      setForm({ serviceId: '', vehicleType: 'Car', vehicleModel: '', date: '', timeSlot: '', notes: '' });
      setTimeout(() => navigate('/my-bookings'), 1600);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingServices) return <Spinner />;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Book a Service</h2>
            <p>Choose your vehicle, the service you need, and a slot that works for you.</p>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <form onSubmit={handleSubmit} className="booking-layout">
          <div>
            {/* --- Vehicle details --- */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h3>1. Vehicle Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="vehicleType">Vehicle type</label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    className="form-control"
                    value={form.vehicleType}
                    onChange={handleChange}
                  >
                    {VEHICLE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="vehicleModel">Make & model (optional)</label>
                  <input
                    id="vehicleModel"
                    name="vehicleModel"
                    className="form-control"
                    placeholder="e.g. Toyota Corolla 2019"
                    value={form.vehicleModel}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* --- Service picker --- */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h3>2. Choose a Service</h3>
              {services.map((service) => (
                <div
                  key={service._id}
                  className={`service-pick ${form.serviceId === service._id ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, serviceId: service._id })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setForm({ ...form, serviceId: service._id });
                    }
                  }}
                  role="radio"
                  aria-checked={form.serviceId === service._id}
                  tabIndex={0}
                >
                  <span className="pick-icon">{service.icon}</span>
                  <div className="pick-info">
                    <strong>{service.name}</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem' }}>{service.duration}</p>
                  </div>
                  <span className="pick-price">{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>

            {/* --- Date & time --- */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h3>3. Pick a Date & Time</h3>
              <div className="form-group">
                <label htmlFor="date">Preferred date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="form-control"
                  min={minDate}
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
              <label>Preferred time slot</label>
              <div className="slot-grid" style={{ marginTop: 8 }}>
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={`slot-btn ${form.timeSlot === slot ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, timeSlot: slot })}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* --- Notes --- */}
            <div className="card" style={{ padding: 24 }}>
              <h3>4. Anything we should know?</h3>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <textarea
                  name="notes"
                  className="form-control"
                  rows={3}
                  placeholder="Optional notes for the workshop (e.g. strange noise from the front brakes)"
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* --- Summary --- */}
          <div className="card summary-box">
            <h3>Booking Summary</h3>
            <div className="summary-row">
              <span className="text-muted">Service</span>
              <span>{selectedService ? selectedService.name : '—'}</span>
            </div>
            <div className="summary-row">
              <span className="text-muted">Vehicle</span>
              <span>{form.vehicleType}{form.vehicleModel ? ` (${form.vehicleModel})` : ''}</span>
            </div>
            <div className="summary-row">
              <span className="text-muted">Date</span>
              <span>{form.date || '—'}</span>
            </div>
            <div className="summary-row">
              <span className="text-muted">Time</span>
              <span>{form.timeSlot || '—'}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{selectedService ? formatPrice(selectedService.price) : '—'}</span>
            </div>
            <p style={{ fontSize: '0.78rem' }}>
              💵 Payment is collected in cash once the service is complete. No online payment required.
            </p>
            <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
