import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '../../../utils/adminApi';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import { FormField, Input, Select, Textarea, TagInput, SaveButton } from '../ui/FormField';
import SpecializationInput from '../ui/SpecializationInput';
import TimeSlotPicker from '../ui/TimeSlotPicker';
import toast from 'react-hot-toast';

const EMPTY = {
  id: '', name: '', shortDes: '', time: '', img: '', program: '', department: '',
  yearOfStudy: '', bio: '', specialization: [], availabilitySlots: [], languagesSpoken: [],
  supportAreas: [], achievements: [], contactInfo: { email: '', linkedin: '', github: '' }
};

const MentorForm = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY);
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
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Mentor ID" required><Input value={form.id} onChange={e => set('id', e.target.value)} placeholder="unique-id" required disabled={!!initial} /></FormField>
        <FormField label="Full Name" required><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Name" required /></FormField>
        <FormField label="Short Description" required><Input value={form.shortDes} onChange={e => set('shortDes', e.target.value)} placeholder="Brief tagline" required /></FormField>
        <FormField label="Availability (general)" required><Input value={form.time} onChange={e => set('time', e.target.value)} placeholder="Mon–Fri 10–12 AM" required /></FormField>
        <FormField label="Photo URL" required><Input value={form.img} onChange={e => set('img', e.target.value)} placeholder="https://..." required /></FormField>
        <FormField label="Program" required><Input value={form.program} onChange={e => set('program', e.target.value)} placeholder="B.Tech CSE" required /></FormField>
        <FormField label="Department" required><Input value={form.department} onChange={e => set('department', e.target.value)} placeholder="CSE" required /></FormField>
        <FormField label="Year of Study" required><Input value={form.yearOfStudy} onChange={e => set('yearOfStudy', e.target.value)} placeholder="3rd Year" required /></FormField>
      </div>
      <FormField label="Bio" required><Textarea value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="About the mentor…" rows={4} required /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Specializations">
          <SpecializationInput value={form.specialization} onChange={v => set('specialization', v)} />
        </FormField>
        <FormField label="Availability Slots">
          <TimeSlotPicker value={form.availabilitySlots} onChange={v => set('availabilitySlots', v)} />
        </FormField>
        <FormField label="Languages Spoken"><TagInput value={form.languagesSpoken} onChange={v => set('languagesSpoken', v)} placeholder="English, Hindi…" /></FormField>
        <FormField label="Support Areas"><TagInput value={form.supportAreas} onChange={v => set('supportAreas', v)} placeholder="Placement, Resume…" /></FormField>
        <FormField label="Achievements" className="col-span-2"><TagInput value={form.achievements} onChange={v => set('achievements', v)} placeholder="Dean's List…" /></FormField>
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-1">Contact</p>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Email"><Input value={form.contactInfo.email} onChange={e => setContact('email', e.target.value)} placeholder="mentor@email.com" /></FormField>
        <FormField label="LinkedIn"><Input value={form.contactInfo.linkedin} onChange={e => setContact('linkedin', e.target.value)} placeholder="linkedin.com/in/…" /></FormField>
        <FormField label="GitHub"><Input value={form.contactInfo.github} onChange={e => setContact('github', e.target.value)} placeholder="github.com/…" /></FormField>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
        <SaveButton loading={loading} label={initial ? 'Update Mentor' : 'Create Mentor'} />
      </div>
    </form>
  );
};

const MentorsPage = () => {
  const [mentors, setMentors]   = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await adminApi.getMentors(new URLSearchParams({ search }).toString()); setMentors(d.data); }
    catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    if (editing === 'new') await adminApi.createMentor(form);
    else await adminApi.updateMentor(editing._id, form);
    toast.success(editing === 'new' ? 'Mentor created' : 'Mentor updated');
    load();
  };

  const handleDelete = async () => {
    try { await adminApi.deleteMentor(deleting._id); toast.success('Mentor deleted'); load(); }
    catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Mentors</h1>
          <p className="text-gray-400 text-sm mt-1">{mentors.length} mentors</p>
        </div>
        <button onClick={() => setEditing('new')} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Add Mentor
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mentors…"
          className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-500 col-span-3 py-10 text-center">Loading…</p>
        ) : mentors.length === 0 ? (
          <p className="text-gray-500 col-span-3 py-10 text-center">No mentors found</p>
        ) : mentors.map(m => (
          <div key={m._id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-3">
            <img src={m.img} alt={m.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" onError={e => e.target.src = 'https://ui-avatars.com/api/?name=' + m.name} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate capitalize">{m.name}</p>
              <p className="text-gray-400 text-xs">{m.program} · {m.yearOfStudy}</p>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{m.shortDes}</p>
              {m.specialization?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {m.specialization.slice(0, 3).map(s => (
                    <span key={s} className="text-xs bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                  {m.specialization.length > 3 && <span className="text-xs text-gray-500">+{m.specialization.length - 3}</span>}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => setEditing(m)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"><Pencil size={14} /></button>
              <button onClick={() => setDeleting(m)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add Mentor' : 'Edit Mentor'} onClose={() => setEditing(null)} wide>
          <MentorForm initial={editing === 'new' ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog message={`Delete mentor "${deleting.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
};

export default MentorsPage;
