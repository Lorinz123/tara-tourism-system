// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user is trying to access a protected route
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/explore') || path.startsWith('/dashboard');
  
  // Get the token from cookies (Note: localStorage doesn't work in middleware)
  // If you prefer to keep using localStorage, use the "Page-Level" method below instead.
  
  return NextResponse.next();
}