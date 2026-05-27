'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import SipService from '@/src/lib/sip';

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
import { FormClient } from '@/src/components/client/form';
import { Iconify } from '../iconify';
import { color } from 'framer-motion';
import { Registerer } from 'sip.js';
import { set } from 'nprogress';

const timeFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const DOMAIN = process.env.WS_DOMAIN || '192.168.1.31';
const SERVER = process.env.WS_SERVER || 'wss://192.168.1.31:8089/ws';

interface IServiceForm {
  agent: number | null;
  client: number | null;
  status: string;
  start_at: string;
  end_at: string;
  observation: string;
  service: number | null;
}

export const serviceFormSchema = z.object({
  agent: z
    .number({
      required_error: 'El agente es requerido',
      invalid_type_error: 'El agente debe ser un número',
    })
    .int('El agente debe ser un número entero'),
  client: z
    .number({
      required_error: 'El cliente es requerido',
      invalid_type_error: 'El cliente debe ser un número',
    })
    .int('El cliente debe ser un número entero'),
  status: z
    .string({
      required_error: 'El estado es requerido',
    })
    .min(1, 'El estado no puede estar vacío'),
  start_at: z
    .string({
      required_error: 'La fecha de inicio es requerida',
      invalid_type_error: 'La fecha de inicio debe ser una cadena válida',
    })
    .regex(timeFormat, 'La fecha de inicio debe estar en formato ISO (YYYY-MM-DDTHH:mm:ss)'),
  end_at: z
    .string({
      required_error: 'La fecha de finalización es requerida',
      invalid_type_error: 'La fecha de finalización debe ser una cadena válida',
    })
    .regex(timeFormat, 'La fecha de finalización debe estar en formato ISO (YYYY-MM-DDTHH:mm:ss)'),
  observation: z
    .string({
      required_error: 'La observación es requerida',
    })
    .max(500, 'La observación no puede exceder los 500 caracteres'),
  service: z
    .number({
      required_error: 'El servicio es requerido',
      invalid_type_error: 'El servicio debe ser un número',
    })
    .int('El servicio debe ser un número entero'),
});

type ServiceFormInputs = z.infer<typeof serviceFormSchema>;

