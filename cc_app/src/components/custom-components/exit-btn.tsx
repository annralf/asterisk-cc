'use client';
import { redirect } from 'next/navigation'

import Badge from '@mui/material/Badge';
import { Iconify } from 'src/components/iconify';
import { useAppDispatch } from '@/src/store/hooks';
import { clearSession } from '@/src/store/slices/sessionSlice';

import IconButton from '@mui/material/IconButton';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';
import { clearLocalSession } from '@/src/auth/context/jwt';
import { paths } from '@/src/routes/paths';

export const ExitBtn = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleExit = () => {
    dispatch(clearSession());
    router.replace(paths.auth.jwt.signIn);
    clearLocalSession();
    
    //redirect(paths.auth.jwt.signIn);
  };

  return (
    <IconButton aria-label="settings" onClick={handleExit} sx={{ p: 0, width: 40, height: 40 }}>
      <Badge>
        <Iconify width={24} icon="mingcute:exit-line" />
      </Badge>
    </IconButton>
  );
};
