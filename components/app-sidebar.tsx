'use client';

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Receipt, User, LogOut, Plus, Upload, ChevronRight } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
  // Add state to track which submenus are expanded
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    expenses: false
  })

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

  // Toggle submenu expansion
  const toggleSubmenu = (key: string) => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Group navigation items
  const navItems = [
    {
      title: "Main",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { 
          title: "Expenses", 
          url: "/expenses", 
          icon: Receipt,
          children: [
            { title: "All Expenses", url: "/expenses" },
            { title: "Add Expense", url: "/expenses/new", icon: Plus },
            { title: "Import Expenses", url: "/expenses/import", icon: Upload }
          ]
        },
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
                  {item.children ? (
                    // Render as parent menu with submenu
                    <>
                      <SidebarMenuButton
                        tooltip={!isMobile ? item.title : undefined}
                        isActive={pathname.startsWith(item.url) ? true : undefined}
                        onClick={() => toggleSubmenu('expenses')}
                      >
                        <div className="flex items-center gap-2 w-full justify-between">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronRight 
                            className={cn(
                              "h-4 w-4 transition-transform", 
                              expanded.expenses && "rotate-90"
                            )} 
                          />
                        </div>
                      </SidebarMenuButton>
                      
                      {/* Submenu items */}
                      {expanded.expenses && (
                        <div className="pl-6 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <SidebarMenuButton
                              key={child.url}
                              isActive={pathname === child.url ? true : undefined}
                              onClick={() => handleNavigation(child.url)}
                            >
                              <div className="flex items-center gap-2">
                                {child.icon && <child.icon className="h-4 w-4" />}
                                <span>{child.title}</span>
                              </div>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Render as regular menu item
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
                  )}
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
