import React, { useEffect, useState, useCallback } from 'react';
import { Search, Pencil, Trash2, ShieldCheck, ShieldOff, Plus } from 'lucide-react';
import { adminApi } from '../../../utils/adminApi';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import { FormField, Input, Select, SaveButton } from '../ui/FormField';
import toast from 'react-hot-toast';

const EMPTY = { name: '', email: '', phoneNumber: '', disId: '', role: 'user', password: '', academicInfo: { studentId: '', program: '', department: '', yearOfStudy: '', section: '' } };

const UserForm = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial || EMPTY);
  const [loading, setLoading] = useState(false);

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));
  const setAcademic = (field, val) => setForm(p => ({ ...p, academicInfo: { ...p.academicInfo, [field]: val } }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Full Name" required><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" required /></FormField>
        <FormField label="Email" required><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Email" required /></FormField>
        <FormField label="Phone"><Input value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} placeholder="Phone number" /></FormField>
        <FormField label="Discord ID" required><Input value={form.disId} onChange={e => set('disId', e.target.value)} placeholder="Discord ID" required /></FormField>
        <FormField label="Role"><Select value={form.role} onChange={e => set('role', e.target.value)}><option value="user">User</option><option value="admin">Admin</option></Select></FormField>
        <FormField label={initial ? 'New Password (leave blank to keep)' : 'Password'}>
          <Input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder={initial ? 'Leave blank' : 'Password'} required={!initial} />
        </FormField>
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">Academic Info</p>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Student ID"><Input value={form.academicInfo.studentId} onChange={e => setAcademic('studentId', e.target.value)} placeholder="Roll number" /></FormField>
        <FormField label="Program"><Input value={form.academicInfo.program} onChange={e => setAcademic('program', e.target.value)} placeholder="B.Tech CSE" /></FormField>
        <FormField label="Department"><Input value={form.academicInfo.department} onChange={e => setAcademic('department', e.target.value)} placeholder="CSE" /></FormField>
        <FormField label="Year"><Input value={form.academicInfo.yearOfStudy} onChange={e => setAcademic('yearOfStudy', e.target.value)} placeholder="2nd Year" /></FormField>
        <FormField label="Section"><Input value={form.academicInfo.section} onChange={e => setAcademic('section', e.target.value)} placeholder="A" /></FormField>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
        <SaveButton loading={loading} label={initial ? 'Update User' : 'Create User'} />
      </div>
    </form>
  );
};

const UsersPage = () => {
  const [users, setUsers]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);   // null | 'new' | user object
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15, search }).toString();
      const d = await adminApi.getUsers(params);
      setUsers(d.data); setTotal(d.total);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search]);

  const handleSave = async (form) => {
    if (editing === 'new') {
      await adminApi.updateUser('create', form); // will fail — users created via register only
    } else {
      await adminApi.updateUser(editing._id, form);
      toast.success('User updated');
    }
    load();
  };

  const handleDelete = async () => {
    try { await adminApi.deleteUser(deleting._id); toast.success('User deleted'); load(); }
    catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try { await adminApi.updateRole(user._id, newRole); toast.success(`Role changed to ${newRole}`); load(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…"
          className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500" />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Discord ID</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-white font-medium capitalize">{u.name}</td>
                  <td className="px-4 py-3 text-gray-300">{u.email}</td>
                  <td className="px-4 py-3 text-gray-400">{u.disId}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-gray-700 text-gray-300'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleRole(u)} title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                        {u.role === 'admin' ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                      </button>
                      <button onClick={() => setEditing(u)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleting(u)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 15 && (
          <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-sm text-gray-400">
            <span>Page {page} of {Math.ceil(total / 15)}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 transition-colors">Prev</button>
              <button disabled={page >= Math.ceil(total / 15)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40 transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {editing && editing !== 'new' && (
        <Modal title="Edit User" onClose={() => setEditing(null)} wide>
          <UserForm initial={editing} onSave={handleSave} onClose={() => setEditing(null)} />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog message={`Delete user "${deleting.name}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
};

export default UsersPage;
