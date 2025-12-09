import React, { useState, useEffect, useRef } from 'react';
import { useBooking } from '../../../context/BookingContext';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, parseISO, getHours, getMinutes, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, User, Plus } from 'lucide-react';
import { Appointment, Service, Client } from '../../../types';
import { Modal } from '../../common/Modal';
import { AppointmentFormModal } from './AppointmentFormModal';

// Status color mapping for the calendar visual
const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-100 border-blue-300 text-blue-700',
  confirmed: 'bg-green-100 border-green-300 text-green-700',
  completed: 'bg-slate-100 border-slate-300 text-slate-600 line-through',
  cancelled: 'bg-red-50 border-red-200 text-red-400',
  noshow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  pending: 'bg-orange-50 border-orange-200 text-orange-700',
};

export const ProfessionalCalendar: React.FC = () => {
  const { state, dispatch } = useBooking();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Smart Creation State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialDate, setCreateInitialDate] = useState<Date | undefined>(undefined);

  const containerRef = useRef<HTMLDivElement>(null);

  // Update "Now" indicator every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to 8 AM on mount
  useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTop = 560; // Approx 7am-8am
    }
  }, []);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday start
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

  // Handle Navigation
  const nextPeriod = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevPeriod = () => setCurrentDate(subWeeks(currentDate, 1));

  // Filter appointments for the week
  const weekAppointments = state.appointments.filter(apt => {
    const aptDate = parseISO(apt.startTime);
    return aptDate >= startOfCurrentWeek && aptDate <= addDays(startOfCurrentWeek, 7);
  });

  // Calculate position for "Now" line
  const nowDayIndex = weekDays.findIndex(d => isSameDay(d, currentTime));
  const nowHour = getHours(currentTime) + getMinutes(currentTime) / 60;
  const nowTop = nowHour * 80;

  // Handle click on empty slot
  const handleSlotClick = (day: Date, hour: number) => {
    const selectedDate = setMinutes(setHours(day, hour), 0);
    setCreateInitialDate(selectedDate);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[800px]">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'week' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Semana
            </button>
            <button 
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'day' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Dia
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevPeriod} className="p-1 hover:bg-slate-100 rounded"><ChevronLeft size={20} /></button>
            <button onClick={() => setCurrentDate(new Date())} className="text-sm font-medium text-slate-600 hover:text-primary">Hoje</button>
            <button onClick={nextPeriod} className="p-1 hover:bg-slate-100 rounded"><ChevronRight size={20} /></button>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
        </div>
        <button 
            onClick={() => { setCreateInitialDate(undefined); setIsCreateModalOpen(true); }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
        >
            <Plus size={16} /> Novo Agendamento
        </button>
      </div>

      {/* Week Grid */}
      <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar scroll-smooth">
        <div className="min-w-[800px] relative">
          
          {/* Header Row (Days) */}
          <div className="grid grid-cols-8 sticky top-0 bg-white z-20 border-b border-slate-200 shadow-sm">
            <div className="p-4 border-r border-slate-100 text-xs text-slate-400 font-medium text-center">GMT-3</div>
            {weekDays.map((day, i) => (
              <div key={i} className={`p-3 border-r border-slate-100 text-center ${isSameDay(day, new Date()) ? 'bg-indigo-50' : ''}`}>
                <div className="text-xs font-medium text-slate-500 uppercase">{format(day, 'EEE', { locale: ptBR })}</div>
                <div className={`text-xl font-bold ${isSameDay(day, new Date()) ? 'text-primary' : 'text-slate-800'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="relative grid grid-cols-8">
            {/* Time Column */}
            <div className="border-r border-slate-100 bg-slate-50 sticky left-0 z-10">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-20 border-b border-slate-200 text-xs text-slate-400 relative">
                  <span className="absolute -top-2 right-2 bg-slate-50 px-1 font-medium">{i}:00</span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {weekDays.map((day, colIndex) => (
              <div key={colIndex} className="relative border-r border-slate-100 group">
                 
                 {/* Current Time Indicator Line */}
                 {isSameDay(day, currentTime) && (
                    <div 
                        className="absolute w-full border-t-2 border-red-500 z-20 pointer-events-none flex items-center"
                        style={{ top: `${nowTop}px` }}
                    >
                        <div className="h-2 w-2 bg-red-500 rounded-full -ml-1"></div>
                    </div>
                 )}

                 {/* Hour Rows & Click Targets */}
                 {Array.from({ length: 24 }).map((_, h) => {
                     const isBusinessHour = h >= 8 && h < 19;
                     return (
                        <div 
                            key={h} 
                            onClick={() => handleSlotClick(day, h)}
                            className={`h-20 border-b border-slate-100 cursor-pointer transition-colors relative
                                ${isBusinessHour ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100'}
                            `}
                        >
                            {/* Hover "Add" icon for interactivity hint */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
                                <Plus className="text-slate-300 h-6 w-6" />
                            </div>
                        </div>
                     );
                 })}

                 {/* Appointments Overlay */}
                 {weekAppointments
                    .filter(apt => isSameDay(parseISO(apt.startTime), day))
                    .map(apt => {
                        const start = parseISO(apt.startTime);
                        const end = parseISO(apt.endTime);
                        const startHour = getHours(start) + (getMinutes(start) / 60);
                        const durationHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                        
                        // Positioning
                        const top = startHour * 80; // 80px per hour
                        const height = durationHrs * 80;

                        const service = state.services.find(s => s.id === apt.serviceId);
                        const client = state.clients.find(c => c.id === apt.clientId);
                        const colorClass = STATUS_COLORS[apt.status] || 'bg-slate-100 border-slate-300';

                        return (
                          <button
                            key={apt.id}
                            onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }}
                            className={`absolute inset-x-1 rounded px-2 py-1 text-xs border-l-4 shadow-sm hover:brightness-95 transition-all text-left overflow-hidden flex flex-col justify-start z-10 ${colorClass}`}
                            style={{ top: `${top}px`, height: `${height}px`, borderLeftColor: service?.color || '#cbd5e1' }}
                          >
                            <span className="font-bold truncate">{client?.name}</span>
                            <span className="truncate opacity-90">{service?.name}</span>
                            <span className="truncate opacity-75">{format(start, 'HH:mm')} - {format(end, 'HH:mm')}</span>
                          </button>
                        );
                    })
                 }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <Modal 
        open={!!selectedAppointment} 
        onClose={() => setSelectedAppointment(null)} 
        title="Detalhes do Agendamento"
      >
        {selectedAppointment && (
            <AppointmentDetailContent 
                appointment={selectedAppointment} 
                onClose={() => setSelectedAppointment(null)}
                dispatch={dispatch}
                services={state.services}
                clients={state.clients}
            />
        )}
      </Modal>

      {/* Smart Creation Modal */}
      <AppointmentFormModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        initialDate={createInitialDate}
      />
    </div>
  );
};

// Internal component for the Modal content to keep code clean
const AppointmentDetailContent: React.FC<{
    appointment: Appointment;
    onClose: () => void;
    dispatch: any;
    services: Service[];
    clients: Client[];
}> = ({ appointment, onClose, dispatch, services, clients }) => {
    const service = services.find(s => s.id === appointment.serviceId);
    const client = clients.find(c => c.id === appointment.clientId);

    const updateStatus = (newStatus: string) => {
        dispatch({
            type: 'UPDATE_APPOINTMENT',
            payload: { ...appointment, status: newStatus }
        });
        onClose();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-100 text-primary rounded-full flex items-center justify-center">
                        <User size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-slate-900">{client?.name}</h4>
                        <p className="text-sm text-slate-500">{client?.phone} • {client?.email}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase">Serviço</label>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: service?.color }}></div>
                        <p className="font-medium">{service?.name}</p>
                    </div>
                </div>
                <div>
                     <label className="text-xs font-semibold text-slate-500 uppercase">Horário</label>
                     <div className="flex items-center gap-2 mt-1">
                        <Clock size={16} className="text-slate-400" />
                        <p className="font-medium">
                            {format(parseISO(appointment.startTime), "dd/MM 'às' HH:mm")}
                        </p>
                     </div>
                </div>
            </div>
            
            {appointment.intakeData?.notes && (
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
                    <p className="text-xs font-bold text-yellow-800 mb-1">Notas do Cliente:</p>
                    <p className="text-sm text-yellow-900">{appointment.intakeData.notes}</p>
                </div>
            )}

            {appointment.notes && (
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                    <p className="text-xs font-bold text-slate-700 mb-1">Notas Internas:</p>
                    <p className="text-sm text-slate-600">{appointment.notes}</p>
                </div>
            )}

            <div className="border-t border-slate-100 pt-4">
                <label className="text-sm font-medium text-slate-700 mb-3 block">Alterar Status</label>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateStatus('confirmed')} className="px-3 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 text-sm font-medium">Confirmar</button>
                    <button onClick={() => updateStatus('completed')} className="px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm font-medium">Concluir</button>
                    <button onClick={() => updateStatus('noshow')} className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 text-sm font-medium">Não Compareceu</button>
                    <button onClick={() => updateStatus('cancelled')} className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm font-medium">Cancelar</button>
                </div>
            </div>
        </div>
    );
};