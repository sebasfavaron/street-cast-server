import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(?::\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(?::\d+)?$/,
];

function resolveAllowedOrigin(origin: string | null): string {
  if (!origin) {
    return '*';
  }

  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin))
    ? origin
    : '*';
}

export function applyCors(response: NextResponse, request: NextRequest): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', resolveAllowedOrigin(request.headers.get('origin')));
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  response.headers.set('Vary', 'Origin');
  return response;
}

export function createCorsPreflightResponse(request: NextRequest): NextResponse {
  return applyCors(new NextResponse(null, { status: 204 }), request);
}
