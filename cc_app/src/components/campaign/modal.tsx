import React, { useEffect } from 'react';
import { Modal, Box, TextField, Button, Divider, Typography, Stack } from '@mui/material';
import { IService } from '@/src/types/app';

import NewServiceForm from './new-form';

interface ModalCampaignProps {
  open: boolean;
  onClose: () => void;
  service: any;
}

const ModalCampaign: React.FC<ModalCampaignProps> = ({ open, onClose, service = null }) => {
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          width: 800,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
      <Typography variant="h4">{service ? 'Actualizar Cola' : 'Agregar Cola'}</Typography>
        <Stack spacing={2} mt={2} ml={2}>
          <Typography variant="subtitle2">Configuración de Colas | Servicios de Atención</Typography>
          <Typography variant="caption">Las colas en el sistema gestionan la distribución de llamadas entrantes a los operadores disponibles. Aquí puedes crear y configurar colas para optimizar la atención, definiendo estrategias de distribución, tiempos de espera y asignaciones de agentes según la demanda del servicio.</Typography>
        </Stack>
        <Divider sx={{ mt: 2, mb:2 }} />
        <Box mt={2}>
          <NewServiceForm service={service} onClose={onClose} step_next={() => {}} step_back={() => {}}/>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCampaign;