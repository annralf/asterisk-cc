import { SimpleUser, SimpleUserOptions,  } from "sip.js/lib/platform/web";

interface SipConfig {
  username: string;
  password: string;
  domain: string;
  wsServer: string;
  audioElement: HTMLAudioElement;
}

interface CallerInfo {
  caller: string;
  callId: string;
  queueName: string;
  timestamp: number;
  fromHeader?: string;
  callerName?: string;
  callerNumber?: string;
}

class SipService {
  static audioElement: HTMLAudioElement;
  private static simpleUser: SimpleUser | null = null;
  private static incomingCallHandler: ((callerInfo: string) => void) | null = null;
  private static isConnected = false;
  private static isHangUp = false;
  private static currentSession: SimpleUser | null = null;
  private static currentCallerId: string | null = null;
  private static currentCallId: string | null = null;

  /**
   * Inicializa el servicio SIP usando SimpleUser con WebRTC
   */
  static async initialize(config: SipConfig): Promise<boolean> {
    try {
      // Verificar permisos de micrófono
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("🎤 Permiso de micrófono concedido");

      this.audioElement = config.audioElement;

      // Configurar SimpleUser con WebRTC
      const options: SimpleUserOptions = {
        aor: `sip:${config.username}@${config.domain}`,
        media: {
          constraints: {
            audio: true,
            video: false,
          },
          remote: {
            audio: config.audioElement,
          },
        },
        userAgentOptions: {
          authorizationUsername: config.username,
          authorizationPassword: config.password,
        },
        delegate: {
          onCallReceived: () => {
            console.log("Llamada entrante...");
    
            // Obtener la sesión activa
            const session = this.simpleUser?.id;
    
            if (session) {
                // Extraer la información del llamante desde la sesión SIP
                const callerURI = session.remoteIdentity.uri.toString();
                console.log(`Llamada entrante de: ${callerURI}`);
            } else {
                console.warn("No se pudo obtener la sesión activa.");
            }
    
            // Aquí puedes decidir responder o rechazar la llamada
            this.simpleUser?.answer();
        },
          onCallAnswered: () => {
            console.log(`✅ Llamada contestada - CallerId: ${this.currentCallerId}`);
            this.attachAudio();
          },
          onCallHangup: () => {
            console.log(`🚫 Llamada colgada - CallerId: ${this.currentCallerId}`);
            this.cleanupCall();
          },
          onServerConnect: () => {
            console.log("🔗 Conectado al servidor SIP");
            this.isConnected = true;
          },
          onServerDisconnect: () => {
            console.log("❌ Desconectado del servidor SIP");
            this.isConnected = false;
          },
          onRegistered: () => {
            console.log("✅ Registrado en el servidor SIP");
            this.isConnected = true;
          },
          onUnregistered: () => {
            console.log("❌ Desregistrado del servidor SIP");
            this.isConnected = false;
          }
        },
      };

      // Inicializar SimpleUser
      this.simpleUser = new SimpleUser(config.wsServer, options);
      this.currentSession = this.simpleUser;

      // Conectar al servidor SIP y registrar
      await this.simpleUser.connect();
      await this.simpleUser.register();

      console.log("✅ SIP registrado y conectado");
      const agentId = this.simpleUser.id;
      console.log("Agent ID:", agentId);
      return true;
    } catch (error) {
      console.error("❌ Error al inicializar SIP:", error);
      return false;
    }
  }

  /**
   * Acepta una llamada entrante
   */
  static async acceptCall(): Promise<boolean> {
    if (!this.simpleUser) {
      console.error("❌ No hay una llamada activa para aceptar");
      return false;
    }

    try {
      console.log(`Aceptando llamada de ${this.currentCallerId} [${this.currentCallId}]`);
      await this.simpleUser.answer();
      
      const answerTime = new Date().toISOString();
      console.log(`✅ Llamada aceptada a las ${answerTime}`);
      
      this.attachAudio();
      return true;
    } catch (error) {
      console.error("❌ Error al aceptar la llamada:", error);
      return false;
    }
  }

