import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apis from '../utils/apis';

const Super = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRouteAccess = async () => {
      try {
        setLoading(true);
        const response = await fetch(apis().getAccess, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result?.message);
        if (result?.status) setIsAuth(true);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getRouteAccess();
  }, []);

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fdf8f0',
      fontFamily: 'Outfit, sans-serif',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          border: '3px solid rgba(245,158,11,0.2)',
          borderTopColor: '#f59e0b',
          animation: 'spin 0.7s linear infinite',
        }} />
        <span style={{ color: '#b45309', fontSize: '0.9rem', fontWeight: 500 }}>
          Verifying access…
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default Super;
