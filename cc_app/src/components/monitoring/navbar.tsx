'use client';
import { Paper } from '@mui/material';
import { NavSectionHorizontal } from '@/src/components/nav-section';
import { Iconify } from 'src/components/iconify';

const NAV_ITEMS = [
  {
    items: [
      {
        title: 'Operadores',
        path: '#landing',
        icon: <Iconify icon="lets-icons:user-alt-light" />,
        roles: ['admin'],
        caption: 'Display only admin role',
      },
      {
        title: 'Servicio | Cola',
        path: '#landing',
        icon: <Iconify icon="material-symbols-light:stacks-outline" />,
        roles: ['admin'],
        caption: 'Display only admin role',
      },
      {
        title: 'Extensiones',
        path: '#landing',
        icon: <Iconify icon="material-symbols-light:call-log-outline-sharp" />,
        roles: ['admin'],
        caption: 'Display only admin role',
      },
    ],
  },
];

const MonitoringNavBar = () => {
  return (
    <Paper variant="outlined" sx={{ px: 2, height: 80, borderRadius: 2 }}>
      <NavSectionHorizontal
        data={NAV_ITEMS}
        cssVars={{
          '--nav-item-gap': '24px',
        }}
        slotProps={{
          paper: {},
          rootItem: {
            sx: {
              typography: 'subtitle1',
              fontFamily: (theme) => theme.typography.fontSecondaryFamily,
            },
            icon: {},
            title: {},
            caption: {},
            info: {},
            arrow: {},
          },
          subItem: {
            sx: {},
            icon: {},
            title: {},
            caption: {},
            info: {},
            arrow: {},
          },
        }}
      />
    </Paper>
  );
};

export default MonitoringNavBar;
