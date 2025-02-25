'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle, DollarSign, Calendar, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { 
  PageContainer, 
  PageHeader, 
  CardGrid, 
  DashboardSection,
  MetricCard,
  TableContainer
} from "@/components/ui/page-layout";
import { format } from "date-fns";

export default function DashboardPage() {
  // Get the current month name
  const currentMonth = format(new Date(), 'MMMM yyyy');
  
  return (
    <PageContainer>
      <PageHeader 
        heading="Dashboard" 
        description="Your financial overview"
      >
        <Button asChild>
          <Link href="/expenses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Link>
        </Button>
      </PageHeader>
      
      {/* Financial metrics overview */}
      <DashboardSection 
        title="Financial Summary" 
        subtitle={`Overview for ${currentMonth}`}
      >
        <CardGrid>
          <MetricCard
            title="Total Spending"
            value="$400.00"
            description="Since February 1"
            icon={<DollarSign />}
            trend={{ value: 12, positive: false }}
          />
          <MetricCard
            title="Average Per Day"
            value="$13.33"
            description="30-day average"
            icon={<Calendar />}
          />
          <MetricCard
            title="Top Category"
            value="Food"
            description="40% of total spending"
            icon={<TrendingUp />}
          />
        </CardGrid>
      </DashboardSection>
      
      {/* Recent expenses */}
      <DashboardSection
        title="Recent Expenses"
        subtitle="Your latest transactions"
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/expenses">View all</Link>
          </Button>
        }
      >
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex flex-col">
              <span className="font-medium">Food</span>
              <span className="text-sm text-muted-foreground">Feb 24, 2025</span>
            </div>
            <span className="font-medium">$400.00</span>
          </div>
        </div>
      </DashboardSection>
    </PageContainer>
  );
} 