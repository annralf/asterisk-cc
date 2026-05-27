'use client';
import { Button, Paper, Stack } from "@mui/material";
import { NavSectionHorizontal } from "@/src/components/nav-section";
import { Iconify } from 'src/components/iconify';

const NAV_ITEMS = [
   { items: [
        {
            title: 'Colgar',
            path: '#landing',
            icon: <Iconify icon="streamline:hang-up-2" />,
            roles: ['user'],
            caption: 'Display only admin role',
          },
          {
            title: 'Pedir soporte',
            path: '#services',
            icon: <Iconify icon="ix:support" />,
            roles: ['admin', 'user'],
          },
    ]}
];

const ServiceNavBar = () => {
    return (
        <Paper variant="outlined" sx={{ px: 2, py: 2, borderRadius: 2 }}>
          <Stack direction="row" spacing={2}> 
            {NAV_ITEMS[0].items.map((item) => (
              <Button
                  key={item.title}
                  href={item.path}
                  startIcon={item.icon}
                  sx={{ 
                display: 'flex', 
                justifyContent: 'flex-start', 
                mb: 1, 
                textTransform: 'none' 
                  }}
              >
                  {item.title}
              </Button>
            ))}
          </Stack>
        </Paper>
    )
};

export default ServiceNavBar;