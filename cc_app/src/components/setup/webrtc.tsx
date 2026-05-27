import React, { useState, useEffect, useRef } from 'react';

const WebRTCComponent: React.FC = () => {
    const [microphoneStatus, setMicrophoneStatus] = useState<string>('');
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [log, setLog] = useState<string[]>([]);
    const [audioLevel, setAudioLevel] = useState<number>(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        checkWebRTCSupport();
    }, []);

    const logMessage = (message: string) => {
        setLog(prevLog => [...prevLog, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const checkWebRTCSupport = () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            logMessage('WebRTC no está soportado en este navegador');
        } else {
            logMessage('WebRTC soportado');
        }
    };

    const testMicrophone = async () => {
        try {
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicrophoneStatus('Micrófono funcionando correctamente');
            logMessage('Micrófono activado exitosamente');
            startAudioMeter();
        } catch (error: any) {
            setMicrophoneStatus(`Error: ${error.message}`);
            logMessage(`Error al acceder al micrófono: ${error.message}`);
        }
    };

    const startAudioMeter = () => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        if (!mediaStreamRef.current) return;

        const mediaStreamSource = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
        analyserRef.current = audioContextRef.current.createAnalyser();
        mediaStreamSource.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const updateLevel = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            setAudioLevel((average / 255) * 100);
            animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
    };

    const stopAudio = () => {
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        audioContextRef.current?.close();
        audioContextRef.current = null;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        setAudioLevel(0);
        setMicrophoneStatus('Audio detenido');
        logMessage('Audio detenido');
    };

    const listDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            setDevices(devices);
            logMessage(`Se encontraron ${devices.length} dispositivos`);
        } catch (error: any) {
            logMessage(`Error al listar dispositivos: ${error.message}`);
        }
    };

    return (
        <div className="container">
            <h1>Diagnóstico Completo WebRTC</h1>

            <div className="diagnostic-section">
                <h2>Pruebas de Audio</h2>
                <button onClick={testMicrophone}>Probar Micrófono</button>
                <button onClick={stopAudio}>Detener Audio</button>
                <p>{microphoneStatus}</p>
                <div className="audio-meter" style={{ width: '100%', height: '30px', background: '#eee', borderRadius: '15px', overflow: 'hidden' }}>
                    <div style={{ width: `${audioLevel}%`, height: '100%', background: 'green' }}></div>
                </div>
            </div>

            <div className="diagnostic-section">
                <h2>Dispositivos</h2>
                <button onClick={listDevices}>Listar Dispositivos</button>
                <ul>
                    {devices.map((device, index) => (
                        <li key={index}>{device.kind}: {device.label || 'Desconocido'}</li>
                    ))}
                </ul>
            </div>

            <div className="diagnostic-section">
                <h2>Registro de Eventos</h2>
                <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                    {log.map((entry, index) => (
                        <p key={index} style={{ fontFamily: 'monospace', fontSize: '12px' }}>{entry}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WebRTCComponent;