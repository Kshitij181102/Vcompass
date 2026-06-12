import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import apis from '../../../utils/apis';
import toast from 'react-hot-toast';
import SpecializationInput from '../../admin/ui/SpecializationInput';
import TimeSlotPicker from '../../admin/ui/TimeSlotPicker';

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-300">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const inp = "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors";
const ta  = `${inp} resize-none`;

const PROGRAMS = ['B.Tech CSE','B.Tech ECE','B.Tech ME','B.Tech CE','MBA','MCA','M.Tech','BCA','B.Sc','Other'];
const YEARS    = ['1st Year','2nd Year','3rd Year','4th Year','Final Year','Alumni'];

const MentorProfile = () => {
  const [form, setForm]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    fetch(apis().mentorProfile, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setForm(d.data))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setContact = (k, v) => setForm(p => ({ ...p, contactInfo: { ...p.contactInfo, [k]: v } }));

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await fetch(apis().mentorProfile, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setForm(d.data);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Update your mentor profile — students will see this.</p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Photo preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl">
          <img
            src={form?.img}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
            onError={e => e.target.src = `https://ui-avatars.com/api/?name=${form?.name}&background=f59e0b&color=fff`}
          />
          <div className="flex-1">
            <Field label="Photo URL">
              <input className={inp} value={form?.img || ''} onChange={e => set('img', e.target.value)} placeholder="https://…" />
            </Field>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Basic Information</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input className={inp} value={form?.name || ''} onChange={e => set('name', e.target.value)} placeholder="Your name" required />
            </Field>
            <Field label="Short Description" required>
              <input className={inp} value={form?.shortDes || ''} onChange={e => set('shortDes', e.target.value)} placeholder="Brief tagline" required />
            </Field>
            <Field label="Program" required>
              <select className={inp} value={form?.program || ''} onChange={e => set('program', e.target.value)} required>
                <option value="">Select program</option>
                {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Department" required>
              <input className={inp} value={form?.department || ''} onChange={e => set('department', e.target.value)} placeholder="Computer Science" required />
            </Field>
            <Field label="Year of Study" required>
              <select className={inp} value={form?.yearOfStudy || ''} onChange={e => set('yearOfStudy', e.target.value)} required>
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="General Availability" required>
              <input className={inp} value={form?.time || ''} onChange={e => set('time', e.target.value)} placeholder="Mon–Fri 10 AM–12 PM" required />
            </Field>
          </div>
          <Field label="Bio" required>
            <textarea className={ta} rows={4} value={form?.bio || ''} onChange={e => set('bio', e.target.value)} placeholder="Tell students about yourself…" required />
          </Field>
        </div>

        {/* Specializations & slots */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills & Availability</p>
          <Field label="Specializations">
            <SpecializationInput value={form?.specialization || []} onChange={v => set('specialization', v)} />
          </Field>
          <Field label="Availability Slots">
            <TimeSlotPicker value={form?.availabilitySlots || []} onChange={v => set('availabilitySlots', v)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Support Areas">
              <SupportTagInput value={form?.supportAreas || []} onChange={v => set('supportAreas', v)} placeholder="Placement, Resume…" />
            </Field>
            <Field label="Languages Spoken">
              <SupportTagInput value={form?.languagesSpoken || []} onChange={v => set('languagesSpoken', v)} placeholder="English, Hindi…" />
            </Field>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Achievements</p>
          <SupportTagInput value={form?.achievements || []} onChange={v => set('achievements', v)} placeholder="Press Enter — Dean's List, Hackathon winner…" />
        </div>

        {/* Contact */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Email">
              <input className={inp} value={form?.contactInfo?.email || ''} onChange={e => setContact('email', e.target.value)} placeholder="you@email.com" />
            </Field>
            <Field label="LinkedIn">
              <input className={inp} value={form?.contactInfo?.linkedin || ''} onChange={e => setContact('linkedin', e.target.value)} placeholder="linkedin.com/in/…" />
            </Field>
            <Field label="GitHub">
              <input className={inp} value={form?.contactInfo?.github || ''} onChange={e => setContact('github', e.target.value)} placeholder="github.com/…" />
            </Field>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
            <Save size={16} />
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Simple inline tag input reused here
const SupportTagInput = ({ value = [], onChange, placeholder }) => {
  const [input, setInput] = React.useState('');
  const add = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const t = input.trim();
      if (t && !value.includes(t)) onChange([...value, t]);
      setInput('');
    }
  };
  return (
    <div className="w-full min-h-[42px] px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg focus-within:border-amber-500 transition-colors flex flex-wrap gap-1.5 items-center">
      {value.map(tag => (
        <span key={tag} className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">
          {tag}
          <button type="button" onClick={() => onChange(value.filter(v => v !== tag))} className="hover:text-white">×</button>
        </span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={add} placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none" />
    </div>
  );
};

export default MentorProfile;
