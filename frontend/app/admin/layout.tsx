import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminToastProvider } from '@/components/admin/AdminToast';

export const metadata: Metadata = {
  title: 'Administration',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminToastProvider>{children}</AdminToastProvider>
    </AuthProvider>
  );
}
