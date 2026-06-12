import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const PRESET_SPECIALIZATIONS = [
  'Data Structures & Algorithms',
  'System Design',
  'Web Development',
  'Backend Development',
  'Frontend Development',
  'Full Stack Development',
  'Machine Learning',
  'Deep Learning',
  'Data Science',
  'Cloud Computing',
  'DevOps',
  'Databases',
  'Competitive Programming',
  'Mobile Development',
  'Cybersecurity',
  'Blockchain',
  'Open Source',
  'Placement Guidance',
  'Resume Review',
  'Interview Preparation',
  'Research & Academia',
  'Entrepreneurship',
];

const SpecializationInput = ({ value = [], onChange }) => {
  const [selected, setSelected] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const remaining = PRESET_SPECIALIZATIONS.filter(s => !value.includes(s));

  const addPreset = () => {
    if (!selected || value.includes(selected)) return;
    onChange([...value, selected]);
    setSelected('');
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setCustomInput('');
    setShowCustom(false);
  };

  const remove = (tag) => onChange(value.filter(v => v !== tag));

  return (
    <div className="space-y-2">
      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map(tag => (
            <span key={tag} className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full border border-amber-500/30">
              {tag}
              <button type="button" onClick={() => remove(tag)} className="hover:text-white transition-colors ml-0.5">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown row */}
      <div className="flex gap-2">
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
        >
          <option value="">— Select specialization —</option>
          {remaining.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          type="button"
          onClick={addPreset}
          disabled={!selected}
          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Custom option */}
      {!showCustom ? (
        <button
          type="button"
          onClick={() => setShowCustom(true)}
          className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
        >
          + Add custom specialization
        </button>
      ) : (
        <div className="flex gap-2">
          <input
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
            placeholder="Type custom specialization…"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            autoFocus
          />
          <button type="button" onClick={addCustom} className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">Add</button>
          <button type="button" onClick={() => { setShowCustom(false); setCustomInput(''); }} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SpecializationInput;
