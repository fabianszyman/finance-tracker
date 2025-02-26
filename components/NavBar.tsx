'use client';

import Link from "next/link";
import { PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function NavBar({ variant = "marketing" }: { variant?: "marketing" | "auth" | "dashboard" }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center gap-2 font-bold">
          <PiggyBank className="h-6 w-6" />
          <Link href="/">FinanceAI</Link>
        </div>
        
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link 
            href="/marketing#features" 
            className="transition-colors hover:text-foreground/80"
          >
            Features
          </Link>
          <Link 
            href="/marketing#benefits" 
            className="transition-colors hover:text-foreground/80"
          >
            Benefits
          </Link>
          <Link 
            href="/marketing#faq" 
            className="transition-colors hover:text-foreground/80"
          >
            FAQ
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button 
            variant={isLoginPage ? "default" : "outline"} 
            asChild
            className={isLoginPage ? "pointer-events-none" : ""}
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button 
            variant={isRegisterPage ? "default" : "outline"} 
            asChild
            className={isRegisterPage ? "pointer-events-none" : ""}
          >
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
} 