
import React, { createContext, useReducer, ReactNode } from 'react';
import { Appointment, Service, Client, IntegrationConfig, NotificationRule, NotificationLog } from '../types';
import { mockAppointments, mockServices, mockClients } from '../mocks/mockData';

type State = {
  services: Service[];
  appointments: Appointment[];
  clients: Client[];
  integrations: IntegrationConfig[];
  notificationRules: NotificationRule[];
  notificationLogs: NotificationLog[];
};

type Action =
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'TOGGLE_INTEGRATION'; payload: { provider: string; connected: boolean } }
  | { type: 'TOGGLE_RULE'; payload: string } // id of rule
  | { type: 'ADD_LOG'; payload: NotificationLog };

// Default Integrations
const defaultIntegrations: IntegrationConfig[] = [
  { provider: 'google_calendar', connected: false },
  { provider: 'outlook_calendar', connected: false },
  { provider: 'whatsapp', connected: true, metadata: { provider: 'Z-API' } },
];

// Default Rules
const defaultRules: NotificationRule[] = [
  { id: 'rule_1', trigger: 'created', channel: 'email', active: true, templateSubject: 'Agendamento Recebido' },
  { id: 'rule_2', trigger: 'confirmed', channel: 'whatsapp', active: true },
  { id: 'rule_3', trigger: 'reminder_24h', channel: 'email', active: true, templateSubject: 'Lembrete: Seu horário é amanhã' },
  { id: 'rule_4', trigger: 'reminder_1h', channel: 'whatsapp', active: true },
];

// Mock Logs
const defaultLogs: NotificationLog[] = [
  { id: 'log_1', appointmentId: 'apt_1', clientName: 'João Silva', channel: 'email', trigger: 'created', status: 'sent', sentAt: new Date().toISOString() },
  { id: 'log_2', appointmentId: 'apt_1', clientName: 'João Silva', channel: 'whatsapp', trigger: 'confirmed', status: 'sent', sentAt: new Date().toISOString() }
];

const initialState: State = {
  services: mockServices,
  appointments: mockAppointments,
  clients: mockClients,
  integrations: defaultIntegrations,
  notificationRules: defaultRules,
  notificationLogs: defaultLogs
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a => (a.id === action.payload.id ? action.payload : a))
      };
    case 'ADD_CLIENT':
      if (state.clients.some(c => c.email === action.payload.email)) return state;
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(c => (c.id === action.payload.id ? action.payload : c))
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.payload)
      };
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(s => (s.id === action.payload.id ? action.payload : s))
      };
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(s => s.id !== action.payload)
      };
    case 'TOGGLE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(i => 
          i.provider === action.payload.provider 
            ? { ...i, connected: action.payload.connected, lastSync: action.payload.connected ? new Date().toISOString() : undefined } 
            : i
        )
      };
    case 'TOGGLE_RULE':
      return {
        ...state,
        notificationRules: state.notificationRules.map(r => 
          r.id === action.payload ? { ...r, active: !r.active } : r
        )
      };
    case 'ADD_LOG':
      return { ...state, notificationLogs: [action.payload, ...state.notificationLogs] };
    default:
      return state;
  }
}

const BookingContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const BookingProvider = ({ children }: { children?: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <BookingContext.Provider value={{ state, dispatch }}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const ctx = React.useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
