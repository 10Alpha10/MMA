import { NextResponse } from 'next/server'

export async function POST() {
  const response = new NextResponse(null, { status: 204 })

  response.cookies.set({
    name: 'auth-token',
    value: '',
    path: '/',
    expires: new Date(0), 
  })

  return response
}
