import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => (
    <Iconify width={24} icon={name} /> 
);

const ICONS = {
  home: icon('material-symbols:home-outline-rounded'),
  support: icon('fluent:video-person-call-20-regular'),
  settings: icon('tdesign:setting'),
  user: icon('bx:user'),
  clients: icon('hugeicons:user-list'),
  calls: icon('material-symbols:call-log-outline-rounded'),
  monitor: icon('lucide:monitor-cog')
};

// ----------------------------------------------------------------------

/* export const navDataMonitor = [
  {
    subheader: 'Call Center',
    items: [
      { title: 'Inicio', path: paths.service.main, icon: ICONS.home },
      { title: 'Clientes', path: paths.clients.main, icon: ICONS.clients },
      { title: 'Monitoreo', path: paths.monitoring, icon: ICONS.monitor },
    ],
  },
]; */
export const navDataAdmin = [
  {
    subheader: 'Call Center',
    items: [
      { title: 'Inicio', path: paths.setup.main, icon: ICONS.home },
      { title: 'Extensiones', path: paths.extensions.main, icon: ICONS.settings },
      { title: 'Colas', path: paths.campaign.main, icon: ICONS.settings },
      { title: 'Contextos', path: paths.context_setup.main, icon: ICONS.settings },
      { title: 'Tipificaciones', path: paths.categories.main, icon: ICONS.settings },
      { title: 'Usuarios', path: paths.user.main, icon: ICONS.clients },
      { title: 'Monitor de Servicio', path: paths.setup.monitor, icon: ICONS.settings },
      { title: 'Log de Servicio', path: paths.setup.server, icon: ICONS.settings },
      { title: 'Test de Conexión', path: paths.init.test, icon: ICONS.settings },
    ],
  },
];

export const navDataAgent = [
  {
    subheader: 'Call Center',
    items: [
      { title: 'Inicio', path: paths.console.main, icon: ICONS.home },
    ],
  },
];
export const navDataMonitor = [
  {
    subheader: 'Call Center',
    items: [
      { title: 'Inicio',    path: paths.monitoring.main, icon: ICONS.home },
      { title: 'Clientes',  path: paths.clients.main, icon: ICONS.clients },
    ],
  },
];
