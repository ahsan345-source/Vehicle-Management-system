import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL se parameters read karne ke liye hook add kiya
  const [searchParams] = useSearchParams();
  const isAdminRoute = searchParams.get('role') === 'admin';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      const redirectTo = location.state?.from || (loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        {/* Dynamic Tag based on URL */}
        <span className="auth-tag" style={{ backgroundColor: isAdminRoute ? '#e6fffa' : '#ffe8cc', color: isAdminRoute ? '#006d77' : '#d9480f' }}>
          {isAdminRoute ? 'Admin Control' : 'Welcome Back'}
        </span>
        
        {/* Dynamic Heading based on URL */}
        <h1>{isAdminRoute ? 'Log in to Admin Portal' : 'Log in to AutoCare'}</h1>
        
        <p className="text-muted" style={{ marginBottom: 24 }}>
          {isAdminRoute 
            ? 'Authorized personnel login only. Please enter your secure management credentials.' 
            : "Customers and admins both sign in here — you'll land in the right place automatically."}
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder={isAdminRoute ? "admin@autocare.com" : "you@example.com"}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password</label>
              <Link 
                to="/forgot-password" 
                style={{ fontSize: '13px', color: '#0f4c5c', textDecoration: 'none', marginBottom: '5px' }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Forgot Password?
              </Link>
            </div>
            
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                style={{ paddingRight: '50px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6c757d',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  userSelect: 'none'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}