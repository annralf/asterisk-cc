import React, { useEffect, useState } from "react";

const WebSocketTest: React.FC = () => {
    const [status, setStatus] = useState<string>("Desconectado");
    const [logs, setLogs] = useState<string[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);

    const logMessage = (message: string, type: "info" | "success" | "error" = "info") => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prevLogs) => [`${timestamp} - ${message}`, ...prevLogs]);
    };

    useEffect(() => {
        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${wsProtocol}//${window.location.hostname}:8088/ws`;

        logMessage(`Intentando conectar a ${wsUrl}`);
        const socket = new WebSocket(wsUrl);
        setWs(socket);

        socket.onopen = () => {
            logMessage("Conexión WebSocket establecida", "success");
            setStatus("✓ Conectado");
        };

        socket.onerror = (error) => {
            logMessage(`Error WebSocket: ${JSON.stringify(error)}`, "error");
            setStatus("✗ Error de conexión");
        };

        socket.onclose = (event) => {
            logMessage(`Conexión cerrada. Código: ${event.code}, Razón: ${event.reason}`);
            setStatus("⚠ Desconectado");
        };

        const pingInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send("ping");
                logMessage("Ping enviado");
            }
        }, 30000);

        return () => {
            clearInterval(pingInterval);
            socket.close();
        };
    }, []);

    return (
        <div>
            <h2>Test de Conexión WebSocket Asterisk</h2>
            <div style={{ color: status.includes("✓") ? "green" : status.includes("✗") ? "red" : "orange" }}>
                <h3>{status}</h3>
            </div>
            <div style={{ background: "#f4f4f4", padding: "10px", borderRadius: "4px", margin: "10px 0", fontFamily: "monospace", maxHeight: "200px", overflowY: "auto" }}>
                {logs.map((log, index) => (
                    <div key={index} style={{ color: log.includes("error") ? "red" : log.includes("success") ? "green" : "black" }}>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WebSocketTest;