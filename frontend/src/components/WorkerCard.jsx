import React from 'react';

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function WorkerCard({ worker }) {
  return (
    <div className="worker-card">
      <div className="worker-avatar">{initials(worker.name)}</div>
      <h3>{worker.name}</h3>
      <div className="worker-expertise">{worker.expertise}</div>
      <div className="worker-status">
        <span className={`status-dot ${worker.status}`} />
        {worker.status === 'available' && 'Available'}
        {worker.status === 'busy' && 'Currently Busy'}
        {worker.status === 'off-duty' && 'Off Duty'}
      </div>
      {worker.experienceYears > 0 && (
        <p style={{ marginTop: 10, marginBottom: 0, fontSize: '0.78rem' }}>
          {worker.experienceYears}+ years experience
        </p>
      )}
    </div>
  );
}
