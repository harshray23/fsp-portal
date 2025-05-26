import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, CheckCircle2, Users, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Mock data cleared or set to default
const teacherData = {
  name: "Teacher User", // Generic name
  activeClasses: 0,
  totalStudents: 0,
  upcomingSession: null, // No upcoming session by default
  /*
  upcomingSession: {
    subject: "Advanced Java",
    batch: "FSP-CSE-A1",
    time: "Tomorrow, 09:00 AM",
    room: "CL-05",
  },
  */
  pendingTasks: [] // No pending tasks by default
};

export default function TeacherDashboardPage() {
  return (
    <>
      <PageHeader title={`Welcome, ${teacherData.name}!`} description="Your FSP teaching dashboard." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <CalendarClock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData.activeClasses}</div>
            <Link href="/teacher/dashboard/manage-timetables" className="text-xs text-primary hover:underline">View Timetables</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData.totalStudents}</div>
            <Link href="/teacher/dashboard/assign-students" className="text-xs text-primary hover:underline">Manage Students</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Submitted</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" /> 
            {/* Default to muted, change to green-500 if logic dictates */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div> 
            {/* Or 0% if that's more appropriate for no data */}
            <p className="text-xs text-muted-foreground">For yesterday&apos;s classes</p>
             <Link href="/teacher/dashboard/manage-attendance" className="text-xs text-primary hover:underline">View Attendance</Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Session</CardTitle>
          </CardHeader>
          <CardContent>
            {teacherData.upcomingSession ? (
              <>
                <p className="font-semibold text-lg">{teacherData.upcomingSession.subject}</p>
                <p className="text-sm text-muted-foreground">Batch: {teacherData.upcomingSession.batch}</p>
                <p className="text-sm text-muted-foreground">Time: {teacherData.upcomingSession.time}</p>
                <p className="text-sm text-muted-foreground">Room: {teacherData.upcomingSession.room}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Action items requiring your attention.</CardDescription>
          </CardHeader>
          <CardContent>
            {teacherData.pendingTasks.length > 0 ? (
              <ul className="space-y-3">
                {teacherData.pendingTasks.map((task: any, index) => (
                  <li key={index} className="flex items-start p-3 bg-secondary/50 rounded-md">
                    <AlertTriangle className="h-5 w-5 mr-3 mt-1 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{task.description}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No pending tasks.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
