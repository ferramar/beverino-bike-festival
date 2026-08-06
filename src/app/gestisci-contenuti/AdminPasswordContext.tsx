'use client';
import { createContext, useContext } from 'react';

// La password viene passata ai form di scrittura (es. upload foto), che la inviano
// ad ogni richiesta: è solo comodità UX, l'autorizzazione reale è rivalidata server-side.
const AdminPasswordContext = createContext<string | null>(null);

export const AdminPasswordProvider = AdminPasswordContext.Provider;

export function useAdminPassword(): string {
  const password = useContext(AdminPasswordContext);
  if (!password) {
    throw new Error('useAdminPassword deve essere usato dentro AdminPasswordProvider');
  }
  return password;
}
