'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadAvatar } from 'src/components/upload/upload-avatar';
import { createUser, updateUsers, uploadAvatar } from 'src/services/user';
import { Scrollbar } from '../scrollbar';

import { getServices } from '@/src/services/campaing';
import { getExtensions } from '@/src/services/extension';

import { fData } from 'src/utils/format-number';
import { toast } from 'src/components/snackbar';


const userFormSchema = z.object({
  first_name: z.string().min(1, { message: 'El primer nombre es requerido' }),
  last_name: z.string().min(1, { message: 'El apellido es requerido' }),
  email: z
    .string()
    .email({ message: 'El correo electrónico debe ser válido' })
    .min(1, { message: 'El correo electrónico es requerido' }),
  phone_number: z.string().min(1, { message: 'El número de teléfono es requerido' }),
  avatar: z.string().url({ message: 'El avatar debe ser una URL válida' }),
  access_type: z.string().min(1, { message: 'El tipo de acceso es requerido' }),
  username: z.string().min(1, { message: 'El nombre de usuario es requerido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  campaign: z.number().optional(),
  extension: z.number().optional(),
});

type UserFormInputs = z.infer<typeof userFormSchema>;

interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

const ModalUser: React.FC<ModalFormProps> = ({ open, onClose, user = null }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      access_type: user?.access_type || '',
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Selecciona un archivo antes de subir!');
    }
    setUploading(true);
    try {
      const response = await uploadAvatar(selectedFile);
      setValue('avatar', response.file_path);
      console.log('Avatar uploaded');
    } catch (error) {
      console.error('Error uploading image', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: UserFormInputs) => {
    console.log('Form Submitted:', data);
    try {
      if (!data.avatar) {
        alert('Sube una imagen antes de guardar.');
        return;
      }
      console.log(data);

      if (!user) {
        createUser(data)
          .then((response) => {
            console.log('User created', response.message);
            toast.info(`Usuario creado con éxito ID:${response.id}`);
          })
          .catch((error) => {
            console.error('Error creating user:', error.message);
            toast.info(error.message);
          })
          .finally(() => {
            console.log('Create service finish');
          });
      } else {
        updateUsers(user.id, data)
          .then((response) => {
            console.log('User updated', response.message);
            toast.info(`Usuario actualizado con éxito:${response.message}`);
          })
          .catch((error) => {
            console.error('Error updating user:', error.message);
          })
          .finally(() => {
            console.log('Update service finish');
          });
      }
    } catch (error: any) {
      console.error('Error in form:', error.message);
      toast.error(error.message);
    } finally {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (user) {
      reset({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        phone_number: user.phone_number || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        access_type: user?.access_type || '',
      });
    } else {
      reset();
    }
  }, [user, reset]);

  return (
    <Modal open={open} onClose={handleClose}>
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
        <h2>{user ? 'Editar usuario' : 'Nuevo usuario'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/**
           * Component to upload avatar  - start
           */}
          <Controller
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
                      setUploading(true);
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
          />
          {/**
           * Component to upload avatar  - end
           */}
          <div>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombres"
                  fullWidth
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Apellidos"
                  fullWidth
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Correo electrónico"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  fullWidth
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="access_type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tipo de usuario"
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
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'left',
                      color: 'text.primary',
                    }}
                  >
                    Accesos
                  </Typography>
          <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Usuario"
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  margin="normal"
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  margin="normal"
                  type='password'
                />
              )}
            />

          {/**
           * Auth form - End
           */}
          {/**
           * Set Service/campaign - Start
           */}
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
                    Accesos
                  </Typography>
             <Controller
              name="campaign"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Campaña"
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
          {/**
           * Set Service/campaign - End
           */}
          {/**
           * Set Extension - Start
           */}
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
                    Accesos
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
                  <option value="admin">Administrador/a</option>
                  <option value="agent">Agente</option>
                  <option value="monitor">Monitor/a</option>
                </TextField>
              )}
            />
          {/**
           * Set Extension - End
           */}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
            {user ? 'Actualizar' : 'Guardar & Cerrar'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleClose}
          >
            Cerrar & Cancelar
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUser;