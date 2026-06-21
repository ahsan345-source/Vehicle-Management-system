import React from 'react';

const STATUS_STYLES = {
  Pending: 'bg-warning-light text-warning',
  Approved: 'bg-primary-light text-primary',
  'In-Progress': 'bg-accent-light text-accent-dark',
  'On-Hold': 'bg-warning-light text-warning',
  Completed: 'bg-success-light text-success',
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

/**
 * One job, shown the same way across all three dashboard tabs — only
 * the action buttons at the bottom change depending on its status.
 */
export default function TaskCard({ booking, onStart, onHold, onResume, onComplete, busy }) {
  const customerName = booking.user?.name || 'Customer';
  const customerPhone = booking.user?.phone || '—';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      {/* Status + service name */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-display font-semibold text-gray-900 text-[15px] leading-snug">
          {booking.serviceNameSnapshot}
        </h3>
        <span className={`shrink-0 text-[11px] font-mono font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_STYLES[booking.status] || 'bg-gray-100 text-gray-600'}`}>
          {booking.status}
        </span>
      </div>

      {/* Vehicle + plate */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-1.5">
        <span>🚗</span>
        <span className="font-medium">{booking.vehicleType}</span>
        {booking.vehicleModel && <span className="text-gray-400">·</span>}
        {booking.vehicleModel && <span>{booking.vehicleModel}</span>}
        {booking.plateNumber && (
          <span className="ml-auto font-mono text-xs bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">
            {booking.plateNumber}
          </span>
        )}
      </div>

      {/* Date & time */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-1.5">
        <span>🕒</span>
        <span>{formatDate(booking.date)}</span>
        <span className="text-gray-400">·</span>
        <span className="font-mono text-[13px]">{booking.timeSlot}</span>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-1.5">
        <span>👤</span>
        <span>{customerName}</span>
        <a href={`tel:${customerPhone}`} className="ml-auto text-primary text-xs font-mono underline-offset-2 hover:underline">
          {customerPhone}
        </a>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="mt-2.5 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-700">Note: </span>
          {booking.notes}
        </div>
      )}

      {/* Quick actions */}
      {(onStart || onHold || onResume || onComplete) && (
        <div className="flex gap-2 mt-4">
          {onStart && (
            <button
              onClick={() => onStart(booking)}
              disabled={busy}
              className="flex-1 bg-primary text-white text-sm font-semibold rounded-lg py-2.5 disabled:opacity-50 active:scale-[0.98] transition"
            >
              {busy ? 'Starting…' : 'Start Job'}
            </button>
          )}
          {onHold && (
            <button
              onClick={() => onHold(booking)}
              disabled={busy}
              className="flex-1 bg-warning-light text-warning text-sm font-semibold rounded-lg py-2.5 disabled:opacity-50 active:scale-[0.98] transition"
            >
              Hold
            </button>
          )}
          {onResume && (
            <button
              onClick={() => onResume(booking)}
              disabled={busy}
              className="flex-1 bg-primary-light text-primary text-sm font-semibold rounded-lg py-2.5 disabled:opacity-50 active:scale-[0.98] transition"
            >
              Resume
            </button>
          )}
          {onComplete && (
            <button
              onClick={() => onComplete(booking)}
              disabled={busy}
              className="flex-1 bg-success text-white text-sm font-semibold rounded-lg py-2.5 disabled:opacity-50 active:scale-[0.98] transition"
            >
              {busy ? 'Saving…' : 'Mark Completed'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
