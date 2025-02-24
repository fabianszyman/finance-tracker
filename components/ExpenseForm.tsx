'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PostgrestError } from '@supabase/supabase-js';

// Schema for form validation
const expenseFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)), 'Must be a valid number')
    .transform((val) => parseFloat(val)),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  date: z.date({
    required_error: 'Please select a date',
  }),
});

// Define form input values type (pre-transformation)
type ExpenseFormInputs = z.input<typeof expenseFormSchema>;
// Define form values type after transformation
type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

const defaultValues: Partial<ExpenseFormInputs> = {
  amount: '',
  description: '',
  category: '',
  date: new Date(),
};

export default function ExpenseForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientSupabaseClient();
  
  // Define categories
  const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Housing',
    'Utilities',
    'Healthcare',
    'Shopping',
    'Other'
  ];

  const form = useForm<ExpenseFormInputs>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ExpenseFormValues) {
    setIsLoading(true);
    
    try {
      // Get the current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to add an expense');
        setIsLoading(false);
        return;
      }

      // Insert expense into database with user_id
      const { error } = await supabase.from('expenses').insert({
        user_id: user.id,
        amount: data.amount,
        description: data.description || '',
        category: data.category,
        date: data.date.toISOString(),
      });

      if (error) {
        const pgError = error as PostgrestError;
        throw pgError;
      }

      toast.success('Expense added successfully!');
      router.push('/expenses');
      router.refresh();
    } catch (error) {
      const pgError = error as PostgrestError;
      toast.error(pgError.message || 'Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
        <CardDescription>
          Record a new expense in your finance tracker
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0.00"
                        className="pl-8" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add details about this expense"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Expense'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 