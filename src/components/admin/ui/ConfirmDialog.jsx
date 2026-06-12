import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl w-full max-w-sm p-6">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <p className="text-white font-medium">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm font-medium transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
