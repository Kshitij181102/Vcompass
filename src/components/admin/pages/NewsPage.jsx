import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '../../../utils/adminApi';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import { FormField, Input, Select, Textarea, TagInput, SaveButton } from '../ui/FormField';
import toast from 'react-hot-toast';

const EMPTY = { title: '', content: '', summary: '', category: 'general', image: '', author: '', featured: false, status: 'published', readTime: 5, tags: [] };

const NewsForm = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial, tags: initial.tags || [] } : EMPTY);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try { await onSave(form); onClose(); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormField label="Title" required><Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Article title" required /></FormField>
      <FormField label="Summary" required><Textarea value={form.summary} onChange={e => set('summary', e.target.value)} placeholder="Short summary (max 200 chars)" maxLength={200} required /></FormField>
      <FormField label="Content" required><Textarea value={form.content} onChange={e => set('content', e.target.value)} placeholder="Full article content…" rows={6} required /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Author" required><Input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Author name" required /></FormField>
        <FormField label="Image URL"><Input value={form.image || ''} onChange={e => set('image', e.target.value)} placeholder="https://…" /></FormField>
        <FormField label="Category">
          <Select value={form.category} onChange={e => set('category', e.target.value)}>
            {['academic','sports','cultural','placement','announcement','general'].map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormField>
        <FormField label="Status">
          <Select value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option>
          </Select>
        </FormField>
        <FormField label="Read Time (mins)"><Input type="number" min={1} value={form.readTime} onChange={e => set('readTime', +e.target.value)} /></FormField>
        <FormField label="Featured">
          <Select value={form.featured ? 'true' : 'false'} onChange={e => set('featured', e.target.value === 'true')}>
            <option value="false">No</option><option value="true">Yes</option>
          </Select>
        </FormField>
      </div>
      <FormField label="Tags (Enter to add)"><TagInput value={form.tags} onChange={v => set('tags', v)} placeholder="campus, event…" /></FormField>
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
        <SaveButton loading={loading} label={initial ? 'Update News' : 'Create News'} />
      </div>
    </form>
  );
};

const statusColor = { published: 'bg-green-500/20 text-green-300', draft: 'bg-yellow-500/20 text-yellow-300', archived: 'bg-gray-700 text-gray-400' };

const NewsPage = () => {
  const [news, setNews]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminApi.getNews(new URLSearchParams({ page, limit: 12, search, status: filter }).toString());
      setNews(d.data); setTotal(d.total);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [page, search, filter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, filter]);

  const handleSave = async (form) => {
    if (editing === 'new') await adminApi.createNews(form);
    else await adminApi.updateNews(editing._id, form);
    toast.success(editing === 'new' ? 'News created' : 'News updated');
    load();
  };

  const handleDelete = async () => {
    try { await adminApi.deleteNews(deleting._id); toast.success('News deleted'); load(); }
    catch (e) { toast.error(e.message); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">News</h1><p className="text-gray-400 text-sm mt-1">{total} articles</p></div>
        <button onClick={() => setEditing('new')} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Add Article
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or author…"
            className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-amber-500" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500">
          <option value="">All Status</option>
          <option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option>
        </select>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Author</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? <tr><td colSpan={6} className="text-center py-10 text-gray-500">Loading…</td></tr>
            : news.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-gray-500">No articles found</td></tr>
            : news.map(n => (
              <tr key={n._id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 text-white font-medium max-w-xs truncate">{n.title}</td>
                <td className="px-4 py-3 text-gray-300">{n.author}</td>
                <td className="px-4 py-3 text-gray-400 capitalize">{n.category}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[n.status]}`}>{n.status}</span></td>
                <td className="px-4 py-3 text-gray-400">{new Date(n.publishDate || n.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(n)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setDeleting(n)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {total > 12 && (
          <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-sm text-gray-400">
            <span>Page {page} of {Math.ceil(total / 12)}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40">Prev</button>
              <button disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Add Article' : 'Edit Article'} onClose={() => setEditing(null)} wide>
          <NewsForm initial={editing === 'new' ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
        </Modal>
      )}
      {deleting && <ConfirmDialog message={`Delete "${deleting.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />}
    </div>
  );
};

export default NewsPage;
