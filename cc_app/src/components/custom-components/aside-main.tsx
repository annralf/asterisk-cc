'use client';

import React from 'react';
import Box from '@mui/material/Box'; 

type Props = {
  children: React.ReactNode;
};

const AsideComponent: React.FC<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#d9dbdc',
        color: 'black',
        padding: 2,
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Box>
  );
};

export default AsideComponent;