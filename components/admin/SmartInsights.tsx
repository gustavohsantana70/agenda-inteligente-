import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { Sparkles, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { format, isSameDay, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const SmartInsights: React.FC = () => {
  const { state } = useBooking();
  const today = new Date();
  
  // 1. Calculate Occupancy for Today
  const todaysAppointments = state.appointments.filter(a => isSameDay(parseISO(a.startTime), today));
  const occupancyRate = (todaysAppointments.length / 8) * 100; // Assuming 8 slots/day capacity

  // 2. Find Gaps (Simple logic: check empty hours between 9-17)
  const busyHours = todaysAppointments.map(a => parseISO(a.startTime).getHours());
  let gaps = 0;
  for(let h=9; h<17; h++) {
    if (!busyHours.includes(h)) gaps++;
  }

  // 3. Detect "High Demand" days
  // (Mock logic: just random suggestion for demo purposes if not enough data)
  const isHighDemand = occupancyRate > 70;

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>

        <div className="flex items-center gap-2 mb-4 relative z-10">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <h3 className="font-bold text-lg">Insights Inteligentes</h3>
        </div>

        <div className="space-y-4 relative z-10">
            {/* Occupancy Insight */}
            <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="bg-white/20 p-2 rounded-lg">
                    <TrendingUp size={18} className="text-white" />
                </div>
                <div>
                    <p className="font-semibold text-sm">Ocupação Hoje: {occupancyRate.toFixed(0)}%</p>
                    <p className="text-xs text-indigo-100 mt-0.5">
                        {isHighDemand 
                            ? "Dia movimentado! Prepare-se para um fluxo intenso." 
                            : "Movimento tranquilo. Bom momento para organizar a semana."}
                    </p>
                </div>
            </div>

            {/* Gaps Insight */}
            {gaps > 0 && (
                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-lg border border-white/10 backdrop-blur-sm">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Calendar size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{gaps} horários vagos hoje</p>
                        <p className="text-xs text-indigo-100 mt-0.5">
                            Sugestão: Que tal disparar uma oferta relâmpago no WhatsApp?
                        </p>
                    </div>
                </div>
            )}

            {/* Pending Confirmation Alert */}
            {state.appointments.some(a => a.status === 'pending') && (
                <div className="flex items-start gap-3 bg-amber-500/20 p-3 rounded-lg border border-amber-400/30 backdrop-blur-sm">
                    <div className="bg-amber-500/20 p-2 rounded-lg">
                        <AlertTriangle size={18} className="text-amber-200" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-amber-50">Confirmações Pendentes</p>
                        <p className="text-xs text-amber-100 mt-0.5">
                            Existem agendamentos aguardando sua aprovação no calendário.
                        </p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};