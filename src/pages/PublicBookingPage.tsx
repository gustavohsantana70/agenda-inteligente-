
import React, { useState } from 'react';
import { ServiceList } from '../components/booking/ServiceList';
import { CalendarMonthView } from '../components/booking/CalendarMonthView';
import { SlotList } from '../components/booking/SlotList';
import { IntakeForm } from '../components/booking/IntakeForm';
import { CalendarSync } from '../components/booking/CalendarSync';
import { Button } from '../components/common/Button';
import { CheckCircle, ArrowLeft, Crown } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { Appointment } from '../types';

export const PublicBookingPage: React.FC = () => {
  const { state } = useBooking();
  const { user, subscribe } = useAuth(); // Use auth for subscription check
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

  const handleServiceSelect = (id: string) => {
    const service = state.services.find(s => s.id === id);
    if (!service) return;

    if (service.isPremium) {
        if (!user) {
            alert('Faça login primeiro para agendar serviços premium.');
            // In a real app, redirect to login
            return;
        }

        const isPlanPaid = user.plan === 'paid';
        const isPlanValid = user.planExpiry ? new Date(user.planExpiry) > new Date() : false;

        if (!isPlanPaid) {
            alert('Esse serviço faz parte do plano pago! Assine por R$19,90/mês para liberar.');
            return;
        } else if (!isPlanValid) {
            alert('Sua assinatura expirou! Renove por R$19,90/mês para continuar.');
            return;
        }
    }

    setSelectedServiceId(id);
    setStep('date');
  };

  const handleSubscribe = () => {
      if (!user) {
          alert("Faça login para assinar.");
          return;
      }
      // Simulate Payment Process
      if(confirm("Deseja confirmar a assinatura de R$ 19,90/mês?")) {
        subscribe();
        alert('Assinatura ativa! Você agora tem acesso aos serviços premium.');
      }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Agende seu horário</h1>
        <p className="text-slate-600 mt-2">Siga os passos abaixo para confirmar sua presença.</p>
        
        {/* Subscription Banner for Free Users */}
        {user && user.plan !== 'paid' && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-lg inline-flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 text-emerald-800">
                    <Crown size={20} className="text-yellow-500" />
                    <span className="font-medium">Liberar serviços Premium?</span>
                </div>
                <button 
                    onClick={handleSubscribe}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm"
                >
                    Assinar Plano Pago R$19,90/mês
                </button>
            </div>
        )}
        
        {user && user.plan === 'paid' && (
             <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                 <CheckCircle size={16} /> Assinatura Ativa (Vence em: {user.planExpiry ? format(parseISO(user.planExpiry), 'dd/MM/yyyy') : '-'})
             </div>
        )}
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
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    {state.services.map(s => (
                        <div 
                        key={s.id} 
                        className={`group p-4 border rounded-xl hover:shadow-md transition-all bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                            s.isPremium ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200'
                        }`}
                        >
                        <div>
                            <div className="flex items-center gap-2">
                                <h5 className="font-semibold text-lg text-slate-900">{s.name}</h5>
                                {s.isPremium && (
                                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1 border border-amber-200">
                                        <Crown size={10} /> PREMIUM
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{s.description}</p>
                            <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
                                <span className="bg-slate-100 px-2 py-1 rounded">{s.durationMinutes} min</span>
                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded">R$ {(s.priceCents/100).toFixed(2)}</span>
                            </div>
                        </div>
                        <Button 
                            onClick={() => handleServiceSelect(s.id)} 
                            className={`w-full sm:w-auto ${s.isPremium ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
                        >
                            Selecionar
                        </Button>
                        </div>
                    ))}
                </div>
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
