'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IContextDef, IService } from '@/src/types/app';
import { createService, updateServices } from '@/src/services/campaing';
import { toast } from 'src/components/snackbar';
import { TextField, Typography, Button, Stack } from '@mui/material';
import { getAllContexts } from '@/src/services/contextDef';

import { getUserSession } from '@/src/auth/context/jwt';

//Esquema de validación Zod
const serviceFormSchema = z.object({
  name: z.string().min(1, { message: 'El nombre del servicio es requerido' }),
  context: z.string().min(1, { message: 'El contexto del servicio es requerido' }),
  is_active: z.boolean({ required_error: 'El estado de actividad es requerido' }),
  status: z.string().min(1, { message: 'El estado es requerido' }),
  retry: z.string().min(1, { message: '*campo requerido' }),
  wrapuptime: z.string().min(1, { message: '*campo requerido' }),
  strategy: z.string().min(1, { message: 'La estrategia es requerida' }),
  timeout: z.string().min(1, { message: '*campo requerido' }),
});

type ServiceFormInput = z.infer<typeof serviceFormSchema>;

interface IForm {
  service: any;
  onClose: () => void | null;
  step_next: () => void | null;
  step_back: () => void | null;
}
const NewServiceForm: React.FC<IForm> = ({ service, onClose, step_next, step_back }) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: service?.name || '',
      context: service?.context || '',
      status: service?.status || '',
      is_active: service?.is_active ?? true,
      retry: service?.retry || '0',
      wrapuptime: service?.wrapuptime || '0',
      strategy: service?.strategy || '',
      timeout: service?.timeout || '0',
    },
  });
  //User details
  const user = getUserSession();
  const parsedUser = user && user.id ? user.id.toString() : '';
  const [contexts, setContexts] = React.useState<IContextDef[]>([]);

  //==============================Start Buttons handler==============================
  const submitBtnText = () => {
    if (typeof step_next === 'function' && step_next.toString() !== '()=>{}') {
      return 'Siguiente';
    }
    return service ? 'Actualizar' : 'Guardar & Cerrar';
  };

  const closeBtnText = () => {
    if (!step_back || (typeof step_back === 'function' && step_back.toString() === '()=>{}')) {
      return 'Cerrar';
    }
    return 'Anterior';
  };
  //==============================End Buttons handler==============================
  //Function to get all contexts
  const fetchContexts = async () => {
    try {
      const data = await getAllContexts();
      setContexts(data.context_defs);
    } catch (error) {
      console.error('Error fetching contexts:', error);
    }
  };

  //==============================Start Submit Form==============================
  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const data = {
      name: getValues('name'),
      context: getValues('context'),
      status: getValues('status'),
      retry: getValues('retry'),
      wrapuptime: getValues('wrapuptime'),
      strategy: getValues('strategy'),
      timeout: getValues('timeout'),
      users: parsedUser,
    };
    console.log('Datos enviados:', data);
    try {
      if (!service) {
        const response = await createService(data);
        console.log('Service created:', response.message);
        toast.info(`Cola creada ID:${response.id}`);
      } else {
        if (!service.id) {
          throw new Error('Service ID is required for updating');
        }
        const response = await updateServices(service.id, data);
        console.log('Service updated:', response.message);
        toast.info(`Cola actualizada ID:${service.id}`);
      }
    } catch (error: any) {
      console.error('Error en el formulario:', error.message);
      toast.error(error.message);
    } finally {
      if (step_next) {
        step_next();
      } else {
        reset();
        onClose();
      }
    }
  };

  useEffect(() => {
    fetchContexts();
  }, []);
  //==============================End Submit Form================================
  useEffect(() => {
    if (service) {
      reset({
        name: service.name || '',
        context: service.context || '',
        is_active: service.is_active ?? true,
        status: service.status || '',
        retry: service.retry || '0',
        wrapuptime: service.wrapuptime || '0',
        strategy: service.strategy || '',
        timeout: service.timeout || '0',
      });
    } else {
      reset({
        name: '',
        context: '',
        is_active: true,
        status: 'activa',
        retry: '0',
        wrapuptime: '0',
        strategy: '',
        timeout: '0',
      });
    }
  }, [service, reset]);
  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            Nombre de la Cola
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                margin="normal"
              />
            )}
          />
          Contexto de la Cola
          <Controller
            name="context"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value="">-</option>
                {contexts.map((context) => (
                  <option key={context.id} value={context.id}>
                    {context.name}
                  </option>
                ))}
              </TextField>
            )}
          />
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            Estado del la Cola
          </Typography>
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value="">-</option>
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </TextField>
            )}
          />
          <Typography variant="subtitle2" mt={3}>
            Configuración de campaña
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            Estratégia de Asignación/Distribución
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            *Configura como se distribuirán las llamadas a los agentes disponibles
          </Typography>
          <Controller
            name="strategy"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                <option value="">-</option>
                <option value="ringall">
                  ringall - Llama a todos los agentes disponibles simultáneamente
                </option>
                <option value="leastrecent">
                  leastrecent - Llama al agente que ha estado libre por más tiempo
                </option>
                <option value="fewestcalls">
                  fewestcalls - Llama al agente que ha atendido menos llamadas
                </option>
                <option value="random">random - Selecciona un agente aleatoriamente</option>
                <option value="rrmemory">rrmemory - Llama a los agentes de manera rotativa</option>
                <option value="linear">linear - Llama a los agentes en un orden predefinido</option>
                <option value="wrandom">
                  wrandom - Selecciona un agente de forma aleatoria con ponderación
                </option>
              </TextField>
            )}
          />{' '}
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            Intentos de Reasignación (retry)
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            *Número de veces que el sistema intentará reasignar la llamada si no es atendida
          </Typography>
          <Controller
            name="retry"
            control={control}
            defaultValue={'5'} // Valor por defecto
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                error={!!errors.retry}
                helperText={errors.retry?.message}
                margin="normal"
              />
            )}
          />
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            Tiempo entre Llamadas (wrapuptime)
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            *Tiempo de espera antes de asignar una nueva llamada a un agente tras finalizar la
            anterior
          </Typography>
          <Controller
            name="wrapuptime"
            control={control}
            defaultValue={'0'} // Valor por defecto
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                error={!!errors.wrapuptime}
                helperText={errors.wrapuptime?.message}
                margin="normal"
              />
            )}
          />
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            Tiempo Máximo de Espera{' '}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            *Límite de tiempo en segundos que una llamada permanecerá en la cola antes de ser
            redirigida o finalizada
          </Typography>
          <Controller
            name="timeout"
            control={control}
            defaultValue={'15'} // Valor por defecto
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                fullWidth
                error={!!errors.timeout}
                helperText={errors.timeout?.message}
                margin="normal"
              />
            )}
          />
          <Typography
            variant="body2"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            Estado de la Configuración
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            *Configura si el servicio estará activo o inactivo
          </Typography>
          <Controller
            name="status"
            control={control}
            defaultValue="active" // Valor por defecto
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.status}
                helperText={errors.status?.message}
                margin="normal"
              />
            )}
          />
        </div>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => {
              if (
                !step_back ||
                (typeof step_back === 'function' && step_back.toString() === '()=>{}')
              ) {
                onClose();
              } else {
                step_back();
              }
            }}
          >
            {closeBtnText()}
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
            {submitBtnText()}
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default NewServiceForm;