import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ForgetPassword from './components/auth/ForgetPassword';
import VerifyOtp from './components/auth/VerifyOtp';
import UpdatePassword from './components/auth/UpdatePassword';
import Super from './components/Super';
import MainPage from './components/auth/MainPage';
import MentorConnect from './components/auth/MentorConnect';
import Main from './components/auth/Main';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget/password" element={<ForgetPassword />} />
      
      <Route
        path="/main"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/connect"
        element={
          <ProtectedRoute>
            <MentorConnect />
          </ProtectedRoute>
        }
      />

      <Route element={<Super />}>
        <Route path="/otp/verify" element={<VerifyOtp />} />
        <Route path="/password/update" element={<UpdatePassword />} />
      </Route>
    </Routes>
  );
};

export default App;
