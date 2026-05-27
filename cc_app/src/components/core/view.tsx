'use client';

import { Box, Stack, Button, Paper, Divider, Card } from '@mui/material';


import { DialPlanStatus } from './core-status';
import { DashboardContent } from '@/src/layouts/dashboard';
import { paths } from '@/src/routes/paths';
import { CustomBreadcrumbs } from '../custom-breadcrumbs';

const CoreView = () => {
    return(<>
        <Stack spacing={3} direction={'column'}>
            <Paper sx={{ p: 3 }}>
                <DialPlanStatus />
            </Paper>
            <Divider/>
        </Stack>
    </>)
};

export default CoreView;