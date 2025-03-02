'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, DollarSign, Calendar, TrendingDown, TrendingUp, ArrowUpRight, CreditCard, Upload } from "lucide-react";
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
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Interface for expense data
interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

// Interface for summary statistics
interface ExpenseStats {
  totalExpenses: number;
  averageExpense: number;
  largestExpense: number;
  recentTotal: number;
  categorySummary: {
    [key: string]: number;
  };
}

// Avoid hydration mismatches by using a loading state
export default function DashboardPage() {
  // Start with loading state to avoid hydration mismatch
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ExpenseStats>({
    totalExpenses: 0,
    averageExpense: 0,
    largestExpense: 0,
    recentTotal: 0,
    categorySummary: {}
  });
  const supabase = createClientSupabaseClient();

  // Use a useEffect to load data only on the client side
  useEffect(() => {
    async function fetchExpenseData() {
      try {
        // Get all expenses for the current user
        const { data: expenses, error } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        // Calculate statistics from the expense data
        if (expenses && expenses.length > 0) {
          // Total of all expenses
          const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
          
          // Average expense amount
          const averageExpense = totalExpenses / expenses.length;
          
          // Largest single expense
          const largestExpense = Math.max(...expenses.map(expense => expense.amount));
          
          // Get expenses from the current month - STORE DATE ONCE
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth();
          const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString();
          
          const recentExpenses = expenses.filter(expense => expense.date >= startOfMonth);
          const recentTotal = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          
          // Group expenses by category
          const categorySummary = expenses.reduce((acc, expense) => {
            const category = expense.category || 'Uncategorized';
            if (!acc[category]) acc[category] = 0;
            acc[category] += expense.amount;
            return acc;
          }, {} as {[key: string]: number});
          
          setStats({
            totalExpenses,
            averageExpense,
            largestExpense,
            recentTotal,
            categorySummary
          });
        }
      } catch (error) {
        console.error('Error fetching expense data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenseData();
  }, [supabase]);

  // Get top 3 categories by expense amount
  const topCategories = Object.entries(stats.categorySummary)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3);

  // While loading, show skeleton state or placeholder
  if (loading) {
    return (
      <PageContainer>
        <PageHeader heading="Dashboard" description="Loading your financial overview..." />
        {/* You could add skeleton loading UI here */}
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader 
        heading="Dashboard" 
        description="Your financial overview"
      >
        <div className="ml-auto mt-2 sm:mt-0">
          <Button asChild>
            <Link href="/expenses/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Link>
          </Button>
        </div>
      </PageHeader>
      
      {/* Financial metrics overview */}
      <DashboardSection 
        title="Summary" 
        subtitle="Your expense overview"
      >
        <CardGrid>
          <MetricCard
            title="Total Expenses"
            value={formatCurrency(stats.totalExpenses)}
            description="All-time total spent"
            icon={<DollarSign />}
            className="sm:col-span-2"
          />
          <MetricCard
            title="This Month"
            value={formatCurrency(stats.recentTotal)}
            description="Spent since beginning of month"
            icon={<Calendar />}
          />
          <MetricCard
            title="Average Expense"
            value={formatCurrency(stats.averageExpense)}
            description="Average per transaction"
            icon={<TrendingDown />}
          />
          <MetricCard
            title="Largest Expense"
            value={formatCurrency(stats.largestExpense)}
            description="Your biggest transaction"
            icon={<CreditCard />}
          />
        </CardGrid>
      </DashboardSection>
      
      {/* Top categories */}
      <DashboardSection
        title="Top Categories"
        subtitle="Where you spend the most"
      >
        <CardGrid className="grid-cols-1 sm:grid-cols-3">
          {topCategories.map(([category, amount]) => (
            <MetricCard
              key={category}
              title={category as string}
              value={formatCurrency(amount as number)}
              description={`${(((amount as number) / stats.totalExpenses) * 100).toFixed(1)}% of total`}
              icon={<ArrowUpRight />}
            />
          ))}
        </CardGrid>
      </DashboardSection>
      
      {/* Quick Actions */}
      <DashboardSection 
        title="Quick Actions" 
        subtitle="Common tasks"
        className="mt-6"
      >
        <div className="flex gap-3 flex-wrap">
          <Button asChild variant="outline" className="h-auto py-4 px-6">
            <Link href="/expenses/new">
              <PlusCircle className="h-5 w-5 mb-2 mx-auto" />
              <span className="block text-sm">Add Expense</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-auto py-4 px-6">
            <Link href="/expenses/import">
              <Upload className="h-5 w-5 mb-2 mx-auto" />
              <span className="block text-sm">Import Expenses</span>
            </Link>
          </Button>
          
          {/* Add more quick actions */}
        </div>
      </DashboardSection>
    </PageContainer>
  );
} 