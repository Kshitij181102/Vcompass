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
import Profile from './components/auth/Profile';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import Dashboard from './components/admin/pages/Dashboard';
import UsersPage from './components/admin/pages/UsersPage';
import MentorsPage from './components/admin/pages/MentorsPage';
import NewsPage from './components/admin/pages/NewsPage';
import EventsPage from './components/admin/pages/EventsPage';
import BookingsPage from './components/admin/pages/BookingsPage';
import MentorApplicationsPage from './components/admin/pages/MentorApplicationsPage';

// Mentor portal
import MentorRegister from './components/mentor/MentorRegister';
import MentorLayout from './components/mentor/MentorLayout';
import MentorProtectedRoute from './components/mentor/MentorProtectedRoute';
import MentorDashboard from './components/mentor/pages/MentorDashboard';
import MentorProfile from './components/mentor/pages/MentorProfile';
import MentorBookings from './components/mentor/pages/MentorBookings';

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Main />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget/password" element={<ForgetPassword />} />
      <Route path="/mentor/register" element={<MentorRegister />} />

      {/* OTP / password reset */}
      <Route element={<Super />}>
        <Route path="/otp/verify" element={<VerifyOtp />} />
        <Route path="/password/update" element={<UpdatePassword />} />
      </Route>

      {/* Regular user app */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/main" element={<MainPage />} />
        <Route path="/mentor/connect" element={<MentorConnect />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin panel */}
      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<MentorApplicationsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="mentors" element={<MentorsPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
      </Route>

      {/* Mentor portal */}
      <Route path="/mentor" element={<MentorProtectedRoute><MentorLayout /></MentorProtectedRoute>}>
        <Route index element={<MentorDashboard />} />
        <Route path="profile" element={<MentorProfile />} />
        <Route path="bookings" element={<MentorBookings />} />
      </Route>
    </Routes>
  );
};

export default App;
