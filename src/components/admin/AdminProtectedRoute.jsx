import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { adminApi } from '../../utils/adminApi';

const AdminProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'fail'

  useEffect(() => {
    adminApi.getStats()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('fail'));
  }, []);

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return status === 'ok' ? children : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;
