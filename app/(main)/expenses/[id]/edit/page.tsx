import { createClientSupabaseClient } from "@supabase/auth-helpers-nextjs";
import ExpenseForm from "@/components/ExpenseForm";
import { useParams } from "next/navigation";

const { data: expense } = await createClientSupabaseClient().from('expenses').select('*').eq('id', params.id).single();

return <ExpenseForm initialData={expense} />; 