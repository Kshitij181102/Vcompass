import React, { useEffect, useState } from 'react';
import { BookOpen, Users, Clock, CheckCircle } from 'lucide-react';
import apis from '../../../utils/apis';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-white text-2xl font-bold">{value ?? '—'}</p>
    </div>
  </div>
);

const MentorDashboard = () => {
  const [profile, setProfile]   = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(apis().mentorProfile,  { credentials: 'include' }).then(r => r.json()),
      fetch(apis().mentorBookings, { credentials: 'include' }).then(r => r.json()),
    ]).then(([p, b]) => {
      setProfile(p.data);
      setBookings(b.data || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const active   = bookings.filter(b => b.isActive);
  const upcoming = active.filter(b => new Date(b.scheduleTime) > new Date());
  const totalMentees = active.reduce((sum, b) => sum + (b.menteeIds?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center gap-4">
        <img
          src={profile?.img}
          alt={profile?.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-amber-500"
          onError={e => e.target.src = `https://ui-avatars.com/api/?name=${profile?.name}&background=f59e0b&color=fff`}
        />
        <div>
          <h1 className="text-2xl font-bold text-white capitalize">
            Welcome back, {profile?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-400 text-sm">{profile?.program} · {profile?.yearOfStudy}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen}    label="Total Bookings"   value={bookings.length}  color="bg-blue-600" />
        <StatCard icon={CheckCircle} label="Active Sessions"  value={active.length}    color="bg-green-600" />
        <StatCard icon={Clock}       label="Upcoming"         value={upcoming.length}  color="bg-amber-600" />
        <StatCard icon={Users}       label="Total Mentees"    value={totalMentees}     color="bg-purple-600" />
      </div>

      {/* Upcoming sessions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming sessions.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map(b => (
              <div key={b._id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">
                    {new Date(b.scheduleTime).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(b.scheduleTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    {' · '}{b.menteeIds?.length || 0} mentee{b.menteeIds?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full font-medium">Active</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile snapshot */}
      {profile?.specialization?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">Your Specializations</h2>
          <div className="flex flex-wrap gap-2">
            {profile.specialization.map(s => (
              <span key={s} className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
