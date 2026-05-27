import React from 'react'

import { Box, Grid, Paper, Typography } from '@mui/material';

import { ITab } from '@/src/utils/interfaces';
import { useTheme } from '@mui/material/styles';
import { AppWidget } from '@/src/sections/overview/app/app-widget';
import { svgColorClasses } from '../svg-color';
import { AnimateCountUpNumber } from '@/src/sections/_examples/extra/animate-view/other/count-up-number';

interface IInfoPanelParameters {
    tabs: ITab[];
}

const InfoPanelParameters: React.FC<IInfoPanelParameters> = ({ tabs }) => {
    const theme = useTheme();
    return (
        <Grid container spacing={2} xs={12}>
            {tabs.map((tab, index) => (
                <Grid item key={index} xs={12} md={4} >
                    {/*  <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
                        <Typography variant="h6">{tab.total}</Typography>
                        <Typography variant="body2">{tab.title}</Typography>
                    </Paper> */}
                    <AppWidget
                        title={tab.title}
                        total={tab.total}
                        icon="solar:user-rounded-bold"
                        chart={{ series: 48, colors: [ theme.vars.palette.info.light, theme.vars.palette.info.main ] }}
                        sx={{ bgcolor: `${tab.color}.dark`, [ `& .${svgColorClasses.root}` ]: { color: `${tab.color}.light` } }}
                      
                    />
                    
                </Grid>


            ))}

            {/*   <Grid xs={12} md={4} >
                <Box sx={{ gap: 3, display: 'flex', flexWrap: 'wrap' }}>
                    <AppWidget
                        title="Conversion"
                        total={38566}
                        icon="solar:user-rounded-bold"
                        chart={{ series: 48 }}
                    />

                    <AppWidget
                        title="Applications"
                        total={55566}
                        icon="fluent:mail-24-filled"
                        chart={{
                            series: 75,
                            colors: [ theme.vars.palette.info.light, theme.vars.palette.info.main ],
                        }}
                        sx={{ bgcolor: 'info.dark', [ `& .${svgColorClasses.root}` ]: { color: 'info.light' } }}
                    />
                </Box>
            </Grid> */}
        </Grid>
    )
}

export default InfoPanelParameters


