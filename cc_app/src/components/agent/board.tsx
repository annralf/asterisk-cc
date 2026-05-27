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
import AgentPanel from './agentPanel';
import InfoPanelParameters from '../info-dashboard/infoDashboard';

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


export const Board: React.FC<IFlag> = ({ flag = true, name }) => (
  <Box sx={{ padding: 2 }}>
    <Typography variant="h5" gutterBottom>
      {name}
    </Typography>

   
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