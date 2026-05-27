const AsteriskExtensionStates = [
    { value: "UNKNOWN", label: "Estado desconocido" },
    { value: "NOT_INUSE", label: "No en uso (disponible)" },
    { value: "INUSE", label: "En uso (ocupado)" },
    { value: "BUSY", label: "Ocupado" },
    { value: "INVALID", label: "Extensión no válida" },
    { value: "UNAVAILABLE", label: "No disponible" },
    { value: "RINGING", label: "Sonando (llamada entrante)" },
    { value: "RINGINUSE", label: "Sonando pero en uso" },
    { value: "ONHOLD", label: "En espera" },
    { value: "PAUSED", label: "Pausado (usado en colas)" },
  ];
  
  export default AsteriskExtensionStates;