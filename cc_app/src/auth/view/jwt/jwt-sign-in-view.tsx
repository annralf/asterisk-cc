'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
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

import { useAuthContext } from '../../hooks';
import { FormHead } from '../../components/form-head';
import { signInWithPassword } from '../../context/jwt';
import { getAuth, IUserAuth } from '@/src/services/userAuth';
import { useSearchParams } from 'next/navigation';
import { toast } from 'src/components/snackbar';
import { clearLocalSession } from '@/src/auth/context/jwt';

// ----------------------------------------------------------------------  

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  username: zod
    .string()
    .min(1, { message: 'user is required!' }),
  //.user({ message: 'user must be a valid user address!' }),  
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(1, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------  

export function JwtSignInView() {
  const router = useRouter();
 // clearLocalSession();

  const { checkUserSession } = useAuthContext();

  const [ errorMsg, setErrorMsg ] = useState('');
  const password = useBoolean();
  const searchParams = useSearchParams(); // <-- Obtener parámetros de URL
  const returnTo = searchParams.get('returnTo') || paths.agent.main; // <--
  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: '', // Inicializa el valor del user  
      password: '', // Inicializa el valor de la contraseña  
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: IUserAuth) => {
    try {
      let returnUrl: any = "/";
      await getAuth(data).then((e) => {
        returnUrl = paths[e.user.access_type as keyof typeof paths];
        if(returnUrl.main){
          router.push(returnUrl.main);      
        }else{
          router.push(returnUrl);      
        }
      })
      //await signInWithPassword({ email: data.user, password: data.password });  
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      const errorMsj = error.message ;
      toast.error(errorMsj);
      console.log(error.message);
      //setErrorMsg(typeof error === 'string' ? error : error.message);  
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        name="username" // Cambia a 'user' como se especifica en el schema  
        label="user"
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
          placeholder="Contraseña"
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
        Ingresar
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Inicio de sesión"
        description={
          <>
            <b>Bienvenido a Optimus Call Center:</b>
            {` Acceso a la consola`}
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}