'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { ComuneOption, loadComuni, searchComuni } from '@/utils/comuni';

interface ComuneAutocompleteProps {
  label: string;
  value: string;
  onChange: (nome: string, cap?: string) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  autoComplete?: string;
}

export default function ComuneAutocomplete({
  label,
  value,
  onChange,
  error,
  helperText,
  required,
  autoComplete = 'address-level2',
}: ComuneAutocompleteProps) {
  const [comuni, setComuni] = useState<ComuneOption[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComuni()
      .then(setComuni)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const options = useMemo(() => {
    if (!comuni.length) return [];
    if (inputValue.length >= 2) return searchComuni(comuni, inputValue, 15);
    if (value) {
      const match = comuni.find((c) => c.nome.toLowerCase() === value.toLowerCase());
      return match ? [match] : [];
    }
    return [];
  }, [comuni, inputValue, value]);

  const selected = useMemo(
    () => comuni.find((c) => c.nome.toLowerCase() === value.toLowerCase()) ?? null,
    [comuni, value]
  );

  return (
    <Autocomplete
      freeSolo
      loading={loading}
      options={options}
      value={selected}
      inputValue={inputValue}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      isOptionEqualToValue={(option, val) => option.nome === val.nome}
      onInputChange={(_, newInput) => setInputValue(newInput)}
      onChange={(_, newValue) => {
        if (typeof newValue === 'string') {
          onChange(newValue);
          return;
        }
        if (newValue) {
          onChange(newValue.nome, newValue.cap || undefined);
        } else {
          onChange('');
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={required ? `${label}*` : label}
          error={error}
          helperText={helperText}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: Boolean(inputValue) || Boolean(selected),
          }}
          inputProps={{
            ...params.inputProps,
            autoComplete,
          }}
        />
      )}
    />
  );
}
