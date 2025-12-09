
import { Service, Client, Appointment } from '../types';
import { add, formatISO, sub } from 'date-fns';

const now = new Date();

export const mockServices: Service[] = [
  {
    id: 'svc_1',
    name: 'Consulta Rápida',
    description: '50 minutos, avaliação inicial',
    priceCents: 15000,
    durationMinutes: 50,
    bufferMinutes: 10,
    color: '#4F46E5', // Indigo
    category: 'Consultas',
    active: true,
    isPremium: false
  },
  {
    id: 'svc_2',
    name: 'Acompanhamento (Mensal)',
    description: 'Sessão de retorno e ajustes',
    priceCents: 12000,
    durationMinutes: 45,
    bufferMinutes: 5,
    color: '#0ea5e9', // Sky
    category: 'Consultas',
    active: true,
    isPremium: false
  },
  {
    id: 'svc_3',
    name: 'Mentoria Premium',
    description: 'Sessão exclusiva via videochamada (Requer Plano Pago)',
    priceCents: 35000,
    durationMinutes: 90,
    bufferMinutes: 15,
    color: '#8b5cf6', // Violet
    category: 'Mentoria',
    active: true,
    isPremium: true // Marked as Premium
  }
];

export const mockClients: Client[] = [
  { id: 'cli_1', name: 'João Silva', email: 'joao@example.com', phone: '(11) 99999-9999', tags: ['VIP', 'Recorrente'], notes: 'Prefere horários pela manhã.' },
  { id: 'cli_2', name: 'Maria Pereira', email: 'maria@example.com', phone: '(21) 98888-8888', tags: ['Novo'], notes: '' },
  { id: 'cli_3', name: 'Carlos Souza', email: 'carlos@example.com', phone: '(31) 97777-7777', tags: [], notes: '' }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt_1',
    clientId: 'cli_1',
    serviceId: 'svc_1',
    startTime: formatISO(add(now, { days: 0, hours: 2 })),
    endTime: formatISO(add(now, { days: 0, hours: 3 })),
    status: 'confirmed',
    paymentStatus: 'paid',
    intakeData: { notes: 'Dores nas costas' }
  },
  {
    id: 'apt_2',
    clientId: 'cli_2',
    serviceId: 'svc_3',
    startTime: formatISO(add(now, { days: 1, hours: 4 })),
    endTime: formatISO(add(now, { days: 1, hours: 5, minutes: 30 })),
    status: 'scheduled',
    paymentStatus: 'unpaid',
    intakeData: {}
  },
  {
    id: 'apt_3',
    clientId: 'cli_1',
    serviceId: 'svc_2',
    startTime: formatISO(sub(now, { days: 1, hours: 2 })),
    endTime: formatISO(sub(now, { days: 1, hours: 1, minutes: 15 })),
    status: 'completed',
    paymentStatus: 'paid',
    intakeData: {}
  }
];
