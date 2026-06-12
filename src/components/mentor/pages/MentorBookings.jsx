import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, Users, Clock, CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-sm space-y-4">
      <p className="text-white text-center font-medium">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">Keep</button>
        <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Cancel Session</button>
      </div>
    </div>
  </div>
);

const MentorBookings = () => {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [cancelling, setCancelling] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(apis().mentorBookings, { credentials: 'include' });
      const d = await r.json();
      setBookings(d.data || []);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async () => {
    try {
      const r = await fetch(`${apis().mentorBookings}/${cancelling._id}`, {
        method: 'DELETE', credentials: 'include',
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      toast.success('Session cancelled');
      load();
    } catch (e) { toast.error(e.message); }
    finally { setCancelling(null); }
  };

  const now = new Date();
  const filtered = bookings.filter(b => {
    if (filter === 'active')   return b.isActive;
    if (filter === 'upcoming') return b.isActive && new Date(b.scheduleTime) > now;
    if (filter === 'past')     return new Date(b.scheduleTime) < now;
    return true;
  });

  const stats = {
    total:    bookings.length,
    active:   bookings.filter(b => b.isActive).length,
    upcoming: bookings.filter(b => b.isActive && new Date(b.scheduleTime) > now).length,
    mentees:  bookings.reduce((s, b) => s + (b.menteeIds?.length || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-gray-400 text-sm mt-1">All mentoring sessions booked with you</p>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total',    value: stats.total,    icon: CalendarDays, color: 'text-blue-400'   },
          { label: 'Active',   value: stats.active,   icon: CheckCircle,  color: 'text-green-400'  },
          { label: 'Upcoming', value: stats.upcoming, icon: Clock,        color: 'text-amber-400'  },
          { label: 'Mentees',  value: stats.mentees,  icon: Users,        color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <s.icon size={20} className={s.color} />
            <div>
              <p className="text-gray-400 text-xs">{s.label}</p>
              <p className="text-white text-xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'upcoming', 'active', 'past'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === f ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-7 h-7 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
          <CalendarDays size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => {
            const isPast     = new Date(b.scheduleTime) < now;
            const isUpcoming = b.isActive && !isPast;
            return (
              <div key={b._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Date & time */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg text-center min-w-[56px]">
                        <p className="text-xs font-medium">
                          {new Date(b.scheduleTime).toLocaleDateString('en-IN', { month: 'short' })}
                        </p>
                        <p className="text-lg font-bold leading-none">
                          {new Date(b.scheduleTime).getDate()}
                        </p>
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {new Date(b.scheduleTime).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="text-gray-400 text-sm flex items-center gap-1 mt-0.5">
                          <Clock size={13} />
                          {new Date(b.scheduleTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Mentees */}
                    <div>
                      <p className="text-gray-400 text-xs mb-1.5 flex items-center gap-1">
                        <Users size={12} /> {b.menteeIds?.length || 0} / {b.maxMentees} mentees
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {b.menteeIds?.map(id => (
                          <span key={id} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full font-mono">{id}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status + action */}
                  <div className="flex flex-col items-end gap-3">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      isPast      ? 'bg-gray-800 text-gray-400' :
                      isUpcoming  ? 'bg-green-500/20 text-green-300' :
                                    'bg-gray-700 text-gray-300'
                    }`}>
                      {isPast ? <XCircle size={11} /> : <CheckCircle size={11} />}
                      {isPast ? 'Past' : isUpcoming ? 'Upcoming' : 'Inactive'}
                    </span>
                    {isUpcoming && (
                      <button onClick={() => setCancelling(b)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-lg text-xs font-medium transition-colors">
                        <Trash2 size={13} />Cancel Session
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancelling && (
        <ConfirmModal
          message={`Cancel the session on ${new Date(cancelling.scheduleTime).toLocaleDateString()}? All ${cancelling.menteeIds?.length} mentee(s) will be removed.`}
          onConfirm={handleCancel}
          onCancel={() => setCancelling(null)}
        />
      )}
    </div>
  );
};

export default MentorBookings;
