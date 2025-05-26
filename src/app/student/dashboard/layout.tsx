import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { ReactNode } from 'react';

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  // In a real app, user data would come from auth context or session
  const mockUser = { name: "Student User", email: "student@aec.edu.in" };
  return <DashboardLayout role="student" user={mockUser}>{children}</DashboardLayout>;
}
