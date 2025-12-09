
import React, { useState } from 'react';
import { useBooking } from '../../../context/BookingContext';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Modal } from '../../common/Modal';
import { Calendar, MessageCircle, CheckCircle, XCircle, RefreshCw, Loader2, AlertTriangle, CreditCard, Settings } from 'lucide-react';
import { IntegrationProvider } from '../../../types';
import { initGoogleAuth } from '../../../utils/googleCalendar';

export const IntegrationsView: React.FC = () => {
  const { state, dispatch } = useBooking();
  const [loading, setLoading] = useState<string | null>(null);
  
  // WhatsApp Config Modal State
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [whatsappConfig, setWhatsappConfig] = useState({ instanceId: '', token: '' });

  const handleConnectGoogle = () => {
    setLoading('google_calendar');
    
    const tokenClient = initGoogleAuth((response: any) => {
      if (response && response.access_token) {
        dispatch({ 
            type: 'TOGGLE_INTEGRATION', 
            payload: { 
                provider: 'google_calendar', 
                connected: true,
                metadata: {
                    accessToken: response.access_token,
                    scope: response.scope,
                    expiresIn: response.expires_in
                }
            } 
        });
        setLoading(null);
      } else {
        setLoading(null);
        alert("Falha na autenticação com o Google.");
      }
    });

    if (tokenClient) {
        tokenClient.requestAccessToken();
    } else {
        setLoading(null);
        alert("Google API não carregada.");
    }
  };

  const handleOpenWhatsappConfig = () => {
    // Load existing config if available
    const existing = state.integrations.find(i => i.provider === 'whatsapp')?.metadata;
    if (existing) {
        setWhatsappConfig({ instanceId: existing.instanceId || '', token: existing.token || '' });
    }
    setIsWhatsappModalOpen(true);
  };

  const handleSaveWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('whatsapp');
    setTimeout(() => {
        dispatch({
            type: 'TOGGLE_INTEGRATION',
            payload: {
                provider: 'whatsapp',
                connected: true,
                metadata: {
                    provider: 'Z-API',
                    instanceId: whatsappConfig.instanceId,
                    token: whatsappConfig.token
                }
            }
        });
        setLoading(null);
        setIsWhatsappModalOpen(false);
    }, 1000);
  };

  const handleDisconnect = (provider: IntegrationProvider) => {
    if(confirm('Deseja realmente desconectar?')) {
        dispatch({ type: 'TOGGLE_INTEGRATION', payload: { provider, connected: false } });
    }
  };

  const getStatus = (provider: IntegrationProvider) => {
    return state.integrations.find(i => i.provider === provider);
  };

  const IntegrationCard = ({ provider, title, icon: Icon, description, color, onConnect, onConfig }: any) => {
    const config = getStatus(provider);
    const isConnected = config?.connected;
    const isLoading = loading === provider;

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
            
            <div className="flex gap-2">
                {isConnected ? (
                    <Button 
                        variant="outline" 
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDisconnect(provider)}
                    >
                        Desconectar
                    </Button>
                ) : (
                    <Button 
                        variant="primary" 
                        className="flex-1"
                        onClick={onConnect}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                        {isLoading ? 'Conectando...' : 'Conectar'}
                    </Button>
                )}
                {/* Config button for connected or complex integrations */}
                {(onConfig || isConnected) && (
                    <Button 
                        variant="outline"
                        className="px-3"
                        onClick={onConfig || onConnect}
                        title="Configurações"
                    >
                        <Settings size={18} className="text-slate-600" />
                    </Button>
                )}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Canais de Integração</h2>
      
      {!(import.meta as any).env?.VITE_GOOGLE_CLIENT_ID && (
         <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
                <strong>Configuração necessária:</strong> Para testar a integração do Google Calendar, configure <code>VITE_GOOGLE_CLIENT_ID</code>.
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IntegrationCard 
            provider="google_calendar"
            title="Google Calendar"
            description="Sincronização bidirecional de eventos."
            icon={Calendar}
            color="bg-blue-600"
            onConnect={handleConnectGoogle}
        />
        <IntegrationCard 
            provider="whatsapp"
            title="WhatsApp Gateway"
            description="Envio automático de lembretes via API (Z-API/Twilio)."
            icon={MessageCircle}
            color="bg-green-600"
            onConnect={handleOpenWhatsappConfig}
            onConfig={handleOpenWhatsappConfig}
        />
        <IntegrationCard 
            provider="mercadopago"
            title="Pagamentos Online"
            description="Receba de seus clientes via PIX e Cartão (Stripe/Mercado Pago)."
            icon={CreditCard}
            color="bg-sky-600"
            onConnect={() => alert('Em breve: Configuração de chaves de API do Mercado Pago.')}
        />
      </div>

      {/* WhatsApp Configuration Modal */}
      <Modal 
        open={isWhatsappModalOpen} 
        onClose={() => setIsWhatsappModalOpen(false)} 
        title="Configurar WhatsApp Gateway"
      >
        <form onSubmit={handleSaveWhatsapp} className="space-y-4">
            <p className="text-sm text-slate-500 mb-4">
                Insira as credenciais da sua API de WhatsApp (ex: Z-API, Twilio ou Evolution API) para habilitar o envio automático.
            </p>
            <Input 
                label="ID da Instância (Instance ID)"
                placeholder="Ex: 3B92C..."
                value={whatsappConfig.instanceId}
                onChange={e => setWhatsappConfig({...whatsappConfig, instanceId: e.target.value})}
                required
            />
            <Input 
                label="Token de Acesso"
                placeholder="Ex: 8A29F..."
                type="password"
                value={whatsappConfig.token}
                onChange={e => setWhatsappConfig({...whatsappConfig, token: e.target.value})}
                required
            />
            <div className="bg-slate-50 p-3 rounded text-xs text-slate-500">
                <p>O sistema simulará o envio se as credenciais estiverem preenchidas.</p>
            </div>
            <div className="flex justify-end pt-2">
                <Button type="submit">
                    {loading === 'whatsapp' ? 'Validando...' : 'Salvar e Conectar'}
                </Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};
