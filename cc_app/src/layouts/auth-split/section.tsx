import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config-global';
import { varAlpha, bgGradient } from 'src/theme/styles';

// ----------------------------------------------------------------------

type SectionProps = BoxProps & {
  method?: string;
  imgUrl?: string;
  subtitle?: string;
  layoutQuery: Breakpoint;
};

export function Section({
  sx,
  method,
  layoutQuery,
  imgUrl = `${CONFIG.assetsDir}/logo/optimus_call_horizontal.png`,
  subtitle = '"Tu aliado en la optimización de la atención al cliente."',
  ...other
}: SectionProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)}, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)}`,
          imgUrl: `${CONFIG.assetsDir}/assets/background/background-3-blur.webp`,
        }),
        px: 3,
        pb: 3,
        width: 1,
        maxWidth: 700,
        display: 'none',
        position: 'relative',
        pt: 'var(--layout-header-desktop-height)',
        [theme.breakpoints.up(layoutQuery)]: {
          gap: 8,
          display: 'flex',
          alignItems: 'center',
          justifyItems:'center',
          flexDirection: 'column',
          justifyContent: 'center',
        },
        ...sx,
      }}
      {...other}
    >     
     <Box
        component="img"
        alt="Optimus Call Center"
        src={imgUrl}
        sx={{ width: '50%', aspectRatio: '1/1', objectFit: 'contain' }}
      />
        <Box component="ul" gap={2} display="flex">
          <Typography sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>
            {subtitle}
          </Typography>
        </Box>
    </Box>
  );
}
