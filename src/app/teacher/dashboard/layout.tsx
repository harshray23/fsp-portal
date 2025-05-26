import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { ReactNode } from 'react';

export default function TeacherDashboardLayout({ children }: { children: ReactNode }) {
  const mockUser = { name: "Teacher User", email: "teacher@aec.edu.in" };
  return <DashboardLayout role="teacher" user={mockUser}>{children}</DashboardLayout>;
}
