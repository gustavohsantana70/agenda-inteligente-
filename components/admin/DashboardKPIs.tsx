import React from 'react';
import { useBooking } from '../../context/BookingContext';
import { format } from 'date-fns';
import { Users, CalendarCheck, DollarSign } from 'lucide-react';

export const DashboardKPIs: React.FC = () => {
  const { state } = useBooking();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const todaysCount = state.appointments.filter(a => a.startTime.startsWith(today)).length;
  
  // Calculate mock revenue
  const revenue = state.appointments
    .filter(a => a.paymentStatus === 'paid')
    .reduce((sum, a) => {
        const svc = state.services.find(s => s.id === a.serviceId);
        return sum + (svc ? svc.priceCents : 0);
    }, 0);

  const kpis = [
    { label: 'Agendamentos Hoje', value: todaysCount, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Receita Total', value: `R$ ${(revenue/100).toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Base de Clientes', value: state.clients.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
            <kpi.icon size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};