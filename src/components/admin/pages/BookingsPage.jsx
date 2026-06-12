import React, { useEffect, useState, useCallback } from 'react';
import { Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminApi } from '../../../utils/adminApi';
import ConfirmDialog from '../ui/ConfirmDialog';
import toast from 'react-hot-toast';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== '' ? `isActive=${filter}` : '';
      const d = await adminApi.getBookings(params);
      setBookings(d.data);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    try { await adminApi.deleteBooking(deleting._id); toast.success('Booking deleted'); load(); }
    catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (b) => {
    try { await adminApi.updateBooking(b._id, { isActive: !b.isActive }); toast.success('Booking updated'); load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Bookings</h1><p className="text-gray-400 text-sm mt-1">{bookings.length} bookings</p></div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500">
          <option value="">All</option><option value="true">Active</option><option value="false">Inactive</option>
        </select>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Mentor ID</th>
                <th className="text-left px-4 py-3">Mentees</th>
                <th className="text-left px-4 py-3">Max</th>
                <th className="text-left px-4 py-3">Scheduled</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? <tr><td colSpan={6} className="text-center py-10 text-gray-500">Loading…</td></tr>
              : bookings.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-gray-500">No bookings found</td></tr>
              : bookings.map(b => (
                <tr key={b._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-white font-mono text-xs">{b.mentorId}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {b.menteeIds.slice(0, 3).map(id => (
                        <span key={id} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full font-mono">{id}</span>
                      ))}
                      {b.menteeIds.length > 3 && <span className="text-xs text-gray-500">+{b.menteeIds.length - 3} more</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{b.menteeIds.length} / {b.maxMentees}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">{new Date(b.scheduleTime).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                      {b.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleActive(b)} title={b.isActive ? 'Deactivate' : 'Activate'}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                        {b.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button onClick={() => setDeleting(b)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleting && <ConfirmDialog message={`Delete this booking for mentor "${deleting.mentorId}"?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  );
};

export default BookingsPage;
