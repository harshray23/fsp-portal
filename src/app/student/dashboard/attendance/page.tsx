import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge'; 

// Mock data cleared
const attendanceData = {
  overallPercentage: 0,
  subjects: [],
  recentAbsences: []
};

const getAttendanceBadgeVariant = (percentage: number): "default" | "secondary" | "destructive" | "outline" => {
  if (percentage >= 90) return "default"; 
  if (percentage >= 75) return "secondary"; 
  return "destructive"; 
};


export default function StudentAttendancePage() {
  return (
    <>
      <PageHeader title="My Attendance" description="Detailed view of your FSP attendance records." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <div className="text-4xl font-bold text-primary">{attendanceData.overallPercentage}%</div>
          <div className="flex-1">
            <Progress value={attendanceData.overallPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground mt-1">
              {attendanceData.subjects.length === 0 
                ? "No attendance data available."
                : attendanceData.overallPercentage >= 75 
                  ? "Great job! Keep up the good attendance." 
                  : "Your attendance is low. Please ensure regular presence."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Breakdown of your attendance for each subject.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Attended</TableHead>
                <TableHead className="text-center">Total Classes</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.subjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No subject attendance data available.
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData.subjects.map((subject: any) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell className="text-center">{subject.attended}</TableCell>
                    <TableCell className="text-center">{subject.totalClasses}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span>{subject.percentage}%</span>
                         <Badge variant={getAttendanceBadgeVariant(subject.percentage)} className="ml-2 capitalize">
                          {subject.percentage >= 90 ? "Excellent" : subject.percentage >= 75 ? "Good" : "Low"}
                        </Badge>
                      </div>
                      <Progress value={subject.percentage} className="h-1.5 mt-1" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {attendanceData.recentAbsences.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Absences</CardTitle>
            <CardDescription>Details of your recent absences.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {attendanceData.recentAbsences.map((absence: any, index) => (
                <li key={index} className="p-3 bg-secondary/30 rounded-md text-sm">
                  <strong>{new Date(absence.date).toLocaleDateString()}:</strong> Absent from {absence.subject}. 
                  {absence.reason !== "Not specified" && <span className="text-muted-foreground"> (Reason: {absence.reason})</span>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
