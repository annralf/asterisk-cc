'use client'
import React, { useState } from 'react'

import { Box, Button, Grid, Typography } from '@mui/material';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';

import { CONFIG } from 'src/config-global';

import AsideComponent from '../custom-components/aside-main';
import Aside from './aside';
import BoardCampaign from './board';
import ModalCampaign from './modal';

export const metadata = { title: `Campaign - ${CONFIG.appName}` };

export interface ICampaign {
  userName: string;
  campaignName: string;
  id: string;
  status: string;
};
export default function MainCampaign() {
  const [ open, setOpen ] = useState(false); // Estado para controlar el modal

  const handleOpen = () => setOpen(true);  // Función para abrir el modal
  const handleClose = () => setOpen(false); // Función para cerrar el modal


  const listCampaign: ICampaign[] = [
    { userName: 'José Millán', id: '180893445', campaignName: 'card', status: 'FINALIZADA' },
    { userName: 'José Millán', id: '180893445', campaignName: 'card', status: 'FINALIZADA' },
    { userName: 'José Millán', id: '180893445', campaignName: 'card', status: 'FINALIZADA' },
  ];

  return (
    <Grid container spacing={2}>
      {/* Aside Section */}
      <Grid item xs={12} md={4}>
        <AsideComponent>
          <Aside />
        </AsideComponent>
      </Grid>

      {/* Main Section */}
      <Grid item xs={12} md={8}>
        {/*  <CallServiceStatus name='Estado de Serivicio' /> */}
        <Box style={{ paddingBottom: 5 }} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <SettingsTwoToneIcon style={{ fontSize: 36, marginRight: 8 }} />
          <Typography variant="h6" fontWeight="bold">
            Gestión de Campaña
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Crear Campaña
          </Button>
        </Box>
        <BoardCampaign/>
        {/* Form */}
        <ModalCampaign open={open} onClose={handleClose} service={null}/>
      </Grid>
    </Grid>
  )
}

