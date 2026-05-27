'use client';
import { Paper } from '@mui/material';
import { NavSectionHorizontal } from '@/src/components/nav-section';
import { Iconify } from 'src/components/iconify';
import { paths } from '@/src/routes/paths';

const NAV_ITEMS = [
  {
    items: [
      {
        title: 'Operadores',
        path: paths.user.main,
        icon: <Iconify icon="lets-icons:user-alt-light" />,        
        caption: 'Display only admin role',
      },
      {
        title: 'Servicio | Colas',
        path: paths.campaign.main,
        icon: <Iconify icon="material-symbols-light:stacks-outline" />,        
        caption: 'Display only admin role',
      },
      {
        title: 'Categorias de Servicio | Tipificaciones',
        path: paths.categories.main,
        icon: <Iconify icon="carbon:category-new-each" />,        
        caption: 'Display only admin role',
      },
      {
        title: 'Contextos de Atención',
        path: paths.context_setup.main,
        icon: <Iconify icon="f7:scope" />,        
        caption: 'Display only admin role',
      },
      {
        title: 'Extensiones',
        path: paths.extensions.main,
        icon: <Iconify icon="material-symbols-light:call-log-outline-sharp" />,
        caption: 'Display only admin role',
      },
    ],
  },
];

const SetupNavBar = () => {
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

export default SetupNavBar;