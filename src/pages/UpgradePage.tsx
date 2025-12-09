import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlan } from '../hooks/usePlan';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Check, CreditCard, QrCode, Lock, Copy, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingTier {
  name: string;
  price: number | 'Custom';
  description: string;
  features: string[];
  recommended?: boolean;
  buttonText?: string;
  includesPrevious?: string;
  color?: string;
}

export const UpgradePage: React.FC = () => {
  const { subscribe } = useAuth();
  const { isPro } = usePlan(); // "isPro" usually means paid in this context
  const navigate = useNavigate();
  
  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const plans: PricingTier[] = [
    {
      name: 'Starter',
      price: 19.90,
      description: 'Coloque sua empresa para funcionar com nosso plano inicial.',
      buttonText: 'ASSINAR STARTER',
      features: [
        'Agendamento feito pelo cliente',
        'Serviços e sessões ilimitados',
        '1 calendário para agendamentos',
        'Processamento de pagamentos',
        'Confirmação por e-mail'
      ]
    },
    {
      name: 'Padrão',
      price: 49.90,
      recommended: true,
      description: 'Faça sua empresa crescer com mais formas de envolver os clientes.',
      buttonText: 'ASSINAR PADRÃO',
      includesPrevious: 'Todos os recursos do Starter mais',
      features: [
        'Até 6 calendários',
        'Lembretes por WhatsApp (Z-API)',
        'Pacotes de sessões e Assinaturas',
        'Vales-presente',
        'Personalização de marca (White-label)'
      ]
    },
    {
      name: 'Premium',
      price: 89.90,
      description: 'Amplie sua empresa com todas as ferramentas de agendamento.',
      buttonText: 'ASSINAR PREMIUM',
      includesPrevious: 'Todos os recursos do Padrão mais',
      features: [
        'Calendários ilimitados',
        'API para desenvolvedores',
        'CSS personalizado',
        'Conformidade HIPAA (Simulado)',
        'Múltiplos locais e fusos horários'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Soluções personalizadas para seus negócios empresariais.',
      buttonText: 'FALAR COM VENDAS',
      includesPrevious: 'Todos os recursos do Premium mais',
      features: [
        'Gerente de conta dedicado',
        'SSO (Single Sign-On)',
        'SLA garantido',
        'Auditoria de logs avançada'
      ]
    }
  ];

  const handleSelectPlan = (plan: PricingTier) => {
    if (plan.price === 'Custom') {
      window.location.href = 'mailto:vendas@cronosflow.app';
      return;
    }
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    // Simulate API processing delay
    setTimeout(() => {
        setIsProcessing(false);
        setIsCheckoutOpen(false);
        
        // Trigger generic subscribe/upgrade logic
        // In a real app, we would store the specific plan ID
        subscribe(); 
        
        alert(`Assinatura do plano ${selectedPlan?.name} confirmada! Bem-vindo.`);
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
                <h1 className="text-3xl font-bold text-green-900 mb-2">Você já é assinante!</h1>
                <p className="text-green-700">Obrigado por confiar no CronosFlow. Você tem acesso aos recursos do seu plano.</p>
            </div>
            <div>
                <Button variant="outline" onClick={() => navigate('/admin')}>Voltar ao Dashboard</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Escolha seu plano</h1>
        <p className="text-xl text-slate-600">
            Experimente gratuitamente por 7 dias. Não é necessário cartão de crédito para testar.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-start">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative flex flex-col bg-white border shadow-sm transition-all duration-300 hover:shadow-xl ${
                plan.recommended ? 'border-sky-500 ring-1 ring-sky-500 pt-0 mt-[-16px] z-10' : 'border-slate-200 mt-0'
            }`}
          >
            {plan.recommended && (
                <div className="bg-sky-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-wider w-full">
                    Recomendado
                </div>
            )}

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-serif font-medium text-slate-900 mb-2">{plan.name}</h3>
                
                <div className="mb-4">
                    {typeof plan.price === 'number' ? (
                        <div className="flex items-baseline">
                            <span className="text-4xl font-bold text-slate-900">R${plan.price.toFixed(2).replace('.', ',')}</span>
                            <span className="text-slate-500 ml-1">/mês</span>
                        </div>
                    ) : (
                        <div className="text-4xl font-bold text-slate-900">{plan.price}</div>
                    )}
                    {typeof plan.price === 'number' && (
                        <p className="text-xs text-blue-600 mt-1">Economize 10% a cada ano</p>
                    )}
                </div>

                <p className="text-slate-600 text-sm mb-6 min-h-[40px]">
                    {plan.description}
                </p>

                <button 
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-3 px-4 rounded-md text-sm font-bold uppercase tracking-wider transition-colors mb-8 ${
                        plan.price === 'Custom' 
                        ? 'bg-slate-900 text-white hover:bg-slate-800' 
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                >
                    {plan.buttonText || 'ASSINAR'}
                </button>

                {/* Features List */}
                <div className="flex-1 space-y-4">
                    {plan.includesPrevious && (
                        <p className="text-xs font-bold text-blue-600 uppercase mb-2">
                            {plan.includesPrevious}
                        </p>
                    )}
                    <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                <Check size={16} className="text-slate-900 flex-shrink-0 mt-0.5" />
                                <span className="leading-snug">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Checkout Modal */}
      <Modal 
        open={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        title="Finalizar Assinatura"
      >
        <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-slate-900 text-lg">Plano {selectedPlan?.name}</h4>
                    <p className="text-sm text-slate-500">Cobrança mensal</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                        {typeof selectedPlan?.price === 'number' ? `R$ ${selectedPlan.price.toFixed(2).replace('.', ',')}` : ''}
                    </div>
                </div>
            </div>

            {/* Payment Method Selector */}
            <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Método de pagamento</label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${
                            paymentMethod === 'credit_card' 
                            ? 'border-slate-900 bg-slate-50 text-slate-900' 
                            : 'border-slate-100 hover:border-slate-300 text-slate-500'
                        }`}
                    >
                        <CreditCard size={24} />
                        <span className="text-sm font-medium">Cartão</span>
                    </button>
                    <button 
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${
                            paymentMethod === 'pix' 
                            ? 'border-slate-900 bg-slate-50 text-slate-900' 
                            : 'border-slate-100 hover:border-slate-300 text-slate-500'
                        }`}
                    >
                        <QrCode size={24} />
                        <span className="text-sm font-medium">PIX</span>
                    </button>
                </div>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === 'credit_card' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <Input 
                        label="Nome no Cartão" 
                        placeholder="NOME IMPRESSO" 
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
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <Lock size={10} /> Pagamento processado via Stripe
                    </div>
                </div>
            )}

            {/* PIX View */}
            {paymentMethod === 'pix' && (
                <div className="text-center space-y-4 py-4 animate-in fade-in slide-in-from-top-2">
                    <div className="mx-auto w-40 h-40 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-inner relative">
                        <div className="absolute inset-2 bg-slate-900" style={{
                             maskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20,20 h20 v20 h-20 z M60,20 h20 v20 h-20 z M20,60 h20 v20 h-20 z M50,50 h10 v10 h-10 z\' fill=\'black\' /%3E%3C/svg%3E")',
                             maskSize: 'cover',
                             WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20,20 h20 v20 h-20 z M60,20 h20 v20 h-20 z M20,60 h20 v20 h-20 z M50,50 h10 v10 h-10 z\' fill=\'black\' /%3E%3C/svg%3E")',
                             WebkitMaskSize: 'cover'
                        }}></div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-lg border border-slate-200">
                        <code className="text-xs text-slate-600 flex-1 truncate font-mono">
                            00020126580014br.gov.bcb.pix0136123e4567-e89b...
                        </code>
                        <button className="text-black text-xs font-bold flex items-center gap-1 hover:underline">
                            <Copy size={12} /> Copiar
                        </button>
                    </div>
                </div>
            )}

            {/* Action */}
            <div className="pt-4 border-t border-slate-100">
                <Button 
                    className="w-full py-3 text-lg font-bold bg-slate-900 text-white hover:bg-slate-800" 
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Confirmando...' : `Pagar R$ ${typeof selectedPlan?.price === 'number' ? selectedPlan.price.toFixed(2).replace('.', ',') : ''}`}
                </Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
