'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TimeTableCreator } from '@/components/time-table-creator'
import { AppLayout } from '@/components/app-layout'

export default function TimeTablePage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-0">Time Table Creator</h1>
          <Link href="/generate">
            <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </Button>
          </Link>
        </div>
        <div className="w-full overflow-hidden">
          <TimeTableCreator />
        </div>
      </div>
    </AppLayout>
  )
}
