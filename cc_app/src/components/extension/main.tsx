'use client'
import React, { useState } from 'react'
import ListExtension from './board'
import { useEffect } from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import ModalExtensionForm from './modal';

const MainExtension = () => {

  const [ listExtencion, setListExtension ] = useState(null);
  const [ open, setOpen ] = useState(false); // Estado para controlar el modal

  const handleOpen = () => setOpen(true);  // Función para abrir el modal
  const handleClose = () => setOpen(false); // Función para cerrar el modal

  useEffect(() => {


    return () => {
    }
  }, [ listExtencion ])



  return (
    <Box>

      <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant="h4" marginBottom={2}>
          Extensiones
        </Typography>
        {/* Botón para abrir el modal */}
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Crear Extension
        </Button>

      </Grid>
      <ModalExtensionForm open={open} onClose={handleClose} extension={null}/>
      <ListExtension/>
    </Box>
  )
}

export default MainExtension
