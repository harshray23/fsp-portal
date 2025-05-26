import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, Percent } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with actual data fetching
const studentData = {
  name: "Amit Sharma",
  batch: "FSP-CSE-2024-A1",
  attendanceOverall: "92%",
  subjects: [
    { name: "Advanced Java Programming", attendance: "95%", lastClass: "2024-07-28" },
    { name: "Web Technologies", attendance: "90%", lastClass: "2024-07-29" },
    { name: "Aptitude & Reasoning", attendance: "88%", lastClass: "2024-07-27" },
  ],
  upcomingClasses: [
    { subject: "Advanced Java Programming", time: "Tomorrow, 10:00 AM", room: "CL-05" },
    { subject: "Aptitude & Reasoning", time: "Tomorrow, 02:00 PM", room: "TR-02" },
  ]
};

export default function StudentDashboardPage() {
  return (
    <>
      <PageHeader title={`Welcome, ${studentData.name}!`} description="Here's an overview of your FSP progress." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Batch</CardTitle>
            <BookOpenCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.batch}</div>
            <p className="text-xs text-muted-foreground">
              Assigned to Computer Science FSP Batch
            </p>
            <Link href="/student/dashboard/batch" className="text-sm text-primary hover:underline mt-2 block">View Details</Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Percent className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.attendanceOverall}</div>
            <p className="text-xs text-muted-foreground">
              Across all FSP subjects
            </p>
            <Link href="/student/dashboard/attendance" className="text-sm text-primary hover:underline mt-2 block">View Detailed Report</Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
            <CardDescription>Your attendance percentage in each subject.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {studentData.subjects.map((subject) => (
                <li key={subject.name} className="flex justify-between items-center p-3 bg-secondary/50 rounded-md">
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">Last class: {subject.lastClass}</p>
                  </div>
                  <span className="font-semibold text-lg text-primary">{subject.attendance}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Your FSP schedule for the upcoming days.</CardDescription>
          </CardHeader>
          <CardContent>
            {studentData.upcomingClasses.length > 0 ? (
              <ul className="space-y-3">
                {studentData.upcomingClasses.map((cls) => (
                  <li key={cls.subject + cls.time} className="p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{cls.subject}</p>
                    <p className="text-sm text-muted-foreground">{cls.time} - Room: {cls.room}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No upcoming classes scheduled at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
