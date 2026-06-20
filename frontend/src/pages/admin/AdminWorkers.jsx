import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

const emptyForm = { name: '', expertise: '', phone: '', experienceYears: 1, status: 'available' };

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingWorker, setEditingWorker] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadWorkers = () => {
    setLoading(true);
    api
      .get('/workers')
      .then(({ data }) => setWorkers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadWorkers, []);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setEditingWorker({});
  };

  const openEdit = (worker) => {
    setForm({
      name: worker.name,
      expertise: worker.expertise,
      phone: worker.phone,
      experienceYears: worker.experienceYears,
      status: worker.status,
    });
    setFormError('');
    setEditingWorker(worker);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editingWorker._id) {
        await api.put(`/workers/${editingWorker._id}`, form);
      } else {
        await api.post('/workers', form);
      }
      setEditingWorker(null);
      loadWorkers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    await api.delete(`/workers/${deleteTarget._id}`);
    setDeleteTarget(null);
    loadWorkers();
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Workers</h2>
          <p>Manage technician profiles. Open "Schedule" to see a worker's assigned jobs.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Worker</button>
      </div>

      {loading && <Spinner />}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <div className="list-card">
          {workers.map((worker) => (
            <div key={worker._id} className="booking-row" style={{ gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr auto' }}>
              <div><strong>{worker.name}</strong></div>
              <div className="text-muted">{worker.expertise}</div>
              <div className="mono" style={{ fontSize: '0.8rem' }}>{worker.phone}</div>
              <div>
                <span className={`status-dot ${worker.status}`} style={{ marginRight: 6 }} />
                {worker.status}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/admin/workers/${worker._id}/schedule`} className="btn btn-outline btn-sm">
                  Schedule
                </Link>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(worker)}>Edit</button>
                <button className="btn btn-danger-outline btn-sm" onClick={() => setDeleteTarget(worker)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingWorker && (
        <div className="modal-overlay" onClick={() => setEditingWorker(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingWorker._id ? 'Edit Worker' : 'Add Worker'}</h3>
            {formError && <div className="form-error">{formError}</div>}
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="wk-name">Name</label>
                <input
                  id="wk-name"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="wk-expertise">Expertise</label>
                <input
                  id="wk-expertise"
                  className="form-control"
                  placeholder="e.g. Brake Specialist"
                  value={form.expertise}
                  onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="wk-phone">Phone</label>
                  <input
                    id="wk-phone"
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="wk-exp">Years of experience</label>
                  <input
                    id="wk-exp"
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="wk-status">Status</label>
                <select
                  id="wk-status"
                  className="form-control"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="off-duty">Off Duty</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline btn-block" onClick={() => setEditingWorker(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <Modal
          title="Remove this worker?"
          message={`"${deleteTarget.name}" will be removed and unassigned from any bookings.`}
          confirmLabel="Remove"
          danger
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
