import { Client } from '../types';

interface WhatsAppConfig {
  instanceId?: string;
  token?: string;
  provider?: string; // 'Z-API' | 'Twilio'
}

/**
 * Formats a phone number to strict format required by WhatsApp APIs
 * e.g. (11) 99999-9999 -> 5511999999999
 */
export const formatPhoneForWhatsapp = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  // Assuming BR numbers for MVP
  if (digits.length <= 11) {
    return `55${digits}`;
  }
  return digits;
};

/**
 * Simulates sending a message via WhatsApp Gateway
 */
export const sendWhatsAppMessage = async (
  client: Client, 
  message: string, 
  config: WhatsAppConfig
): Promise<boolean> => {
  console.log(`[WhatsApp Mock] Sending to ${client.name} (${formatPhoneForWhatsapp(client.phone || '')}) via ${config.provider || 'Z-API'}`);
  console.log(`[WhatsApp Mock] Config: Instance ${config.instanceId}`);
  console.log(`[WhatsApp Mock] Message: ${message}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!client.phone) return false;

  // In a real implementation, you would use fetch here:
  /*
  await fetch(`https://api.z-api.io/instances/${config.instanceId}/token/${config.token}/send-messages`, {
    method: 'POST',
    body: JSON.stringify({ phone: formatPhoneForWhatsapp(client.phone), message })
  });
  */

  return true;
};