import ExpenseForm from '@/components/ExpenseForm';

export default function NewExpensePage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex flex-col items-center">
        <ExpenseForm />
      </div>
    </div>
  );
} 