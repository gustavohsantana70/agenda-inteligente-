
import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { Appointment, Service, Client, IntegrationConfig, NotificationRule, NotificationLog } from '../types';
import { mockAppointments, mockServices, mockClients } from '../mocks/mockData';
import { differenceInMinutes, parseISO, subMinutes } from 'date-fns';
import { sendWhatsAppMessage } from '../utils/whatsapp';
import { uuidv4 } from '../utils/helpers';

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
  | { type: 'TOGGLE_INTEGRATION'; payload: { provider: string; connected: boolean; metadata?: any } }
  | { type: 'TOGGLE_RULE'; payload: string } // id of rule
  | { type: 'ADD_LOG'; payload: NotificationLog };

// Default Integrations
const defaultIntegrations: IntegrationConfig[] = [
  { provider: 'google_calendar', connected: false },
  { provider: 'outlook_calendar', connected: false },
  { provider: 'whatsapp', connected: false, metadata: { provider: 'Z-API', instanceId: '', token: '' } },
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
            ? { 
                ...i, 
                connected: action.payload.connected, 
                lastSync: action.payload.connected ? new Date().toISOString() : undefined,
                metadata: action.payload.metadata || i.metadata
              } 
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

  // Simulated Cron Job for Reminders (Runs every 30 seconds)
  useEffect(() => {
    const checkReminders = async () => {
      const now = new Date();
      const whatsappConfig = state.integrations.find(i => i.provider === 'whatsapp');
      
      if (!whatsappConfig?.connected) return;

      const rule24h = state.notificationRules.find(r => r.trigger === 'reminder_24h' && r.active);
      const rule1h = state.notificationRules.find(r => r.trigger === 'reminder_1h' && r.active);

      if (!rule24h && !rule1h) return;

      state.appointments.forEach(async (appt) => {
        if (appt.status !== 'confirmed') return;

        const start = parseISO(appt.startTime);
        const diffMinutes = differenceInMinutes(start, now);
        const remindersSent = appt.remindersSent || [];

        // Check 24h (1440 mins) - Allow 10 min window
        if (rule24h && !remindersSent.includes('24h') && diffMinutes > 1430 && diffMinutes < 1450) {
           const client = state.clients.find(c => c.id === appt.clientId);
           const service = state.services.find(s => s.id === appt.serviceId);
           if (client && service) {
             const success = await sendWhatsAppMessage(client, `Olá ${client.name}, seu agendamento de ${service.name} é amanhã às ${start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`, whatsappConfig.metadata);
             
             if (success) {
               dispatch({ 
                 type: 'UPDATE_APPOINTMENT', 
                 payload: { ...appt, remindersSent: [...remindersSent, '24h'] } 
               });
               dispatch({
                 type: 'ADD_LOG',
                 payload: { id: uuidv4(), appointmentId: appt.id, clientName: client.name, channel: 'whatsapp', trigger: 'reminder_24h', status: 'sent', sentAt: new Date().toISOString() }
               });
             }
           }
        }

        // Check 1h (60 mins) - Allow 10 min window
        if (rule1h && !remindersSent.includes('1h') && diffMinutes > 50 && diffMinutes < 70) {
           const client = state.clients.find(c => c.id === appt.clientId);
           const service = state.services.find(s => s.id === appt.serviceId);
           if (client && service) {
             const success = await sendWhatsAppMessage(client, `Olá ${client.name}, seu agendamento de ${service.name} começa em 1 hora!`, whatsappConfig.metadata);
             
             if (success) {
               dispatch({ 
                 type: 'UPDATE_APPOINTMENT', 
                 payload: { ...appt, remindersSent: [...remindersSent, '1h'] } 
               });
               dispatch({
                 type: 'ADD_LOG',
                 payload: { id: uuidv4(), appointmentId: appt.id, clientName: client.name, channel: 'whatsapp', trigger: 'reminder_1h', status: 'sent', sentAt: new Date().toISOString() }
               });
             }
           }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [state.appointments, state.integrations, state.notificationRules, state.clients, state.services]);

  return <BookingContext.Provider value={{ state, dispatch }}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const ctx = React.useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
