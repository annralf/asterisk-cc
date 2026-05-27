'use client';
import React, { useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Divider, Stack } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { createExtension, ExtensionItem, updateExtensions } from 'src/services/extension';
import { getAllContexts } from '@/src/services/contextDef';
import { getFilteredService } from '@/src/services/campaing';

import { toast } from 'src/components/snackbar';
import { IContextDef, IExtensions } from '@/src/types/app';

import AsteriskExtensionStates from '@/src/utils/ext-status';

// Esquema de validación con Zod
const extensionFormSchema = z.object({
  identity: z.string().min(1, { message: 'Identificador de la extensión es requerido' }),
  is_active: z.boolean().optional(),
  status: z.string().min(1, { message: 'Estado es requerido' }),
  context: z.number().min(1, { message: 'Contexto es requerido' }).optional(),
  access_type: z.string().min(1, { message: 'Tipo de acceso es requerido' }),
  service: z.string().min(1, { message: 'Campaña' }).optional(),
});

type ExtensionFormInput = z.infer<typeof extensionFormSchema>;
interface IForm {
  extension: any;
  onClose: () => void;
  step_next: () => void | null;
  step_back: () => void | null;
}

const NewExtensionForm: React.FC<IForm> = ({
  onClose,
  extension = null,
  step_next,
  step_back,
}) => {
  console.log('Extension:', extension);

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<ExtensionFormInput>({
    resolver: zodResolver(extensionFormSchema),
    defaultValues: {
      identity: extension?.identity || '',
      is_active: extension?.is_active || false,
      status: extension?.status || 'active',
      context: extension?.context_id || null,
      access_type: extension?.access_type || '',
    },
  });

  const [contexts, setContexts] = React.useState<IContextDef[]>([]);
  const [campaigns, setCampaigns] = React.useState<any[]>([]);

  const accessTypes = [
    { value: 'monitor', label: 'Monitor' },
    { value: 'operator', label: 'Agente/Operador' },
  ];

  //==============================Start Buttons handler==============================
  const submitBtnText = () => {
    if (typeof step_next === 'function' && step_next.toString() !== '()=>{}') {
      return 'Siguiente';
    }
    return extension ? 'Actualizar' : 'Guardar & Cerrar';
  };

  const closeBtnText = () => {  
    if (!step_back || (typeof step_back === 'function' && step_back.toString() === '()=>{}')) {
      return 'Cerrar';
    }
    return 'Anterior';
  };
  //==============================End Buttons handler==============================

  //===========================Start data fetching=====================================================================
  //Function to get all contexts
  const fetchContexts = async () => {
    try {
      const data = await getAllContexts();
      setContexts(data.context_defs);
    } catch (error) {
      console.error('Error fetching contexts:', error);
    }
  };

  //Function to get all campaigns
  const fetchCampaigns = async () => {
    try {
      const data = await getFilteredService({ is_active: true });
      setCampaigns(data.services);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };
  //===========================End data fetching=====================================================================

  //===========================Start data submit=====================================================================
  const onSubmit = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      const formData = getValues();
      const data: IExtensions = {
        ...formData,
        service: formData.service ? parseInt(formData.service) : undefined,
      };
      console.log('Datos enviados:', data);
      if (!extension) {
        const response = await createExtension({
          ...data,
          service: data.service ? data.service : undefined,
        });
        console.log('Extension created:', response.message, response.id);
        toast.success(`Extensión creada! ID: ${response.id}`);
      } else {
        console.log('Updating extension with ID:', extension.id);
        console.log('Data:', data);
        const response = await updateExtensions(extension.id, {
          ...data,
          service: data.service ? data.service : undefined,
          extensions_agent: data.extensions_agent ? data.extensions_agent : null,
        });
        console.log('Extension updated:', response.message);
        toast.success(`Extensión actualizada! ID: ${extension.id}`);
      }
    } catch (error: any) {
      console.error(
        extension ? 'Error updating extension:' : 'Error creating extension:',
        error.message
      );
      toast.error(
        extension
          ? `Error al actualizar la extensión: ${error.message}`
          : `Error al crear la extensión: ${error.message}`
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
  //===========================End data submit=====================================================================
  // Función para cerrar el modal y resetear el formulario

  useEffect(() => {
    fetchContexts();
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (extension) {
      reset({
        identity: extension.identity || '',
        is_active: extension.is_active || true,
        status: extension.status || 'active',
        context: extension.context_id || null,
        access_type: extension.access_type || '',
      });
    } else {
      reset({
        identity: '',
        is_active: true,
        status: 'active',
        access_type: '',
        context: 0,
      });
    }
  }, [extension, reset]);
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
            Numero de la Extensión (Número - 4 dígitos)
          </Typography>
          <Controller
            name="identity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.identity}
                helperText={errors.identity?.message}
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
            Estado de la Extensión
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              ml: 1,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            *Indica si la extensión está activa o inactiva en el sistema.
          </Typography>
          <Controller
            name="status"
            control={control}
            defaultValue={watch("status") ?? ""}
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
                {AsteriskExtensionStates.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </TextField>
            )}
          />
          <Typography variant="subtitle2" mt={3}>
            Configuración de permisos
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
            Nivel de Permiso
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              ml: 1,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            *Configura los permisos asociados a la extensión según el rol del usuario que la
            utilizará.
          </Typography>
          <Controller
            name="access_type"
            control={control}
            defaultValue={watch("access_type") ?? ""}
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
                {accessTypes.map((access) => (
                  <option key={access.value} value={access.value}>
                    {access.label}
                  </option>
                ))}
              </TextField>
            )}
          />
          <Typography variant="subtitle2" mt={3}>
            Configuración de Contexto
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
            Contexto de Atención
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              ml: 1,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            *Especifica el contexto en el que operará la extensión, determinando cómo se enrutan y
            gestionan las llamadas.
          </Typography>
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
          <Typography variant="subtitle2" mt={3}>
            Asignación a una Cola
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
            Servicio de Atención Asignado
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 3,
              ml: 1,
              mx: 'auto',
              display: 'block',
              textAlign: 'left',
              color: 'text.primary',
            }}
          >
            *Vincula la extensión con un servicio/cola específico para la gestión de llamadas
            entrantes y salientes..
          </Typography>
          <Controller
            name="service"
            control={control}
            defaultValue={watch("service") ?? ""}
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
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </TextField>
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
              if (!step_back || (typeof step_back === 'function' && step_back.toString() === '()=>{}')) {
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

export default NewExtensionForm;