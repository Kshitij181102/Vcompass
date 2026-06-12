import React from 'react';

export const FormField = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-300">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

export const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500
                focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors ${className}`}
    {...props}
  />
);

export const Select = ({ children, className = '', ...props }) => (
  <select
    className={`w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm
                focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const Textarea = ({ className = '', ...props }) => (
  <textarea
    rows={3}
    className={`w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500
                focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none ${className}`}
    {...props}
  />
);

export const TagInput = ({ value = [], onChange, placeholder }) => {
  const [input, setInput] = React.useState('');
  const add = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) onChange([...value, input.trim()]);
      setInput('');
    }
  };
  const remove = (tag) => onChange(value.filter(t => t !== tag));
  return (
    <div className="w-full min-h-[42px] px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg focus-within:border-amber-500 transition-colors flex flex-wrap gap-1.5 items-center">
      {value.map(tag => (
        <span key={tag} className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full">
          {tag}
          <button type="button" onClick={() => remove(tag)} className="hover:text-white">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={add}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
      />
    </div>
  );
};

export const SaveButton = ({ loading, label = 'Save' }) => (
  <button
    type="submit"
    disabled={loading}
    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
  >
    {loading ? 'Saving…' : label}
  </button>
);
