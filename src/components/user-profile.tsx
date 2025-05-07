'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserCircle } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { getCookie } from 'cookies-next'

export function UserProfile() {
  const { logout } = useAuth()
  const userData = getCookie('currentUser')
  const email = userData ? JSON.parse(userData.toString()).email : ''

  if (!email) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <UserCircle className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{email}</p>
          </div>
        </div>
        <DropdownMenuItem 
          className="text-red-600 cursor-pointer" 
          onClick={logout}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
