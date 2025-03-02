import { createClientSupabaseClient } from "@/lib/supabase/client";
import ExpenseForm from "@/components/ExpenseForm";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

// Make it a proper async function component
export default async function EditExpensePage({ params }: { params: { id: string } }) {
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