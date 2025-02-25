'use client';

import * as React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog"

interface AccessibleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function AccessibleSheet({
  open,
  onOpenChange,
  side = "left",
  children,
  className,
  ...props
}: AccessibleSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} {...props}>
      <SheetContent 
        side={side}
        className={className}
        data-sidebar="sidebar"
        data-mobile="true"
      >
        <DialogTitle className="sr-only">
          Navigation Menu
        </DialogTitle>
        <DialogDescription className="sr-only">
          Application navigation links and controls
        </DialogDescription>
        {children}
      </SheetContent>
    </Sheet>
  );
} 