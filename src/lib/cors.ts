// lib/cors.ts
import { NextRequest, NextResponse } from 'next/server'

/**
 * تُرجع رؤوس CORS المناسبة لطلب معين.
 */
export function corsHeaders(req: NextRequest): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
}

/**
 * يعالج طلبات OPTIONS (preflight)
 */
export function handleOptions(req: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(req),
  })
}
