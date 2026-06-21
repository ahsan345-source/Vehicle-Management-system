import React from 'react';
import { Navigate } from 'react-router-dom';
// 📂 FIX: Components folder se ek step baahir nikal kar context folder ka sahi path diya
import { useWorkerAuth } from '../context/WorkerAuthContext';

export default function WorkerProtectedRoute({ children }) {
  const { worker, loading } = useWorkerAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="h-7 w-7 rounded-full border-[3px] border-gray-200 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!worker) return <Navigate to="/worker/login" replace />;

  return children;
}