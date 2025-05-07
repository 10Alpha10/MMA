import { NextResponse } from 'next/server'
import type { Progress, ProgressStats } from '@/types/types'

import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const stats = {
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    dailyProgress: []
  }
  
  return NextResponse.json(stats)
}

export async function POST(request: NextRequest) {
  const progress: Progress = await request.json()
  return NextResponse.json({ success: true })
}

// Add OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
