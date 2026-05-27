'use client';

import React, { useEffect } from 'react';
import { Modal, Box, TextField, Button, Stack, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { createServiceCategory, updateServiceCategory } from '@/src/services/serviceCategory';
import { getServices } from '@/src/services/campaing';

import { toast } from 'src/components/snackbar';
import { IService, IServicesCategory } from '@/src/types/app';

// Esquema de validación con Zod
const serviceCategoryFormSchema = z.object({
  name: z.string().min(1, { message: 'Nombre de la categoría es requerido' }),
  service: z.string().min(1, { message: 'Servicio es requerido' }),
  is_active: z.string().min(1, { message: 'Estado es requerido' }),
});

type ServiceCategoryFormInput = Omit<IServicesCategory, 'id' | 'created_at' | 'updated_at'>;
interface IForm {
  serviceCategory: any;
  onClose: () => void;
  step_next: () => void | null;
  step_back: () => void | null;
}
const NewServiceCategoryForm: React.FC<IForm> = ({ serviceCategory, onClose, step_next, step_back }) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<ServiceCategoryFormInput>({
    resolver: zodResolver(serviceCategoryFormSchema),
    defaultValues: {
      name: serviceCategory ? serviceCategory.name : '',
      service: serviceCategory ? serviceCategory.service : '',
      is_active: serviceCategory ? serviceCategory.is_active : 'active',
    },
  });

  const [services, setServices] = React.useState<IService[] | []>([]);
  //==============================Start Buttons handler==============================
  const submitBtnText = () => {
    if (typeof step_next === 'function' && step_next.toString() !== '()=>{}') {
      return 'Siguiente';
    }
    return serviceCategory ? 'Actualizar' : 'Guardar & Cerrar';
  };

  const closeBtnText = () => {  
    if (!step_back || (typeof step_back === 'function' && step_back.toString() === '()=>{}')) {
      return 'Cerrar';
    }
    return 'Anterior';
  };
  //==============================End Buttons handler==============================

  //================================Start handle submit handler ===================================================================
  const onSubmit = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      const data = getValues();
      console.log('Datos enviados:', data);

      if (!serviceCategory) {
        const response = await createServiceCategory(data);
        console.log('Service Category created:', response.message, response.id);
        toast.success(`Categoría de servicio creada! ID: ${response.id}`);       
      } else {
        console.log('Updating service category with ID:', serviceCategory.id);
        const response = await updateServiceCategory(serviceCategory.id, data);
        console.log('Service Category updated:', response.message);
        toast.success(`Categoría de servicio actualizada! ID: ${serviceCategory.id}`);
      }
    } catch (error: any) {
      console.error(
        serviceCategory ? 'Error updating service category:' : 'Error creating service category:',
        error.message
      );
      toast.error(
        serviceCategory
          ? `Error al actualizar la categoría de servicio: ${error.message}`
          : `Error al crear la categoría de servicio: ${error.message}`
      );
    } finally {
      if (step_next() !== null) {
        step_next();
      }else{
        reset();
        onClose();
      }
    }
  };
  //================================End handle submit handler ===================================================================
  //================================Start services list ===================================================================
  const fetchServices = async () => {
    try {
      const response = await getServices();
      setServices(response.services);
      console.log('Services:', response.services);
    } catch (error: any) {
      console.error('Error fetching services:', error.message);
    }
  };
  //================================End services list ===================================================================
  //================================Start handle form ===================================================================
  const handleClose = () => {
    reset();
    onClose();
  };
  //================================End handle form ===================================================================
  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (serviceCategory) {
      reset({
        name: serviceCategory.name || '',
        service: serviceCategory.service || '',
        is_active: serviceCategory.is_active || true,
      });
    } else {
      reset({
        name: '',
        service: 0,
        is_active: true,
      });
    }
  }, [serviceCategory, reset]);
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
            Nombre de la Tipificación{' '}
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
            *Configura el nombre único de la tipificación que se asignará a durante la atención de
            la llamada.
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
          <Typography variant="subtitle2" mt={3}>
            Asignación de Tipificación a Servicio
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
            Servicio de Atención
          </Typography>
          <Controller
            name="service"
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
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
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
            Estado de la Tipificación
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
            *Configura si la tipificación estará activa o inactiva para ser asignada a las llamadas.
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
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
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

export default NewServiceCategoryForm;
