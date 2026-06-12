import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import apis from '../../utils/apis';
import toast from 'react-hot-toast';

const PROGRAMS = ['B.Tech CSE','B.Tech ECE','B.Tech ME','B.Tech CE','MBA','MCA','M.Tech','BCA','B.Sc','Other'];
const YEARS    = ['1st Year','2nd Year','3rd Year','4th Year','Final Year','Alumni'];

const inp = "w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors";
const sel = `${inp}`;

const MentorRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', disId: '',
    program: '', department: '', yearOfStudy: '',
    shortDes: '', bio: '', img: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch(apis().mentorRegister, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      toast.success('Registered! Please log in.');
      navigate('/login');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500 rounded-2xl mb-4 shadow-lg shadow-amber-500/30">
            <GraduationCap size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Become a Mentor</h1>
          <p className="text-gray-400 mt-2 text-sm">Share your knowledge with students at V-Compass</p>
        </div>

        <form onSubmit={submit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6 shadow-2xl">

          {/* Account details */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Account Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Full Name <span className="text-red-400">*</span></label>
                <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Email <span className="text-red-400">*</span></label>
                <input className={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <input className={inp} type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="6–12 characters" required minLength={6} maxLength={12} />
                  <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Discord ID <span className="text-red-400">*</span></label>
                <input className={inp} value={form.disId} onChange={e => set('disId', e.target.value)} placeholder="username#1234" required />
              </div>
            </div>
          </div>

          {/* Academic details */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Academic Details</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Program <span className="text-red-400">*</span></label>
                <select className={sel} value={form.program} onChange={e => set('program', e.target.value)} required>
                  <option value="">Select…</option>
                  {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Department <span className="text-red-400">*</span></label>
                <input className={inp} value={form.department} onChange={e => set('department', e.target.value)} placeholder="CSE, ECE…" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Year <span className="text-red-400">*</span></label>
                <select className={sel} value={form.yearOfStudy} onChange={e => set('yearOfStudy', e.target.value)} required>
                  <option value="">Select…</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Mentor profile */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Mentor Profile (optional — can edit later)</p>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Short Tagline</label>
                <input className={inp} value={form.shortDes} onChange={e => set('shortDes', e.target.value)} placeholder="e.g. Passionate about DSA & competitive programming" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Bio</label>
                <textarea className={`${inp} resize-none`} rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell students about yourself, your experience, what you can help with…" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Profile Photo URL</label>
                <input className={inp} value={form.img} onChange={e => set('img', e.target.value)} placeholder="https://… (leave blank for auto-generated avatar)" />
              </div>
            </div>
          </div>

          {/* Perks list */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-2">
            {['Manage your availability slots','See all students who booked with you','Update your skills and specializations anytime'].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm text-amber-200">
                <CheckCircle size={14} className="text-amber-400 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-amber-500/25">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><ArrowRight size={18} />Register as Mentor</>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default MentorRegister;
