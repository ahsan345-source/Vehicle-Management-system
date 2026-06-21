import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ServiceCard from '../components/ServiceCard';
import Spinner from '../components/Spinner';
import WriteReview from '../components/WriteReview';

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api
      .get('/services')
      .then(({ data }) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get('/reviews')
      .then(({ data }) => setReviews(data))
      .catch((err) => console.log(err.message));
  }, []);

  // "Book Now" sends a logged-in customer straight into the booking
  // form with the service pre-selected; anyone else goes to login first.
  const handleBook = (service) => {
    if (user?.role === 'user') {
      navigate('/dashboard', { state: { preselectedServiceId: service._id } });
    } else if (!user) {
      navigate('/login');
    }
  };

  // Helper function to re-fetch reviews instantly when a user submits a new one
  const handleReviewRefresh = () => {
    api.get('/reviews')
      .then(({ data }) => setReviews(data))
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      {/* ===================== UPDATED HERO SECTION WITH BACKGROUND IMAGE ===================== */}
      <section 
        className="hero"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "var(--space-6) 0",
          color: "white" // Text ko clear dikhane ke liye white color ensure kiya
        }}
      >
        <div className="container hero-inner">
          <div className="hero-eyebrow" style={{ color: "var(--color-accent, #ea580c)" }}>Workshop Booking, Simplified</div>
          <h1>Get your vehicle serviced without the waiting-room hassle.</h1>
          <p style={{ color: "#e0e0e0" }}>
            Browse our six core services, pick a date and time that works for you, and pay only
            when the job is done — cash on delivery, no online payment needed.
          </p>
          <div className="hero-actions">
            {user?.role === 'user' ? (
              <a href="/dashboard" className="btn btn-accent">Book a Service</a>
            ) : (
              <a href="/register" className="btn btn-accent">Create an Account</a>
            )}
            <a href="/workers" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>
              Meet Our Technicians
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Our Core Services</h2>
              <p>Six essential services, transparent pricing, no surprises at pickup.</p>
            </div>
          </div>

          {loading && <Spinner />}
          {error && <p className="form-error">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-2">
              {services.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  actionLabel={user?.role === 'admin' ? null : 'Book Now'}
                  onAction={handleBook}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== NEW SECTION 1: How It Works ===================== */}
      <section className="section" style={{ borderTop: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.01)' }}>
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{ width: '100%' }}>
              <h2>How It Works</h2>
              <p>Simple 3-step process to get your vehicle serviced</p>
            </div>
          </div>
          
          <div className="grid grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)' }}>
            <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-5)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>📱</div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>1. Book Online</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                Select your required repair service and pick a preferred date and time slot.
              </p>
            </div>
            
            <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-5)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🔧</div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>2. Expert Service</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                Our assigned professional technician inspects and works on your vehicle with precision.
              </p>
            </div>
            
            <div className="stat-card" style={{ textAlign: 'center', padding: 'var(--space-5)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>💵</div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>3. Pay on Delivery</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                Take a test drive and pay with Cash on Delivery once you are 100% satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== NEW SECTION 2: Why Choose Us Stats ===================== */}
      <section style={{ background: 'var(--color-surface)', padding: 'var(--space-6) 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 'var(--space-4)', textAlign: 'center' }}>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '4px' }}>100%</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Satisfaction</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '4px' }}>6+</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Expert Mechanics</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '4px' }}>No Hidden</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>Charges or Fees</p>
          </div>
        </div>
      </section>

      {/* ===================== ADDED: Write Review Form Panel ===================== */}
      {user?.role === 'user' && (
        <section className="section" style={{ background: 'rgba(0,0,0,0.01)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container">
            <WriteReview onReviewSubmitted={handleReviewRefresh} />
          </div>
        </section>
      )}

      {/* ===================== REAL SECTION 3: Customer Testimonials ===================== */}
      <section className="section">
        <div className="container">
          <div className="section-head" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{ width: '100%' }}>
              <h2>What Our Customers Say</h2>
              <p>Real reviews from verified vehicle owners</p>
            </div>
          </div>

          {reviews.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No reviews yet.</p>
          ) : (
            <div className="grid grid-2" style={{ gap: 'var(--space-5)' }}>
              {reviews.map((review) => (
                <div key={review._id} className="stat-card" style={{ padding: 'var(--space-5)', position: 'relative' }}>
                  <span style={{ fontSize: '3rem', color: 'rgba(0,0,0,0.06)', position: 'absolute', top: '10px', right: '20px', fontFamily: 'serif', fontWeight: 'bold' }}>“</span>
                  
                  {/* Rating Stars Display */}
                  <div style={{ color: 'var(--color-accent)', marginBottom: '8px', fontSize: '1rem' }}>
                    {'⭐'.repeat(review.rating)}
                  </div>

                  <p style={{ fontStyle: 'italic', fontSize: '0.92rem', marginBottom: 'var(--space-3)', lineHeight: '1.5', color: 'var(--color-text)' }}>
                    "{review.comment}"
                  </p>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                    — {review.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}