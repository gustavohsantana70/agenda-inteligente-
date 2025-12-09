import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { format, parseISO } from 'date-fns';
import { Button } from '../common/Button';
import { GripVertical } from 'lucide-react';

export const AdminCalendarView: React.FC = () => {
  const { state, dispatch } = useBooking();

  const handleDragSim = (id: string) => {
    const appt = state.appointments.find(a => a.id === id);
    if (!appt) return;
    const updated = { ...appt, status: 'confirmed' as const };
    dispatch({ type: 'UPDATE_APPOINTMENT', payload: updated });
    alert('Status atualizado para Confirmado!');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Próximos Agendamentos</h3>
        </div>
        <div className="divide-y divide-slate-100">
            {state.appointments.length === 0 ? (
                <div className="p-8 text-center text-slate-500">Nenhum agendamento encontrado.</div>
            ) : (
                state.appointments.map(a => {
                    const client = state.clients.find(c => c.id === a.clientId);
                    const service = state.services.find(s => s.id === a.serviceId);
                    
                    return (
                        <div key={a.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-start space-x-3">
                                <div className="mt-1 text-slate-400 cursor-move" title="Arraste para reagendar (Simulado)">
                                    <GripVertical size={20} />
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900">{client?.name || 'Cliente Desconhecido'}</div>
                                    <div className="text-sm text-slate-600">
                                        {service?.name} • {format(parseISO(a.startTime), "dd/MM HH:mm")}
                                    </div>
                                    <div className="mt-1 flex items-center space-x-2 text-xs">
                                        <span className={`px-2 py-0.5 rounded-full capitalize ${
                                            a.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                                            a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {a.status}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full capitalize ${
                                            a.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {a.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2 w-full sm:w-auto">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 sm:flex-none text-xs" 
                                    onClick={() => handleDragSim(a.id)}
                                >
                                    Confirmar
                                </Button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
};