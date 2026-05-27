import { getSupportClient } from '@/src/services/support';
import { Divider, MenuItem, Stack, TextField } from '@mui/material';
import { Controller, FieldErrors, Control, UseFormSetValue } from 'react-hook-form';
import { useCallback } from 'react';
import { toast } from 'src/components/snackbar';

interface FormClientProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
}

interface TypeIdOptions {
  value: string;
  label: string;
}

export const FormClient: React.FC<FormClientProps> = ({ control, errors, setValue }) => {
  const optionTypeID: TypeIdOptions[] = [
    { value: 'DNI', label: 'Cédula' },
    { value: 'PASSPORT', label: 'Pasaporte' },
    { value: 'RIF', label: 'Rif' },
  ];

 
  const getClientData = useCallback(async (id_number: string) => {
    if (!id_number) return;

    try {
      const response = await getSupportClient({ id_number });

      if (response.client) {
        setValue("first_name", response.client.first_name || "");
        setValue("last_name", response.client.last_name || "");
        setValue("mail", response.client.mail || "");
        setValue("address", response.client.address || "");
        setValue("phone_number", response.client.phone_number || "");
      }
    } catch (error) {
       toast.error("Cliente no registrado, debe registrar los datos del cliente!");
      console.error("Error fetching client data", error);
    }
  }, [setValue]);


  return (
    <Stack spacing={3}>
       <Controller
        name="id_type"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Tipo de Identificación"
            value={field.value || ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => field.onChange(event.target.value)} // Actualiza el estado
            error={!!errors.id_type}
            helperText={typeof errors.id_type?.message === 'string' ? errors.id_type.message : ''}
          >
            {optionTypeID.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
            />
            <Controller
        name="id_number"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Número de Identificación"
            value={field.value || ''}
            onBlur={() => getClientData(field.value)} // Send the field value once the user finishes typing
            error={!!errors.id_number}
            helperText={typeof errors.id_number?.message === 'string' ? errors.id_number.message : ''}
          />
        )}
            />
            <Divider sx={{ mt: 3 }} />
            <Controller
        name="first_name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nombres"
            value={field.value || ''} // Asegura que siempre tenga un valor controlado
            error={!!errors.first_name}
            helperText={typeof errors.first_name?.message === 'string' ? errors.first_name.message : ''}
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
            value={field.value || ''}
            error={!!errors.last_name}
            helperText={typeof errors.last_name?.message === 'string' ? errors.last_name.message : ''}
          />
        )}
      />     
      <Controller
        name="mail"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Correo Electrónico"
            type="email"
            value={field.value || ''}
            error={!!errors.mail}
            helperText={typeof errors.mail?.message === 'string' ? errors.mail.message : ''}
          />
        )}
      />
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Dirección"
            value={field.value || ''}
            error={!!errors.address}
            helperText={typeof errors.address?.message === 'string' ? errors.address.message : ''}
          />
        )}
      />
      <Controller
        name="phone_number"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Número de Teléfono"
            value={field.value || ''}
            error={!!errors.phone_number}
            helperText={typeof errors.phone_number?.message === 'string' ? errors.phone_number.message : ''}
          />
        )}
      />
    </Stack>
  );
};
