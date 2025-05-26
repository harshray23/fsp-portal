
"use client";

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Save } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data cleared
const mockClasses: any[] = [];
const mockStudentsForBatch: Record<string, any[]> = {};

type Student = { id: string; name: string; roll: string; };

export default function ManageAttendancePage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [studentsForClass, setStudentsForClass] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({}); // { studentId: isPresent }

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    const cls = mockClasses.find(c => c.id === classId);
    if (cls) {
      const batchStudents = mockStudentsForBatch[cls.batch] || [];
      setStudentsForClass(batchStudents);
      const initialAttendance: Record<string, boolean> = {};
      batchStudents.forEach(s => initialAttendance[s.id] = true); 
      setAttendance(initialAttendance);
    } else {
      setStudentsForClass([]);
      setAttendance({});
    }
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  const handleSaveAttendance = () => {
    if (!selectedClass || studentsForClass.length === 0) {
      toast({ title: "Error", description: "Please select a class with students.", variant: "destructive" });
      return;
    }
    console.log("Saving attendance:", { date: selectedDate, classId: selectedClass, attendance });
    toast({ title: "Attendance Saved", description: `Attendance for ${mockClasses.find(c=>c.id === selectedClass)?.subject} on ${selectedDate ? format(selectedDate, "PPP") : ""} submitted.` });
  };

  return (
    <>
      <PageHeader title="Manage Attendance" description="Mark and submit student attendance for classes." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Class & Date</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date-picker">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="class-select">Class</Label>
            <Select onValueChange={handleClassSelect} value={selectedClass || ""} disabled={mockClasses.length === 0}>
              <SelectTrigger id="class-select">
                <SelectValue placeholder={mockClasses.length === 0 ? "No classes available" : "Select a class session"} />
              </SelectTrigger>
              <SelectContent>
                {mockClasses.length === 0 ? (
                    <SelectItem value="no-classes" disabled>No classes available</SelectItem>
                ) : (
                    mockClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                        {cls.batch} - {cls.subject} ({cls.time})
                    </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedClass && studentsForClass.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>
              For: {mockClasses.find(c=>c.id === selectedClass)?.subject} on {selectedDate ? format(selectedDate, "PPP") : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-center w-[100px]">Present</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsForClass.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>{student.roll}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={attendance[student.id] || false}
                        onCheckedChange={() => toggleAttendance(student.id)}
                        aria-label={`Mark ${student.name} as ${attendance[student.id] ? 'absent' : 'present'}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveAttendance}>
              <Save className="mr-2 h-4 w-4" /> Save Attendance
            </Button>
          </CardFooter>
        </Card>
      )}
      {selectedClass && studentsForClass.length === 0 && mockClasses.length > 0 && (
        <Card>
          <CardHeader><CardTitle>No Students</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">No students found for the selected class or batch.</p></CardContent>
        </Card>
      )}
       {!selectedClass && mockClasses.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Select a Class</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Please select a class to view and mark attendance.</p></CardContent>
        </Card>
      )}
      {mockClasses.length === 0 && (
         <Card>
          <CardHeader><CardTitle>No Classes Available</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">There are no classes scheduled or available to manage attendance for.</p></CardContent>
        </Card>
      )}
    </>
  );
}
