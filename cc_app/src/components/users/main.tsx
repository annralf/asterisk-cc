'use client'
import React, { useState } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';

import ModalUser from './modal';
import NewUser from './new';
import { ITab } from '@/src/utils/interfaces';

import UserList from './board';
import DashboardCount from '../dashboard-count/dashboardCount';
import InfoPanelParameters from '../info-dashboard/infoDashboard';

const MainUser = () => {
  const [open, setOpen] = useState(false); // Estado para controlar el modal

  const handleOpen = () => setOpen(true);  // Función para abrir el modal
  const handleClose = () => setOpen(false); // Función para cerrar el modal

  const tabs: ITab[] = [
    {
      title: 'Usuarios',
      total: 100,
      color: 'success',
    },
    {
      title: 'Activos',
      total: 122,
      color: 'warning',
    },
    {
      title: 'Inactivos',
      total: 202,
      color: 'error',
    },
  ]
  return (
    <Box>
      <Typography variant="h4" marginBottom={2}>
        Gestion de Usuario
      </Typography>
      <InfoPanelParameters tabs={tabs} />

      <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Button variant="contained" color="primary" onClick={handleOpen} style={{marginTop: '2%', marginBottom: '2%'}}>
          Crear Usuario
        </Button>
      </Grid>
      <UserList />
      <NewUser user={null}/>
      {/* Pasando las props al ModalForm */}
     {/*  <ModalUser open={open} onClose={handleClose} user={null} /> */}
    </Box>
  );
};

export default MainUser;