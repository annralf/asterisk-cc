import { Grid, Paper, Typography } from '@mui/material'
import React from 'react'

const DashboardCount = () => {
  return (
    <Grid container spacing={2} mb={2}>
    <Grid item>
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
        <Typography variant="h6">10</Typography>
        <Typography variant="body2">RECIBIDAS</Typography>
      </Paper>
    </Grid>
    <Grid item>
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
        <Typography variant="h6">02</Typography>
        <Typography variant="body2">PAUSADAS</Typography>
      </Paper>
    </Grid>
    <Grid item>
      <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
        <Typography variant="h6">02</Typography>
        <Typography variant="body2">CON NOVEDAD</Typography>
      </Paper>
    </Grid>
  </Grid>
  )
}

export default DashboardCount
