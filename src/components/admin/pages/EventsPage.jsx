import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '../../../utils/adminApi';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import { FormField, Input, Select, Textarea, TagInput, SaveButton } from '../ui/FormField';
import toast from 'react-hot-toast';

const EMPTY = {
  title: '', description: '', eventDate: '', eventTime: '', venue: '', image: '',
  category: 'other', organizer: '', registrationLink: '', featured: false,
  status: 'upcoming', tags: [], contactInfo: { email: '', phone: '' }
};

const EventForm = ({ initial, onSave, onClose }) => {
  const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : '';
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial, eventDate: formatDate(initial.eventDate), tags: initial.tags || [] } : EMPTY);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setContact = (k, v) => setForm(p => ({ ...p, contactInfo: { ...p.contactInfo, [k]: v } }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try { await onSave(form); onClose(); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormField label="Title" required><Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Event title" required /></FormField>
      <FormField label="Description" required><Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Event details…" rows={4} required /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Event Date" required><Input type="date" value={form.eventDate} onChange={e => set('eventDate', e.target.value)} required /></FormField>
        <FormField label="Event Time" required><Input value={form.eventTime} onChange={e => set('eventTime', e.target.value)} placeholder="10:00 AM" required /></FormField>
        <FormField label="Venue" required><Input value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="Venue name" required /></FormField>
        <FormField label="Organizer" required><Input value={form.organizer} onChange={e => set('organizer', e.target.value)} placeholder="Organizing body" required /></FormField>
        <FormField label="Poster Image URL" required><Input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://…" required /></FormField>
        <FormField label="Registration Link"><Input value={form.registrationLink || ''} onChange={e => set('registrationLink', e.target.value)} placeholder="https://…" /></FormField>
        <FormField label="Category">
          <Select value={form.category} onChange={e => set('category', e.target.value)}>
            {['workshop','seminar','cultural','sports','competition','fest','placement','other'].map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormField>
        <FormField label="Status">
          <Select value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
          </Select>
        </FormField>
        <FormField label="Featured">
          <Select value={form.featured ? 'true' : 'false'} onChange={e => set('featured', e.target.value === 'true')}>
            <option value="false">No</option><option value="true">Yes</option>
          </Select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Contact Email"><Input value={form.contactInfo.email} onChange={e => setContact('email', e.target.value)} placeholder="contact@…" /></FormField>
        <FormField label="Contact Phone"><Input value={form.contactInfo.phone} onChange={e => setContact('phone', e.target.value)} placeholder="+91…" /></FormField>
      </div>
      <FormField label="Tags (Enter to add)"><TagInput value={form.tags} onChange={v => set('tags', v)} placeholder="tech, cultural…" /></FormField>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
        <SaveButton loading={loading} label={initial ? 'Update Event' : 'Create Event'} />
      </div>
    </form>
  );
};

const statusColor = { upcoming: 'bg-blue-500/20 text-blue-300', ongoing: 'bg-green-500/20 text-green-300', completed: 'bg-gray-700 text-gray-400', cancelled: 'bg-red-500/20 text-red-300' };

const EventsPage = () => {
  const [posters, setPosters]   = useState([]);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await adminApi.getPosters(new URLSearchParams({ search, status: filter }).toString()); setPosters(d.data); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [search, filter]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    if (editing === 'new') await adminApi.createPoster(form);
    else await adminApi.updatePoster(editing._id, form);
    toast.success(editing === 'new' ? 'Event created' : 'Event updated');
    load();
  };

  const handleDelete = async () => {
    try { await adminApi.deletePoster(deleting._id); toast.success('Event deleted'); load(); }
    catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Events</h1><p className="text-gray-400 text-sm mt-1">{posters.length} events</p></div>
        <button onClick={() => setEditing('new')} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…"
            className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500">
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-500 col-span-3 py-10 text-center">Loading…</p>
        : posters.length === 0 ? <p className="text-gray-500 col-span-3 py-10 text-center">No events found</p>
        : posters.map(p => (
          <div key={p._id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <img src={p.image} alt={p.title} className="w-full h-36 object-cover" onError={e => e.target.style.display='none'} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-white font-semibold text-sm line-clamp-2">{p.title}</p>
                <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[p.status]}`}>{p.status}</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">{p.organizer} · {new Date(p.eventDate).toLocaleDateString()}</p>
              <p className="text-gray-500 text-xs mt-1">{p.venue}</p>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"><Pencil size={14} /></button>
                <button onClick={() => setDeleting(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add Event' : 'Edit Event'} onClose={() => setEditing(null)} wide>
          <EventForm initial={editing === 'new' ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
        </Modal>
      )}
      {deleting && <ConfirmDialog message={`Delete event "${deleting.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  );
};

export default EventsPage;
