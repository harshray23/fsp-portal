import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { AIConflictChecker } from '@/components/teacher/AIConflictChecker'; // AI Component

// Mock data
const timetables = [
  { id: "TT001", batch: "FSP-CSE-A1", day: "Monday", time: "09:00-11:00", subject: "Adv Java", room: "CL01", status: "Published" },
  { id: "TT002", batch: "FSP-CSE-A1", day: "Monday", time: "11:00-13:00", subject: "Web Tech", room: "CL02", status: "Draft" },
  { id: "TT003", batch: "FSP-ECE-B2", day: "Tuesday", time: "14:00-16:00", subject: "Signals", room: "LAB03", status: "Published" },
];

export default function ManageTimetablesPage() {
  return (
    <>
      <PageHeader 
        title="Manage Timetables" 
        description="Create, view, and update class schedules."
        actions={<Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Schedule Entry</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Timetable Entries</CardTitle>
              <CardDescription>List of scheduled classes. Use AI assistant below before adding new entries.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timetables.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.batch}</TableCell>
                      <TableCell>{entry.day}</TableCell>
                      <TableCell>{entry.time}</TableCell>
                      <TableCell>{entry.subject}</TableCell>
                      <TableCell>{entry.room}</TableCell>
                      <TableCell>{entry.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="mr-1"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="mr-1"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {timetables.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                        No timetable entries found. Start by adding a new schedule entry.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
           <AIConflictChecker />
           {/* Placeholder for a form to add/edit schedule entry - AI checker can inform this form */}
           <Card>
             <CardHeader>
               <CardTitle>Add/Edit Schedule Entry</CardTitle>
               <CardDescription>Use this form after checking for conflicts.</CardDescription>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground text-sm">
                  Form for adding a new schedule (e.g., selecting batch, day, time, subject, room) would go here.
                  The AI assistant helps ensure the new entry doesn't conflict.
                </p>
             </CardContent>
             <CardFooter>
                <Button disabled>Save Schedule Entry (Example)</Button>
             </CardFooter>
           </Card>
        </div>
      </div>
    </>
  );
}
