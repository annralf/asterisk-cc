'use client';

import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { IUser } from '@/src/types/app';

// ----------------------------------------------------------------------

export type UserPopoverProps = ButtonBaseProps & {
  data?: IUser | null;
/*   data?: {
    id: string;
    name: string;
    status: string;
  }[];
}; */
};

export function UserPopover({ data = null, sx, ...other }: UserPopoverProps) {
  const popover = usePopover();

  const mediaQuery = 'sm';

  const [user, setUser] = useState(data);

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={popover.onOpen}
        sx={{
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          ...sx,
        }}
        {...other}
      >
       {/*  <Box
          component="img"
          alt={user?.name}
          src={user?.logo}
          sx={{ width: 24, height: 24, borderRadius: '50%' }}
        /> */}

        <Box
          component="span"
          sx={{
            typography: 'subtitle2',
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {`${user?.first_name} ${user?.last_name}`}
        </Box>

       {/*  <Label
          color={user?.status === 'online' ? 'primary' : 'info'}
          sx={{
            height: 22,
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {user?.status}
        </Label> */}

        <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
      </ButtonBase>
    </>
  );
}
