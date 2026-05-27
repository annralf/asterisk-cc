"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  UserAgent,
  Registerer,
  Invitation,
  Session,
  SessionState,
} from "sip.js";
import { Button, Typography, Box, Paper, Grid, Stack, Divider } from "@mui/material";
import styles from './AudioClient.module.css';

export default function SipClient() {
  const userAgentRef = useRef<UserAgent | null>(null);
  const registererRef = useRef<Registerer | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [incomingCall, setIncomingCall] = useState<Invitation | null>(null);
  const [iceState, setIceState] = useState<string>("new");
  const [logs, setLogs] = useState<string[]>([]);
  const [callStatus, setCallStatus] = useState("⏳ Esperando...");
  const [microphoneConnected, setMicrophoneConnected] = useState(false);
  const [senderRtc, setSenderRtc] = useState<RTCRtpSender | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [localIp, setLocalIp] = useState<string>("Desconocida");
  const portsToCheck = [443, 8089, 8088, 5060, 3478, 5349, 10000_20000];
  const [portsStatus, setPortsStatus] = useState(
    Object.fromEntries(portsToCheck.map(port => [port, { status: "❌ Desconectado" }]))
  );

  const server = "wss://10.134.0.147:8089/ws";
  const uri = UserAgent.makeURI("sip:1003@10.134.0.147");
  const contactUri = UserAgent.makeURI(`sip:1003@${localIp}`);
  const iceServers = [
    { urls: "stun:10.134.0.147:3478" },
    {
      urls: "turn:10.134.0.147:3478",
      username: "asterisk",
      credential: "p3g4s0_",
    },
  ];

  //Función para check de puertos
  const updatePortStatus = (port, isConnected) => {
    setPortsStatus(prevStatus => ({
      ...prevStatus,
      [port]: { status: isConnected ? "✅ Conectado" : "❌ Desconectado" }
    }));
  };
  useEffect(()=> {},[portsStatus]);
  const checkPort = async (port) => {
    return new Promise((resolve) => {
      const ws = new WebSocket(`wss://${localIp}:${port}`);
  
      ws.onopen = () => {
        ws.close();
        resolve(true); // Puerto abierto
      };
  
      ws.onerror = () => {
        resolve(false); // Puerto cerrado
      };
  
      setTimeout(() => {
        ws.close();
        resolve(false); // Timeout, asumir cerrado
      }, 3000);
    });
  };
    const [ports, setPorts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    /* useEffect(() => {
      const fetchPorts = async () => {
        const results = await Promise.all(
          portsToCheck.map(async (port) => ({
            port,
            isOpen: await checkPort(port),
          }))
        );
        setPorts(results);
        setLoading(false);
      };
  
      fetchPorts();
    }, [localIp]); */
  

  // Función para agregar logs al front
  const addLog = (message: string, type: 'info' | 'error' | 'warning' | 'success' = 'info') => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [...prev, { timestamp, type, message }]);
  };
  //Get IP local
  const getLocalIp = async () => {
    try {
      const peerConnection = new RTCPeerConnection({ iceServers });
      peerConnection.createDataChannel("dummy"); // Crea un canal de datos falso

      peerConnection.addEventListener("icecandidate", (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const match = candidate.match(
            /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/
          );
          if (match) {
            const ip = match[1];
            setLocalIp(ip);
            addLog(`IP local: ${ip}`);
            peerConnection.close(); // Cierra la conexión una vez obtenida la IP
          }
        }
      });

      await peerConnection.createOffer();
      await peerConnection.setLocalDescription();
    } catch (error) {
      addLog(`Error obteniendo IP local: ${error.message}`);
    }
  };

  // Configuración del UserAgent
  const startUserAgent = async () => {
    if (userAgentRef.current) {
      addLog("Deteniendo UserAgent anterior", "info");
      await userAgentRef.current.stop();
      userAgentRef.current = null;
    }

    if (registererRef.current) {
      addLog("Anulando registro anterior", "info");
      await registererRef.current.unregister();
      registererRef.current = null;
    }
    setIsRegistered(false);
    addLog("Iniciando Conexión a Central Telefónica | puerto:8089","success");

    const userAgent = new UserAgent({
      uri,
      transportOptions: { server, traceSip: true },
      contactUri,
      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionConfiguration: {
          iceServers,
          iceTransportPolicy: "all",
          rtcpMuxPolicy: "require",
          bundlePolicy: "max-bundle",
        },
      },
      authorizationUsername: "1003",
      authorizationPassword: "10033XVAkw",
      displayName: "1003"
    });

    try {
      await userAgent.start();
      userAgentRef.current = userAgent;
      addLog("Usuario conectado","success");
      updatePortStatus(443, true);
      updatePortStatus(8089, true);
      updatePortStatus(8088, true);
      updatePortStatus(5060, true);
      const registerer = new Registerer(userAgent, {
        regOptions: {
          extraHeaders: [`X-Preferred-IP: ${localIp}`]
        }
      });
      registererRef.current = registerer;

      registerer.stateChange.addListener((state) => {
        if (state === "Registered") {
          setIsRegistered(true);
          addLog("Registro de conexión de usuario ok | puerto:8089","success");
        } else {
          setIsRegistered(false);
          addLog("Error de Conexión a Central Telefónica | puerto:8089","error");
        }
      });

      await registerer.register();
      userAgent.delegate = {
        onInvite: (invitation: Invitation) => {
          addLog("Llamada entrante detectada","info");
          if (sessionRef.current) {
            addLog("Error de conexión, falla en la transmisión de paquetes RTP | puertos: 10000-200000","error");
            sessionRef.current.terminate();
          }
          setIncomingCall(invitation);
          setCallStatus("📞 Llamada entrante...");
          console.log(invitation);
          handleCallStateChange(invitation);
        }
      };
    } catch (error) {
      addLog(`Error de Conexión a Central Telefónica: ${error} | puerto:8089`,"error");
      setCallStatus("⚠ Error de conexión");
    }
  };

  const setupPeerConnection = (peerConnection: RTCPeerConnection) => {
    addLog("🔧 Configurando Transmisión de audio bidireccional", "info");
    console.log(peerConnection);
  
    let count = 0;
    const maxAttempts = 5;
  
    // Monitoreo de conexión ICE
    const interval = setInterval(() => {
      const iceState = peerConnection.iceConnectionState;
      const connectionState = peerConnection.connectionState;
      const signalingState = peerConnection.signalingState;
      const iceGatheringState = peerConnection.iceGatheringState;
  
      console.log("📡 Estado actual:");
      console.log(`ICE Connection State: ${iceState}`);
      console.log(`Connection State: ${connectionState}`);
      console.log(`Signaling State: ${signalingState}`);
      console.log(`ICE Gathering State: ${iceGatheringState}`);
  
      // Mensajes de log según el estado de ICE
      if (connectionState === "closed" || iceState === "closed") {
        addLog(`Establecimiento de conectividad interactiva ICE | estatus: ${iceState} | puerto:3478`, "error");
      } else if (connectionState === "connected" || iceState === "connected") {
        updatePortStatus(3478, true);
        updatePortStatus(5349, true);
        addLog(`Establecimiento de conectividad interactiva ICE | estatus: ${iceState} | puerto:3478`, "success");
      } else {
        addLog(`Establecimiento de conectividad interactiva ICE | estatus: ${iceState} | puerto:3478`, "info");
      }
  
      count++;
      if (count >= maxAttempts) {
        clearInterval(interval);
        addLog(`Monitor ICE | estatus: ${iceState} | Finalizado`, "success");
        console.log("✅ Monitoreo finalizado");
  
        // Una vez completado el chequeo de ICE, revisar tracks
        checkTracks(peerConnection);
      }
    }, 2000);
  
    // Monitorear estado de recolección ICE
    if (peerConnection.iceGatheringState === "gathering") {
      addLog(`Estado recolección de candidatos ICE: ${peerConnection.iceGatheringState}`, "warning");
    } else if (peerConnection.iceGatheringState === "complete") {
      addLog(`Estado recolección de candidatos ICE: ${peerConnection.iceGatheringState}`, "success");
    } else {
      addLog(`Estado recolección de candidatos ICE: ${peerConnection.iceGatheringState}`, "info");
    }
  };
  
  // Función para revisar los tracks solo si ICE está activo
  const checkTracks = (peerConnection) => {
    addLog("Verificando disponibilidad de tracks de audio...", "info");
  
    // Logs de audios entrantes
    peerConnection.getReceivers().forEach(receiver => {
      console.log("Receiver:", receiver);
      if (receiver.track) {
        console.log(`Track: ${receiver.track.kind}, Estado: ${receiver.track.readyState}, Habilitado: ${receiver.track.enabled}`);
        if (receiver.track.readyState !== "live" || !receiver.track.enabled) {
          addLog(`Error: El track de entrada ${receiver.track.kind} no está listo para reproducir. Estado: ${receiver.track.readyState}, Habilitado: ${receiver.track.enabled}`, "error");
          updatePortStatus(10000_20000, true);
        } else {
          addLog(`Track de entrada ${receiver.track.kind} listo para reproducir.`, "success");
          if (receiver.track) {
            const audioStream = new MediaStream([receiver.track]);
            if (audioRef.current) {
              audioRef.current.srcObject = audioStream;
              audioRef.current.play()
                .then(() => {
                  addLog("Reproducción de audio entrante iniciada", "success");
                  audioRef.current.volume = 1.0;
                })
                .catch(error => {
                  addLog(`Error en reproducción de audio: ${error}`, "error");
                });
            }
          } else {
            addLog("Error: No se encontró un track de entrada", "error");
          }
        }
      } else {
        addLog("Error: No hay track de entrada.", "error");
      }
    });
  
    // Logs de audios salientes
    peerConnection.getSenders().forEach(sender => {
      console.log("Sender:", sender);
      if (sender.track) {
        console.log(`Track: ${sender.track.kind}, Estado: ${sender.track.readyState}, Habilitado: ${sender.track.enabled}`);
        if (sender.track.readyState === "live" && sender.track.enabled) {
          addLog(`Track de salida ${sender.track.kind} listo para transmitir.`, "success");
    
          // Si el track de audio está listo, activamos el micrófono y enviamos audio
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
              const audioTrack = stream.getAudioTracks()[0];
              const audioSender = peerConnection.getSenders().find(s => s.track?.kind === "audio");
    
              if (audioSender) {
                audioSender.replaceTrack(audioTrack);
                setSenderRtc(audioSender);
                setMicrophoneConnected(true);
                addLog("Micrófono conectado y track de audio enviado", "success");
              } else {
                peerConnection.addTrack(audioTrack, stream);
                addLog("Track de audio agregado a la conexión", "success");
              }
            })
            .catch(error => {
              addLog(`Error al acceder al micrófono: ${error.message}`, "error");
            });
    
        } else {
          addLog(`Error: El track de salida ${sender.track.kind} no está listo para transmitir.`, "error");
        }
      } else {
        addLog("Error: No hay track de salida.", "error");
      }
    });

  
    // Logs de transceivers
    peerConnection.getTransceivers().forEach(transceiver => {
      console.log("Transceiver:", transceiver);
      if (transceiver.receiver.track) {
        console.log(`Track: ${transceiver.receiver.track.kind}, Estado: ${transceiver.receiver.track.readyState}, Habilitado: ${transceiver.receiver.track.enabled}`);
        if (transceiver.receiver.track.readyState !== "live" || !transceiver.receiver.track.enabled) {
          addLog(`Error: El track bidireccional ${transceiver.receiver.track.kind} no está listo para reproducir.`, "error");
        } else {
          addLog(`Track bidireccional ${transceiver.receiver.track.kind} listo para reproducir.`, "success");
        }
      } else {
        addLog("Error: No hay track bidireccional.", "error");
      }
    });
  };
  const answerCall = async () => {
    if (!incomingCall) return;

    try {
      addLog("Contestando llamada","info");
      setCallStatus("📡 Conectando...");

      /* const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      if(stream){
        addLog("Microfono conectado","success");
        setMicrophoneConnected(true);
      }

      const options = {
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false },
          peerConnectionConfiguration: {
            iceServers,
            iceTransportPolicy: "all",
            bundlePolicy: "max-bundle",
            rtcpMuxPolicy: "require"
          }
        },
        tracks: stream.getAudioTracks()
      };

      await incomingCall.accept(options); */
      await incomingCall.accept();
      addLog("Llamada aceptada","success");

    } catch (error) {
      addLog(`Error en llamada: ${error} | puerto:8089 - 10000,20000`,"error");
      setCallStatus("⚠ Error en llamada");
    }
  };

  const handleCallStateChange = (session: Session) => {
    session.stateChange.addListener((newState) => {
      addLog(`Estado de la llamada: ${newState}`,"info");

      switch (newState) {
        case SessionState.Establishing:
          setCallStatus("🔄 Estableciendo llamada...");
          break;
        case SessionState.Established:
          setCallStatus("🔊 Llamada en curso");
          sessionRef.current = session;
          const peerConnection = session.sessionDescriptionHandler?.peerConnection;
          if (peerConnection) {
            setupPeerConnection(peerConnection);
          }
          break;
        case SessionState.Terminated:
          setCallStatus("📞 Llamada finalizada");
          addLog("Llamada finalizada","success");
          setIncomingCall(null);
          sessionRef.current = null;
          if (audioRef.current) {
            audioRef.current.srcObject = null;
          }
          break;
      }
    });
  };

  // Limpieza de la sesión
  const cleanup = () => {
    sessionRef.current = null;
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
  };

  const endCall = () => {
    if (sessionRef.current) {
      sessionRef.current.terminate();
      addLog("Llamada finalizada","success");
      cleanup();
    }
  };

  const testAudio = () => {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
      
      addLog("Prueba de audio ejecutada", "success");
    } catch (error) {
      addLog(`Error en prueba de audio: ${error}`, "error");
    }
  };


  useEffect(() => {
    startUserAgent();

    return () => {
      if (registererRef.current) registererRef.current.unregister();
      if (userAgentRef.current) userAgentRef.current.stop();
    };
  }, [localIp]);
  useEffect(() => {getLocalIp()},[localIp]);

  return (
    <Box sx={{  minHeight: "100vh", padding: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        mb={10}
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#00B8D9",
        }}
      >
        Dashboard de Control | Call Center
      </Typography>

      <Grid container spacing={4}>
        {/* Información del estado */}
        <Grid item xs={12} md={12}>
            <Paper sx={{ padding: 3, borderRadius: '10px', boxShadow: 'rgba(100, 100, 111, 0.2) 3px 4px 20px 4px' }}>
            <Typography variant="h6" sx={{ color: "#005f73" }}>
              Configuración
            </Typography>
            <Typography>
              <strong>IP Local:</strong> {localIp}
            </Typography>
            <Typography>
              <strong>Servidor:</strong> 10.134.0.147
            </Typography>            
            <Typography>
              <strong>Puertos:</strong> 443| 8089 | 8088 | 5060 | 3478 | 5349 | 10000 - 20000
            </Typography>
            <Typography>
              <strong>TURN/STUN:</strong> stun:10.134.0.147:3478 | turn:10.134.0.147:3478
            </Typography>
           
            </Paper>
            <Paper sx={{ padding: 3, borderRadius: '10px', boxShadow: 'rgba(100, 100, 111, 0.2) 3px 4px 20px 4px' }}>
            <Typography variant="h6" sx={{ color: "#005f73" }} mt={3}>
              Estado de conexión de puertos
            </Typography>
            {Object.entries(portsStatus).map(([port, { status }]) => (
                <Typography key={port}>
                  <strong>Puerto {port}:</strong> {status}
                </Typography>
              ))}
            </Paper>
          </Grid>
        <Grid item xs={12} md={12}>
          <Paper sx={{ padding: 3,  borderRadius: '10px', boxShadow: 'rgba(100, 100, 111, 0.2) 3px 4px 20px 4px' }}>
           <Typography variant="h6" sx={{ color: "#005f73" }} mt={3}>
              Estado del cliente (llamada | registro | micrófono)
            </Typography>
            <Typography>
              <strong>Micrófono:</strong>{" "}
              {microphoneConnected ? "🎤 Conectado" : "❌ No conectado"}
            </Typography>
            <Typography>
              <strong>Usuario:</strong> 1003
            </Typography>
            <Typography>
              <strong>Estado de Conexión de Usuario:</strong>{" "}
              {isRegistered ? "✅ Registrado" : "❌ No registrado"}
            </Typography>
            <Typography>
              <strong>Estado de la Llamada:</strong> {callStatus}
            </Typography>
            <Divider mt={3} mb={3}/>
              <Typography variant="h6" sx={{ color: "#005f73" }} mt={3}>
                Controles
              </Typography>
              <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                <Button
            variant="outlined"
            onClick={testAudio}
                >
            🔊 Probar Audio
                </Button>
                {incomingCall && incomingCall.state === SessionState.Initial && (
            <Button
              variant="outlined"
             
              onClick={() => {
                answerCall();
                setCallStatus("🔊 Llamada en curso");
                audioRef.current?.play()}}
            >
              ▶️ Contestar
            </Button>
                )}
                {incomingCall && incomingCall.state === SessionState.Established &&(
                <Button
            variant="outlined"
        
            onClick={endCall}
      
                >
            📴 Colgar Llamada
                </Button>

                )}
              </Stack>
          </Paper>
        </Grid>
          

          {/* Logs */}
        <Grid item xs={12}>
          <Paper
            sx={{
              padding: 3,
            }}
          >
            <Typography variant="h6" sx={{ color: "#005f73" }}>
              Monitor de proceso
            </Typography>
            <div className={styles.logsContainer}>
            <h3>Logs de Conexión Call Center</h3>
            <div className={styles.logsContent}>
              {logs.map((log, index) => (
                <div key={index} className={`${styles.logEntry} ${styles[log.type]}`}>
                  <span className={styles.timestamp}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={styles.message}>{log.message}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                const logText = logs
                  .map(log => `${log.timestamp} [${log.type}] ${log.message}`)
                  .join('\n');
                
                const blob = new Blob([logText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sip-client-logs-${new Date().toISOString()}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                addLog("Logs descargados", "success");
              }}
              className={styles.downloadButton}
            >
              📥 Descargar Logs
            </button>
          </div>
          </Paper>
        </Grid>
      </Grid>
      <audio ref={audioRef} autoPlay playsInline controls hidden />
    </Box>
  );
}