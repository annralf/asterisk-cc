'use client';

import { z as zod } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '@/src/auth/hooks';
import { getAuth, IUserAuth } from '@/src/services/userAuth';
import { toast } from 'src/components/snackbar';
import { Typography } from '@mui/material';

import { getUserSession } from '@/src/auth/context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  username: zod.string().min(1, { message: 'user is required!' }),
  //.user({ message: 'user must be a valid user address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(1, { message: 'Password must be at least 6 characters!' }),
});
// ----------------------------------------------------------------------

interface IForm {
  step_next: () => void | null;
  step_back: () => void | null;
}
const UserInitAuth: React.FC<IForm> = ({ step_next = null, step_back = null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const user = getUserSession();
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const password = useBoolean();
  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: '', 
      password: '', 
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      // Simulate a delay for loading data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  //========================Start data submit ===========================================================================
  const onSubmit = handleSubmit(async (data: IUserAuth) => {
    try {
      await getAuth(data);
      await checkUserSession?.();
      if (step_next) {
        step_next();
      }
    } catch (error) {
      const errorMsj = error.message;
      toast.error("Usuario/Contraseña Incorrectos");
      console.log(errorMsj);
    }
  });
  //========================End data submit ===========================================================================

  if (isLoading) {
    return <Typography variant="h6" textAlign="center">Cargando...</Typography>;
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box gap={3} display="flex" flexDirection="column">
        <Typography variant="subtitle2" mt={3}>
          Acceso a la Configuración Inicial
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
          *Para iniciar la configuración del sistema, ingresa el usuario y contraseña que te
          fueron suministrados. Estos credenciales son exclusivos para la primera configuración y
          permitirán establecer los parámetros iniciales del sistema.
        </Typography>
        <Field.Text
          name="username" // Cambia a 'user' como se especifica en el schema
          label="Usuario de Acceso | Configuración Inicial"
          InputLabelProps={{ shrink: true }}
        />
        <Box gap={1.5} display="flex" flexDirection="column">
          <Link
            component={RouterLink}
            href={paths.auth.jwt.signUp} // Actualiza la ruta para "Olvidé la clave"
            variant="body2"
            color="inherit"
            sx={{ alignSelf: 'flex-end' }}
          >
            Olvidé la clave
          </Link>

          <Field.Text
            name="password"
            label="Contraseña"
            placeholder="Contraseña de Acceso"
            type={password.value ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          loadingIndicator="Ingresando ..."
        >
          {
            step_next ? 'Continuar' : 'Ingresar'
          }
        </LoadingButton>
        <Typography variant="caption" textAlign="center" color="text.secondary" sx={{ mt: 2 }}>
          *Si tienes problemas con el acceso, verifica tus credenciales o contacta al
          administrador del sistema.
        </Typography>
      </Box>
    </Form>
  );
};

export default UserInitAuth;