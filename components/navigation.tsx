'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Menu, Home, Building2, MapPin, MessageSquare, DollarSign, User, Moon, Sun, LogOut, Settings, BarChart3, Shield, FileText, Users, Plus, History, CreditCard, BookOpen, TrendingUp, Bell, Search, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { apiClient } from '@/lib/api'

interface NavigationProps {
  userType?: 'resident' | 'investor' | null
}

export function Navigation({ userType }: NavigationProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      fetchUserProfile()
    }
  }, [])

  const fetchUserProfile = async () => {
    const response = await apiClient.getProfile()
    if (response.data) {
      setUser(response.data)
    }
  }

  const handleLogout = () => {
    apiClient.clearToken()
    setIsLoggedIn(false)
    setUser(null)
    window.location.href = '/'
  }

  const residentNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/projects', label: 'Projects', icon: Building2 },
    { href: '/map', label: 'Interactive Map', icon: MapPin },
    { href: '/buildings', label: 'Buildings', icon: Building2 },
    { href: '/feedback-history', label: 'My Feedback', icon: MessageSquare },
    { href: '/payments', label: 'Payments', icon: DollarSign },
    { href: '/verify-residence', label: 'Verify Residence', icon: Shield },
  ]

  const investorNavItems = [
    { href: '/investor-dashboard', label: 'Dashboard', icon: Home },
    { href: '/my-projects', label: 'My Projects', icon: Building2 },
    { href: '/create-project', label: 'Create Project', icon: Plus },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/compliance', label: 'Compliance', icon: Shield },
  ]

  const sharedNavItems = [
    { href: '/regulations', label: 'Regulations', icon: BookOpen },
    { href: '/statistics', label: 'Statistics', icon: TrendingUp },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  const navItems = userType === 'investor' ? investorNavItems : residentNavItems

  const NavContent = ({ mobile = false }) => (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => mobile && setIsMobileOpen(false)}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group relative",
              isActive
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              !mobile && isCollapsed && "justify-center"
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {(mobile || !isCollapsed) && <span>{item.label}</span>}
            {!mobile && isCollapsed && (
              <div className="absolute left-16 bg-card text-card-foreground px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border">
                {item.label}
              </div>
            )}
          </Link>
        )
      })}

      {/* Shared Items */}
      <div className="pt-4">
        {(mobile || !isCollapsed) && (
          <div className="text-xs font-medium text-muted-foreground mb-2 px-3 border-t pt-4">
            GENERAL
          </div>
        )}
        {sharedNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setIsMobileOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group relative",
                isActive
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                !mobile && isCollapsed && "justify-center"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {(mobile || !isCollapsed) && <span>{item.label}</span>}
              {!mobile && isCollapsed && (
                <div className="absolute left-16 bg-popover text-popover-foreground px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card h-16">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Side - Logo and Menu Toggle */}
          <div className="flex items-center space-x-4">
            {/* Desktop Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold">URBANFLOW</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <NavContent mobile />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">URBANFLOW</span>
            </div>
          </div>

          {/* Right Side - Actions and Profile */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Search className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {isLoggedIn && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-white">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] bg-card transition-all duration-300 ease-in-out hidden lg:block",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4">
            <NavContent />
          </div>
        </div>
      </div>

      {/* Content Spacer for Desktop */}
      <div className={cn(
        "hidden lg:block transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )} />
    </>
  )
}
