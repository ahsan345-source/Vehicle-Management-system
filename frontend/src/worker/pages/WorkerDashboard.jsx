import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import workerApi from '../api/workerApi';
import { useWorkerAuth } from '../context/WorkerAuthContext';
import TaskCard from '../components/TaskCard';

const TABS = [
  { key: 'new', label: 'New Schedules', statuses: ['Pending', 'Approved'] },
  { key: 'active', label: 'Active Jobs', statuses: ['In-Progress', 'On-Hold'] },
  { key: 'history', label: 'Completed', statuses: ['Completed'] },
];

const todayStr = () => new Date().toISOString().split('T')[0];

export default function WorkerDashboard() {
  const { worker, logout, updateWorkerLocal } = useWorkerAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('new');
  const [busyId, setBusyId] = useState(null);
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  const loadSchedule = () => {
    setLoading(true);
    workerApi
      .get('/worker/schedule')
      .then(({ data }) => setBookings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadSchedule, []);

  const todaysJobCount = useMemo(
    () => bookings.filter((b) => b.date === todayStr() && b.status !== 'Cancelled' && b.status !== 'Rejected').length,
    [bookings]
  );

  const visibleBookings = useMemo(() => {
    const tab = TABS.find((t) => t.key === activeTab);
    return bookings.filter((b) => tab.statuses.includes(b.status));
  }, [bookings, activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/worker/login');
  };

  const handleToggleAvailability = async () => {
    const next = worker.availability === 'Available' ? 'On Leave' : 'Available';
    setTogglingAvailability(true);
    try {
      const { data } = await workerApi.put('/worker/availability', { availability: next });
      updateWorkerLocal(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setTogglingAvailability(false);
    }
  };

  // Shared handler for every status-change action (Start / Hold / Resume / Complete).
  const changeStatus = async (booking, status) => {
    setBusyId(booking._id);
    setError('');
    try {
      await workerApi.put(`/worker/tasks/${booking._id}/status`, { status });
      // Simplest correct approach: reload from the server so tab counts
      // and the "today's jobs" figure always reflect real data.
      loadSchedule();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-body pb-10">
      {/* --- Top bar --- */}
      <header className="bg-primary text-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-4 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-white/60 font-mono uppercase tracking-wide">Welcome back</p>
              <h1 className="font-display font-bold text-lg leading-tight">{worker?.name}</h1>
              <p className="text-xs text-white/70 mt-0.5">{worker?.expertise}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-white/70 underline-offset-2 hover:underline mt-1"
            >
              Logout
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="bg-white/10 rounded-xl px-3.5 py-2">
              <p className="text-[10px] text-white/60 uppercase tracking-wide font-mono">Today's Jobs</p>
              <p className="font-display font-bold text-xl">{todaysJobCount}</p>
            </div>

            <button
              onClick={handleToggleAvailability}
              disabled={togglingAvailability}
              className={`flex items-center gap-2 rounded-full pl-2.5 pr-3.5 py-2 text-xs font-semibold transition disabled:opacity-60 ${
                worker?.availability === 'Available'
                  ? 'bg-success text-white'
                  : 'bg-white/15 text-white'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${worker?.availability === 'Available' ? 'bg-white' : 'bg-white/50'}`} />
              {worker?.availability === 'Available' ? 'Available' : 'On Leave'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4">
        {/* --- Tabs --- */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 my-4 sticky top-[150px] z-10">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-xs font-semibold rounded-lg py-2.5 transition ${
                activeTab === tab.key ? 'bg-primary text-white' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-danger-light text-danger text-sm rounded-lg px-3.5 py-2.5 mb-4">{error}</div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-7 w-7 rounded-full border-[3px] border-gray-200 border-t-primary animate-spin" />
          </div>
        )}

        {!loading && visibleBookings.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm">Nothing here right now.</p>
          </div>
        )}

        {/* --- Task list --- */}
        <div className="space-y-3">
          {!loading &&
            visibleBookings.map((booking) => {
              const busy = busyId === booking._id;
              if (activeTab === 'new') {
                return (
                  <TaskCard key={booking._id} booking={booking} busy={busy} onStart={(b) => changeStatus(b, 'In-Progress')} />
                );
              }
              if (activeTab === 'active') {
                return (
                  <TaskCard
                    key={booking._id}
                    booking={booking}
                    busy={busy}
                    onHold={booking.status === 'In-Progress' ? (b) => changeStatus(b, 'On-Hold') : undefined}
                    onResume={booking.status === 'On-Hold' ? (b) => changeStatus(b, 'In-Progress') : undefined}
                    onComplete={(b) => changeStatus(b, 'Completed')}
                  />
                );
              }
              return <TaskCard key={booking._id} booking={booking} />;
            })}
        </div>
      </div>
    </div>
  );
}
