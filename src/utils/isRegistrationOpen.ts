import { EVENT } from '../config/event';

export function isRegistrationOpen(): boolean {
  if (typeof window !== 'undefined') {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('debugClose') === '1') return false;
    if (sp.get('debugOpen') === '1') return true;
  }
  const closing = new Date(EVENT.registrationClosingISO);
  return new Date() <= closing;
}

export function getRegistrationClosingDate(): Date {
  return new Date(EVENT.registrationClosingISO);
}

