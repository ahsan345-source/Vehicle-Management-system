import React from 'react';
import { formatPrice } from '../utils/helpers';

/**
 * Displays one service as a "job ticket" — the app's signature visual
 * motif (see ticket styles in components.css). Used on the Home page
 * and reused inside the booking form's service picker.
 */
export default function ServiceCard({ service, actionLabel, onAction }) {
  return (
    <div className="ticket">
      <div className="ticket-body">
        <div className="ticket-icon">{service.icon || '🔧'}</div>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="ticket-meta">
          <span>⏱ {service.duration}</span>
        </div>
      </div>
      <div className="ticket-stub">
        <div>
          <div className="ticket-price-label">Starting at</div>
          <div className="ticket-price">{formatPrice(service.price)}</div>
        </div>
        {actionLabel && (
          <button className="btn btn-accent btn-sm btn-block" onClick={() => onAction(service)}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
