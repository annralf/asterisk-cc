'use client';

import React, { FC, useEffect, useState } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Stack,
  Divider,
  Card,
  ListItemText,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUser, updateUsers, uploadAvatar } from 'src/services/user';
import { Scrollbar } from '../scrollbar';
import { ComponentBlock, ComponentContainer } from '@/src/sections/_examples/component-block';

import { LoadingButton } from '@mui/lab';
import ServiceNavBar from './navbar';

import { Iconify } from '../iconify';
import { color } from 'framer-motion';

import { ISupportDetail } from '@/src/utils/interfaces';

import { paths } from '@/src/routes/paths';
import { CustomBreadcrumbs } from '../custom-breadcrumbs';
import { DashboardContent } from '@/src/layouts/dashboard';

const serviceDetailFormSchema = z.object({
  id: z.string().optional(),
  support: z.string().min(1, 'Servicio'),
  serviceCategory: z.string().min(1, 'Debe agregar la tipificación del servicio'),
  observation: z.string().min(10, 'Coloque la observación al servicio').optional(),
});

type ServiceDetailFormInputs = z.infer<typeof serviceDetailFormSchema>;

const NewServiceDetail = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<ServiceDetailFormInputs>({
    resolver: zodResolver(serviceDetailFormSchema),
    defaultValues: {
      support: undefined,
      serviceCategory: undefined,
      observation: '',
    },
  });

  const [uploading, setUploading] = useState(false);
  const onSubmit = async (data: ServiceDetailFormInputs) => {
    console.log('Form Submitted:', data);
    try {
      console.log('Form Submitted:', data);
      // Realiza la lógica de envío (e.g., llamada a una API)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const extension = 'active';
  return (
    <>
      <ComponentBlock
        title="Llamada"
        sx={{ flexDirection: 'column', alignItems: 'unset', paddingBottom: 3, paddingTop: 3 }}
      >
        <Card
          sx={{
            display: 'flex',
            alignItems: 'center',
            direction: 'row',
            p: (theme) => theme.spacing(3, 2, 3, 3),
          }}
        >
          <ListItemText
            primary="Operador - name"
            secondary={<>{extension}</>}
            primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              noWrap: true,
              display: 'flex',
              component: 'span',
              alignItems: 'center',
              typography: 'caption',
              color: 'success.main',
            }}
          />
          <ListItemText
            primary="Estado del Campaña"
            secondary={<>Tipificación</>}
            primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              noWrap: true,
              display: 'flex',
              component: 'span',
              alignItems: 'center',
              typography: 'caption',
              color: 'success.main',
            }}
          />
        </Card>
      </ComponentBlock>
      <Divider sx={{ mt: 3 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Divider sx={{ mt: 3 }} />
        <ComponentBlock
          title="Observaciones"
          sx={{ flexDirection: 'column', alignItems: 'unset', paddingBottom: 3, paddingTop: 3 }}
        >
          <Stack spacing={3}>
            <Controller
              name="support"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Campaña"
                  type="string"
                  error={!!errors.support}
                  helperText={errors.support ? errors.support.message : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <Controller
              name="serviceCategory"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Tipificación | Categoría"
                  type="string"
                  error={!!errors.serviceCategory}
                  helperText={errors.serviceCategory ? errors.serviceCategory.message : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <MenuItem key="1" value="1">
                    - servicio 1
                  </MenuItem>
                </TextField>
              )}
            />
          
            <Controller
              name="observation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observaciones | Notas"
                  multiline
                  rows={4}
                  error={!!errors.observation}
                  helperText={errors.observation ? errors.observation.message : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Stack>          
        </ComponentBlock>
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton color="inherit" size="large" variant="outlined">
            Cerrar & Cancelar
          </LoadingButton>
          <LoadingButton
            color="inherit"
            size="large"
            variant="contained"
            loading={uploading}
            type="submit"
          >
            {' '}
            Guardar & Cerrar
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
};

export const ServiceDetailView: FC = () => {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Supervisión de Llamada entrante"
        links={[{ name: 'Inicio', href: paths.monitoring.main }, { name: 'Supervisor' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      ></CustomBreadcrumbs>
      <NewServiceDetail />
    </DashboardContent>
  );
};
