'use client';

import React, { useEffect } from 'react';
import { Modal, Box, TextField, Button, Stack, Typography, Divider } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { createServiceCategory, updateServiceCategory } from '@/src/services/serviceCategory';
import { getServices } from '@/src/services/campaing';

import { toast } from 'src/components/snackbar';
import { IService, IServicesCategory } from '@/src/types/app';

import NewServiceCategoryForm from './new-form';

// Esquema de validación con Zod
const serviceCategoryFormSchema = z.object({
  name: z.string().min(1, { message: 'Nombre de la categoría es requerido' }),
  service: z.string().min(1, { message: 'Servicio es requerido' }),
  is_active: z.string().min(1, { message: 'Estado es requerido' }),
});

type ServiceCategoryFormInput = Omit<IServicesCategory, 'id' | 'created_at' | 'updated_at'>;

interface ModalServiceCategoryFormProps {
  open: boolean;
  onClose: () => void;
  serviceCategory: any;
}

const ModalServiceCategoryForm: React.FC<ModalServiceCategoryFormProps> = ({
  open,
  onClose,
  serviceCategory = null,
}) => {

  //Función para enviar los datos del formulario
  

  // Función para cerrar el modal y resetear el formulario
  

  //Funcion para obtener los servicios
  
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          width: 800,
        }}
      >
        <Typography variant="h4">{serviceCategory ? 'Actualizar Tipificación' : 'Agregar Tipificación'}</Typography>
        <Stack spacing={2} mt={2} ml={2}>
          <Typography variant="subtitle2">Configuración de Tipificaciones</Typography>
          <Typography variant="caption">Las tipificaciones permiten categorizar las interacciones dentro de cada servicio de atención, facilitando la gestión y análisis de las llamadas. Durante la atención, los operadores asignan una tipificación a cada caso para clasificarlo correctamente y mejorar el seguimiento.
          <br/>
          <br/>
          En esta sección, puedes crear y gestionar tipificaciones, asignarlas a servicios específicos y definir su disponibilidad para los operadores. Esto garantiza una mejor organización de la información y permite generar reportes detallados sobre los motivos de contacto.
  </Typography>
        </Stack>
        <Divider sx={{ mt: 2, mb:2 }} />
        <Box mt={2}>
          <NewServiceCategoryForm serviceCategory={serviceCategory} onClose={onClose} step_next={() => {}} step_back={() => {}}/>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalServiceCategoryForm;