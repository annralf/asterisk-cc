'use client';

import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { authenticated, loading } = useAuthContext();
  const [ isChecking, setIsChecking ] = useState<boolean>(true);

  // Helper para construir query strings
  const createQueryString = useCallback(
    (name: string, value: string) => {
      if (value === paths.auth.jwt.signIn) {
        return '';
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [ searchParams ]
  );

  const checkPermissions = useCallback(async () => {
    if (loading) return; // Si está cargando, no hacemos nada

    // Evita redirigir si ya estás en el inicio de sesión
    if (!authenticated) {
      const isSignInPage = pathname.startsWith(paths.auth.jwt.signIn);

      // Si ya estamos en la página de inicio de sesión, detenemos el proceso
      if (isSignInPage) {
        setIsChecking(false);
        return;
      }

      // Generamos el 'returnTo' con la ruta previa
      const returnToPath = pathname || '/';
      const href = `${paths.auth.jwt.signIn}?${createQueryString('returnTo', returnToPath)}`;

      router.replace(href); // Redirigimos al inicio de sesión

      return;
    }

    // Si está autenticado, dejamos de verificar
    setIsChecking(false);
  }, [ authenticated, loading, pathname, createQueryString, router ]);






  useEffect(() => {
    checkPermissions();
  }, [ checkPermissions ]);

  if (loading || isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}