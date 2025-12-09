import React from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { DashboardKPIs } from '../components/admin/DashboardKPIs';
import { ProfessionalCalendar } from '../components/admin/Calendar/ProfessionalCalendar';
import { ServiceManager } from '../components/admin/ServiceManager';
import { ClientManager } from '../components/admin/ClientManager';
import { IntegrationsView } from '../components/admin/settings/IntegrationsView';
import { NotificationsView } from '../components/admin/settings/NotificationsView';
import { LogsView } from '../components/admin/settings/LogsView';
import { SmartInsights } from '../components/admin/SmartInsights';
import { UpgradePage } from './UpgradePage';

// Sub-component for the main dashboard view
const DashboardHome = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Column */}
        <div className="lg:col-span-2 space-y-6">
            <DashboardKPIs />
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900">Atividade Recente</h3>
                    <NavLink to="/admin/calendar" className="text-sm text-primary hover:underline">Ver agenda</NavLink>
                </div>
                <div className="space-y-4">
                     {/* Mini activity feed mock */}
                    <div className="flex items-center gap-3 text-sm p-2 hover:bg-slate-50 rounded transition-colors">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-900 font-medium">João Silva</span>
                        <span className="text-slate-500">agendou "Consulta Rápida" para amanhã às 14:00</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-2 hover:bg-slate-50 rounded transition-colors">
                        <div className="h-2 w-2 bg-red-400 rounded-full"></div>
                        <span className="text-slate-900 font-medium">Maria Pereira</span>
                        <span className="text-slate-500">cancelou o agendamento de hoje</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar Column (Insights) */}
        <div className="space-y-6">
            <SmartInsights />
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Dica do Dia</h3>
                <p className="text-sm text-slate-600">
                    Mantenha sua agenda organizada configurando os intervalos de buffer entre serviços para evitar atrasos.
                </p>
            </div>
        </div>
    </div>
  </div>
);

const SettingsLayout = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        
        {/* Settings Navigation Tabs */}
        <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
                <NavLink 
                    to="/admin/settings" 
                    end 
                    className={({ isActive }) => `
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${isActive ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                    `}
                >
                    Integrações
                </NavLink>
                <NavLink 
                    to="/admin/settings/notifications" 
                    className={({ isActive }) => `
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${isActive ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                    `}
                >
                    Notificações
                </NavLink>
                <NavLink 
                    to="/admin/settings/logs" 
                    className={({ isActive }) => `
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${isActive ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                    `}
                >
                    Logs de Envio
                </NavLink>
            </nav>
        </div>
        
        <Routes>
            <Route path="/" element={<IntegrationsView />} />
            <Route path="/notifications" element={<NotificationsView />} />
            <Route path="/logs" element={<LogsView />} />
        </Routes>
    </div>
);

export const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/calendar" element={<ProfessionalCalendar />} />
        <Route path="/services" element={<ServiceManager />} />
        <Route path="/clients" element={<ClientManager />} />
        <Route path="/upgrade" element={<UpgradePage />} />
        
        {/* Settings Sub-routes */}
        <Route path="/settings/*" element={<SettingsLayout />} />
        
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};
