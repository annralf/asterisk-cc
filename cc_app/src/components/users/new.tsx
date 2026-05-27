'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { TextField, Typography, Stack } from '@mui/material';
import { toast } from 'src/components/snackbar';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadAvatar } from 'src/components/upload/upload-avatar';
import { fData } from 'src/utils/format-number';
import { LoadingButton } from '@mui/lab';

import { getFilteredService } from '@/src/services/campaing';
import { ExtensionItem, getFilteredExtensions } from '@/src/services/extension';

import { AnyObject, IService } from '@/src/types/app';
import { createUser, updateUsers } from '@/src/services/user';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

export const userFormSchema = z.object({
  first_name: z.string().min(1, { message: 'El primer nombre es requerido' }),
  last_name: z.string().min(1, { message: 'El apellido es requerido' }),
  email: z
    .string()
    .email({ message: 'El correo electrónico debe ser válido' })
    .min(1, { message: 'El correo electrónico es requerido' }),
  phone_number: z.string().min(1, { message: 'El número de teléfono es requerido' }),
  avatar: z.string().url({ message: 'El avatar debe ser una URL válida' }).optional(),
  access_type: z.string().min(1, { message: 'El tipo de acceso es requerido' }),
  username: z.string().min(1, { message: 'El nombre de usuario es requerido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  campaign: z.number().optional(),
  extension: z.number().optional(),
});

type UserFormInputs = z.infer<typeof userFormSchema>;

interface NewUserProps {
  user: any;
  step_next?: () => void | null;
  step_back?: () => void | null;
}

const NewUser: React.FC<NewUserProps> = ({ user = null, step_next= null, step_back = null }) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
      email: user?.email || '',
      avatar: user?.avatar ?? undefined,
      access_type: user?.access_type || '',
      username: user?.username || '',
      password: user?.password || '',
      campaign: user?.campaign ?? null,
      extension: user?.extension ?? null,
    },
  });
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [services, setServices] = useState<IService[] | null>(null);
  const [extensions, setExtensions] = useState<ExtensionItem[] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  //==============================Start Buttons handler==============================
  const submitBtnText = () => {
    if (step_next) {
      return 'Siguiente';
    }
    if (user) {
      return 'Actualizar';
    } else {
      return 'Guardar & Cerrar';
    }
  };

  const closeBtnText = () => {
    if (step_back) {
      return 'Anterior';
    } else {
      return 'Cerrar';
    }
  };
  //==============================End Buttons handler==============================
