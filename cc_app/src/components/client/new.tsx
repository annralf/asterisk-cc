'use client';
import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LoadingButton } from '@mui/lab';
import { FormClient } from './form';
import { createClient } from '@/src/services/client';
import { toast } from 'src/components/snackbar';
import { IClient } from '@/src/types/app';
import { useRouter } from 'next/navigation';
import { DashboardContent } from '@/src/layouts/dashboard';
import { CustomBreadcrumbs } from '../custom-breadcrumbs';
import { paths } from '@/src/routes/paths';

export const clientFormSchema = z.object({
  first_name: z.string().min(1, 'El nombre es requerido'),
  last_name: z.string().min(1, 'El apellido es requerido'),
  id_type: z.string().min(1, 'El tipo de identificación es requerido'),
  id_number: z.string().min(1, 'El número de identificación es requerido'),
  mail: z.string().email('El correo electrónico debe ser válido'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone_number: z.string().min(1, 'El número de teléfono es requerido'),
});

export type ClientFormInputs = z.infer<typeof clientFormSchema>;

const NewClient = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormInputs>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      id_type: '',
      id_number: '',
      mail: '',
      address: '',
      phone_number: '',
    },
  });

  const [ uploading, setUploading ] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: ClientFormInputs) => {

    try {
      const resp = await createClient(data);
      toast.success(resp.message);
      console.log(data);
      // Enviar datos al servidor
      // await createUser(data);

      reset();
      router.back();
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <Stack spacing={1} sx={{ mt: 3 }}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Nuevo Cliente"
          links={[ 
            { name: 'Home', href: paths.dashboard.root },
            { name: 'Clientes', href: paths.clients.main }
            
           ]}
          
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormClient control={control} errors={errors} />
          <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
            <LoadingButton color="inherit" size="large" variant="outlined">
              Cancelar
            </LoadingButton>
            <LoadingButton
              color="inherit"
              size="large"
              variant="contained"
              loading={uploading}
              type="submit"
            >
              Guardar
            </LoadingButton>
          </Stack>
        </form>
      </DashboardContent>
    </Stack>

  );
};

export default NewClient;
