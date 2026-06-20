import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import WorkerCard from '../components/WorkerCard';
import Spinner from '../components/Spinner';

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/workers')
      .then(({ data }) => setWorkers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Our Technicians</h2>
            <p>Get to know who might be working on your vehicle before you book.</p>
          </div>
        </div>

        {loading && <Spinner />}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && workers.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🧰</div>
            <p>No technician profiles have been added yet.</p>
          </div>
        )}

        {!loading && !error && workers.length > 0 && (
          <div className="grid grid-3">
            {workers.map((worker) => (
              <WorkerCard key={worker._id} worker={worker} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
