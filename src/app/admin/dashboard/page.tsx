import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarDays, UserPlus, Activity } from 'lucide-react';
import Link from 'next/link';

// Mock data for dashboard overview
const adminStats = {
  totalStudents: 1250,
  activeBatches: 15,
  totalTeachers: 45,
  pendingRegistrations: 3,
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
            <ul className="space-y-3">
              <li className="flex items-center text-sm">
                <Activity className="h-4 w-4 mr-2 text-green-500" />
                New batch "FSP-MECH-2024-B1" created by Admin User. (2 hours ago)
              </li>
              <li className="flex items-center text-sm">
                <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
                Teacher "Prof. R. Sharma" registered. (5 hours ago)
              </li>
              <li className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-purple-500" />
                Timetable updated for "FSP-ECE-2024-A2". (1 day ago)
              </li>
            </ul>
             <p className="text-sm text-muted-foreground mt-4">This is a placeholder for recent system activities.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
