import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';

interface ConfirmationProps {
  onBack: () => void;
  onSubmit: () => void;
}

const ConfirmationSteps: React.FC<ConfirmationProps> = ({ onBack, onSubmit }) => {
  const { extension, service, user } = useSelector((state: RootState) => state.form);

  return (
    <Box display="flex" flexDirection="column" gap={2} p={2}>
      <Typography variant="h5" align="center">
        Confirmación de Datos
      </Typography>

      <Box>
        <Typography variant="h6">Extensión</Typography>
        <Typography>Identificador: {extension.identity}</Typography>
        <Typography>Estado: {extension.status}</Typography>
      </Box>

      <Box>
        <Typography variant="h6">Configuración de Campaña</Typography>
        <Typography>Nombre: {service.name}</Typography>
        <Typography>Estado: {service.status}</Typography>
        <Typography>Activo: {service.isActive ? 'Sí' : 'No'}</Typography>
        <Typography>Reintentos: {service.retry}</Typography>
        <Typography>Tiempo de Finalización: {service.wrapuptime}</Typography>
        <Typography>Estrategia: {service.strategy}</Typography>
        <Typography>Tiempo de Espera: {service.timeout}</Typography>
      </Box>

      <Box>
        <Typography variant="h6">Información del Usuario</Typography>
        <Typography>Nombre: {user.firstName} {user.lastName}</Typography>
        <Typography>Tipo de Documento: {user.documentType}</Typography>
        <Typography>Número de Documento: {user.documentNumber}</Typography>
        <Typography>Teléfono: {user.phone}</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Usuario: {user.username}</Typography>
        <Typography>Extensión: {user.extention}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Button onClick={onBack} variant="outlined">
          Atrás
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Finalizar
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmationSteps;