const NewService = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ServiceFormInputs>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      agent: undefined, // Valor predeterminado para el campo `agent`
      client: undefined, // Valor predeterminado para el campo `client`
      status: '', // Cadena vacía para `status`
      start_at: '', // Cadena vacía para `start_at`
      end_at: '', // Cadena vacía para `end_at`
      observation: '', // Cadena vacía opcional para `observation`
      service: undefined, // Valor predeterminado para `service`
    },
  });
  const [uploading, setUploading] = useState(false);
  /**
   * Call setup
   * @param data
   */

  const [status, setStatus] = useState('active');
  const [connected, setConnected] = useState(false);
  const [destination, setDestination] = useState('');
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [lastCaller, setLastCaller] = useState<string | null>(null);

  const [register, setRegister] = useState<null | Registerer>(null);
  const [incomingCall, setIncomingCall] = useState<null | string>(null);
  const [callActive, setCallActive] = useState(false);

  //=====================================Setup call session start ===========================================================
  //Set SIP configuration - take from user data
  const extension = '2003'; //'webrtc_test_user'
  const password = '123456';

  useEffect(() => {
    const initializeSip = async () => {
      try {
        const sipConfig = {
          username: "2003",
          password: "123456",
          domain: "192.168.1.33",
          wsServer: "wss://192.168.1.33:8089/ws",
          audioElement: document.getElementById("remoteAudio") as HTMLAudioElement
        };
        const response = await SipService.initialize(sipConfig);
        setConnected(response);
  
        // Escuchar llamadas entrantes
        SipService.onIncomingCall((caller) => {
          console.log(`📞 Llamada entrante de: ${caller}`);
          setIncomingCall(caller);
        });
      } catch (error) {
        console.error("Error al inicializar SIP:", error);
      }
    };
  
    initializeSip();
  
    return () => {
      SipService.terminate();
    };
  }, []);
  

  /* useEffect(() => {
    const initializeSip = async () => {
      try {
        const sipConfig = {
          username: extension,
          password: password,
          domain: DOMAIN,
          wsServer: SERVER,
          audioElement: audioRef.current! as HTMLAudioElement,
        };
        const response = await SipService.initialize(sipConfig);
        setConnected(response);
        //Get incoming call
        SipService.onIncomingCall((caller) => {
          console.log(`📞 Llamada entrante de: ${caller}`);
          setIncomingCall(caller);
          setLastCaller(caller); 
        });
      } catch (error) {
        console.error('Error while initializing SIP service:', error);
      }
    };
    //=====================================Setup call session end===========================================================

    //=========================================Setup devices start============================================================
    const checkMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
      } catch (error) {
        console.error('Error while getting audio permission:', error);
      }
    };
    //=========================================Setup devices end =============================================================

    checkMicPermission();
    initializeSip();

    return () => {
      //SipService.hangUp();
    };
  }, []); */

  useEffect(() => {
    console.log('SIP service initialized', connected);
  }, [connected]);

  useEffect(() => {
    /* if (SipService.hasCurrentSession()) {
      setCallActive(true);
    } else {
      setCallActive(false);
    } */
  }, [incomingCall]);

  //=====================================Setup call handling start ===========================================================
  const handleCall = () => {
    if (destination.trim()) {
      //SipService.makeCall(destination);
    }
  };

  const handleHangUp = () => {
    //SipService.hangUp();
  };

  const handleLogout = async () => {
    try {
      //await SipService.terminate(); // Terminar la sesión actual
      setConnected(false);
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  };
  //=====================================Setup call handling end   ===========================================================

  const onSubmit = async (data: IServiceForm) => {
    console.log(data);
    try {
      // Lógica para enviar los datos del formulario al servidor
      // await createUser(data);
      // reset();
    } catch (error) {
      console.error(error);
    }
  };

 /*  useEffect(() => {
    const register = () => {
      return SipService.registerer;
    }
    setRegister(register);
    console.log('Getting registerer...', register);
  }, [register]); */
  return (
    <>
      <div>
      <h1>WebRTC con SIP.js en Next.js</h1>
      <p>Estado: {connected ? "Conectado" : "Desconectado"}</p>
      <p>Última llamada de: {lastCaller || "Ninguna"}</p>
      <p>{hasMicPermission ? "Micrófono habilitado" : "Permisos de micrófono requeridos"}</p>
      <input
        type="text"
        placeholder="Destino"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={handleCall} disabled={!hasMicPermission || !connected}>
        Llamar
      </button>
     {/*  <button onClick={handleHangUp} disabled={!SipService.hasCurrentSession()}>
        Colgar
      </button> */}
      <button onClick={handleLogout}>
        Logout
      </button>
      <audio ref={audioRef} style={{ display: "none" }} />
    </div> 
        {incomingCall && (
      <div style={{ padding: 20, background: '#f5f5f5', borderRadius: 8 }}>
        <Typography variant="h6">📞 Llamada entrante de {incomingCall}</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" color="success" onClick={() => SipService.acceptCall()}>
            Contestar
          </Button>
          <Button variant="outlined" color="error" onClick={() => setIncomingCall(null)}>
            Rechazar
          </Button>
        </Stack>
      </div>
    )}
      <Divider sx={{ mt: 3 }} />
      {callActive && (
        <div style={{ padding: 20, background: '#e3f2fd', borderRadius: 8 }}>
          <Typography variant="h6">📞 Llamada en curso</Typography>
         {/*  <Button variant="contained" color="error" onClick={() => SipService.hangUp()}>
            Colgar
          </Button> */}
        </div>
      )}
      <ComponentBlock
        title={`Extensión | #${extension}`}
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
            secondary={
              <>
                {connected === true ? (
                  <Iconify
                    icon="carbon:checkmark-outline"
                    width={16}
                    sx={{ flexShrink: 0, mr: 0.5 }}
                  />
                ) : (
                  <Iconify icon="carbon:close-outline" width={16} sx={{ flexShrink: 0, mr: 0.5 }} />
                )}
                <Typography
                  variant="caption"
                  color={connected === true ? 'success.main' : 'error.main'}
                >
                  {connected === true ? 'Conectado' : 'Desconectado'}
                </Typography>
              </>
            }
            primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              noWrap: true,
              display: 'flex',
              component: 'span',
              alignItems: 'center',
              typography: 'caption',
              color: connected === true ? 'success.main' : 'error.main',
            }}
          />
          <ListItemText
            primary="Estado del Servicio"
            secondary={
              <>
                {connected === true ? (
                  <Iconify icon="ph:phone-call-light" width={16} sx={{ flexShrink: 0, mr: 0.5 }} />
                ) : (
                  <Iconify
                    icon="solar:call-chat-linear"
                    width={16}
                    sx={{ flexShrink: 0, mr: 0.5 }}
                  />
                )}
                En Línea | Asistida
              </>
            }
            primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              noWrap: true,
              display: 'flex',
              component: 'span',
              alignItems: 'center',
              typography: 'caption',
              color: status === 'active' ? 'success.main' : 'error.main',
            }}
          />
        </Card>
      </ComponentBlock>
      <Divider sx={{ mt: 3 }} />
      <ComponentBlock
        title="Control de Llamada"
        sx={{ flexDirection: 'column', alignItems: 'unset', paddingBottom: 3, paddingTop: 3 }}
      >
        <ServiceNavBar />
      </ComponentBlock>
      <Divider sx={{ mt: 3 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ComponentBlock
          title="Datos Cliente"
          sx={{ flexDirection: 'column', alignItems: 'unset', paddingBottom: 3, paddingTop: 3 }}
        >
          <FormClient control={control} errors={errors} />
        </ComponentBlock>
        <Divider sx={{ mt: 3 }} />
        <ComponentBlock
          title="Datos Servicio"
          sx={{ flexDirection: 'column', alignItems: 'unset', paddingBottom: 3, paddingTop: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={3}>
            <Controller
              name="start_at"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha de Inicio"
                  type="datetime-local"
                  error={!!errors.start_at}
                  helperText={errors.start_at ? errors.start_at.message : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <Controller
              name="end_at"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha de Finalización"
                  type="datetime-local"
                  error={!!errors.end_at}
                  helperText={errors.end_at ? errors.end_at.message : ''}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </Stack>
          <Stack>
            <Controller
              name="service"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Categoría"
                  type="number"
                  error={!!errors.service}
                  helperText={errors.service ? errors.service.message : ''}
                >
                  <MenuItem key="1" value="1">
                    - servicio 1
                  </MenuItem>
                </TextField>
              )}
            />
            <Divider sx={{ mt: 3 }} />
            <Controller
              name="observation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observación"
                  multiline
                  rows={4}
                  error={!!errors.observation}
                  helperText={errors.observation ? errors.observation.message : ''}
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

export default NewService;