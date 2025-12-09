import { useAuth } from '../context/AuthContext';

export function usePlan() {
  const { user } = useAuth();

  const isPro = user?.plan === 'pro';
  const isFree = !isPro;

  return {
    isPro,
    isFree,
    plan: user?.plan || 'free',
    limits: {
        maxAppointments: isPro ? Infinity : 20,
        maxServices: isPro ? Infinity : 3,
        canSyncCalendar: isPro,
        canUseWhatsApp: isPro,
        canUseCRM: isPro,
    }
  };
}
