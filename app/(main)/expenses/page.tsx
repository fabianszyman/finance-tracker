'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Expense } from '@/types/expense';
import { format } from 'date-fns';
import { PostgrestError } from '@supabase/supabase-js';
import { 
  PageContainer, 
  PageHeader, 
  DashboardSection,
  TableContainer
} from "@/components/ui/page-layout";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabaseClient();

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        const pgError = error as PostgrestError;
        throw pgError;
      }

      setExpenses(data || []);
    } catch (error) {
      const pgError = error as PostgrestError;
      toast.error(pgError.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <PageContainer>
      <PageHeader 
        heading="Expenses" 
        description="Manage your expenditures"
      >
        <Button asChild>
          <Link href="/expenses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </Button>
      </PageHeader>
      
      {/* Summary card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-medium text-muted-foreground">Total Amount</h3>
            <p className="text-3xl font-bold">$400.00</p>
            <p className="text-sm text-muted-foreground">Food • Feb 24, 2025</p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </Card>
      
      {/* List of expenses */}
      <DashboardSection
        title="All Expenses"
        contentClassName="space-y-4"
      >
        {/* We'll use repeated cards for better mobile appearance rather than a table */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b hover:bg-muted/50 cursor-pointer">
            <div className="flex flex-col">
              <span className="font-medium">Food</span>
              <span className="text-sm text-muted-foreground">Feb 24, 2025</span>
            </div>
            <span className="font-medium">$400.00</span>
          </div>
        </Card>
      </DashboardSection>
    </PageContainer>
  );
} 