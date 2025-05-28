
"use client";

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { UserPlus, Search, ArrowRightLeft, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data cleared
const mockStudents: any[] = [];
const mockBatches: any[] = [];

interface Student {
  id: string;
  name: string;
  roll: string;
  currentBatch?: string | null;
}

export default function AssignStudentsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>(mockStudents); 

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleAssignBatch = () => {
    if (!selectedBatch || selectedStudents.length === 0) {
      toast({
        title: "Assignment Error",
        description: "Please select students and a target batch.",
        variant: "destructive",
      });
      return;
    }
    
    setStudents(prevStudents => 
      prevStudents.map(s => 
        selectedStudents.includes(s.id) ? { ...s, currentBatch: selectedBatch } : s
      )
    );
    toast({
      title: "Success",
      description: `${selectedStudents.length} student(s) assigned to batch ${selectedBatch}.`,
    });
    setSelectedStudents([]);
  };

  return (
    <>
      <PageHeader title="Assign Students to Batches" description="Manage student batch allocations." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <div className="flex items-center space-x-2 pt-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students by name or roll..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Current Batch</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                  <TableRow key={student.id} data-state={selectedStudents.includes(student.id) ? "selected" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleSelectStudent(student.id)}
                        aria-label={`Select student ${student.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.roll}</TableCell>
                    <TableCell>{student.currentBatch || "Not Assigned"}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No students found. Register students or adjust search.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Batch Assignment</CardTitle>
            <CardDescription>Assign selected students to a batch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="batch-select">Target Batch</Label>
              <Select onValueChange={setSelectedBatch} value={selectedBatch || ""}>
                <SelectTrigger id="batch-select">
                  <SelectValue placeholder="Select a batch" />
                </SelectTrigger>
                <SelectContent>
                  {mockBatches.length === 0 ? (
                    <SelectItem value="no-batches" disabled>No batches available</SelectItem>
                  ) : (
                    mockBatches.map((batch: any) => (
                      <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-secondary/50 rounded-md">
              <div className="flex items-center text-sm font-medium">
                <Users className="h-4 w-4 mr-2 text-primary" />
                <span>{selectedStudents.length} student(s) selected.</span>
              </div>
            </div>
            <Button onClick={handleAssignBatch} className="w-full" disabled={!selectedBatch || selectedStudents.length === 0 || mockBatches.length === 0}>
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Assign to Batch
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
