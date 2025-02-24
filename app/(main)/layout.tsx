import Navbar from '@/components/ui/navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  );
} 