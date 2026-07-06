'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface ViaAutocompleteProps {
  comune: string;
  value: string;
  onChange: (via: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export default function ViaAutocomplete({
  comune,
  value,
  onChange,
  error,
  helperText,
  disabled,
}: ViaAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!comune || inputValue.length < 2) {
      setOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ comune, q: inputValue });
        const res = await fetch(`/api/indirizzo/vie?${params}`);
        const data = await res.json();
        setOptions(data.vie ?? []);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [comune, inputValue]);

  const noComune = !comune.trim();

  const helper = useMemo(() => {
    if (helperText) return helperText;
    if (noComune) return 'Seleziona prima il comune';
    return 'Inizia a digitare la via per i suggerimenti';
  }, [helperText, noComune]);

  return (
    <Autocomplete
      freeSolo
      disabled={disabled || noComune}
      loading={loading}
      options={options}
      value={value || null}
      inputValue={inputValue}
      onInputChange={(_, newInput) => setInputValue(newInput)}
      onChange={(_, newValue) => {
        const via = typeof newValue === 'string' ? newValue : newValue ?? '';
        onChange(via);
        setInputValue(via);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Via/Corso/Piazza*"
          placeholder="Via Roma, Corso Italia, ..."
          error={error}
          helperText={helper}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: Boolean(inputValue),
          }}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'street-address',
          }}
        />
      )}
    />
  );
}
