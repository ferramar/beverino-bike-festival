"use client";
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Stato per memorizzare il valore
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  // Inizializza il client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Carica il valore dal localStorage quando il componente è montato
  useEffect(() => {
    if (!isClient) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key, isClient]);

  // Funzione per aggiornare il valore
  const setValue = (value: T | ((val: T) => T)) => {
    if (!isClient) return;

    try {
      // Permette al valore di essere una funzione così come il setState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salva lo stato
      setStoredValue(valueToStore);
      
      // Salva nel localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

