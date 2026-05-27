'use client';

import React from 'react';
import {
  Box,
  Divider,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import { CalendarItem } from 'src/components/custom-icons/calendar-icon';
import { SearchItem } from 'src/components/custom-icons/search-icon';

export const Aside: React.FC = () => (
    <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Llamadas
      </Typography>

      <Typography variant="body1" p={2}>Consulta por fecha</Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Desde"
          type="date"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarItem />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Hasta"
          type="date"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarItem />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider />

      <Typography variant="body1" mt={2}>
        Búsqueda por cliente
      </Typography>
      <TextField
        fullWidth
        placeholder="Buscar cliente..."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchItem />
            </InputAdornment>
          ),
        }}
      />

      <Divider />

      <Typography variant="body1" mt={2}>
        Consulta por agente
      </Typography>
      <TextField
        fullWidth
        placeholder="Buscar agente..."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchItem/>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );