import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { Search, User } from 'lucide-react';

export const ClientList: React.FC = () => {
  const { state } = useBooking();
  const [q, setQ] = useState('');
  
  const filtered = state.clients.filter(c => 
    c.name.toLowerCase().includes(q.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mt-6">
      <h3 className="font-semibold text-slate-800 mb-4">Clientes</h3>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input 
            placeholder="Buscar por nome ou email..." 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            className="w-full pl-10 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {filtered.map(c => (
          <div key={c.id} className="p-3 border border-slate-100 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                <User size={16} />
              </div>
              <div>
                <div className="font-medium text-sm text-slate-900">{c.name}</div>
                <div className="text-xs text-slate-500">{c.email} • {c.phone}</div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-2">Nenhum cliente encontrado.</p>
        )}
      </div>
    </div>
  );
};