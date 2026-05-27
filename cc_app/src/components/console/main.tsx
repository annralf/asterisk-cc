'use client';
//Libraries Definition
import SipService from '@/src/lib/sip';
import { useState, useCallback, useEffect, useRef, use } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

//Components Definition
import { ConsoleAnalytic } from './analytic';
import { DashboardContent } from '@/src/layouts/dashboard';
import { IPagination, IUser } from '@/src/types/app';
import { CustomBreadcrumbs } from '../custom-breadcrumbs';
import { Scrollbar } from '../scrollbar';
import { ComponentBlock } from '@/src/sections/_examples/component-block';
import { Iconify } from '../iconify';
import { FormClient } from '@/src/components/client/form';
import { toast } from 'src/components/snackbar';
import {
  Box,
  Card,
  Table,
  Divider,
  Button,
  TableBody,
  Tabs,
  Tab,
  Stack,
  ListItemText,
  Typography,
  TextField,
  MenuItem,
  Select,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { useRouter } from '@/src/routes/hooks';
import { useForm, Controller } from 'react-hook-form';

//Services Definition
import { getAgentSession, getUserSession } from '@/src/auth/context/jwt';
import { getSingleServiceAgent } from '@/src/services/servicesAgent';
import { getSingleAgent, updateActivity, updateAgent } from '@/src/services/agent';
import { getServiceCategoryList } from '@/src/services/serviceCategory';
import { createSupport } from '@/src/services/support';
import { getTodaysAgentActivities } from '@/src/services/stats';
import { set } from 'nprogress';

//Types Definition
const timeFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
export const serviceFormSchema = z.object({
  observation: z
    .string({
      required_error: 'La observación es requerida',
    })
    .max(500, 'La observación no puede exceder los 500 caracteres'),
  category_service: z
    .number({
      required_error: 'Debe asignar una tipificación a la atención',
    }),
  id_type: z.string({
    required_error:'Debe seleccionar el tipo de documento de identidad'
  }),
  id_number: z.string({
    required_error:'Debe ingresar el numero de cédula'
  }),
  first_name: z.string({
    required_error:'Debe ingresar los nombres del cliente'
  }),
  last_name: z.string({
    required_error:'Debe ingresar los apellidos del cliente'
  }),
  mail: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string({
    required_error:'Debe ingresar el numero de contácto del cliente'
  }),
});
type ServiceFormInputs = z.infer<typeof serviceFormSchema>;

//Main Component Definition
const NewConsole = () => {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    getValues,
  } = useForm<ServiceFormInputs>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      observation: '', 
      category_service: undefined,
    },
  });

  // -------------------------- Call flow setup start ----------------------------
  const [agentUser, setAgentUser] = useState<null | IUser>(null);
  const [status, setStatus] = useState('Disponible');
  const [connected, setConnected] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [incomingCall, setIncomingCall] = useState<boolean>(false);
  const [callActive, setCallActive] = useState(false);
  const [supportCall, setSupportCall] = useState(false);
  // -------------------------- Call flow setup end ----------------------------

  //Set SIP configuration - take from user data
  const [campaign, setCampaign] = useState<null | any>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [extension, setExtension] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 16));
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [serviceStatus, setServiceStatus] = useState<string>("");
  const [stats, setStats] = useState<any>([]);
  const [toPlay, setToPlay] = useState(false);

  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(0);
  const [rejected, setRejected] = useState(0);
  //--------------------- Get Agent Session ------------------------------
  const agentAccess = async () => {
    try {
      const session = await getAgentSession();
      const user = await getUserSession();

      if (!session || !user) {
        console.warn('No se pudo obtener la sesión del agente o usuario.');
        return;
      }

      const user_name = `${user.first_name || ''} ${user.last_name || ''}`;
      setOperator(user_name);
      setUsername(session.extension || '');
      setExtension(session.extension || '');
      setPassword(session.pw || '');
      setAgentUser(user);
      if (user.id) {
        const service_detail = await getSingleServiceAgent(user.id);
        setCampaign(service_detail);
        getCategories(service_detail.service.id);
      }
    } catch (error) {
      console.error('Error fetching agent session:', error);
    }
  };
  //--------------------- Get Agent Session ------------------------------
  //--------------------- Set Agent Status ------------------------------
  const getStatus = async () => {
    try {
      if (agentUser && agentUser.id) {
        const response = await getSingleAgent(agentUser.id);
        console.info(response);
        setStatus(response.status);
      }
    } catch (error) {
      console.error('Error during fetch Agent Status', error);
    }
  };
  const updateStatus = async (status: string) => {
    try {
      if (agentUser && agentUser.id) {
        const data = {
          status: status,
        };
        const response = await updateAgent(agentUser.id, data);
        statusLog(status);
        console.info(response);
      }
    } catch (error) {
      console.error('Error trying update agent status', error);
    }
  };

  const statusLog = async(status:string) => {
    try{
      if(agentUser && agentUser.id){
        const data = {
          user:  agentUser.id,
          status: status
        }
        const response =  await updateActivity(data); 
        console.info("Update activity", response.id);
      }
      else{
        console.warn("Update activity no data Agent");
      }
    }catch(error){
      console.error("Error during updating Agent activity", error);
    }
  }
  //--------------------- Set Agent Status -----------------------------------
  //--------------------- Manager options fetch ------------------------------
  const getCategories = async (service: number) => {
    try {
      const response = await getServiceCategoryList(service);
      if (response.categories.length > 0) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error fetching categories list', error);
    }
  };
  //--------------------- Manager options fetch ------------------------------

  //--------------------------- Setup Call Center Service --------------------
  const DOMAIN = process.env.WS_DOMAIN || "10.134.0.147";
  const WS_SERVER = process.env.WS_SERVER || "wss://10.134.0.147:8089/ws";
  /**
   * Inicializar el servicio SIP
   */
  useEffect(() => {    
    //Initialize SIP service
    const startSip = async () => {
      try {
        await agentAccess();
        if(username && password){
          //Setup SIP configuration - take from user data
          const sipConfig = {
            username: username,
            password: "10033XVAkw",//password,
            domain: DOMAIN,
            server: WS_SERVER,
            audioElement: audioRef,
          };
          console.log('📞 SIP service initializing...', sipConfig);
          SipService.init(sipConfig).then((response) => {
            setConnected(response);
            console.log('✅ SIP service initialized');
          });
          //Add Event Listeners         
          const states = SipService.getSessionState();
          if(SipService.userAgent){
            SipService.userAgent.delegate = {
              onInvite: async (invitation) => {
                console.log('📞 Incoming call');
                setIncomingCall(true); 
                SipService.setSession(invitation);
                console.log('📡 Session:', SipService.session);
                invitation.stateChange.addListener((newState) => {
                  console.log(`📡 Call state changed: ${newState}`);
                  if (newState === states.Terminated) {
                    console.log("📞 Call was not answered or was rejected");
                    setIncomingCall(false);
                  }
                });        
              },          
            };
          }
        }else{
          console.error('❌ Error initializing SIP service: No username or password');
        }
      } catch (error) {
        console.error('❌ Error initializing SIP service:', error);
      }
    };
    //Start SIP service
    startSip();
  }, [username, password]);

 /**
  * Get agent current status
  */
  useEffect(() => {
    getStatus();
  }, []);

  /**
   * Setup ringtone call
  */  
  const ringAudio = new Audio('/ringtone.mp3');
  const playRing = () => {
    ringAudio.loop = false;  // Para que suene continuamente
    ringAudio.play().catch(error => console.error("Error al reproducir el timbre:", error));
  };
  const stopRing = () => {
    ringAudio.pause();
    ringAudio.currentTime = 0;
  };

  /**
   * Setup incoming call
  */
  /* useEffect(() => {    
    if (incomingCall) {
      playRing();
    }else{
      stopRing();
    }
  }, [incomingCall]);
 */
  /**
   * Setup agent console
  */
  useEffect(() => {}, [categories]);

  /**
   * Setup Agent Devices
  */
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log("🎤 Permiso concedido para el micrófono");
      })
      .catch((error) => {
        console.error("🚫 Error obteniendo permiso de micrófono:", error);
      });
  }, []);
  //--------------------------- Setup Call Center Service ----------------------

  //===========================setup call handling start =======================

  /**
   * Handle handup call
   */
  const handleHangUp = async() => {
    stopRing();
    SipService.hangup().then(() => {
      console.log('Hanging Up Call...');
      setIncomingCall(false);
      setCallActive(false);
      setServiceStatus('hangup');
      SipService.terminate();
    } 
    ).catch((error: unknown) => {
      console.error('Error hanging up call:', error);
    });
  };
  /**
   * Handle incoming call answer
  */
 useEffect(() => {
  if(SipService.isCalling){
    console.log('📞 Incoming call...', SipService.isCalling);
    setIncomingCall(true);
  }
 },[SipService.isCalling]);

 const answerCall = async () => {
  try {
    const response = await SipService.answerShd();
    
    if (!response) {
      console.error('❌ No se recibió SessionDescriptionHandler.');
      return;
    }

    setIncomingCall(false);
    console.log('📞 Call answered...', response);
    setCallActive(true);
    setServiceStatus('answered');

    // Obtener la conexión RTC
    const peerConnectionRemote = response.peerConnection;
    
    if (!peerConnectionRemote) {
      console.error('❌ No se pudo obtener la conexión RTC.');
      return;
    }

    console.log('📡 Peer connection:', peerConnectionRemote);

    peerConnectionRemote.onicecandidate = (event) => {
      console.log("📡 ICE Candidate Event:", event);
      if (event.candidate) {
        console.log("📡 ICE Candidate:", event.candidate.candidate);
      } else {
        console.log("✅ No hay más candidatos ICE.");
      }
    };
    
    peerConnectionRemote.oniceconnectionstatechange = () => {
      console.log("🔄 Estado ICE:", peerConnectionRemote.iceConnectionState);
      if (peerConnectionRemote.iceConnectionState === "failed") {
        console.error("❌ ICE Connection Failed. Reiniciando ICE...");
        peerConnectionRemote.restartIce();
      }
    };

    // Crear el stream remoto
    const remoteMediaStream = new MediaStream();
    console.log('📞 Remote stream created', remoteMediaStream);

    // Agregar tracks al stream remoto
    peerConnectionRemote.getReceivers().forEach((receiver: RTCRtpReceiver) => {
      if (receiver.track && receiver.track.kind === 'audio') {
        console.log('🔊 Track recibido:', receiver.track);
        remoteMediaStream.addTrack(receiver.track);
      } else {
        console.error('❌ No se recibió track en el receptor', receiver);
      }
    });

    // Validar Media streams
    console.log('🎙️ Tracks del MediaStream:', remoteMediaStream.getTracks());

    if (remoteMediaStream.getTracks().length === 0) {
      console.error("❌ No hay tracks en el MediaStream, no se puede reproducir audio");
      return;
    }

    // Reproducir el stream remoto en el audioElement
    setTimeout(() => {
      if (audioRef?.current) {
        audioRef.current.srcObject = remoteMediaStream;
        audioRef.current.muted = false;
        audioRef.current.volume = 1.0;
        audioRef.current.play()
          .then(() => console.log('📞 Audio playing!'))
          .catch((error) => console.error('❌ Error al reproducir audio:', error));
      } else {
        console.error('❌ Elemento de audio no disponible');
      }
    }, 1000);

  } catch (error) {
    console.error('❌ Error answering call:', error);
  }
};
  
  //======================= Form handling start ============================
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //await registerSupport("finished");
  }; 
  // --------------- Stats handler -----------------------------------------------
  /**
   * Get agent stats
  */
  const getStats = async() => {
    const agent = campaign?.extension?.agent;
    const response = await getTodaysAgentActivities(agent);
    const total = response.reduce((acc: number, curr: { status: string; total: number }) => acc + curr.total, 0);
    setTotal(total);
    const rejectedCalls = response.find((item: { status: string }) => ['rejected', 'handup'].includes(item.status));
    if (rejectedCalls) {
      setRejected(rejectedCalls.total);
    }
    const finished = response.find((item: { status: string }) => item.status === 'finished');
    if (finished) {
      setFinished(finished.total);
    }
    setStats(response);
  }
