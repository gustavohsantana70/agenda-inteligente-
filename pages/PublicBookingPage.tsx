import React, { useState } from 'react';
import { ServiceList } from '../components/booking/ServiceList';
import { CalendarMonthView } from '../components/booking/CalendarMonthView';
import { SlotList } from '../components/booking/SlotList';
import { IntakeForm } from '../components/booking/IntakeForm';
import { CalendarSync } from '../components/booking/CalendarSync';
import { Button } from '../components/common/Button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { format } from 'date-fns';
import { Appointment } from '../types';

export const PublicBookingPage: React.FC = () => {
  const { state } = useBooking();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedStartIso, setSelectedStartIso] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'date' | 'slots' | 'intake' | 'success'>('select');
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const selectedService = state.services.find(s => s.id === selectedServiceId);

  const reset = () => {
    setStep('select');
    setSelectedServiceId(null);
    setSelectedStartIso(null);
    setConfirmedAppointment(null);
  };

  const goBack = () => {
    if (step === 'date') setStep('select');
    if (step === 'slots') setStep('date');
    if (step === 'intake') setStep('slots');
  };

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Agende seu horário</h1>
        <p className="text-slate-600 mt-2">Siga os passos abaixo para confirmar sua presença.</p>
      </header>
      
      {/* Progress Steps (simplified visual) */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2 text-sm font-medium">
            <span className={`${step === 'select' ? 'text-primary' : 'text-slate-400'}`}>1. Serviço</span>
            <span className="text-slate-300">/</span>
            <span className={`${['date', 'slots'].includes(step) ? 'text-primary' : 'text-slate-400'}`}>2. Data e Hora</span>
            <span className="text-slate-300">/</span>
            <span className={`${step === 'intake' ? 'text-primary' : 'text-slate-400'}`}>3. Dados</span>
        </div>
      </div>

      <div className="relative">
        {step !== 'select' && step !== 'success' && (
            <button 
                onClick={goBack} 
                className="absolute -top-12 left-0 text-sm text-slate-500 hover:text-primary flex items-center gap-1"
            >
                <ArrowLeft size={16} /> Voltar
            </button>
        )}

        {step === 'select' && (
            <section className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-center">Escolha um serviço</h2>
                <ServiceList onSelect={id => { setSelectedServiceId(id); setStep('date'); }} />
            </section>
        )}

        {step === 'date' && (
            <section className="space-y-4 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 text-center">Escolha o dia</h2>
                <CalendarMonthView value={selectedDay} onDayClick={d => { setSelectedDay(d); setStep('slots'); }} />
            </section>
        )}

        {step === 'slots' && selectedService && (
            <section className="space-y-4">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Horários disponíveis</h2>
                    <p className="text-slate-600">Para {format(selectedDay, 'dd/MM/yyyy')} — {selectedService.name}</p>
                </div>
                <SlotList 
                    date={selectedDay} 
                    serviceId={selectedService.id} 
                    onSelect={startIso => { setSelectedStartIso(startIso); setStep('intake'); }} 
                />
            </section>
        )}

        {step === 'intake' && selectedService && selectedStartIso && (
            <section className="max-w-xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Seus dados</h2>
                    <p className="text-slate-600">Finalize o agendamento preenchendo as informações abaixo.</p>
                </div>
                <IntakeForm 
                  serviceId={selectedService.id} 
                  startIso={selectedStartIso} 
                  onComplete={(appt) => { 
                    setConfirmedAppointment(appt);
                    setStep('success'); 
                  }} 
                />
            </section>
        )}

        {step === 'success' && (
            <section className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-600 rounded-full mb-6">
                    <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Agendamento Confirmado!</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Recebemos seu agendamento. Um e-mail com os detalhes foi enviado para você.
                </p>
                
                {confirmedAppointment && selectedService && (
                  <CalendarSync appointment={confirmedAppointment} service={selectedService} />
                )}

                <div className="mt-8">
                  <Button onClick={reset} variant="primary">
                      Fazer novo agendamento
                  </Button>
                </div>
            </section>
        )}
      </div>
    </main>
  );
};