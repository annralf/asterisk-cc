'use client';

import React from 'react';

import {
  Box,
  Grid,
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

// Sample data for the table
const data = [
  {
    agent: 'Alejandra Rojas',
    ext: '0001',
    service: 'Service Type',
    status: 'Completed',
    duration: '01:40 min',
  },
  {
    agent: 'Alejandra Rojas',
    ext: '0001',
    service: 'Service Type',
    status: 'Completed',
    duration: '01:40 min',
  },
  {
    agent: 'Alejandra Rojas',
    ext: '0001',
    service: 'Service Type',
    status: 'Completed',
    duration: '01:40 min',
  },
  {
    agent: 'Alejandra Rojas',
    ext: '0001',
    service: 'Service Type',
    status: 'Completed',
    duration: '01:40 min',
  },
];

export interface IFlag {
  flag?: boolean;
  name?: string;
};


export const Board: React.FC<IFlag> = ({ flag= true , name }) => (
  <Box sx={{ padding: 2 }}>
    <Typography variant="h5" gutterBottom>
      {name}
    </Typography>

    <Typography variant="subtitle1" mb={2}>
      Calls from Dec 1, 2014 to Dec 15, 2024
    </Typography>

  {
    flag ?  <Grid container spacing={2} mb={2}>
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
  </Grid> :  <Grid container spacing={2} mb={2}>
      <Grid item>
        <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
          <Typography variant="h6">10</Typography>
          <Typography variant="body2">ACTIVO</Typography>
        </Paper>
      </Grid>
      <Grid item>
        <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e0e0e0' }}>
          <Typography variant="h6">02</Typography>
          <Typography variant="body2">FUERA DE SERVICIO</Typography>
        </Paper>
      </Grid>
    </Grid>
  }
   {/*  <Grid container spacing={2} mb={2}>
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
    </Grid> */}

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Agente</TableCell>
            <TableCell>EXT.</TableCell>
            <TableCell>Servicio</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Duracion</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.agent}</TableCell>
              <TableCell>{row.ext}</TableCell>
              <TableCell>{row.service}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.duration}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                  Reproducir
                </Button>
                <Button variant="outlined" color="primary">
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);