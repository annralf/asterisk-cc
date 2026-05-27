'use client';
import { Paper } from "@mui/material";
import { NavSectionHorizontal } from "@/src/components/nav-section";
import { Iconify } from 'src/components/iconify';

const NAV_ITEMS = [
   { items: [
        {
            title: 'Pausar',
            path: '#landing',
            icon: <Iconify icon="eva:more-vertical-fill" />,
            roles: ['admin'],
            caption: 'Display only admin role',
          },
          {
            title: 'Silenciar',
            path: '#services',
            icon: <Iconify icon="ep:mute" />,
            roles: ['admin', 'user'],
          },
          {
            title: 'Pausar grabación',
            path: '#services',
            icon: <Iconify icon="carbon:stop-outline" />,
            roles: ['admin', 'user'],
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
        <Paper variant="outlined" sx={{px:2, height:80, borderRadius: 2}}>
            <NavSectionHorizontal data={NAV_ITEMS}   cssVars={{
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
        }}/>
        </Paper>
    )
};

export default ServiceNavBar;