
export interface Service {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  durationMinutes: number;
  bufferMinutes?: number;
  isPackage?: boolean;
  packageSessions?: number;
  color: string; // Hex color for calendar
  category?: string;
  active: boolean;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'noshow' | 'rescheduled' | 'pending';
export type PaymentStatus = 'paid' | 'unpaid' | 'refunded';

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  startTime: string; // ISO
  endTime: string; // ISO
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  intakeData: Record<string, any>;
  notes?: string; // Internal admin notes
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  tags: string[]; // e.g., 'VIP', 'New', 'Late'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'provider' | 'client';
  plan: 'free' | 'pro';
}

// --- New Types for Settings & Integrations ---

export type IntegrationProvider = 'google_calendar' | 'outlook_calendar' | 'whatsapp' | 'stripe';

export interface IntegrationConfig {
  provider: IntegrationProvider;
  connected: boolean;
  lastSync?: string;
  metadata?: Record<string, any>; // e.g., calendarId, webhookUrl
}

export type NotificationChannel = 'email' | 'whatsapp' | 'push';
export type NotificationTrigger = 'created' | 'confirmed' | 'reminder_24h' | 'reminder_1h' | 'cancelled';

export interface NotificationRule {
  id: string;
  trigger: NotificationTrigger;
  channel: NotificationChannel;
  active: boolean;
  templateSubject?: string;
}

export interface NotificationLog {
  id: string;
  appointmentId: string;
  clientName: string;
  channel: NotificationChannel;
  trigger: NotificationTrigger;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
}
