import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Zap, Users, ArrowRight, Star, Menu, X, Layout, CreditCard } from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                <Calendar className="h-6 w-6" />
                <span>CronosFlow</span>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Funcionalidades</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Depoimentos</a>
              <Link to="/agendar" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Demo</Link>
              <div className="flex items-center space-x-4">
                <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Entrar</Link>
                <Link to="/admin">
                  <Button className="rounded-full px-6">Começar Agora</Button>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-4 space-y-4">
             <a href="#features" className="block text-sm font-medium text-slate-600">Funcionalidades</a>
             <Link to="/agendar" className="block text-sm font-medium text-slate-600">Ver Demo (Agendar)</Link>
             <Link to="/admin" className="block text-sm font-medium text-primary">Painel Admin</Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Gerencie tudo em um só lugar, <br className="hidden sm:block" />
            <span className="text-primary">sem complicações.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
            Agendamentos, formulários, fluxo de clientes e automações em uma plataforma simples, rápida e inteligente.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/admin">
              <Button className="w-full sm:w-auto px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link to="/agendar">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg rounded-full bg-white hover:bg-slate-50">
                Ver Demonstração
              </Button>
            </Link>
          </div>

          {/* CSS Mockup of Dashboard */}
          <div className="relative mx-auto max-w-5xl rounded-2xl bg-slate-900 p-2 sm:p-4 shadow-2xl ring-1 ring-slate-900/10">
            <div className="relative rounded-xl bg-slate-50 overflow-hidden aspect-[16/9] flex">
               {/* Mockup Sidebar */}
               <div className="hidden sm:flex w-48 bg-white border-r border-slate-200 flex-col p-4 space-y-4">
                  <div className="h-6 w-24 bg-slate-100 rounded animate-pulse"></div>
                  <div className="space-y-2 pt-4">
                    <div className="h-8 w-full bg-indigo-50 rounded flex items-center px-2"><div className="h-4 w-4 bg-primary rounded-full mr-2"></div><div className="h-2 w-16 bg-indigo-200 rounded"></div></div>
                    <div className="h-8 w-full bg-white rounded flex items-center px-2"><div className="h-4 w-4 bg-slate-200 rounded-full mr-2"></div><div className="h-2 w-20 bg-slate-100 rounded"></div></div>
                    <div className="h-8 w-full bg-white rounded flex items-center px-2"><div className="h-4 w-4 bg-slate-200 rounded-full mr-2"></div><div className="h-2 w-12 bg-slate-100 rounded"></div></div>
                  </div>
               </div>
               
               {/* Mockup Content */}
               <div className="flex-1 p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-slate-200 rounded"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                        <div className="h-8 w-8 bg-primary rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-white rounded-lg border border-slate-100 shadow-sm p-4 space-y-2">
                        <div className="h-8 w-8 bg-blue-50 rounded-lg"></div>
                        <div className="h-4 w-12 bg-slate-100 rounded"></div>
                        <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-24 bg-white rounded-lg border border-slate-100 shadow-sm p-4 space-y-2">
                        <div className="h-8 w-8 bg-green-50 rounded-lg"></div>
                        <div className="h-4 w-12 bg-slate-100 rounded"></div>
                        <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-24 bg-white rounded-lg border border-slate-100 shadow-sm p-4 space-y-2">
                        <div className="h-8 w-8 bg-purple-50 rounded-lg"></div>
                        <div className="h-4 w-12 bg-slate-100 rounded"></div>
                        <div className="h-6 w-16 bg-slate-200 rounded"></div>
                    </div>
                  </div>

                  <div className="h-64 bg-white rounded-lg border border-slate-100 shadow-sm p-4">
                     <div className="h-4 w-32 bg-slate-100 rounded mb-4"></div>
                     <div className="space-y-3">
                        <div className="h-12 w-full bg-slate-50 rounded border border-slate-100 flex items-center px-4 justify-between">
                            <div className="h-3 w-24 bg-slate-200 rounded"></div>
                            <div className="h-6 w-16 bg-green-100 rounded-full"></div>
                        </div>
                        <div className="h-12 w-full bg-slate-50 rounded border border-slate-100 flex items-center px-4 justify-between">
                            <div className="h-3 w-32 bg-slate-200 rounded"></div>
                            <div className="h-6 w-16 bg-yellow-100 rounded-full"></div>
                        </div>
                        <div className="h-12 w-full bg-slate-50 rounded border border-slate-100 flex items-center px-4 justify-between">
                            <div className="h-3 w-20 bg-slate-200 rounded"></div>
                            <div className="h-6 w-16 bg-green-100 rounded-full"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tudo o que você precisa</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Uma suíte completa de ferramentas para modernizar seu atendimento.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-amber-500" />}
              title="Simples e Intuitivo"
              description="Comece em minutos. Interface limpa que não requer treinamento complexo para sua equipe."
            />
            <FeatureCard 
              icon={<Layout className="text-blue-500" />}
              title="100% Automatizado"
              description="Confirmações, lembretes e reagendamentos acontecem sem você precisar mover um dedo."
            />
            <FeatureCard 
              icon={<CreditCard className="text-green-500" />}
              title="Pagamentos Integrados"
              description="Receba via PIX ou Cartão no momento do agendamento e reduza a inadimplência a zero."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Como funciona</h2>
              <div className="space-y-8">
                <Step number="1" title="Crie sua conta" desc="Configure seus serviços e disponibilidade em segundos." />
                <Step number="2" title="Compartilhe seu link" desc="Envie para clientes ou coloque na bio do Instagram." />
                <Step number="3" title="Receba agendamentos" desc="Veja sua agenda encher automaticamente." />
              </div>
              <div className="mt-8">
                <Link to="/agendar">
                    <Button variant="outline" className="flex items-center gap-2">
                        Ver exemplo ao vivo <ArrowRight size={16} />
                    </Button>
                </Link>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-8 flex items-center justify-center aspect-square">
               {/* Abstract Calendar Visual */}
               <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 space-y-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex justify-between items-center mb-4">
                      <div className="font-bold text-lg text-slate-800">Setembro 2024</div>
                      <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-red-400"></div>
                          <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                          <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                      {[...Array(7)].map((_, i) => <div key={i} className="h-6 bg-slate-100 rounded text-center text-xs flex items-center justify-center text-slate-400">D</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                      {[...Array(28)].map((_, i) => (
                          <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-xs ${i === 14 ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-400'}`}>
                              {i+1}
                          </div>
                      ))}
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-100">
                          <CheckCircle className="text-green-600 h-5 w-5" />
                          <div className="text-sm">
                              <span className="font-semibold text-green-900">Novo Agendamento</span>
                              <div className="text-green-700">João Silva - 14:00</div>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-12">Quem usa, recomenda</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <TestimonialCard 
                    quote="Economizou 2h por dia do meu atendimento. Não vivo mais sem."
                    author="Ana Clara"
                    role="Psicóloga"
                />
                <TestimonialCard 
                    quote="Meus clientes adoram a facilidade de agendar pelo celular."
                    author="Marcos Souza"
                    role="Personal Trainer"
                />
                <TestimonialCard 
                    quote="A integração com o Google Agenda funciona perfeitamente."
                    author="Júlia Lima"
                    role="Consultora"
                />
            </div>
            <div className="mt-16 pt-8 border-t border-slate-800 text-slate-400 text-sm">
                +12.000 profissionais confiam no CronosFlow
            </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-primary">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Comece a automatizar hoje mesmo</h2>
            <p className="text-indigo-100 text-lg mb-10">Nada para instalar. Sem complexidade. 100% online.</p>
            <Link to="/admin">
                <button className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg">
                    Criar Conta Grátis
                </button>
            </Link>
         </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <Calendar className="h-6 w-6 text-primary" />
                <span>CronosFlow</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
                <a href="#" className="hover:text-primary">Sobre</a>
                <a href="#" className="hover:text-primary">Termos</a>
                <a href="#" className="hover:text-primary">Privacidade</a>
                <a href="#" className="hover:text-primary">Suporte</a>
            </div>
            <div className="text-sm text-slate-400">
                © {new Date().getFullYear()} CronosFlow.
            </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 text-2xl">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);

const Step: React.FC<{number: string, title: string, desc: string}> = ({ number, title, desc }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 text-primary font-bold flex items-center justify-center">
            {number}
        </div>
        <div>
            <h4 className="font-bold text-slate-900 text-lg">{title}</h4>
            <p className="text-slate-600">{desc}</p>
        </div>
    </div>
);

const TestimonialCard: React.FC<{quote: string, author: string, role: string}> = ({ quote, author, role }) => (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div className="flex text-amber-400 mb-4 justify-center">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
        </div>
        <p className="text-slate-300 mb-6 italic">"{quote}"</p>
        <div>
            <div className="font-bold text-white">{author}</div>
            <div className="text-slate-500 text-sm">{role}</div>
        </div>
    </div>
);
