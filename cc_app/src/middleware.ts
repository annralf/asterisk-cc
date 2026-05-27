// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { paths } from './routes/paths';
// Definir los accesos por tipo de usuario
const accessControl: Record<string, string[]> = {
  admin: [
    '/setup/',
    '/setup/monitor/',
    '/setup/webrtc/',
    '/setup/server/',
    '/setup/ws/',
    '/monitoring/',
    '/clients/',
    '/extensions/',
    '/campaign/',
    '/categories/',
    '/',
    '/init/test/',
    '/init/',
    '/campaigns/',
    '/context/',
    '/users/',
    '/console/test/',
    '/console/',
  ],
  monitor: [ '/monitoring/', '/clients/', '/campaigns/', '/users/', '/extensions/' ],
  agent: [ '/console/', '/clients/' ],
  manager: [ '/campaign/', '/extensions/', '/users/' ],
  firstConfig: [ '/init/' ],
};
type userType = 'admin' | 'user' | 'firstConfig' | 'monitor' | 'agent' | 'operator' | 'manager';
//monitor: service, clients, stats(crearla en el app/stats/page.tsx)
//manager: campaigns, extensions, users

export default function middleware(request: NextRequest) {
  console.log("middleware");

  const token = request.cookies.get('permissionSession')?.value as userType;
  const url = request.nextUrl;

  // Redirigir si no hay token
  if (!token) {
    return NextResponse.redirect(new URL(paths.auth.jwt.signIn, request.url));
  }

  // Excluir solicitudes de RSC y estáticos
  if (url.pathname.includes('_next') || url.searchParams.has('_rsc')) {
    return NextResponse.next();
  }

  try {
    // Obtener el tipo de usuario desde el token
    const userType = token;

    // Obtener la ruta solicitada
    const requestedPath = request.nextUrl.pathname;
    

    // Verificar si el usuario tiene acceso a la ruta solicitada
    const allowedPaths = accessControl[userType] || [];
    const hasAccess = allowedPaths.includes(requestedPath); // <-- Verificar igualdad exacta


    // Si el usuario no tiene acceso, redirigir a su página de inicio
    if (!hasAccess) {
      const defaultPage = allowedPaths.length > 0 ? allowedPaths[0] : paths.auth.jwt.signIn;
      return NextResponse.redirect(new URL(defaultPage, request.url));
    }

    return NextResponse.next(); // Si tiene acceso, continuar normalmente
  } catch (error) {
    console.error("Token inválido:", error);
    return NextResponse.redirect(new URL(paths.auth.jwt.signIn, request.url));
  }
}

export const config = {
  matcher: [
    '/monitoring/:path*',
    '/clients/:path*',
    '/extensions/:path*',
    '/categories/:path*',
    '/setup/:path*',
    '/campaigns/:path*',
    '/context/:path*',
    '/users/:path*',
    '/console/:path*',
  ],
}