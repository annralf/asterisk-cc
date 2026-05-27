'use client';
import { useEffect } from 'react';

import { Grid } from '@mui/material';
import { Aside } from './aside';
import { Board } from './board';

import AsideComponent from 'src/components/custom-components/aside-main';
import { DashboardContent } from 'src/layouts/dashboard';

import { useAppDispatch } from '@/src/store/hooks';
import { setSession } from '@/src/store/slices/sessionSlice';

interface MonitorMainProps {
  userType: string;
}

const MonitorMain = ({ userType }: MonitorMainProps) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
      const session = {
        userType,
      };
  
      dispatch(setSession(session));
    }, [dispatch, userType]);

    const name = 'Estado del Servicio';
    
    return(
      <DashboardContent maxWidth="xl">
        <Grid container spacing={2}>
        {/* Aside Section */}
        <Grid item xs={12} md={4}>
          <AsideComponent>
            <Aside/>
          </AsideComponent>
        </Grid>
  
        {/* Main Section */}
        <Grid item xs={12} md={8}>
          <Board name={name} />
        </Grid>
      </Grid>

      </DashboardContent>
    )
}

export default MonitorMain;