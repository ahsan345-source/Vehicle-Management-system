import React from 'react';

/**
 * A small, generic confirm dialog used for destructive or important
 * actions (cancel booking, delete service, etc.).
 */
export default function Modal({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-outline btn-block" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`btn btn-block ${danger ? 'btn-danger-outline' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
