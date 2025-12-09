
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlan } from '../hooks/usePlan';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Check, Star, Shield, Zap, CreditCard, QrCode, Lock, Copy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpgradePage: React.FC = () => {
  const { upgradePlan } = useAuth();
  const { isPro } = usePlan();
  const navigate = useNavigate();
  
  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const handleUpgradeClick = () => {
    setIsCheckoutOpen(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Simulate API processing delay
    setTimeout(() => {
        setIsProcessing(false);
        setIsCheckoutOpen(false);
        upgradePlan();
        alert("Pagamento confirmado com sucesso! Bem-vindo ao CronosFlow Pro.");
        navigate('/admin');
    }, 2000);
  };

  if (isPro) {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 inline-block mb-8 shadow-sm">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={32} fill="currentColor" />
                </div>
                <h1 className="text-3xl font-bold text-green-900 mb-2">Você é PRO!</h1>
                <p className="text-green-700">Obrigado por apoiar o CronosFlow. Você tem acesso ilimitado a todos os recursos.</p>
            </div>
            <div>
                <Button variant="outline" onClick={() => navigate('/admin')}>Voltar ao Dashboard</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Desbloqueie todo o potencial</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Automatize sua agenda, reduza faltas e fidelize clientes com o plano profissional.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900">Gratuito</h3>
                <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900">R$ 0</span>
                    <span className="ml-1 text-slate-500">/mês</span>
                </div>
                <p className="mt-2 text-slate-500">Para quem está começando agora.</p>
            </div>
            
            <ul className="space-y-4 mb-8">
                <FeatureItem text="Até 20 agendamentos/mês" />
                <FeatureItem text="Até 3 serviços cadastrados" />
                <FeatureItem text="1 Profissional" />
                <FeatureItem text="Link de agendamento público" />
                <FeatureItem text="E-mail de confirmação básico" />
                <FeatureItem text="Integrações externas" included={false} />
                <FeatureItem text="WhatsApp automático" included={false} />
            </ul>

            <Button variant="outline" className="w-full" disabled>
                Plano Atual
            </Button>
        </div>

        {/* Pro Plan */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-white relative overflow-hidden transform md:-translate-y-4 shadow-2xl">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                RECOMENDADO
            </div>
            
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white">Profissional</h3>
                <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-white">R$ 19,90</span>
                    <span className="ml-1 text-slate-400">/mês</span>
                </div>
                <p className="mt-2 text-indigo-200">Para quem quer crescer de verdade.</p>
            </div>
            
            <ul className="space-y-4 mb-8">
                <FeatureItem text="Agendamentos Ilimitados" light />
                <FeatureItem text="Serviços Ilimitados" light />
                <FeatureItem text="Sincronização com Google Calendar" light />
                <FeatureItem text="Lembretes via WhatsApp (24h e 1h)" light />
                <FeatureItem text="CRM Completo de Clientes" light />
                <FeatureItem text="Relatórios Financeiros" light />
                <FeatureItem text="Suporte Prioritário" light />
            </ul>

            <Button 
                variant="primary" 
                className="w-full py-4 text-lg font-bold bg-indigo-500 hover:bg-indigo-400 border-none shadow-lg hover:shadow-indigo-500/25 transition-all"
                onClick={handleUpgradeClick}
            >
                Assinar Agora
            </Button>
            <p className="text-xs text-center text-slate-400 mt-4">Cancele quando quiser. Sem fidelidade.</p>
        </div>
      </div>
      
      <div className="mt-20 grid md:grid-cols-3 gap-8">
         <Benefit icon={Zap} title="Zero No-Show" desc="Reduza em até 80% as faltas com lembretes automáticos no WhatsApp." />
         <Benefit icon={Shield} title="Dados Seguros" desc="Seus dados e de seus clientes protegidos com criptografia de ponta." />
         <Benefit icon={Star} title="Sua Marca" desc="Remova a marca d'água do CronosFlow e use sua própria identidade." />
      </div>

      {/* Checkout Modal */}
      <Modal 
        open={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        title="Finalizar Assinatura Pro"
      >
        <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-slate-900">CronosFlow Pro</h4>
                    <p className="text-sm text-slate-500">Cobrança mensal recorrente</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary">R$ 19,90</div>
                    <div className="text-xs text-slate-500">/mês</div>
                </div>
            </div>

            {/* Payment Method Selector */}
            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Como deseja pagar?</label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${
                            paymentMethod === 'credit_card' 
                            ? 'border-primary bg-indigo-50 text-primary' 
                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                    >
                        <CreditCard size={28} />
                        <span className="text-sm font-medium">Cartão de Crédito</span>
                    </button>
                    <button 
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${
                            paymentMethod === 'pix' 
                            ? 'border-primary bg-indigo-50 text-primary' 
                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                    >
                        <QrCode size={28} />
                        <span className="text-sm font-medium">PIX</span>
                    </button>
                </div>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === 'credit_card' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <Input 
                        label="Nome no Cartão" 
                        placeholder="COMO NO CARTAO" 
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                    />
                    <Input 
                        label="Número do Cartão" 
                        placeholder="0000 0000 0000 0000" 
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Validade" 
                            placeholder="MM/AA" 
                            value={cardExpiry}
                            onChange={e => setCardExpiry(e.target.value)}
                        />
                        <Input 
                            label="CVC" 
                            placeholder="123" 
                            value={cardCvc}
                            onChange={e => setCardCvc(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                        <Shield size={12} className="text-green-600" />
                        Transação processada via Stripe/MercadoPago
                    </div>
                </div>
            )}

            {/* PIX View */}
            {paymentMethod === 'pix' && (
                <div className="text-center space-y-4 py-4 animate-in fade-in slide-in-from-top-2">
                    <div className="mx-auto w-48 h-48 bg-white border-2 border-slate-900 rounded-xl p-2 flex items-center justify-center shadow-sm relative overflow-hidden group">
                        {/* Mock QR Code Visual */}
                        <div className="absolute inset-0 bg-white flex items-center justify-center">
                            <div className="w-40 h-40 bg-slate-900" style={{
                                maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20,20 h20 v20 h-20 z M60,20 h20 v20 h-20 z M20,60 h20 v20 h-20 z M50,50 h10 v10 h-10 z\' fill=\'black\' /%3E%3C/svg%3E")',
                                maskSize: 'cover',
                                WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20,20 h20 v20 h-20 z M60,20 h20 v20 h-20 z M20,60 h20 v20 h-20 z M50,50 h10 v10 h-10 z\' fill=\'black\' /%3E%3C/svg%3E")',
                                WebkitMaskSize: 'cover',
                                backgroundImage: 'radial-gradient(circle, transparent 20%, #000 20%, #000 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #000 20%, #000 80%, transparent 80%, transparent)',
                                backgroundSize: '10px 10px'
                            }}></div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">
                            Escaneie com o app do seu banco
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Aprovação imediata
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
                        <code className="text-xs text-slate-600 flex-1 truncate font-mono">
                            00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000
                        </code>
                        <div className="text-primary text-xs font-bold flex items-center gap-1">
                            <Copy size={14} /> Copiar
                        </div>
                    </div>
                </div>
            )}

            {/* Secure Badge & Action */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 py-2 rounded">
                    <Lock size={12} className="text-green-600" />
                    Ambiente 100% seguro. Seus dados estão protegidos.
                </div>
                <Button 
                    className="w-full py-4 text-lg font-bold shadow-lg hover:shadow-primary/25" 
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processando Pagamento...' : `Confirmar Assinatura`}
                </Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

const FeatureItem: React.FC<{text: string, included?: boolean, light?: boolean}> = ({ text, included = true, light = false }) => (
    <li className="flex items-center gap-3">
        {included ? (
            <div className={`p-1 rounded-full ${light ? 'bg-indigo-500/30 text-indigo-300' : 'bg-green-100 text-green-600'}`}>
                <Check size={12} />
            </div>
        ) : (
            <div className="p-1 rounded-full bg-slate-100 text-slate-400">
                <Check size={12} />
            </div>
        )}
        <span className={`text-sm ${!included ? 'text-slate-400 line-through' : light ? 'text-slate-200' : 'text-slate-700'}`}>
            {text}
        </span>
    </li>
);

const Benefit: React.FC<{icon: any, title: string, desc: string}> = ({ icon: Icon, title, desc }) => (
    <div className="text-center p-6 bg-white rounded-xl border border-slate-100 hover:border-primary/20 transition-all hover:shadow-lg">
        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
            <Icon size={24} />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{desc}</p>
    </div>
);
