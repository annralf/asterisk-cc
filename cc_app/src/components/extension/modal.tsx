'use client';

import React from 'react';
import { Modal, Box, Typography, Divider, Stack } from '@mui/material';

import NewExtensionForm from './new-form';

interface ModalExtensionFormProps {
  open: boolean;
  onClose: () => void;
  extension: any;
}

const ModalExtensionForm: React.FC<ModalExtensionFormProps> = ({
  open,
  onClose,
  extension = null,
}) => {
  const handleClose = () => {
    onClose();
  };

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
          width: 1080,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h4">{extension ? 'Actualizar Extensión' : 'Agregar Extensión'}</Typography>
        <Stack spacing={2} mt={2} ml={2}>
          <Typography variant="subtitle2">Gestión de Extensiones</Typography>
          <Typography variant="caption">Las extensiones en el sistema permiten la comunicación interna entre los operadores y la gestión de llamadas dentro del call center. Cada extensión está asociada a un contexto de atención, lo que define las reglas de enrutamiento de las llamadas. Además, pueden asignarse permisos específicos y vincularse a campañas o servicios de atención según la operatividad del sistema..</Typography>
        </Stack>
        <Divider sx={{ mt: 2, mb:2 }} />
        <Box mt={2}>
          <NewExtensionForm extension={null} onClose={onClose} step_next={() => {}} step_back={() => {}}/>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalExtensionForm;
