'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface CivicoAutocompleteProps {
  comune: string;
  via: string;
  value: string;
  onChange: (civico: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export default function CivicoAutocomplete({
  comune,
  via,
  value,
  onChange,
  error,
  helperText,
  disabled,
}: CivicoAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!comune || !via || via.length < 2) {
      setOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ comune, via });
        const res = await fetch(`/api/indirizzo/civici?${params}`);
        const data = await res.json();
        setOptions(data.civici ?? []);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [comune, via]);

  const waitingForVia = !via.trim();

  const helper = useMemo(() => {
    if (helperText) return helperText;
    if (waitingForVia) return 'Inserisci prima la via';
    if (options.length === 0 && !loading) {
      return 'Digita il numero civico (suggerimenti non disponibili per questa via)';
    }
    return 'Seleziona o digita il numero civico';
  }, [helperText, waitingForVia, options.length, loading]);

  return (
    <Autocomplete
      freeSolo
      disabled={disabled || waitingForVia}
      loading={loading}
      options={options}
      value={value || null}
      inputValue={inputValue}
      onInputChange={(_, newInput) => setInputValue(newInput)}
      onChange={(_, newValue) => {
        const civico = typeof newValue === 'string' ? newValue : newValue ?? '';
        onChange(civico);
        setInputValue(civico);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Numero civico*"
          error={error}
          helperText={helper}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: Boolean(inputValue),
          }}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off',
          }}
        />
      )}
    />
  );
}
