'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Typography,
  TextField,
  Select,
  Stack,
  Chip,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import React, { useEffect, useCallback } from 'react';

import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { toast } from 'src/components/snackbar';
import { IContextDef } from '@/src/types/app';
import { createContext, getFilteredContexts, updateContext } from '@/src/services/contextDef';

interface IForm {
  context: any;
  step_next: () => void | null;
  step_back: () => void | null;
  onClose: () => void | null;
  handleClose: () => void;
}

const contextFormSchema = z.object({
  name: z.string().min(1, { message: 'Nombre del contexto es requerido' }),
  permission: z.string().min(1, { message: 'Permiso es requerido' }),
  monitors: z.string().min(1, { message: 'Monitores es requerido' }).optional(),
});

type ContextFormInput = z.infer<typeof contextFormSchema>;

const NewContextForm: React.FC<IForm> = ({ context, onClose, handleClose, step_back=null, step_next=null }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    reset,
  } = useForm<ContextFormInput>({
    resolver: zodResolver(contextFormSchema),
    defaultValues: {
      name: context ? context.name : '',
      permission: context ? context.permission : '',
      monitors: context ? context.monitors : '',
    },
  });

  //==================== start handle monitors list ====================
  const [monitorsList, setMonitorsList] = React.useState<string[]>(
    context ? (context.monitors ? context.monitors.split(',') : []) : []
  );
  const [monitorsToAdd, setMonitorsToAdd] = React.useState<string[]>([]);
  const [monitors, setMonitors] = React.useState<IContextDef[]>([]);

  const submitBtnText = () => {
    if (step_next) {
      return 'Siguiente';
    }
    if(context){
      return 'Actualizar';
    }else{
      return 'Guardar & Cerrar';
    }
  };

  const closeBtnText = () => {  
    if (step_back) {
      return 'Anterior';
    }else{
      return 'Cerrar';
    }
  };

  const handleMonitorsList = (event: SelectChangeEvent<string>) => {
    const selection = event.target.value;
    setMonitorsList([...monitorsList, selection]);
    setMonitorsToAdd([...monitorsToAdd, selection]);
    setMonitors(monitors.filter((monitor) => monitor.name !== selection));
  };

  const fetchMonitors = useCallback(() => {
    async () => {
      try {
        const filters = { permission: 'monitor', is_active: true };
        const response = await getFilteredContexts(1, 100, filters);
        setMonitors(response.context_defs);
      } catch (error) {
        console.error('Error fetching monitors:', error.message);
        toast.error('Error al cargar los monitores');
      }
    }
  }, [monitors]);

  //==================== end handle monitors list ====================

  //==================== start handle formSubmit ====================
  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const data = {
      name: getValues('name'),
      permission: watch('permission'),
      monitors: monitorsToAdd.join(','),
    };
    try {
      if (!context) {
        const response = await createContext(data);       
        console.log('Context created:', response.message, response.id);
        toast.info(`Contexto creado! ID: ${response.id}`);
      } else {
        console.log('Updating context with ID:', context.id);
        const response = await updateContext({ id: context.id, ...data });
        console.log('Context updated:', response.message);
        toast.info(`Contexto actualizado! ID: ${context.id}`);
      }
    } catch (error: any) {
      console.error(context ? 'Error updating context:' : 'Error creating context:', error.message);
      toast.error(
        context
          ? `Error al actualizar el contexto: ${error.message}`
          : `Error al crear el contexto: ${error.message}`
      );
    } finally {
      if (step_next) {
        step_next();
      }else{
        reset();
        onClose();
      }
    }
  };
  //==================== end handle formSubmit ====================
  useEffect(() => {
    if (monitors.length === 0) {
      fetchMonitors();
    }
  }, [monitors]);

  useEffect(() => {}, [monitorsList]);
  useEffect(() => {
    if (context) {
      reset({
        name: context.name,
        permission: context.permission,
        monitors: context.monitors,
      });
    }
  }, [context, reset]);

  return (
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
          Identificador
        </Typography>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ''}
              fullWidth
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
          Tipo de Permiso (operador | monitor)
        </Typography>
        <Controller
          name="permission"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Permiso"
              native
              fullWidth
              error={!!errors.permission}
              value={field.value || context?.name || ''}
              inputProps={{
                name: 'permission',
                id: 'permission',
              }}
            >
              <option value="">-</option>
              <option value="operator">Agente</option>
              <option value="monitor">Monitor | Supervisor</option>
            </Select>
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
          Monitores | Supervisores
        </Typography>

        <Controller
          name="monitors"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Permiso"
              native
              fullWidth
              error={!!errors.permission}
              inputProps={{
                name: 'permission',
                id: 'permission',
              }}
              onChange={handleMonitorsList}
            >
              <option value="">-</option>
              {monitors.map((monitor) => (
                <option key={monitor.id} value={monitor.name}>
                  {monitor.name}
                </option>
              ))}
            </Select>
          )}
        />
        <Stack direction="row" spacing={1} margin={2} width={'auto'} style={{ flexFlow: 'wrap' }}>
          {monitorsList.map((monitor, index) => (
            <Chip
              key={index}
              label={monitor}
              color="default"
              variant='outlined'
              onDelete={() => {
                const newMonitorsList = monitorsList.filter((_, i) => i !== index);
                setMonitorsList(newMonitorsList);
                fetchMonitors();
              }}
            />
          ))}
        </Stack>
      </div>
      <Stack spacing={2} mt={2} ml={2} direction={'row'}>        
        <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => {
              if (step_back) {
              step_back();
              } else {
              handleClose();
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
  );
};

export default NewContextForm;