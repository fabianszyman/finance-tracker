'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Receipt } from 'lucide-react';
import { Expense } from '@/types/expense';
import { format } from 'date-fns';

export default function Dashboard() {
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch recent expenses
        const { data: expenses } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);

        setRecentExpenses(expenses || []);

        // Calculate total spent this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        const { data: monthlyExpenses } = await supabase
          .from('expenses')
          .select('amount')
          .gte('date', startOfMonth)
          .lte('date', endOfMonth);

        const total = (monthlyExpenses || []).reduce((sum, expense) => sum + expense.amount, 0);
        setTotalSpent(total);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [supabase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
            <CardDescription>Your spending since {format(new Date(), 'MMMM 1')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/expenses">View All Expenses</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used functions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/expenses/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Expense
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Expenses</h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/expenses">View All</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      ) : recentExpenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Receipt className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">No expenses yet</p>
            <Button asChild>
              <Link href="/expenses/new">Add Your First Expense</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recentExpenses.map((expense) => (
            <Link href={`/expenses/${expense.id}`} key={expense.id}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      <CardDescription>
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                    <p className="font-bold text-primary">
                      {formatCurrency(expense.amount)}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 