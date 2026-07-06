'use client';

import { useEffect, useRef, useState } from 'react';

interface UseCapLookupOptions {
  comune: string;
  via: string;
  civico: string;
  onCapFound: (cap: string) => void;
  enabled?: boolean;
}

export function useCapLookup({
  comune,
  via,
  civico,
  onCapFound,
  enabled = true,
}: UseCapLookupOptions) {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const lastQuery = useRef('');

  useEffect(() => {
    if (!enabled || !comune.trim() || !via.trim() || !civico.trim()) {
      setNotFound(false);
      return;
    }

    const queryKey = `${comune}|${via}|${civico}`;
    if (queryKey === lastQuery.current) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetch('/api/indirizzo/cap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comune, via, civico }),
        });

        const data = await res.json();
        lastQuery.current = queryKey;

        if (data.found && data.cap) {
          onCapFound(data.cap);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [comune, via, civico, enabled, onCapFound]);

  return { loading, notFound };
}
