'use client'

import { useState } from 'react'
import { SiteHeader } from './site-header'
import { NavSidebar } from './nav-sidebar'

interface AppLayoutProps {
  children: React.ReactNode;
  onNavigate?: (href: string) => void;
}

export function AppLayout({ children, onNavigate }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader 
        isLoggedIn={true} 
        showMenuButton={true}
        onMenuClick={toggleSidebar}
      />
      <div className="flex-1 flex">
        <NavSidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          onNavigate={onNavigate}
        />
        <main className="flex-1 md:ml-64 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
