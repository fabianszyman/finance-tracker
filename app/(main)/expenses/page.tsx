'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Expense } from '@/types/expense';
import { format } from 'date-fns';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabaseClient();

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      setExpenses(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchExpenses} 
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link href="/expenses/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Expense
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      ) : expenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No expenses found</p>
            <Button asChild>
              <Link href="/expenses/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add your first expense
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <Link href={`/expenses/${expense.id}`} key={expense.id}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-primary">
                        {formatCurrency(expense.amount)}
                      </CardTitle>
                      <CardDescription>
                        {expense.category} • {format(new Date(expense.date), 'MMM d, yyyy')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {expense.description && (
                  <CardContent className="pt-0">
                    <p className="text-sm truncate">{expense.description}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 