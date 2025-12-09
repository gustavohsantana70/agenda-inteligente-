import React from 'react';
import { add, format, setHours, setMinutes } from 'date-fns';
import { useBooking } from '../../context/BookingContext';
import { ArrowRight } from 'lucide-react';

export const SlotList: React.FC<{ date: Date; serviceId: string; onSelect: (startIso: string) => void }> = ({ date, serviceId, onSelect }) => {
  const { state } = useBooking();
  const service = state.services.find(s => s.id === serviceId);
  
  if (!service) return <div className="p-4 text-red-500 text-center">Serviço não encontrado</div>;

  // Simple slot generator: 9:00 - 17:00
  const slots = [];
  for (let h = 9; h < 18; h++) {
    const start = setHours(setMinutes(date, 0), h);
    const end = add(start, { minutes: service.durationMinutes });
    // Don't add slots that go beyond 18:00
    if (end.getHours() <= 18 && (end.getHours() < 18 || end.getMinutes() === 0)) {
        slots.push({ start, end });
    }
  }

  // Filter out slots that are already booked
  // This is a naive implementation. In a real app, we check overlaps more strictly.
  const availableSlots = slots.filter(slot => {
    const slotStartIso = slot.start.toISOString();
    // Check if any appointment starts at the exact same time (simplification)
    const isTaken = state.appointments.some(appt => {
        // Simple string comparison for MVP. Real app should use interval overlap check.
        return appt.startTime.startsWith(format(slot.start, "yyyy-MM-dd'T'HH"));
    });
    return !isTaken;
  });

  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-slate-500">Nenhum horário disponível para este dia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {availableSlots.map((s, idx) => (
        <button
            key={idx}
            onClick={() => onSelect(s.start.toISOString())}
            className="group flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-indigo-50 hover:text-primary transition-all bg-white"
        >
          <span className="font-semibold">{format(s.start, 'HH:mm')}</span>
          <span className="text-xs text-slate-500 group-hover:text-indigo-400">até {format(s.end, 'HH:mm')}</span>
        </button>
      ))}
    </div>
  );
};