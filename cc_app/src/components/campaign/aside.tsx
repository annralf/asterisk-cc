import React from 'react'
import { Box, Typography, TextField, InputAdornment, Divider } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
const Aside = () => {
  return (
    <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
    <Typography variant="h6" gutterBottom>
      Campaña
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
              <CalendarTodayIcon />
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
              <CalendarTodayIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>

    <Divider />

    <Typography variant="body1" mt={2}>
      Consulta por Identificador
    </Typography>
    <TextField
      fullWidth
      placeholder="Buscar agente..."
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  </Box>
  )
}

export default Aside