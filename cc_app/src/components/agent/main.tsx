'use client';
import { useEffect } from 'react';

import { Grid, Typography } from '@mui/material';
import { Aside } from './aside';
import { Board } from './board';

import AsideComponent from 'src/components/custom-components/aside-main';
import { DashboardContent } from 'src/layouts/dashboard';

import { useAppDispatch } from '@/src/store/hooks';
import { setSession } from '@/src/store/slices/sessionSlice';
import { tabs } from '@/src/theme/core/components/tabs';
import InfoPanelParameters from '../info-dashboard/infoDashboard';
import AgentPanel from './agentPanel';
import { ITab } from '@/src/utils/interfaces';

interface AgentMainProps {
  userType: string;
}

const AgentMain = ({ userType }: AgentMainProps) => {

  
const tabs:ITab[] = [
  {
    title: 'RECIBIDAS',
    total: 100,
    color: 'success',
  },
  {
    title: 'PAUSADAS',
    total: 1,
    color: 'warning',
  },
  {
    title: 'CON NOVEDAD',
    total: 20,
    color: 'error',
  },
]

  const dispatch = useAppDispatch();
  useEffect(() => {
    const session = {
      userType,
    };

    dispatch(setSession(session));
  }, [ dispatch, userType ]);

  const name = 'Estado del Servicio';

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={2}>
        {/* Aside Section */}
        <Grid item xs={12} md={4}>
          <AsideComponent>
            <Aside />
          </AsideComponent>
        </Grid>

        {/* Main Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1" mb={2}>
            Calls from Dec 1, 2014 to Dec 15, 2024
          </Typography>

          <InfoPanelParameters tabs={tabs} />
          <AgentPanel />
          <Board name={name} />
        </Grid>
      </Grid>

    </DashboardContent>
  )
}

export default AgentMain;