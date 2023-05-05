// pages/api/_middleware.ts
import { NextResponse, NextRequest } from 'next/server';

const protectedPaths = ['/trips', '/reservations', '/properties', '/favorites'];

export default function middleware(req: NextRequest, res: NextResponse) {
  // Check if the request path is in the protectedPaths list
  if (protectedPaths.includes(req.nextUrl.pathname)) {
    // Add your authentication logic here
  }
  return NextResponse.next();
}

export const config = {
  api: {
    bodyParser: true,
  },
};
