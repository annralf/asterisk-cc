// Code: sipConn.tsx
// Description: SIP Connection library for WebRTC

import SipService from "./sip";

console.log(process.env.NEXT_PUBLIC_WS_DOMAIN, process.env.NEXT_PUBLIC_WS_SERVER);

const DOMAIN = process.env.NEXT_PUBLIC_WS_DOMAIN  || "192.168.1.35";
const SERVER = process.env.NEXT_PUBLIC_WS_SERVER || "wss://192.168.1.35:8089/ws";

interface SipConfig {
  username: string;
  password: string;
  audioElement: HTMLAudioElement;
}

class SipConnection {
  private sipService1: typeof SipService | null = null; // Instancia para Extensión #1
  private sipService2: typeof SipService | null = null; // Instancia para Extensión #2
  private connected1: boolean = false;
  private connected2: boolean = false;
  private connectionStatusCallback: ((status: { ext: number; isConnected: boolean }) => void) | null = null;

  constructor() {
    this.sipService1 = SipService;
    this.sipService2 = SipService;
  }

  async initialize({ username, password, audioElement, extNumber }: SipConfig & { extNumber: number }) {
    try {
      const sipServiceConf = {
        username,
        password,
        domain: DOMAIN,
        wsServer: SERVER,
        audioElement,
      };

      let isConnected = false;
      
      if (extNumber === 1) {
        this.sipService1 = SipService;
        isConnected = await this.sipService1.initialize(sipServiceConf);
        this.connected1 = isConnected;
      } else if (extNumber === 2) {
        this.sipService2 = SipService;
        isConnected = await this.sipService2.initialize(sipServiceConf);
        this.connected2 = isConnected;
      }

      if (this.connectionStatusCallback) {
        this.connectionStatusCallback({ ext: extNumber, isConnected });
      }

      return isConnected;
    } catch (e) {
      console.error(`❌ Error al inicializar SIP para Extensión #${extNumber}:`, e);
      if (this.connectionStatusCallback) {
        this.connectionStatusCallback({ ext: extNumber, isConnected: false });
      }
      return false;
    }
  }

  onConnectionStatus(callback: (status: { ext: number; isConnected: boolean }) => void) {
    this.connectionStatusCallback = callback;
  }

  makeCall(extNumber: number, destination: string) {
    if (extNumber === 1 && this.connected1) {
      this.sipService1?.makeCall(destination);
    } else if (extNumber === 2 && this.connected2) {
      this.sipService2?.makeCall(destination);
    } else {
      console.error(`❌ No hay una conexión SIP activa para la Extensión #${extNumber}`);
    }
  }

  hangUp(extNumber: number) {
    if (extNumber === 1 && this.connected1) {
      this.sipService1?.hangUp();
    } else if (extNumber === 2 && this.connected2) {
      this.sipService2?.hangUp();
    } else {
      console.error(`❌ No hay una llamada activa en la Extensión #${extNumber}`);
    }
  }

  async logout(extNumber: number) {
    if (extNumber === 1 && this.connected1) {
      await this.sipService1?.terminate();
      this.connected1 = false;
    } else if (extNumber === 2 && this.connected2) {
      await this.sipService2?.terminate();
      this.connected2 = false;
    }

    if (this.connectionStatusCallback) {
      this.connectionStatusCallback({ ext: extNumber, isConnected: false });
    }
  }
}

export default new SipConnection();