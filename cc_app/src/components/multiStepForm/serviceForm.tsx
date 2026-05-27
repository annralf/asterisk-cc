'use client';
import React from 'react';
import { Box, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { updateService } from '@/src/store/slices/stepFormSlice';

const serviceFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre del servicio es requerido' }),
  status: z.string().min(1, { message: 'El estado es requerido' }),
  isActive: z.boolean({ required_error: 'El estado de actividad es requerido' }),
  retry: z.number().nonnegative({ message: 'El número de reintentos no puede ser negativo' }),
  wrapuptime: z.number().nonnegative({ message: 'El tiempo de finalización no puede ser negativo' }),
  strategy: z.string().min(1, { message: 'La estrategia es requerida' }),
  timeout: z.number().nonnegative({ message: 'El tiempo de espera no puede ser negativo' }),
});

type ServiceFormInput = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  onNext: () => void;
  onBack: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onNext, onBack }) => {
  const dispatch = useDispatch();
  const serviceData = useSelector((state: RootState) => state.form.service);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: serviceData,
  });

  const onSubmit = (data: ServiceFormInput) => {
    dispatch(updateService(data));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre del servicio"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
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
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="¿Está activo?"
            />
          )}
        />
        <Controller
          name="retry"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Reintentos"
              type="number"
              variant="outlined"
              error={!!errors.retry}
              helperText={errors.retry?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="wrapuptime"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tiempo de finalización"
              type="number"
              variant="outlined"
              error={!!errors.wrapuptime}
              helperText={errors.wrapuptime?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="strategy"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Estrategia"
              variant="outlined"
              error={!!errors.strategy}
              helperText={errors.strategy?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="timeout"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tiempo de espera"
              type="number"
              variant="outlined"
              error={!!errors.timeout}
              helperText={errors.timeout?.message}
              fullWidth
            />
          )}
        />
        <Box display="flex" justifyContent="space-between">
          <Button onClick={onBack} variant="outlined">
            Atrás
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Siguiente
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default ServiceForm;
