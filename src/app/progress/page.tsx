'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { ProgressStats } from '@/components/progress-stats'
import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'

export default function ProgressPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Link href="/generate">
            <Suspense fallback={null}>
              <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground transition-colors">
                ← Back
              </Button>
            </Suspense>
          </Link>
          <Suspense fallback={null}>
            {/* <ModeToggle /> */}
          </Suspense>
        </div>

        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent dark:from-zinc-100 dark:to-white">Progress Tracking</h1>
            <p className="text-lg text-muted-foreground dark:text-zinc-300 mt-2">
              Track your quiz performance and learning progress over time.
            </p>
          </div>
          <ProgressStats />
        </div>
      </div>
    </AppLayout>
  )
}
