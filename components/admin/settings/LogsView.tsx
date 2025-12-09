
import React from 'react';
import { useBooking } from '../../../context/BookingContext';
import { format, parseISO } from 'date-fns';
import { Mail, MessageCircle, Check, AlertCircle } from 'lucide-react';

export const LogsView: React.FC = () => {
  const { state } = useBooking();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Logs de Envio</h2>
        <p className="text-slate-500 text-sm">Histórico de mensagens enviadas pelo sistema.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Canal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Gatilho</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {state.notificationLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {format(parseISO(log.sentAt), "dd/MM HH:mm")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            {log.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                {log.channel === 'email' ? <Mail size={14} /> : <MessageCircle size={14} />}
                                <span className="capitalize">{log.channel}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs border border-slate-200">
                                {log.trigger}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {log.status === 'sent' ? (
                                <span className="flex items-center text-green-600 gap-1 text-xs font-medium bg-green-50 px-2 py-1 rounded-full w-fit">
                                    <Check size={12} /> Enviado
                                </span>
                            ) : (
                                <span className="flex items-center text-red-600 gap-1 text-xs font-medium bg-red-50 px-2 py-1 rounded-full w-fit">
                                    <AlertCircle size={12} /> Falha
                                </span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {state.notificationLogs.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
                Nenhum log registrado ainda.
            </div>
        )}
      </div>
    </div>
  );
};