//======================Start data fetch functions ==========================================
  const fetchServices = useCallback(async () => {
    try {
      const data: AnyObject = {
        is_active: true,
      };
      const response = await getFilteredService(data);
      setServices(response.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }, []);

  const fetchExtensions = async (serviceId: number) => {
    try {
      const data: AnyObject = {
        is_active: true,
        service: serviceId,
      };
      const response = await getFilteredExtensions(data);
      setExtensions(response.extensions);
    } catch (error) {
      console.error('Error fetching extensions:', error);
    }
  };
//======================end data fetch functions ==========================================

//======================Start data submit handler ==========================================
const onSubmit = async (e: { preventDefault: () => void }) => {
  e.preventDefault();
  const data = getValues();
  try {
    if (!user) {
      const response = await createUser(data);
      setUploading(true); // Activar el estado de carga
      console.log('User created:', response.message);
      toast.success(`Usuario creado ID:${response.id}`);
      if (step_next) {
        step_next();
      }
    } else {
      if (!user.id) {
        toast.error(`ID del usuario no encontrado`);
        throw new Error('User ID is required for updating');
      }
      const response = await updateUsers(user.id, data);
      console.log('User updated:', response.message);
      toast.success(`Usuario actualizado ID:${user.id}`);
    }
    setTimeout(() => {
      router.push(paths.user.main);
    }, 2000);
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.message);
  } finally {
    setUploading(false); // Desactivar el estado de carga
  }
};

//======================End data submit handler ==========================================

//======================Start form handler functions ==========================================
const handleClose = () => {
  reset();
  router.push(paths.user.main);
};
//======================End form handler functions ==========================================


  useEffect(() => {
    if (user) {
      reset({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone_number: user.phone_number || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        access_type: user?.access_type || '',
        username: user?.username || '',
        password: user?.password || '',
        campaign: user?.campaign || 0,
        extension: user?.extension || 0,
      });
    } else {
      reset();
    }
  }, [user, reset]);

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        {/**
         * Component to upload avatar  - start
         */}
        {/*         <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <UploadAvatar
              value={field.value}
              onDrop={async (acceptedFiles: File[]) => {
                if (acceptedFiles.length > 0) {
                  const file = acceptedFiles[0];
                  const validationError = (() => {
                    if (file.size > 3145728) {
                      // 3 MB
                      return {
                        code: 'file-too-large',
                        message: `File is larger than ${fData(3145728)}`,
                      };
                    }
                    return null;
                  })();

                  if (validationError) {
                    alert(validationError.message);
                    return;
                  }

                 try {
                   // setUploading(true);
                    const response = await uploadAvatar(file);
                    setValue('avatar', response.file_path);
                    field.onChange(response.file_path);
                    alert('Avatar subido con éxito');
                  } catch (error) {
                    console.error('Error subiendo la imagen:', error);
                    alert('Error al subir la imagen.');
                  } finally {
                    setUploading(false);
                  }
                }
              }}
              validator={(fileData) => {
                if (fileData.size > 3145728) {
                  return {
                    code: 'file-too-large',
                    message: `File is larger than ${fData(3145728)}`,
                  };
                }
                return null;
              }}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          )}
        /> */}
        {/**
         * Component to upload avatar  - end
         */}
        <div>
        <Typography variant="subtitle2" mt={3}>
          Información General del Usuario
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
            Nombre(s)
          </Typography>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
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
            Apellido(s)
          </Typography>
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
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
            Correo Electrónico{' '}
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
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
            Número de Contacto{' '}
          </Typography>
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.phone_number}
                helperText={errors.phone_number?.message}
                margin="normal"
              />
            )}
          />
 <Typography variant="subtitle2" mt={3}>
          Configuración de Acceso
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
            *Configura el nivel de acceso y permisos dentro del sistema.
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
            Rol del Usuario{' '}
          </Typography>
          <Controller
            name="access_type"
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
                <option value="admin">Administrador/a</option>
                <option value="agent">Agente</option>
                <option value="monitor">Monitor/a</option>
              </TextField>
            )}
          />
        </div>
        {/**
         * Start Auth form
         */}
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
          Nombre de Usuario
        </Typography>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              error={!!errors.username}
              helperText={errors.username?.message}
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
          Contraseña de Acceso
        </Typography>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
              type="password"
            />
          )}
        />

        {/**
         * Auth form - End
         */}
        {/**
         * Set Service/campaign - Start
         */}
        <Typography variant="subtitle2" mt={3}>
          Asignación de Servicio de Atención (opcional){' '}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            mt: 3,
            mx: 'auto',
            display: 'block',
            textAlign: 'left',
            color: 'text.primary',
            ml: 1,
          }}
        >
          *Asigna al usuario/operador al servicio de atención.
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
          Cola de Atención
        </Typography>

        <Controller
          name="campaign"
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
              onChange={(e) => {
                field.onChange(e);
                fetchExtensions(Number(e.target.value));
              }}
            >
              <option value="">-</option>
              {services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </TextField>
          )}
        />
        {/**
         * Set Service/campaign - End
         */}
        {/**
         * Set Extension - Start
         */}
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
          Extensión Telefónica
        </Typography>
        <Controller
          name="extension"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="# de Extensión"
              fullWidth
              select
              SelectProps={{
                native: true,
              }}
              margin="normal"
            >
              <option value="">-</option>
              {extensions?.map((extension) => (
                <option key={extension.id} value={extension.id}>
                  {extension.identity}
                </option>
              ))}
            </TextField>
          )}
        />
        {/**
         * Set Extension - End
         */}
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
          <LoadingButton color="inherit" size="large" variant="outlined"  onClick={() => {
              if (step_back) {
              step_back();
              } else {
              handleClose();
              }
            }}>
          {closeBtnText()}
          </LoadingButton>
          <LoadingButton
            color="inherit"
            size="large"
            variant="contained"
            loading={uploading}
            type="submit"
          >
            {submitBtnText()}
          </LoadingButton>
        </Stack>
      </form>
    </>
  );
};

export default NewUser;