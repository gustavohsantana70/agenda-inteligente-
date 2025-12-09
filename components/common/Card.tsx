import React from 'react';

export const Card: React.FC<{ className?: string; title?: string; children: React.ReactNode }> = ({ className = '', title, children }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 ${className}`}>
    {title && <h4 className="font-semibold text-lg text-slate-900 mb-4">{title}</h4>}
    {children}
  </div>
);