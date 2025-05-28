
"use client";

import { PageHeader } from '@/components/common/PageHeader';
import { UserRegistrationForm } from '@/components/admin/UserRegistrationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react'; // Added useMemo
import { useToast } from '@/hooks/use-toast';

interface TeacherUser {
  id: string;
  name: string;
  email: string;
  department: string;
}

const generateInitialMockTeachers = (): TeacherUser[] => [
  { id: 'teacher1', name: 'Dr. Alan Turing', email: 'alan.turing@aec.edu.in', department: 'Computer Science' },
  { id: 'teacher2', name: 'Prof. Marie Curie', email: 'marie.curie@aec.edu.in', department: 'Physics & Chemistry' },
  { id: 'teacher3', name: 'Dr. Ada Lovelace', email: 'ada.lovelace@aec.edu.in', department: 'Mathematics & Computing' },
];

export default function RegisterTeacherPage() {
  const initialTeachers = useMemo(() => generateInitialMockTeachers(), []);
  const [teachers, setTeachers] = useState<TeacherUser[]>(initialTeachers);
  const { toast } = useToast();

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.id !== teacherId));
    toast({
      title: "Teacher Deleted",
      description: `Teacher account has been removed.`,
    });
  };

  return (
    <>
      <PageHeader 
        title="Register New Teacher" 
        description="Create accounts for new teaching staff."
      />
      <div className="max-w-2xl mb-8">
        <UserRegistrationForm mode="teacher" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Existing Teachers</CardTitle>
          <CardDescription>View and remove existing teacher accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No teachers found.
                  </TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
