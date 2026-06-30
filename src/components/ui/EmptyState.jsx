import React from 'react';
import { Plus } from 'lucide-react';

const EmptyState = ({ title = 'No data available', description = 'Add some items to get started.', onAdd, addText = 'Add Item', icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 backdrop-blur-sm">
      {Icon && (
        <div className="p-4 bg-slate-800/40 rounded-full border border-slate-700/50 mb-4 text-slate-400">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-xs mb-5">{description}</p>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {addText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
