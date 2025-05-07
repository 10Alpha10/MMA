'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { UserProfile } from '@/components/user-profile'

interface NavSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
}

export function NavSidebar({ isOpen, onClose, onNavigate }: NavSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  
  const handleNavigation = (href: string) => {
    if (onNavigate) {
      onNavigate(href)
    } else {
      router.push(href)
    }
    if (isOpen) {
      onClose()
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-screen bg-secondary dark:bg-gray-800 p-4 border-r border-border
        z-50 transition-transform duration-300 ease-in-out
        w-[280px] md:w-64 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Navigation</h2>
            {/* <UserProfile /> */}
          </div>
          <nav className="space-y-2">
            <div 
              onClick={() => handleNavigation('/generate')}
              className={`flex items-center p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-gray-700 cursor-pointer ${
                pathname === '/generate' ? 'bg-primary/10 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-foreground">MCQ Generation</span>
            </div>
            <div 
              onClick={() => handleNavigation('/progress')}
              className={`flex items-center p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-gray-700 cursor-pointer ${
                pathname === '/progress' ? 'bg-primary/10 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-foreground">Progress Tracking</span>
            </div>
            <div 
              onClick={() => handleNavigation('/notes')}
              className={`flex items-center p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-gray-700 cursor-pointer ${
                pathname === '/notes' ? 'bg-primary/10 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-foreground">Study Notes</span>
            </div>
            {/* <div 
              onClick={() => handleNavigation('/pomodoro')}
              className={`flex items-center p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-gray-700 cursor-pointer ${
                pathname === '/pomodoro' ? 'bg-primary/10 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-foreground">Pomodoro Timer</span>
            </div> */}
            <div 
              onClick={() => handleNavigation('/todo')}
              className={`flex items-center p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-gray-700 cursor-pointer ${
                pathname === '/todo' ? 'bg-primary/10 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-foreground">Todo List</span>
            </div>
            <div 
              onClick={() => handleNavigation('/bookmarks')}
              className={`flex items-center p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-gray-700 cursor-pointer ${
                pathname === '/bookmarks' ? 'bg-primary/10 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-foreground">Bookmarks</span>
            </div>
            <div
              onClick={() => handleNavigation('/timetable')}
              className={`flex items-center p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-gray-700 cursor-pointer ${
                pathname === '/timetable' ? 'bg-primary/10 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-foreground">Time Table Creator</span>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
