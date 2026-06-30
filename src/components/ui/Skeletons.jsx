import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md animate-pulse">
      <div className="w-1/3 h-4 bg-slate-800 rounded mb-4" />
      <div className="w-2/3 h-8 bg-slate-800 rounded mb-2" />
      <div className="w-1/2 h-3 bg-slate-800 rounded" />
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-2xl overflow-hidden p-6 animate-pulse">
      <div className="flex gap-4 border-b border-slate-800 pb-4 mb-4">
        <div className="w-1/4 h-5 bg-slate-800 rounded" />
        <div className="w-1/4 h-5 bg-slate-800 rounded" />
        <div className="w-1/4 h-5 bg-slate-800 rounded" />
        <div className="w-1/4 h-5 bg-slate-800 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-slate-800/40 last:border-0">
          <div className="w-1/4 h-4 bg-slate-800/60 rounded" />
          <div className="w-1/4 h-4 bg-slate-800/60 rounded" />
          <div className="w-1/4 h-4 bg-slate-800/60 rounded" />
          <div className="w-1/4 h-4 bg-slate-800/60 rounded" />
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md animate-pulse flex flex-col justify-between h-[300px]">
      <div className="w-1/4 h-4 bg-slate-800 rounded mb-6" />
      <div className="flex-1 flex items-end gap-3 w-full">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-800 rounded-t w-full"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export const ChatSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 p-4 animate-pulse">
      <div className="flex gap-3 max-w-[70%]">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
        <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 w-full h-16" />
      </div>
      <div className="flex gap-3 max-w-[70%] self-end flex-row-reverse">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
        <div className="bg-slate-800 rounded-2xl rounded-tr-none p-4 w-full h-12" />
      </div>
    </div>
  );
};
