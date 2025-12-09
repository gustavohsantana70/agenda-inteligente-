import React from 'react';
import { useBooking } from '../../../context/BookingContext';
import { Mail, MessageCircle, Bell, Clock } from 'lucide-react';
import { NotificationRule } from '../../../types';

export const NotificationsView: React.FC = () => {
  const { state, dispatch } = useBooking();

  const toggleRule = (id: string) => {
    dispatch({ type: 'TOGGLE_RULE', payload: id });
  };

  const RuleItem: React.FC<{ rule: NotificationRule }> = ({ rule }) => {
    let icon = <Mail size={18} />;
    let label = '';
    
    if (rule.channel === 'whatsapp') icon = <MessageCircle size={18} />;
    if (rule.channel === 'push') icon = <Bell size={18} />;

    switch(rule.trigger) {
        case 'created': label = 'Ao criar agendamento'; break;
        case 'confirmed': label = 'Ao confirmar agendamento'; break;
        case 'reminder_24h': label = 'Lembrete (24h antes)'; break;
        case 'reminder_1h': label = 'Lembrete (1h antes)'; break;
        case 'cancelled': label = 'Ao cancelar'; break;
        default: label = rule.trigger;
    }

    return (
        <div className="flex items-center justify-between p-4 border border-slate-100 rounded-lg bg-white hover:border-indigo-100 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${rule.active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    {icon}
                </div>
                <div>
                    <div className="font-medium text-slate-900">{label}</div>
                    <div className="text-xs text-slate-500 uppercase">{rule.channel}</div>
                </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={rule.active}
                    onChange={() => toggleRule(rule.id)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
        </div>
    );
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Regras de Notificação</h2>
        <p className="text-slate-500 text-sm">Defina quando e como seus clientes serão notificados.</p>
      </div>

      <div className="space-y-6">
        <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
                <Clock size={14} /> Confirmação e Status
            </h3>
            <div className="space-y-3">
                {state.notificationRules.filter(r => ['created', 'confirmed', 'cancelled'].includes(r.trigger)).map(rule => (
                    <RuleItem key={rule.id} rule={rule} />
                ))}
            </div>
        </div>

        <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
                <Clock size={14} /> Lembretes Automáticos
            </h3>
            <div className="space-y-3">
                {state.notificationRules.filter(r => ['reminder_24h', 'reminder_1h'].includes(r.trigger)).map(rule => (
                    <RuleItem key={rule.id} rule={rule} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};