'use client';

import type { NavSectionProps } from 'src/components/nav-section';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { allLangs } from 'src/locales';
import { _contacts, _notifications } from 'src/_mock';

import { Logo } from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';

import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';


import { Main } from './main';
import { NavMobile } from './nav-mobile';
import { layoutClasses } from '../classes';
import { NavVertical } from './nav-vertical';
import { NavHorizontal } from './nav-horizontal';
import { _account } from '../config-nav-account';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { StyledDivider, useNavColorVars } from './styles';
import { ContactsPopover } from '../components/contacts-popover';

import { navDataAgent, navDataMonitor, navDataAdmin } from '@/src/components/custom-components/config/navbar';

//----Custom components
import { UserPopover } from '@/src/components/custom-components/user-popover';
import { ExitBtn } from '@/src/components/custom-components/exit-btn';

import { getSession } from '@/src/store/slices/sessionSlice';
import { useAppSelector } from '@/src/store/hooks';
import { getUserSession } from '@/src/auth/context/jwt';


const _user = [
  {
    id: 'team-1',
    name: 'José Garcia',
    status: 'online',
  },
];

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
  data?: {
    nav?: NavSectionProps[ 'data' ];
  };
};

export function DashboardLayout({ sx, children, header, data }: DashboardLayoutProps) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const settings = useSettingsContext();

  const navColorVars = useNavColorVars(theme, settings);

  const user = getUserSession();

  const layoutQuery: Breakpoint = 'lg';


  const isNavMini = settings.navLayout === 'mini';
  const isNavHorizontal = settings.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.navLayout === 'vertical';

  const session = useAppSelector(getSession);
  const userType = user?.access_type;

  const userTypes = [
    {
      id: 'agent',
      name: 'Agente',
      role: 'agent',
    },
    {
      id: 'admin',
      name: 'Administrador',
      role: 'admin',
    },
    {
      id: 'monitor',
      name: 'Monitoreo',
      role: 'monitor',
    },
  ]

  let navData = navDataAgent;

  switch (userType) {
    default:
    case 'agent':
      navData = navDataAgent;
      break;
    case 'admin':
      navData = navDataAdmin;
      break;

    case 'monitor':
      navData = navDataMonitor;
      break;
  }

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          disableElevation={isNavVertical}
          slotProps={{
            toolbar: {
              sx: {
                ...(isNavHorizontal && {
                  bgcolor: 'var(--layout-nav-bg)',
                  [ `& .${iconButtonClasses.root}` ]: {
                    color: 'var(--layout-nav-text-secondary-color)',
                  },
                  [ theme.breakpoints.up(layoutQuery) ]: {
                    height: 'var(--layout-nav-horizontal-height)',
                  },
                }),
              },
            },
            container: {
              maxWidth: false,
              sx: {
                ...(isNavVertical && { px: { [ layoutQuery ]: 5 } }),
              },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            bottomArea: isNavHorizontal ? (
              <NavHorizontal
                data={navData}
                layoutQuery={layoutQuery}
                cssVars={navColorVars.section}
              />
            ) : null,
            leftArea: (
              <>
                {/* -- Nav mobile -- */}
                <MenuButton
                  onClick={mobileNavOpen.onTrue}
                  sx={{
                    mr: 1,
                    ml: -1,
                    [ theme.breakpoints.up(layoutQuery) ]: { display: 'none' },
                  }}
                />
                <Chip
                  variant='soft'
                  label={userTypes.find(type => type.id === userType)?.name || userType}
                  color="info"
                  avatar={<Avatar></Avatar>}
                />

                {/* -- Logo -- */}
                {isNavHorizontal && (
                  <Logo
                    sx={{
                      display: 'none',
                      [ theme.breakpoints.up(layoutQuery) ]: { display: 'inline-flex' },
                    }}
                  />
                )}
                {/* -- Divider -- */}
                {isNavHorizontal && (
                  <StyledDivider
                    sx={{ [ theme.breakpoints.up(layoutQuery) ]: { display: 'flex' } }}
                  />
                )}

              </>
            ),
            rightArea: (
              <Box display="flex" alignItems="center" gap={{ xs: 0, sm: 0.75 }}>
                <UserPopover data={user}
                  sx={{ color: 'var(--layout-nav-text-primary-color)' }} />
                <ExitBtn />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        isNavHorizontal ? null : (
          <NavVertical
            data={navData}
            isNavMini={isNavMini}
            layoutQuery={layoutQuery}
            cssVars={navColorVars.section}
            onToggleNav={() =>
              settings.onUpdateField(
                'navLayout',
                settings.navLayout === 'vertical' ? 'mini' : 'vertical'
              )
            }
          />
        )
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        ...navColorVars.layout,
        '--layout-transition-easing': 'linear',
        '--layout-transition-duration': '120ms',
        '--layout-nav-mini-width': '88px',
        '--layout-nav-vertical-width': '300px',
        '--layout-nav-horizontal-height': '64px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [ `& .${layoutClasses.hasSidebar}` ]: {
          [ theme.breakpoints.up(layoutQuery) ]: {
            transition: theme.transitions.create([ 'padding-left' ], {
              easing: 'var(--layout-transition-easing)',
              duration: 'var(--layout-transition-duration)',
            }),
            pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main isNavHorizontal={isNavHorizontal}>{children}</Main>
    </LayoutSection>
  );
}
