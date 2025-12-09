import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, LayoutDashboard } from 'lucide-react';

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
        isActive ? 'bg-indigo-50 text-primary font-medium' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </Link>
  );
};

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                CronosFlow
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <NavLink to="/agendar">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Agendar (Demo)</span>
              </NavLink>
              <NavLink to="/admin">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Painel</span>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};