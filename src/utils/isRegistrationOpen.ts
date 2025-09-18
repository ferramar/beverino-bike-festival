export function isRegistrationOpen(): boolean {
  if (typeof window !== 'undefined') {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get('debugClose') === '1') return false;
    if (sp.get('debugOpen') === '1') return true;
  }
  const iso = process.env.NEXT_PUBLIC_REG_CLOSING_ISO || '2025-09-20T23:59:59';
  const closing = new Date(iso);
  return new Date() <= closing;
}

export function getRegistrationClosingDate(): Date {
  const iso = process.env.NEXT_PUBLIC_REG_CLOSING_ISO || '2025-09-20T23:59:59';
  return new Date(iso);
}

