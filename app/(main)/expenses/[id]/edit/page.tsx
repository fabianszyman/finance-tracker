import { createClientSupabaseClient } from "@/lib/supabase/client";
import ExpenseForm from "@/components/ExpenseForm";

// Use the correct param typing for Next.js App Router pages
export default async function EditExpensePage({ 
  params 
}: { 
  params: { id: string } 
}) {
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