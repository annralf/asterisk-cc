'use client';

import {
  Container,
  Box,
  Paper,
  Button,
  styled,
  Typography,
  Stack,
  Divider,
  CircularProgress,
  TextField,
} from '@mui/material';

import { Iconify } from '../iconify';
import { stylesMode, varAlpha } from '@/src/theme/styles';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceFormSchema } from './new';

import { getExtensions } from '@/src/services/extension';
import { useEffect, useState } from 'react';
import { useRouter } from '@/src/routes/hooks/use-router';

import sipConn from '@/src/lib/sipConn';
import { paths } from 'src/routes/paths';
import { Sip } from '@mui/icons-material';
import { createSystemLog, getSystemLogs, updateSystemLog } from '@/src/services/systemLog';

const ITextCall = z.object({
  extension1: z.string().nonempty('Extensión #01 es requerido'),
  toCall1: z.string().optional(),
  extension2: z.string().nonempty('Extensión #02 es requerido'),
  toCall2: z.string().optional(),
});

type ServiceFormInput = z.infer<typeof ITextCall>;

const TestCall = ({is_setup = false}) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      extension1: '',
      toCall1: '',
      extension2: '',
      toCall2: '',
    },
  });
  const router = useRouter();
  const [extensions, setExtensions] = useState<any[]>([]);

  const [connected1, setConnected1] = useState(false);
  const [call1, setCall1] = useState('');
  const [incomingCall1, setIncomingCall1] = useState<string | null>(null);

  const [connected2, setConnected2] = useState(false);
  const [call2, setCall2] = useState('');
  const [incomingCall2, setIncomingCall2] = useState<string | null>(null);

  const [destination, setDestination] = useState('');

  const selectedExtension1 = watch('extension1');
  const selectedExtension2 = watch('extension2');

  //=========================Start extensions fetching ==========================================================
  useEffect(() => {
    const fetchData = async () => {
      const response = await getExtensions();
      setExtensions(response.extensions);
    };
    fetchData();
  }, []);
  //=========================End extensions fetching ============================================================

  //=========================Start Connection Handling ==========================================================
  useEffect(() => {
    sipConn.onConnectionStatus(({ ext, isConnected }) => {
      if (ext === 1) {
        setConnected1(isConnected);
      } else if (ext === 2) {
        setConnected2(isConnected);
      }
    });
  }, []);
  //=========================End Connection Handling ==========================================================

  //=========================Start Call Handling ==========================================================
  const handleSipConnection = async (extNumber: number, extension: string, password: string) => {
    const connectionStatus = await sipConn.initialize({
      username: extension,
      password,
      audioElement: document.getElementById('remoteAudio') as HTMLAudioElement,
      extNumber,
    });

    if (extNumber === 1) {
      setConnected1(connectionStatus);
    } else if (extNumber === 2) {
      setConnected2(connectionStatus);
    }
  };

  const handleSipCall = (type: number) => {
    let destination;
    switch (type) {
      case 1:
        destination = getValues('toCall1');
        if (destination) {
          sipConn.makeCall(1, destination);
        }
        break;
      case 2:
        destination = getValues('toCall2');
        if (destination) {
          sipConn.makeCall(2, destination);
        }
        break;
    }
  };

  const handleDisconnect = (type: number) => {
    sipConn.logout(type);
  };
  //=========================End Call Handling ==========================================================
  //=========================Start System log update ==========================================================
  const updateSystemStatus = async () => {
    const data = {
      service_status: "Configured",
      setup: true
    }
    const result = await getSystemLogs();
    if (result?.system_log[0]){
      await updateSystemLog(data, 1).then((data) => {
        console.log("System Setup ok");
      });
    }else{
      await createSystemLog(data).then((data) => {
        console.log("System Setup ok");
      });
    }
    router.push(paths.admin.main);

  }
  //=========================End System log update ==========================================================

  useEffect(() => {
    console.log(selectedExtension1, selectedExtension2);
  }, [selectedExtension1, selectedExtension2]);
  return (
    <>
      <Container sx={{ pt: { xs: 3, md: 5 }, pb: 10 }}>
        <Typography variant="h3" align="center" sx={{ mb: 2 }}>
          Verificación de Configuración Inicial
        </Typography>
        <Typography variant="h5" align="center" sx={{ mb: 15 }}>
          Test de Conexión entre Extensiones
        </Typography>
        <Stack spacing={2} direction="row" justifyContent="center" width="100%">
          <Paper
            sx={{
              p: 2,
              bgcolor: varAlpha('primary', 0.1),
              boxShadow: '7px 12px 20px 0 rgb(28 18 18 / 16%)',
              borderRadius: 2,
              justifyItems: 'center',
              alignItems: 'center',
              alignContent: 'center',
              width: '100%',
              height: 'auto',
            }}
          >
            <Stack spacing={2} direction="column" alignItems="center" width="100%" pb={5} pt={5}>
              <form style={{ width: '80%' }}>
                <Stack spacing={2} direction="column" justifyContent="start">
                  <Typography variant="subtitle2">Extensión #01</Typography>
                  <Controller
                    name="extension1"
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
                        {extensions
                          .filter((ext) => ext.id !== selectedExtension2)
                          .map((extension) => (
                            <option key={extension.id} value={extension.id}>
                              {extension.identity}
                            </option>
                          ))}
                      </TextField>
                    )}
                  ></Controller>
                </Stack>
                <Stack spacing={2} direction="row" justifyContent="start">
                  {connected1 ? (
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#1a5e81' }}
                      onClick={() => {
                        handleDisconnect(1);
                        setConnected1(false);
                      }}
                    >
                      Desconectar
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#1a5e81' }}
                      onClick={() => {
                        const { password } =
                          extensions.find((ext) => ext.id === selectedExtension1) || {};
                        handleSipConnection(1, selectedExtension1, password);
                        setConnected1(true);
                      }}
                    >
                      {' '}
                      Probar Conexión de Extensión con Servidor Optimus
                    </Button>
                  )}
                </Stack>
                <Typography variant="caption" color={connected1 ? 'success.main' : 'error.main'}>
                  {connected1 ? 'Extensión #01 Conectada' : 'Extensión #01 Desconectada'}
                </Typography>
              </form>
            </Stack>
          </Paper>
        </Stack>
        <Divider sx={{ my: 5 }} />
        {
          is_setup && (
            <Stack spacing={2} direction="row" justifyContent="end">
              <Button
              variant="contained"
                sx={{ mr: 'auto' }}
                onClick={updateSystemStatus}
              >
                Finalizar Configuración
              </Button>
            </Stack>
          )
        }
      </Container>
    </>
  );
};

export default TestCall;