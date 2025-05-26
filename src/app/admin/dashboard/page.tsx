import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarDays, UserPlus, Activity } from 'lucide-react';
import Link from 'next/link';

// Updated admin stats to reflect a clean system
const adminStats = {
  totalStudents: 0,
  activeBatches: 0,
  totalTeachers: 0,
  pendingRegistrations: 0,
};

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Admin Dashboard" description="Overview of the Finishing School Program." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled in FSP</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.activeBatches}</div>
            <Link href="/admin/dashboard/batches" className="text-xs text-primary hover:underline">View Batches</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalTeachers}</div>
             <Link href="/admin/dashboard/register-user/teacher" className="text-xs text-primary hover:underline">Manage Teachers</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Registrations</CardTitle>
            <UserPlus className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.pendingRegistrations}</div>
            <p className="text-xs text-muted-foreground">Require approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mt-4">No recent activity to display.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
