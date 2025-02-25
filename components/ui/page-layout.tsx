'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Main container for page content with proper spacing
export function PageContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-8", className)}>
      {children}
    </div>
  );
}

// Page header with flexible layout options
export function PageHeader({
  heading,
  description,
  children,
}: {
  heading: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse gap-y-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{heading}</h1>
        {description && (
          <p className="text-sm text-muted-foreground md:text-base">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-shrink-0 items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Grid layout for card-based content
export function CardGrid({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {children}
    </div>
  );
}

// Dashboard section with title and optional action
export function DashboardSection({
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className={cn(contentClassName)}>
        {children}
      </div>
    </section>
  );
}

// Metric card for displaying financial stats
export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive?: boolean;
  };
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className={cn(
            "mt-1 text-xs",
            trend.positive ? "text-green-600" : "text-red-600"
          )}>
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Table container for responsive table layouts
export function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-auto rounded-md border">
      <div className="w-full min-w-max">
        {children}
      </div>
    </div>
  );
} 