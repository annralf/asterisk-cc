import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { updateUser } from '@/src/store/slices/stepFormSlice';


const userFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  documentType: z.string(),
  documentNumber: z.string().min(1, { message: 'Document number is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(1, { message: 'Username is required' }),
  extention: z.string(),
});

type UserFormInput = z.infer<typeof userFormSchema>;

interface UserFormProps {
  onNext: () => void;
  onBack: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onNext, onBack }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.form.user);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: userData,
  });

  const onSubmit = (data: UserFormInput) => {
    dispatch(updateUser(data));
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              variant="outlined"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              variant="outlined"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="documentType"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Document Type"
              variant="outlined"
              fullWidth
            />
          )}
        />
        <Controller
          name="documentNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Document Number"
              variant="outlined"
              error={!!errors.documentNumber}
              helperText={errors.documentNumber?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              variant="outlined"
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username"
              variant="outlined"
              error={!!errors.username}
              helperText={errors.username?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="extention"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Extention"
              variant="outlined"
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

export default UserForm;