useEffect(() => {
  console.log(campaign);
  if(campaign){
    getStats();
  }
},[campaign]);

useEffect(() => {},[finished, rejected, total]);
// --------------- Stats handler -----------------------------------------------
useEffect(() => {},[serviceStatus, incomingCall, callActive]);


  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={campaign?.service?.name ? campaign.service.name.toUpperCase() : ''}
          links={[
            {
              name: '-',
            },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ComponentBlock
          title={`Extensión | ${extension}`}
          sx={{ flexDirection: 'column', alignItems: 'unset', paddingBottom: 3, paddingTop: 3 }}
        >
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              direction: 'row',
              p: (theme: any) => theme.spacing(3, 2, 3, 3),
            }}
          >
            <ListItemText
              primary={`Operador - ${operator}`}
              secondary={
                <>
                  {connected === true ? (
                    <Iconify
                      icon="carbon:checkmark-outline"
                      width={16}
                      sx={{ flexShrink: 0, mr: 0.5 }}
                    />
                  ) : (
                    <Iconify
                      icon="carbon:close-outline"
                      width={16}
                      sx={{ flexShrink: 0, mr: 0.5 }}
                    />
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
                    <Iconify
                      icon="ph:phone-call-light"
                      width={16}
                      sx={{ flexShrink: 0, mr: 0.5 }}
                    />
                  ) : (
                    <Iconify
                      icon="solar:call-chat-linear"
                      width={16}
                      sx={{ flexShrink: 0, mr: 0.5 }}
                    />
                  )}
                   {status === 'Disponible' ? 'En Línea' : supportCall ? 'Asistida' : 'Desconectado'}
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
                color: status === 'Disponible' ? 'success.main' : 'error.main',
              }}
            />
                        <Box
              display="flex"
              alignItems="center"
              sx={{
              padding: '6px 12px',
              }}
            >
              <Typography textAlign="center" sx={{ mr: 2 }}>
              Estado:
              </Typography>
              <Select
              defaultValue={status}
              onChange={(e) => {
                const val = e.target.value;
                updateStatus(val);
                setStatus(val);
              }}
              >
              <MenuItem
                value="Disponible"
                sx={{ color: status === 'Disponible' ? 'green' : 'inherit' }}
              >
                Disponible
              </MenuItem>
              <MenuItem value="En descanso">En descanso</MenuItem>
              </Select>
            </Box>
          </Card>
        </ComponentBlock>
        <ComponentBlock
          title="Estado de la Operación"
          sx={{
            flexDirection: 'column',
            alignItems: 'unset',
            mt: 5,
            paddingTop: 3,
            paddingBottom: 3,
          }}
        >
          <Card>
            <Scrollbar sx={{ minWidth: 800 }}>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                <ConsoleAnalytic
                  title="Total de Llamadas"
                  total={total}
                  icon="material-symbols-light:call-end-sharp"
                  color={theme.vars.palette.info.main}
                  percent={100}
                />
                <ConsoleAnalytic
                  title="Llamadas Atendidas"
                  total={finished}
                  icon="garden:call-in-26"
                  color={theme.vars.palette.info.main}
                  percent={100}
                />
                <ConsoleAnalytic
                  title="Llamadas Rechazadas"
                  total={rejected}
                  icon="garden:call-in-26"
                  color={theme.vars.palette.info.main}
                  percent={100}
                />
              </Stack>
            </Scrollbar>
          </Card>
        </ComponentBlock>
        <Divider sx={{ mt: 3 }} />
        <ComponentBlock
          title="Control de Operación"
          sx={{
            flexDirection: 'column',
            alignItems: 'unset',
            mt: 5,
            paddingTop: 3,
            paddingBottom: 3,
          }}
        >
          <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={answerCall}
                    disabled={!incomingCall || serviceStatus === 'answered'}
                    sx={{
                      backgroundColor: incomingCall && serviceStatus !== 'answered' ? '#FF5630' : 'inherit',
                      '&::after': incomingCall && serviceStatus !== 'answered'
                        ? {
                            content: '"..."',
                            animation: 'dots 1s steps(5, end) infinite',
                          }
                        : 'none',
                      '@keyframes dots': {
                        '0%, 20%': { color: 'rgba(0,0,0,0)' },
                        '20%, 40%': { color: 'rgba(0,0,0,0.5)' },
                        '40%, 60%': { color: 'rgba(0,0,0,1)' },
                        '60%, 80%': { color: 'rgba(0,0,0,0.5)' },
                        '80%, 100%': { color: 'rgba(0,0,0,0)' },
                      },
                    }}
                  >
                    <Iconify mr={2} icon="streamline:hang-up-2" /> {incomingCall ? 'Llamada Entrante | Contestar' : 'Sin Llamadas'}
                  </Button>
                <Button variant="outlined" color="error" onClick={handleHangUp} disabled={!callActive}>
                <Iconify mr={2} icon="tdesign:call-off" /> Rechazar
                </Button>
                <Button variant="outlined" color="error" disabled={!callActive}>
                <Iconify mr={2} icon="ix:support" /> Pedir Soporte
                </Button>
            </Stack>      
          </Stack>
          <Divider sx={{ mt: 3 }} />
          <Stack direction="row" spacing={2}>
            <audio ref={audioRef} id="sipAudio" controls onPlay={() => console.log('Audio is playing')} onPause={() => console.log('Audio is paused')} />                    
            </Stack>
        </ComponentBlock>
        {
          callActive &&
          (
            <>
              <Divider sx={{ mt: 3 }} />
            <ComponentBlock
              title="Control de Llamada"
              sx={{
                flexDirection: 'column',
                alignItems: 'unset',
                mt: 5,
                paddingTop: 3,
                paddingBottom: 3,
              }}
            >
            </ComponentBlock>
            </>

          )
        }
        <Divider sx={{ mt: 3 }} />
        <form onSubmit={onSubmit}>
          <ComponentBlock
            title="Datos Cliente"
            sx={{ flexDirection: 'column', alignItems: 'unset', paddingBottom: 3, paddingTop: 3 }}
          >
            <FormClient control={control} errors={errors} setValue={setValue} />
          </ComponentBlock>
          <Divider sx={{ mt: 3 }} />
          <ComponentBlock
            title="Datos Servicio"
            sx={{ flexDirection: 'column', alignItems: 'unset', paddingBottom: 3, paddingTop: 3 }}
          >
            <Stack>
              <Controller
                name="category_service"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipificación de la Atención"
                    type="number"
                    value={field.value || ''}
                    error={!!errors.category_service}
                    helperText={errors.category_service ? errors.category_service.message : ''}
                    SelectProps={{
                      native: false,
                    }}
                  >
                    {categories.length > 0 ? (
                      categories.map((category, iCategory) => (
                        <MenuItem key={iCategory} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value=""></MenuItem>
                    )}
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
              Cancelar
            </LoadingButton>
            <LoadingButton
              color="inherit"
              size="large"
              variant="contained"
              type="submit"
            >
              {' '}
              Finalizar
            </LoadingButton>
          </Stack>
        </form>
      </DashboardContent>
    </>
  );
};
export default NewConsole;
