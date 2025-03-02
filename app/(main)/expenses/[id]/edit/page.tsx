import { createClientSupabaseClient } from "@/lib/supabase/client";
import ExpenseForm from "@/components/ExpenseForm";
import { Expense } from "@/types"; // Make sure you have this type defined

interface EditExpensePageProps {
  params: {
    id: string;
  };
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  // Fetch the expense data inside the component
  const supabase = createClientSupabaseClient();
  const { data: expense } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', params.id)
    .single();

  // Return the component
  return <ExpenseForm initialData={expense} />;
} 