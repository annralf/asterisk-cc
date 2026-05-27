'use client';

import { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

import { getSession, getUserSession } from '../context/jwt';

import { paths } from '@/src/routes/paths';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { loading, authenticated } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }
    const sessionData = getUserSession();
    let path = '/';
    if (sessionData?.access_type) {
      const accessType = sessionData?.access_type as keyof typeof paths;
      const accessPath = paths[accessType];
      if (typeof accessPath === 'object' && 'main' in accessPath) {
        path = accessPath.main;

      }
    }
    if (authenticated) {
      router.replace(path);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
