import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, onClose, children, wide = false }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
    <div className={`bg-gray-900 rounded-xl border border-gray-800 shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] flex flex-col`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <h2 className="text-white font-semibold text-lg">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
    </div>
  </div>
);

export default Modal;
