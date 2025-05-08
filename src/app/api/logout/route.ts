import { NextRequest, NextResponse } from 'next/server'
import { corsHeaders, handleOptions } from "@/lib/cors"

// ✅ رد على preflight
export async function OPTIONS(req: NextRequest) {
  return handleOptions(req)
}

export async function POST(req: NextRequest) {
  const response = new NextResponse(
    JSON.stringify({ message: "Logged out successfully" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(req),
      },
    }
  )

  response.cookies.set({
    name: 'auth-token',
    value: '',
    path: '/',
    expires: new Date(0), // يحذف الكوكي
  })

  return response
}
