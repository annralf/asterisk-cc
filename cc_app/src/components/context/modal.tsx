'use client';

import React, { use, useEffect } from 'react';
import { Modal, Box, Typography, Divider, Stack, Paper } from '@mui/material';
import { varAlpha, bgGradient, stylesMode } from 'src/theme/styles';

import NewContextForm from './new-form';

interface ModalContextFormProps {
  open: boolean;
  onClose: () => void;
  context: any;
}
const ModalContextForm: React.FC<ModalContextFormProps> = ({ open, onClose, context = null }) => {
  return (
    <Modal open={open} onClose={onClose}>
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
        }}
      >
        <Typography variant="h4">{context ? 'Actualizar Contexto' : 'Agregar Contexto'}</Typography>
        <Stack spacing={2} mt={2} ml={2}>
          <Typography variant="subtitle2">Configuración de Contextos</Typography>
          <Typography variant="caption">Los contextos definen cómo se enrutan y gestionan las llamadas dentro del sistema. Aquí puedes crear o modificar contextos para organizar las reglas de enrutamiento, asegurando que cada llamada sea dirigida correctamente según su origen y destino</Typography>
        </Stack>
        <Divider sx={{ mt: 2, mb:2 }} />
        <Box mt={2}>
          <NewContextForm context={context} onClose={onClose} handleClose={onClose} />
        </Box>
      </Box>
    </Modal>
  );
};
export default ModalContextForm;