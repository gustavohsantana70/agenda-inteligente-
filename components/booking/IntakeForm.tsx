import React, { useState } from 'react';
import { Input } from '../common/Input';
import { useBooking } from '../../context/BookingContext';
import { uuidv4 } from '../../utils/helpers';
import { Button } from '../common/Button';
import { add } from 'date-fns';
import { Appointment } from '../../types';

export const IntakeForm: React.FC<{ serviceId: string; startIso: string; onComplete: (appt: Appointment) => void }> = ({ serviceId, startIso, onComplete }) => {
  const { state, dispatch } = useBooking();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasAllergy, setHasAllergy] = useState('');

  const service = state.services.find(s => s.id === serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate end time
    const startDate = new Date(startIso);
    const duration = service ? service.durationMinutes : 60;
    const endDate = add(startDate, { minutes: duration });

    // Build appointment
    const appointment: Appointment = {
      id: uuidv4(),
      clientId: uuidv4(), // In real app, check if client exists by email first
      serviceId,
      startTime: startIso,
      endTime: endDate.toISOString(),
      status: 'pending',
      paymentStatus: 'unpaid',
      intakeData: { name, email, phone, hasAllergy }
    };

    // Add client first
    dispatch({ type: 'ADD_CLIENT', payload: { id: appointment.clientId, name, email, phone } });
    
    // Then add appointment
    dispatch({ type: 'ADD_APPOINTMENT', payload: appointment });

    // Simulate checkout/completion
    onComplete(appointment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nome completo" placeholder="Ex: João Silva" value={name} onChange={e => setName(e.target.value)} required />
        <Input label="Email" placeholder="Ex: joao@email.com" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
      </div>
      
      <Input label="Telefone / WhatsApp" placeholder="Ex: (11) 99999-9999" value={phone} onChange={e => setPhone(e.target.value)} required />
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Observações ou Alergias?</label>
        <textarea 
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            rows={3}
            placeholder="Descreva aqui se necessário..." 
            value={hasAllergy} 
            onChange={e => setHasAllergy(e.target.value)} 
        />
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button type="submit" className="w-full md:w-auto">
          Finalizar Agendamento
        </Button>
      </div>
    </form>
  );
};