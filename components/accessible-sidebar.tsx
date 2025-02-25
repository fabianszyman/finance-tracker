'use client';

import * as React from "react"
import { Sidebar, useSidebar } from "@/components/ui/sidebar"
import { AccessibleSheet } from "@/components/accessible-sheet"

export function AccessibleSidebar({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()
  
  if (isMobile) {
    return (
      <AccessibleSheet
        open={openMobile}
        onOpenChange={setOpenMobile}
        className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
        style={{
          "--sidebar-width": "18rem",
        } as React.CSSProperties}
        {...props}
      >
        <div className="flex h-full w-full flex-col">{children}</div>
      </AccessibleSheet>
    );
  }
  
  return (
    <Sidebar className={className} {...props}>
      {children}
    </Sidebar>
  );
} 