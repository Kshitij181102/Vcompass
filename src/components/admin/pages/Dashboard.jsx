import React, { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, Newspaper, CalendarDays, TrendingUp } from 'lucide-react';
import { adminApi } from '../../../utils/adminApi';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold">{value ?? '—'}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getStats()
      .then(d => setStats(d.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (error)   return <p className="text-red-400">{error}</p>;

  const cards = [
    { icon: Users,        label: 'Total Users',       value: stats.totalUsers,       color: 'bg-blue-600' },
    { icon: GraduationCap,label: 'Mentors',            value: stats.totalMentors,     color: 'bg-purple-600' },
    { icon: BookOpen,     label: 'Active Bookings',   value: stats.activeBookings,   color: 'bg-green-600' },
    { icon: BookOpen,     label: 'Total Bookings',    value: stats.totalBookings,    color: 'bg-teal-600' },
    { icon: Newspaper,    label: 'News Articles',     value: stats.totalNews,        color: 'bg-orange-600' },
    { icon: CalendarDays, label: 'Events',             value: stats.totalPosters,     color: 'bg-pink-600' },
    { icon: TrendingUp,   label: 'New Users (7d)',    value: stats.newUsersThisWeek, color: 'bg-amber-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your platform</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>
    </div>
  );
};

export default Dashboard;
