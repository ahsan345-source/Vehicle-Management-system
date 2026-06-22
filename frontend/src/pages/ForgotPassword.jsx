import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      // Render backend endpoint (Yahan apna sahi baseUrl link lagayein agar variable use ho rha)
      const res = await axios.post('https://vehicle-management-system-w67t.onrender.com/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'Reset link sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="auth-card" style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
        <span className="auth-tag" style={{ background: '#ffe8cc', color: '#d9480f', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>SECURITY</span>
        <h1 style={{ fontSize: '24px', margin: '12px 0 8px 0' }}>Forgot Password</h1>
        <p className="text-muted" style={{ fontSize: '14px', color: '#6c757d', marginBottom: '24px' }}>
          Enter your email address and we'll send you a secure link to reset your password.
        </p>

        {error && <div className="form-error" style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}
        {message && <div className="form-success" style={{ color: 'green', marginBottom: '12px' }}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%', padding: '12px', background: '#0f4c5c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} disabled={submitting}>
            {submitting ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-switch" style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          Back to <Link to="/login" style={{ color: '#0f4c5c', textDecoration: 'none', fontWeight: '500' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}