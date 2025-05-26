import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { ReactNode } from 'react';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const mockUser = { name: "Admin User", email: "admin@aec.edu.in" };
  return <DashboardLayout role="admin" user={mockUser}>{children}</DashboardLayout>;
}
