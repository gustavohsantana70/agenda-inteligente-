import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarMonthView: React.FC<{ value: Date; onDayClick: (d: Date) => void }> = ({ value, onDayClick }) => {
  const [currentMonth, setCurrentMonth] = React.useState(startOfMonth(value));

  const days = eachDayOfInterval({ 
    start: startOfMonth(currentMonth), 
    end: endOfMonth(currentMonth) 
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Basic week day headers
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
          <ChevronLeft size={20} />
        </button>
        <span className="font-semibold text-slate-900 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </span>
        <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-slate-500 uppercase">
        {weekDays.map(day => <div key={day} className="py-1">{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(d => {
          const isSelected = isSameDay(d, value);
          const isCurrentDay = isToday(d);
          
          return (
            <button 
              key={d.toISOString()} 
              onClick={() => onDayClick(d)} 
              className={`
                aspect-square rounded-full flex items-center justify-center text-sm transition-colors
                ${isSelected 
                  ? 'bg-primary text-white shadow-md' 
                  : isCurrentDay 
                    ? 'text-primary font-bold bg-indigo-50 border border-indigo-100' 
                    : 'text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              {format(d, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};