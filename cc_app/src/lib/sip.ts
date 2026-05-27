import {
  UserAgent,
  Inviter,
  Invitation,
  Registerer,
  Web,
  URI,
  UserAgentOptions,
  SessionState,
} from 'sip.js';
import { SessionDescriptionHandler } from 'sip.js/lib/platform/web/session-description-handler';
import { SessionDescriptionHandler as WebSessionDescriptionHandler } from 'sip.js/lib/platform/web';

interface SipConfig {
  username: string;
  password: string;
  domain: string;
  server: string;
  audioElement: React.RefObject<HTMLAudioElement>;
}

class SipService {
  static userAgent: UserAgent | null;
  static audioElement: React.RefObject<HTMLAudioElement>;
  static registered: Registerer;
  static session: Invitation | null;
  static isCalling: boolean = false;
  static isRegistered: boolean = false;

  static localMediaStream: MediaStream;
  static remoteMediaStream: MediaStream;

  // Initialize SipService
  static async init(config: SipConfig): Promise<boolean> {
    console.log('SipService.init()');
    try {
      // Guardar audioElement en la clase
      this.audioElement = config.audioElement;
      console.log('📞 AudioElement set in SipService:', this.audioElement);

      // Create UserAgent
      console.log('📞  Creating UserAgent', config);
      const userAgentOptions: UserAgentOptions = {
        uri: new URI('sip', config.username, config.domain),
        transportOptions: {
          server: config.server,
          traceSip: true,
          maxReconnectionAttempts: 5,
          reconnectionTimeout: 7,
          keepAliveInterval: 30,
        },
        sessionDescriptionHandlerFactoryOptions: {
          constraints: {
            audio: true,
            video: false,
          },
          peerConnectionOptions: {
            rtcConfiguration: {
              iceServers: [], // 🚫 Sin STUN/TURN (para LAN)
              iceTransportPolicy: "all", // 🔹 Permitir todas las conexiones en LAN
              bundlePolicy: "max-bundle", // 🏷 Optimiza el tráfico RTP
              rtcpMuxPolicy: "require", // 📡 Multiplexa RTCP con RTP
            },
            constraints: {
              mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: false,
              },
            },
            peerConnectionConfiguration: {
              sdpSemantics: "unified-plan",
              rtcpMuxPolicy: "require",
              iceTransportPolicy: "all", // 💡 Permitir cualquier tipo de transporte ICE
              bundlePolicy: "max-bundle",
              codecs: [
                { name: "opus", clockRate: 48000, numChannels: 2 } // ✅ Prioriza Opus
              ]
            }
          },
        },
        authorizationUsername: config.username,
        authorizationPassword: config.password,
        contactName: config.username,
        displayName: config.username,
      };
      this.userAgent = new UserAgent(userAgentOptions);
      console.log('📞  UserAgent created', this.userAgent);
      // Start UserAgent Session
      this.userAgent.start().then(() => {
        console.log('✅  UserAgent started');
        if(this.userAgent){
          const registerer = new Registerer(this.userAgent, {
            expires: 3600,
            refreshFrequency: 60,
            extraHeaders: ['X-Custom-Header: WebPhone'],
          });
          registerer.register().then(() => {
            console.log('✅  UserAgent registered');
            this.isRegistered;
          });
        }
      });
      // Add Event Listeners
      this.userAgent.delegate = {
        onInvite: async (invitation: Invitation) => {
          console.log('📞  Incoming call');
          this.session = invitation;
          console.log('📡  Session:', this.session);
          this.isCalling = true;
        },
        onRegister: (registerer) => {
          console.log('📞  Registering...',registerer);
        },
        onDisconnect: (error) => {
          console.error('❌  Disconnected', error);
        }
      };
      console.log('✅  SipService initialized');
      this.registered?.unregister();
      return Promise.resolve(true);
    } catch (error) {
      console.error('❌  SipService.init() error', error);
      return false;
    }
  }
  //Active Session
  

  //Answer call
  static async answer(): Promise<boolean> {
    console.log('SipService.answer()');
  
   /*  if (!this.session) {
      console.error('❌ No active session');
      return Promise.resolve(false);
    }
   */
    try {
      console.log('📞 Call accepted');
  
      // Obtener permisos de audio
      let localStream: MediaStream;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        console.log('🎤 Permisos de audio concedidos', localStream);
      } catch (err) {
        console.error('❌ Error obteniendo permisos de audio', err);
        return Promise.resolve(false);
      }
      if(this.session){
        // Verificar estado de la sesión antes de aceptar
        console.log('📡 Estado actual de la sesión:', this.session.state);
        console.log('📡 Session:', this.session);
        await this.session.accept();
        console.log('✅ Llamada aceptada');
       /*  if (this.session.state === SessionState.Established) {
          console.log('✅ La sesión ya está establecida, aceptando llamada...');
          await this.session.accept();
        } else if (this.session.state === SessionState.Initial || this.session.state === SessionState.Establishing) {
          console.log('⏳ Esperando que la sesión se establezca...');
    
          this.session.stateChange.addListener(async (newState) => {
            console.log('📡 Estado actualizado de la sesión:', newState);
    
            if (newState === SessionState.Established) {
              console.log('✅ La sesión está establecida, aceptando llamada...');
              if (this.session) {
                await this.session.accept();
              }
            }
          });
    
          return Promise.resolve(false); // No aceptar hasta que el estado sea Established
        } else {
          console.error('❌ La sesión no está en un estado aceptable para responder');
          return Promise.resolve(false);
        } */
    
        // Obtener el SessionDescriptionHandler (SDH)
        const sdh = this.session.sessionDescriptionHandler as WebSessionDescriptionHandler | undefined;
      
        if (!sdh) {
          console.error('❌ No se pudo obtener el SessionDescriptionHandler');
          return Promise.resolve(false);
        }
    
        if (!(sdh instanceof WebSessionDescriptionHandler)) {
          console.error('❌ El SessionDescriptionHandler no es del tipo esperado');
          return Promise.resolve(false);
        }
    
        // Obtener la conexión RTC
        const peerConnectionRemote = sdh.peerConnection;
        if (!peerConnectionRemote) {
          console.error('❌ No se pudo obtener la conexión RTC');
          return Promise.resolve(false);
        }
    
        // Crear el stream remoto
        this.remoteMediaStream = new MediaStream();
        console.log('📞 Remote stream created', this.remoteMediaStream);
    
        // Agregar tracks al stream remoto
        peerConnectionRemote.getReceivers().forEach((receiver: RTCRtpReceiver) => {
          if (receiver.track && receiver.track.kind === 'audio') {
            console.log('🔊 Track recibido:', receiver.track);
            this.remoteMediaStream.addTrack(receiver.track);
          } else {
            console.error('❌ No se recibió track en el receptor', receiver);
          }
        });
        //Validate Media streams
        console.log('🎙️ Tracks del MediaStream:', this.remoteMediaStream.getTracks());
  
        if (this.remoteMediaStream.getTracks().length === 0) {
          console.error("❌ No hay tracks en el MediaStream, no se puede reproducir audio");
          Promise.resolve(false);
        }
    
        // Reproducir el stream remoto en el audioElement
        setTimeout(() => {
          if (this.audioElement?.current) {
            this.audioElement.current.srcObject = this.remoteMediaStream;
            this.audioElement.current.muted = false;
            this.audioElement.current.volume = 1.0; // 🔊 Asegurar volumen alto
            this.audioElement.current.play()
              .then(() => console.log('📞 Audio playing!'))
              .catch((error) => console.error('❌ Error al reproducir audio:', error));
          } else {
            console.error('❌ Elemento de audio no disponible');
          }
        }, 1000);
    
        // Configurar el stream local en PeerConnection
        console.log('🎤 Creating local stream');
        localStream.getTracks().forEach((track) => {
          console.log('📞 Adding local track to remote peer connection', track);
          peerConnectionRemote.addTrack(track, localStream);
        });
    
      }
      return Promise.resolve(true);
    } catch (error) {
      console.error('❌ SipService.answer() error', error);
      return Promise.resolve(false);
    }
  }
  static async answerShd(): Promise<WebSessionDescriptionHandler | undefined> {
    console.log('SipService.answer()');
    
    try {
      console.log('📞 Call accepted');
  
      // Obtener permisos de audio
      let localStream: MediaStream;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        console.log('🎤 Permisos de audio concedidos', localStream);
      } catch (err) {
        console.error('❌ Error obteniendo permisos de audio', err);
        return undefined;
      }
  
      if (!this.session) {
        console.error('❌ No hay sesión SIP activa.');
        return undefined;
      }
  
      console.log('📡 Estado actual de la sesión:', this.session.state);
      console.log('📡 Session:', this.session);
  
      // Aceptar la llamada y esperar la negociación de SDP
      await this.session.accept();
  
      console.log('✅ Llamada aceptada, esperando SDP...');
  
      // Esperar a que `sessionDescriptionHandler` esté disponible
      let retries = 5;
      while (!this.session.sessionDescriptionHandler && retries > 0) {
        console.log('⏳ Esperando SDP...');
        await new Promise(resolve => setTimeout(resolve, 500));
        retries--;
      }
  
      const sdh = this.session.sessionDescriptionHandler as WebSessionDescriptionHandler | undefined;
      
      if (!sdh) {
        console.error('❌ No se pudo obtener sessionDescriptionHandler.');
        return undefined;
      }
  
      console.log('✅ SDP negociado correctamente.');
      return sdh;
  
    } catch (error) {
      console.error('❌ SipService.answer() error', error);
      return undefined;
    }
  }
  // Hangup call
  static hangup(): Promise<boolean> {
    console.log('SipService.hangup()');
    if (this.session) {
      if (this.session.state === SessionState.Established) {
        this.session.bye();
        console.log('📞  Call ended');
      } else {
        console.warn('⚠️  Cannot hang up, session is already terminated or not established.');
      }

      // Limpiar la sesión
      this.session = null;
      this.isCalling = false;
      return Promise.resolve(true);
    } else {
      console.error('❌  No active session');
      return Promise.resolve(false);
    }
  }
  //Setup bundle
  static getSessionState(): typeof SessionState {
    return SessionState;
}
static setSession(session: Invitation) {
  this.session = session;
}

//End SipService
static async terminate() {
  if (this.userAgent) {
    await this.userAgent.stop(); // Detiene el UserAgent
    this.userAgent = null; // Limpia la referencia
    console.log('SIP session terminated.');
  }
}
}

export default SipService;