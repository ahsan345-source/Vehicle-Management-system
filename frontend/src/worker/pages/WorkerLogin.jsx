import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerAuth } from '../context/WorkerAuthContext';

export default function WorkerLogin() {
  const { login } = useWorkerAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/worker/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-body">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-200 p-7">
        <div className="h-11 w-11 rounded-xl bg-primary text-white flex items-center justify-center text-xl mb-4">
          🧰
        </div>
        <h1 className="font-display text-xl font-bold text-gray-900 mb-1">Worker Portal</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to see your assigned jobs for today.</p>

        {error && (
          <div className="bg-danger-light text-danger text-sm rounded-lg px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
              placeholder="you@autocare.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white font-semibold text-sm rounded-lg py-3 disabled:opacity-50 active:scale-[0.99] transition"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-center">
          Worker accounts are created by the workshop admin. Contact the office if you don't have credentials yet.
        </p>
      </div>
    </div>
  );
}
