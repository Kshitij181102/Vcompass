import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, GraduationCap, Mail, User } from 'lucide-react';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';

const MentorApplicationsPage = () => {
  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState(null); // id being acted on

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(apis().adminMentorApps, { credentials: 'include' });
      const d = await r.json();
      setApps(d.data || []);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const act = async (id, action) => {
    setActing(id);
    try {
      const r = await fetch(`${apis().adminMentorApps}/${id}/${action}`, {
        method: 'PATCH', credentials: 'include',
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      toast.success(d.message);
      load();
    } catch (e) { toast.error(e.message); }
    finally { setActing(null); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock size={22} className="text-amber-400" />
          Mentor Applications
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {apps.length} pending application{apps.length !== 1 ? 's' : ''} awaiting review
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : apps.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
          <p className="text-white font-semibold">All caught up!</p>
          <p className="text-gray-400 text-sm mt-1">No pending mentor applications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map(app => (
            <div key={app._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                {/* Left: info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={22} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold capitalize text-base">{app.name}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <span className="flex items-center gap-1 text-gray-400 text-sm">
                        <Mail size={13} />{app.email}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400 text-sm">
                        <User size={13} />Discord: {app.disId}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1.5">
                      Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-medium rounded-full">
                    <Clock size={11} />Pending
                  </span>
                  <button
                    onClick={() => act(app._id, 'approve')}
                    disabled={acting === app._id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <CheckCircle size={14} />
                    {acting === app._id ? 'Approving…' : 'Approve'}
                  </button>
                  <button
                    onClick={() => act(app._id, 'reject')}
                    disabled={acting === app._id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-900/50 hover:bg-red-900/70 disabled:opacity-50 text-red-400 hover:text-red-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    <XCircle size={14} />Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorApplicationsPage;
