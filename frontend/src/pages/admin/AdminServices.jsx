import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';
import { formatPrice } from '../../utils/helpers';

const emptyForm = { name: '', description: '', price: '', duration: '', icon: '🔧' };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingService, setEditingService] = useState(null); // null = closed, {} = new
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadServices = () => {
    setLoading(true);
    api
      .get('/services?all=true')
      .then(({ data }) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadServices, []);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setEditingService({});
  };

  const openEdit = (service) => {
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      icon: service.icon,
    });
    setFormError('');
    setEditingService(service);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editingService._id) {
        await api.put(`/services/${editingService._id}`, form);
      } else {
        await api.post('/services', form);
      }
      setEditingService(null);
      loadServices();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (service) => {
    await api.put(`/services/${service._id}`, { isActive: !service.isActive });
    loadServices();
  };

  const confirmDelete = async () => {
    await api.delete(`/services/${deleteTarget._id}`);
    setDeleteTarget(null);
    loadServices();
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Services</h2>
          <p>Manage the services customers can book — pricing, descriptions, availability.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Service</button>
      </div>

      {loading && <Spinner />}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <div className="list-card">
          {services.map((service) => (
            <div key={service._id} className="booking-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto' }}>
              <div>
                <strong>{service.icon} {service.name}</strong>
                <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>
                  {service.description}
                </p>
              </div>
              <div className="mono">{formatPrice(service.price)}</div>
              <div className="text-muted">{service.duration}</div>
              <div>
                <span className={`badge ${service.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                  {service.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(service)}>Edit</button>
                <button className="btn btn-outline btn-sm" onClick={() => toggleActive(service)}>
                  {service.isActive ? 'Hide' : 'Show'}
                </button>
                <button className="btn btn-danger-outline btn-sm" onClick={() => setDeleteTarget(service)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingService && (
        <div className="modal-overlay" onClick={() => setEditingService(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingService._id ? 'Edit Service' : 'Add Service'}</h3>
            {formError && <div className="form-error">{formError}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="svc-name">Name</label>
                <input
                  id="svc-name"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="svc-desc">Description</label>
                <textarea
                  id="svc-desc"
                  className="form-control"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="svc-price">Price (Rs.)</label>
                  <input
                    id="svc-price"
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="svc-duration">Duration</label>
                  <input
                    id="svc-duration"
                    className="form-control"
                    placeholder="e.g. 45 mins"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="svc-icon">Icon (emoji)</label>
                <input
                  id="svc-icon"
                  className="form-control"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline btn-block" onClick={() => setEditingService(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <Modal
          title="Delete this service?"
          message={`"${deleteTarget.name}" will be permanently removed. Existing bookings keep their original price and name on record.`}
          confirmLabel="Delete"
          danger
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
