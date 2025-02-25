'use client';

import { AppSidebar } from '@/components/app-sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Mobile header component that uses the sidebar context
function MobileHeader() {
  const { setOpenMobile } = useSidebar();
  
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b px-4 lg:hidden">
      <button 
        onClick={() => setOpenMobile(true)}
        className="inline-flex items-center justify-center size-10 rounded-md text-muted-foreground hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </button>
      
      <Separator orientation="vertical" className="h-6" />
      <span className="font-bold">FinanceTracker</span>
    </header>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          {/* Sidebar that handles its own mobile responsiveness */}
          <AppSidebar />
          
          {/* Main content area with SidebarInset */}
          <SidebarInset className="flex-1 flex flex-col">
            {/* Mobile header with trigger for sidebar */}
            <MobileHeader />
            
            {/* Main content with properly centered layout */}
            <main className="flex-1 overflow-auto">
              <div className="mx-auto w-full px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
                {/* Content wrapper with responsive max-width */}
                <div className="mx-auto max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px]">
                  {children}
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
} 