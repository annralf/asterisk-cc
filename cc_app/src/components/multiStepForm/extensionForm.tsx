'use client'
import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { updateExtension } from '@/src/store/slices/stepFormSlice';
/* import { updateExtension } from '../store/slices/formSlice';
import { RootState } from '../store'; */

const extensionFormSchema = z.object({
  identity: z.string().min(1, { message: 'Identificador de la extensión es requerido' }),
  status: z.string().min(1, { message: 'Estado es requerido' }),
});

type ExtensionFormInput = z.infer<typeof extensionFormSchema>;

interface ExtensionFormProps {
  onNext: () => void;
}

const ExtensionForm: React.FC<ExtensionFormProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const extensionData = useSelector((state: RootState) => state.form.extension);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExtensionFormInput>({
    resolver: zodResolver(extensionFormSchema),
    defaultValues: extensionData,
  });

  const onSubmit = (data: ExtensionFormInput) => {
    dispatch(updateExtension(data));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Controller
          name="identity"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Identificador"
              variant="outlined"
              error={!!errors.identity}
              helperText={errors.identity?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Estado"
              variant="outlined"
              error={!!errors.status}
              helperText={errors.status?.message}
              fullWidth
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          Siguiente
        </Button>
      </Box>
    </form>
  );
};

export default ExtensionForm;
