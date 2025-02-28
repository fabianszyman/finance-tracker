'use client';

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Receipt, User, LogOut } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { toast } from "sonner"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar"
import { AccessibleSidebar } from "@/components/accessible-sidebar"

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/')
      if (isMobile) {
        setOpenMobile(false)
      }
    } catch {
      toast.error('Error signing out')
    }
  }

  // Add navigation handler
  const handleNavigation = (url: string) => {
    router.push(url)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  // Group navigation items
  const navItems = [
    {
      title: "",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "Expenses", url: "/expenses", icon: Receipt },
        { title: "Profile", url: "/profile", icon: User },
      ],
    },
  ]

  const sidebarContent = (
    <SidebarContent>
      {navItems.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    tooltip={!isMobile ? item.title : undefined}
                    isActive={pathname === item.url ? true : undefined}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
      
      {/* Logout button in its own group */}
      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleSignOut}
                tooltip={!isMobile ? "Logout" : undefined}
              >
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )

  return (
    <AccessibleSidebar className={`${className || ""}`} {...props}>
      <SidebarHeader>
        <div className="flex items-center px-2 py-4">
          <Link href="/dashboard" className="font-bold text-xl text-sidebar-foreground">
          </Link>
        </div>
      </SidebarHeader>
      {sidebarContent}
      <SidebarRail />
    </AccessibleSidebar>
  )
}