  /**
   * Asigna el flujo de audio de la llamada
   */
  private static attachAudio() {
    if (!this.simpleUser) return;
    
    try {
      const remoteStream = this.simpleUser.remoteMediaStream;
      if (remoteStream && remoteStream.getAudioTracks().length > 0) {
        if (!this.audioElement) {
          this.audioElement = document.createElement('audio');
          this.audioElement.autoplay = true;
          document.body.appendChild(this.audioElement);
        }
        
        this.audioElement.srcObject = remoteStream;
        this.audioElement.play()
          .then(() => console.log("🔊 Audio iniciado correctamente"))
          .catch(err => console.error("❌ Error al reproducir audio:", err));
      } else {
        console.error("❌ No hay streams de audio disponibles");
      }
    } catch (error) {
      console.error("❌ Error al adjuntar audio:", error);
    }
  }

  /**
   * Limpia los recursos de la llamada
   */
  private static cleanupCall() {
    this.currentSession = null;
    this.currentCallerId = null;
    this.currentCallId = null;
    this.isHangUp = true;
    
    if (this.audioElement) {
      this.audioElement.srcObject = null;
    }
  }

  /**
   * Cuelga la llamada actual
   */
  static async hangUp(): Promise<void> {
    if (!this.simpleUser) {
      console.error("❌ No hay una llamada activa para colgar");
      return;
    }
    try {
      await this.simpleUser.hangup();
      console.log(`📴 Llamada finalizada - CallerId: ${this.currentCallerId}`);
      this.cleanupCall();
    } catch (error) {
      console.error("❌ Error al colgar la llamada:", error);
    }
  }

  /**
   * Realiza una llamada a un destino
   */
  static async makeCall(destination: string) {
    if (!this.simpleUser) {
      console.error("❌ No hay una conexión SIP activa para realizar la llamada");
      return;
    }
    if (this.hasCurrentSession()) {
      console.error("⚠️ Ya hay una llamada en curso");
      return;
    }
    try {
      await this.simpleUser.call(destination);
      this.currentSession = this.simpleUser;
      this.currentCallerId = destination;
      console.log(`📞 Llamando a ${destination}...`);
    } catch (error) {
      console.error("❌ Error al realizar la llamada:", error);
    }
  }

  /**
   * Maneja el evento de llamada entrante
   */
  static onIncomingCall(handler: (callerInfo: string) => void) {
    this.incomingCallHandler = handler;
  }

  /**
   * Verifica si la llamada fue colgada
   */
  static onHangUpCall(): boolean {
    return this.isHangUp;
  }

  /**
   * Termina la conexión SIP
   */
  static async terminate() {
    if (this.simpleUser) {
      await this.simpleUser.disconnect();
      this.cleanupCall();
      this.simpleUser = null;
      this.isConnected = false;
      console.log("🛑 Servicio SIP terminado");
    }
  }

  /**
   * Verifica si hay una llamada activa
   */
  static hasCurrentSession(): boolean {
    return this.currentSession !== null;
  }

  /**
   * Agrega soporte (conferencia) a la llamada
   */
  static async requestSupport(config: SipConfig, ext: string) {
    if (!this.simpleUser) {
      console.error("❌ No hay una llamada activa para agregar soporte");
      return;
    }
    try {
      const options: SimpleUserOptions = {
        aor: `sip:${ext}@${config.domain}`,
        media: {
          constraints: { audio: true, video: false },
          remote: { audio: config.audioElement },
        },
        userAgentOptions: {
          authorizationUsername: config.username,
          authorizationPassword: config.password,
        },
      };
      const supportUser = new SimpleUser(config.wsServer, options);
      await supportUser.connect();
      await supportUser.register();
      await supportUser.call(`sip:${ext}@${config.domain}`);
      console.log(`✅ Soporte (${ext}) agregado a la llamada`);
    } catch (error) {
      console.error("❌ Error al agregar soporte a la llamada:", error);
    }
  }

  /**
   * Obtiene el estado de conexión actual
   */
  static isConnectedToServer(): boolean {
    return this.isConnected;
  }

  /**
   * Obtiene información de la llamada actual
   */
  static getCurrentCallInfo(): { callerId: string | null; callId: string | null } {
    return {
      callerId: this.currentCallerId,
      callId: this.currentCallId
    };
  }
}

export default SipService;