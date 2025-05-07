'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import { UserProfile } from '@/components/user-profile'

export function SiteHeader({ 
  isLoggedIn, 
  showMenuButton = false,
  onMenuClick,
  isLandingPage = false
}: { 
  isLoggedIn: boolean;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  isLandingPage?: boolean;
}) {
  return (
    <header className="w-full py-4 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center border-b border-border">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
        )}
        <Image 
          src="/icon.png" 
          alt="QuizMate Logo" 
          width={40} 
          height={40}
          className="dark:invert" 
        />
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">QuizMate</h1>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
        {isLoggedIn ? (
          <>
            {isLandingPage && (
              <Link href="/generate">
                <Button variant="outline">Go to App</Button>
              </Link>
            )}
            <UserProfile />
            <ModeToggle />
          </>
        ) : (
          <>
            <Link href="/signup">
              <Button variant="outline">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <ModeToggle />
          </>
        )}
      </div>
    </header>
  )
}
