
import React from 'react';
import { useBooking } from '../../../context/BookingContext';
import { Button } from '../../common/Button';
import { Calendar, MessageCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { IntegrationProvider } from '../../../types';

export const IntegrationsView: React.FC = () => {
  const { state, dispatch } = useBooking();

  const handleToggle = (provider: IntegrationProvider, connected: boolean) => {
    // Simulate API call delay
    setTimeout(() => {
        dispatch({ type: 'TOGGLE_INTEGRATION', payload: { provider, connected } });
    }, 600);
  };

  const getStatus = (provider: IntegrationProvider) => {
    return state.integrations.find(i => i.provider === provider);
  };

  const IntegrationCard = ({ provider, title, icon: Icon, description, color }: any) => {
    const config = getStatus(provider);
    const isConnected = config?.connected;

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
             <div className={`p-3 rounded-lg ${color} text-white`}>
                <Icon size={24} />
             </div>
             {isConnected ? (
                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    <CheckCircle size={12} /> Conectado
                 </span>
             ) : (
                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                    <XCircle size={12} /> Desconectado
                 </span>
             )}
          </div>
          <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-slate-500 mb-6">{description}</p>
        </div>
        
        <div>
            {isConnected && config.lastSync && (
                <div className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                    <RefreshCw size={10} /> Sincronizado: {new Date(config.lastSync).toLocaleTimeString()}
                </div>
            )}
            <Button 
                variant={isConnected ? 'outline' : 'primary'} 
                className={`w-full ${isConnected ? 'border-red-200 text-red-600 hover:bg-red-50' : ''}`}
                onClick={() => handleToggle(provider, !isConnected)}
            >
                {isConnected ? 'Desconectar' : 'Conectar Agora'}
            </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Canais de Integração</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IntegrationCard 
            provider="google_calendar"
            title="Google Calendar"
            description="Sincronização bidirecional. Eventos criados no CronosFlow vão para o Google e vice-versa."
            icon={Calendar}
            color="bg-blue-600"
        />
        <IntegrationCard 
            provider="outlook_calendar"
            title="Outlook Calendar"
            description="Integração com Microsoft 365. Ideal para ambientes corporativos."
            icon={Calendar}
            color="bg-sky-600"
        />
        <IntegrationCard 
            provider="whatsapp"
            title="WhatsApp Gateway"
            description="Envio automático de lembretes e confirmações via API (Z-API, Twilio ou Meta)."
            icon={MessageCircle}
            color="bg-green-600"
        />
      </div>
    </div>
  );
};
