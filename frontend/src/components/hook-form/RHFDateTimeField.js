import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/lab';

export default function RHFDateTimeField({ name, label, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          label={label}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={!!error}
              helperText={error ? error.message : null}
              {...other}
            />
          )}
        />
      )}
    />
  );
}
