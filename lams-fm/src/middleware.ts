import { NextResponse } from 'next/server';

// Temporary disable Clerk for preview without keys
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|ts|ico|json|svg)).*)',
    '/(api|trpc)(.*)',
  ],
};
