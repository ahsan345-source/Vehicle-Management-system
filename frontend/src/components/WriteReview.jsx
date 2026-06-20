import React, { useState } from 'react';
import api from '../api/axios';

export default function WriteReview({ onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    api.post('/reviews', { rating, comment })
      .then(() => {
        setSuccess('Thank you! Your review has been posted successfully. 🎉');
        setComment('');
        setRating(5);
        if (onReviewSubmitted) onReviewSubmitted(); // Yeh home page ko auto-refresh karwa dega
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to submit review');
      });
  };

  return (
    <div className="stat-card" style={{ maxWidth: '500px', margin: '20px auto', padding: 'var(--space-5)' }}>
      <h3 style={{ marginBottom: 'var(--space-2)' }}>Share Your Experience</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
        Help others by rating our workshop service.
      </p>

      {success && <p style={{ color: 'var(--color-success)', fontSize: '0.88rem', marginBottom: '10px' }}>{success}</p>}
      {error && <p className="form-error" style={{ marginBottom: '10px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Rating Dropdown */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>Rating</label>
          <select 
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
          >
            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
            <option value="4">⭐⭐⭐⭐ (4/5)</option>
            <option value="3">⭐⭐⭐ (3/5)</option>
            <option value="2">⭐⭐ (2/5)</option>
            <option value="1">⭐ (1/5)</option>
          </select>
        </div>

        {/* Comment Textarea */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '600' }}>Your Review</label>
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your feedback here..."
            required
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.88rem' }}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '10px' }}>
          Submit Review
        </button>
      </form>
    </div>
  );
}