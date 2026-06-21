import React, { createContext, useContext, useEffect, useState } from 'react';
// 📂 FIX: Path ko theek kiya taaki context folder se nikal kar sahi api tak pahuche
import workerApi, { WORKER_TOKEN_KEY } from '../api/workerApi'; 

const WorkerAuthContext = createContext(null);
const WORKER_KEY = 'autocare_worker_profile';

export function WorkerAuthProvider({ children }) {
  const [worker, setWorker] = useState(() => {
    const stored = localStorage.getItem(WORKER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // Verify any stored token is still valid on first load.
  useEffect(() => {
    const token = localStorage.getItem(WORKER_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    workerApi
      // 🔄 Note: Agar aapne backend par route badla hai toh isko '/worker-portal/me' kar sakte hain, abhi default par rakha hai
      .get('/worker/me')
      .then(({ data }) => {
        setWorker(data);
        localStorage.setItem(WORKER_KEY, JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem(WORKER_TOKEN_KEY);
        localStorage.removeItem(WORKER_KEY);
        setWorker(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    // 🔄 Note: Sahi backend route hit karne ke liye alignment
    const { data } = await workerApi.post('/worker/login', { email, password });
    localStorage.setItem(WORKER_TOKEN_KEY, data.token);
    localStorage.setItem(WORKER_KEY, JSON.stringify(data.worker));
    setWorker(data.worker);
    return data.worker;
  };

  const logout = () => {
    localStorage.removeItem(WORKER_TOKEN_KEY);
    localStorage.removeItem(WORKER_KEY);
    setWorker(null);
  };

  // Keeps the top bar's Available/On Leave toggle in sync after a save.
  const updateWorkerLocal = (patch) => {
    setWorker((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(WORKER_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <WorkerAuthContext.Provider value={{ worker, loading, login, logout, updateWorkerLocal }}>
      {children}
    </WorkerAuthContext.Provider>
  );
}

export const useWorkerAuth = () => {
  const ctx = useContext(WorkerAuthContext);
  if (!ctx) throw new Error('useWorkerAuth must be used inside a WorkerAuthProvider');
  return ctx;
};