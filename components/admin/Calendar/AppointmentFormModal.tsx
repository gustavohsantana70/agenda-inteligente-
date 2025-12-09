import React, { useState, useEffect } from 'react';
import { useBooking } from '../../../context/BookingContext';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { add, format, parseISO, isWithinInterval } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, User, Briefcase } from 'lucide-react';
import { uuidv4 } from '../../../utils/helpers';
import { Appointment } from '../../../types';

interface AppointmentFormModalProps {
  open: boolean;
  onClose: () => void;
  initialDate?: Date;
}

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({ open, onClose, initialDate }) => {
  const { state, dispatch } = useBooking();
  
  // Form State
  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  
  // Smart State
  const [conflict, setConflict] = useState<boolean>(false);

  useEffect(() => {
    if (open && initialDate) {
      setDate(format(initialDate, 'yyyy-MM-dd'));
      setTime(format(initialDate, 'HH:mm'));
    } else if (open) {
      // Default to now rounded to next hour
      const now = new Date();
      now.setMinutes(0, 0, 0);
      setDate(format(now, 'yyyy-MM-dd'));
      setTime(format(now, 'HH:mm'));
    }
    // Reset other fields
    if(open) {
        setClientId('');
        setServiceId('');
        setNotes('');
        setConflict(false);
    }
  }, [open, initialDate]);

  // Check for conflicts whenever date, time or service changes
  useEffect(() => {
    if (!date || !time || !serviceId) return;

    const service = state.services.find(s => s.id === serviceId);
    if (!service) return;

    const start = new Date(`${date}T${time}`);
    const end = add(start, { minutes: service.durationMinutes });

    // Check overlap with existing confirmed/scheduled appointments
    const hasOverlap = state.appointments.some(apt => {
        if (['cancelled', 'noshow'].includes(apt.status)) return false;
        
        const aptStart = parseISO(apt.startTime);
        const aptEnd = parseISO(apt.endTime);

        return isWithinInterval(start, { start: aptStart, end: aptEnd }) ||
               isWithinInterval(end, { start: aptStart, end: aptEnd }) ||
               (start < aptStart && end > aptEnd);
    });

    setConflict(hasOverlap);

  }, [date, time, serviceId, state.appointments, state.services]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !serviceId || !date || !time) return;

    const service = state.services.find(s => s.id === serviceId);
    if (!service) return;

    const start = new Date(`${date}T${time}`);
    const end = add(start, { minutes: service.durationMinutes });

    const newAppointment: Appointment = {
      id: uuidv4(),
      clientId,
      serviceId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: 'confirmed',
      paymentStatus: 'unpaid', // Default for manual admin entry
      intakeData: {},
      notes
    };

    dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Agendamento Inteligente">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Smart Conflict Alert */}
        {conflict && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="text-amber-600 h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-amber-800">Conflito de Horário Detectado</p>
                    <p className="text-xs text-amber-600">Já existe um agendamento neste intervalo. Deseja prosseguir mesmo assim (overbooking)?</p>
                </div>
            </div>
        )}

        {!conflict && serviceId && date && time && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-2 flex items-center gap-2">
                <CheckCircle className="text-green-600 h-4 w-4" />
                <span className="text-xs text-green-700 font-medium">Horário disponível</span>
            </div>
        )}

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <User size={14} /> Cliente
            </label>
            <select 
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                required
            >
                <option value="">Selecione um cliente...</option>
                {state.clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Briefcase size={14} /> Serviço
            </label>
            <select 
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary"
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                required
            >
                <option value="">Selecione um serviço...</option>
                {state.services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min)</option>
                ))}
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Input 
                label="Data" 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required 
            />
            <Input 
                label="Hora" 
                type="time" 
                value={time} 
                onChange={e => setTime(e.target.value)} 
                required 
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas Internas</label>
            <textarea 
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
                placeholder="Detalhes extras..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
            />
        </div>

        <div className="flex justify-end pt-2">
            <Button type="submit" variant={conflict ? 'danger' : 'primary'}>
                {conflict ? 'Confirmar Overbooking' : 'Agendar'}
            </Button>
        </div>
      </form>
    </Modal>
  );
};