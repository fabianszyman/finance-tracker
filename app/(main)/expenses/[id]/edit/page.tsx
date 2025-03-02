import { createClientSupabaseClient } from "@/lib/supabase/client";
import ExpenseForm from "@/components/ExpenseForm";

// Use the Next.js App Router dynamic route pattern with no custom types
export default async function EditExpensePage({
  params,
}: any) {
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