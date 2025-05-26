"use client";

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Save, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockClasses = [
  { id: "CLS001", batch: "FSP-CSE-A1", subject: "Advanced Java", time: "09:00 AM" },
  { id: "CLS002", batch: "FSP-ECE-B2", subject: "Signals & Systems", time: "11:00 AM" },
];

const mockStudentsForBatch = { // Simulates fetching students for a selected class
  "FSP-CSE-A1": [
    { id: "S001", name: "Amit Kumar", roll: "CSE/20/01" },
    { id: "S005", name: "Vikram Rathod", roll: "CSE/20/02" },
  ],
  "FSP-ECE-B2": [
    { id: "S002", name: "Priya Sharma", roll: "ECE/20/05" },
  ],
};

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
      // @ts-ignore
      const batchStudents = mockStudentsForBatch[cls.batch] || [];
      setStudentsForClass(batchStudents);
      // Reset attendance for new class
      const initialAttendance: Record<string, boolean> = {};
      batchStudents.forEach(s => initialAttendance[s.id] = true); // Default all to present
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
    // Simulate API call
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
            <Select onValueChange={handleClassSelect} value={selectedClass || ""}>
              <SelectTrigger id="class-select">
                <SelectValue placeholder="Select a class session" />
              </SelectTrigger>
              <SelectContent>
                {mockClasses.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.batch} - {cls.subject} ({cls.time})
                  </SelectItem>
                ))}
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
      {selectedClass && studentsForClass.length === 0 && (
        <Card>
          <CardHeader><CardTitle>No Students</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">No students found for the selected class or batch.</p></CardContent>
        </Card>
      )}
    </>
  );
}
