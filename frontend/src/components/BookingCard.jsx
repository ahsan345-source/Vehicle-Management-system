import React from 'react';
import { formatPrice, formatDate, statusBadgeClass } from '../utils/helpers';

const ACTIVE_STATUSES = ['Pending', 'Approved'];

export default function BookingCard({ booking, onCancel, onReschedule }) {
  const canManage = ACTIVE_STATUSES.includes(booking.status);

  return (
    <div className="ticket">
      <div className="ticket-body">
        <span className={statusBadgeClass(booking.status)}>{booking.status}</span>
        <h3 style={{ marginTop: 10 }}>{booking.serviceNameSnapshot}</h3>
        <p>
          {booking.vehicleType}
          {booking.vehicleModel ? ` — ${booking.vehicleModel}` : ''}
        </p>
        <div className="ticket-meta">
          <span>📅 {formatDate(booking.date)}</span>
          <span>🕒 {booking.timeSlot}</span>
        </div>
        {booking.worker && (
          <div className="ticket-meta" style={{ marginTop: 8 }}>
            <span>🧰 Assigned: {booking.worker.name} ({booking.worker.expertise})</span>
          </div>
        )}
        {canManage && (onCancel || onReschedule) && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {onReschedule && (
              <button className="btn btn-outline btn-sm" onClick={() => onReschedule(booking)}>
                Reschedule
              </button>
            )}
            {onCancel && (
              <button className="btn btn-danger-outline btn-sm" onClick={() => onCancel(booking)}>
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
      <div className="ticket-stub">
        <div>
          <div className="ticket-price-label">Pay on Service</div>
          <div className="ticket-price">{formatPrice(booking.priceSnapshot)}</div>
        </div>
      </div>
    </div>
  );
}
