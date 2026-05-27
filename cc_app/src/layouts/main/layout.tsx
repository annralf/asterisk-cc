'use client';

import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { Main } from './main';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { Footer, HomeFooter } from './footer';
import { LayoutSection } from '../core/layout-section';
import { navData as mainNavData } from '../config-nav-main';

import type { NavMainProps } from './nav/types';

// ----------------------------------------------------------------------

export type MainLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
  data?: {
    nav?: NavMainProps['data'];
  };
};

export function MainLayout({ sx, data, children, header }: MainLayoutProps) {
  const theme = useTheme();

  const pathname = usePathname();

  const mobileNavOpen = useBoolean();

  const homePage = pathname === '/';

  const layoutQuery: Breakpoint = 'md';

  const navData = data?.nav ?? mainNavData;

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      
      /** **************************************
       * Footer
       *************************************** */
      footerSection={homePage ? <HomeFooter /> : <Footer layoutQuery={layoutQuery} />}
      /** **************************************
       * Style
       *************************************** */
      sx={sx}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
