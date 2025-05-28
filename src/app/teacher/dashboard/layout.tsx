
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { ReactNode } from 'react';

export default function TeacherDashboardLayout({ children }: { children: ReactNode }) {
  // User prop is now handled internally by DashboardLayout using token
  return <DashboardLayout role="teacher">{children}</DashboardLayout>;
}
