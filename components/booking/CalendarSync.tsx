
import React, { useState, useEffect } from 'react';
import { Appointment, Service } from '../../types';
import { Button } from '../common/Button';
import { Calendar, Check, Loader2, AlertCircle, Download } from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
    msal?: {
      PublicClientApplication: new (config: any) => any;
    };
  }
}

const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '';
const MICROSOFT_CLIENT_ID = (import.meta as any).env?.VITE_MICROSOFT_CLIENT_ID || '';

export const CalendarSync: React.FC<{ appointment: Appointment; service: Service }> = ({ appointment, service }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [provider, setProvider] = useState<'Google' | 'Outlook' | 'ICS' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [msalInstance, setMsalInstance] = useState<any>(null);

  useEffect(() => {
    if (window.msal && MICROSOFT_CLIENT_ID && MICROSOFT_CLIENT_ID !== 'YOUR_CLIENT_ID_HERE') {
      const msalConfig = {
        auth: {
          clientId: MICROSOFT_CLIENT_ID,
          authority: "https://login.microsoftonline.com/common",
          redirectUri: window.location.origin,
        },
        cache: {
          cacheLocation: "sessionStorage",
        }
      };
      try {
        const msal = new window.msal.PublicClientApplication(msalConfig);
        msal.initialize().then(() => {
           setMsalInstance(msal);
        });
      } catch (e) {
        console.error("MSAL Init Error", e);
      }
    }
  }, []);

  const handleGoogleSync = () => {
    setProvider('Google');
    setStatus('connecting');
    // Simulate OAuth Delay
    setTimeout(() => setStatus('connected'), 1500);
  };

  const handleOutlookSync = () => {
    setProvider('Outlook');
    setStatus('connecting');
     // Simulate OAuth Delay
     setTimeout(() => setStatus('connected'), 1500);
  };

  const handleDownloadICS = () => {
    setProvider('ICS');
    
    const formatDate = (dateStr: string) => {
      return dateStr.replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const start = formatDate(new Date(appointment.startTime).toISOString());
    const end = formatDate(new Date(appointment.endTime).toISOString());
    const now = formatDate(new Date().toISOString());

    // Standard VEVENT format
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CronosFlow//Booking System//EN',
      'BEGIN:VEVENT',
      `UID:${appointment.id}@cronosflow.app`,
      `DTSTAMP:${now}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${service.name}`,
      `DESCRIPTION:Serviço: ${service.name}\\nStatus: Confirmado\\nGerado por CronosFlow`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Lembrete de Agendamento',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `agendamento_${appointment.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatus('connected');
  };

  if (status === 'connected') {
    return (
      <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center justify-center gap-2 text-green-700 font-medium mb-2">
          <Check size={20} />
          {provider === 'ICS' ? 'Arquivo baixado!' : 'Sincronizado!'}
        </div>
        <p className="text-sm text-green-600 text-center">
          {provider === 'ICS' 
            ? 'O arquivo .ics foi baixado. Abra-o para adicionar ao seu calendário.' 
            : `Evento sincronizado com sucesso no ${provider}.`}
        </p>
        <Button variant="outline" onClick={() => setStatus('idle')} className="mt-3 text-xs w-full">
            Sincronizar outro
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      <h4 className="font-semibold text-slate-800 mb-2 text-center">Adicionar ao Calendário</h4>
      <p className="text-sm text-slate-500 mb-6 text-center">
        Escolha uma opção para não esquecer seu horário.
      </p>
      
      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-center gap-2">
            <AlertCircle size={16} />
            {errorMessage || 'Erro desconhecido.'}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
            variant="outline" 
            onClick={handleGoogleSync}
            disabled={status === 'connecting'}
            className="w-full justify-center text-sm"
            >
            {status === 'connecting' && provider === 'Google' ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
                <Calendar className="mr-2 h-4 w-4 text-blue-600" />
            )}
            Google Calendar
            </Button>
            
            <Button 
            variant="outline" 
            onClick={handleOutlookSync}
            disabled={status === 'connecting'}
            className="w-full justify-center text-sm"
            >
            {status === 'connecting' && provider === 'Outlook' ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
                <Calendar className="mr-2 h-4 w-4 text-sky-600" />
            )}
            Outlook
            </Button>
        </div>

        <Button 
          variant="secondary" 
          onClick={handleDownloadICS}
          disabled={status === 'connecting'}
          className="w-full justify-center text-sm"
        >
          <Download className="mr-2 h-4 w-4 text-slate-600" />
          Baixar arquivo (.ics)
        </Button>
      </div>
    </div>
  );
};
