import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import apis from "../utils/apis";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(apis().getUserProfile, {
          method: "GET",
          credentials: "include",
        });
        setIsAuth(response.ok);
      } catch {
        setIsAuth(false);
      }
    };
    verify();
  }, []);

  if (isAuth === null) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fdf8f0',
      fontFamily: 'Outfit, sans-serif',
    }}>
      <div style={{
        width: 36, height: 36,
        borderRadius: '50%',
        border: '3px solid rgba(245,158,11,0.2)',
        borderTopColor: '#f59e0b',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
