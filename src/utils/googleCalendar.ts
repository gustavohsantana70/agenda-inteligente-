
import { Appointment, Service } from '../types';

const CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_PLACEHOLDER';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

/**
 * Initializes the Google Token Client.
 * @param callback Function to handle the token response
 */
export const initGoogleAuth = (callback: (response: any) => void) => {
  if (typeof window === 'undefined' || !window.google) {
    console.error('Google Identity Services script not loaded');
    return null;
  }

  return window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: callback,
  });
};

/**
 * Creates an event object in the format Google Calendar API expects
 */
export const createGoogleEventBody = (appointment: Appointment, service: Service) => {
  return {
    summary: service.name,
    description: `Serviço: ${service.name}\nStatus: ${appointment.status}\nAgendado via CronosFlow`,
    start: {
      dateTime: appointment.startTime, // ISO String
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: appointment.endTime, // ISO String
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };
};

/**
 * Pushes the event to Google Calendar using the Access Token
 */
export const insertGoogleEvent = async (accessToken: string, eventBody: any) => {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventBody),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to create event');
    }

    return await response.json();
  } catch (error) {
    console.error('Error inserting Google Event:', error);
    throw error;
  }
};
