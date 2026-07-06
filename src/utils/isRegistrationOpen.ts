import { EVENT } from '../config/event';

function isBeforeClosing(): boolean {
  return new Date() <= new Date(EVENT.registrationClosingISO);
}

export function isRegistrationOpen(): boolean {
  if (typeof window !== 'undefined') {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('debugClose') === '1') return false;
    if (sp.get('debugOpen') === '1') return isBeforeClosing();
  }
  if (process.env.NEXT_PUBLIC_REG_FORCE_OPEN === '1') {
    return isBeforeClosing();
  }
  const now = new Date();
  const opening = new Date(EVENT.registrationOpeningISO);
  const closing = new Date(EVENT.registrationClosingISO);
  return now >= opening && now <= closing;
}

export function getRegistrationOpeningDate(): Date {
  return new Date(EVENT.registrationOpeningISO);
}

export function getRegistrationClosingDate(): Date {
  return new Date(EVENT.registrationClosingISO);
}
