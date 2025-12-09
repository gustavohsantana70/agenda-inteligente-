import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../common/Button';
import { Clock, Tag } from 'lucide-react';

export const ServiceList: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const { state } = useBooking();
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
      {state.services.map(s => (
        <div 
          key={s.id} 
          className="group p-4 border border-slate-200 rounded-xl hover:border-primary/50 hover:shadow-md transition-all bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h5 className="font-semibold text-lg text-slate-900">{s.name}</h5>
            <p className="text-sm text-slate-600 mb-2">{s.description}</p>
            <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
              <span className="flex items-center bg-slate-100 px-2 py-1 rounded">
                <Clock size={12} className="mr-1" />
                {s.durationMinutes} min
              </span>
              <span className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded">
                <Tag size={12} className="mr-1" />
                R$ {(s.priceCents/100).toFixed(2)}
              </span>
            </div>
          </div>
          <Button onClick={() => onSelect(s.id)} className="w-full sm:w-auto">
            Selecionar
          </Button>
        </div>
      ))}
    </div>
  );
};