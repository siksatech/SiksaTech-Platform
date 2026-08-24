import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Identify subdomain connections (team.siksatech.in or local test hosts team.localhost)
  const isTeamSubdomain = host.startsWith('team.siksatech.in') || host.startsWith('team.localhost');

  if (isTeamSubdomain) {
    // Prevent infinite rewrite loop for static files, next assets, or api endpoints
    const isSpecialPath = 
      url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/api') || 
      url.pathname.startsWith('/team-portal') ||
      url.pathname.includes('.') ||
      url.pathname.startsWith('/hero_stem_building') ||
      url.pathname.startsWith('/stem_lab_setup');

    if (!isSpecialPath) {
      // Rewrite the destination target transparently
      url.pathname = `/team-portal${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Process all paths except API, static resources, and typical image files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
