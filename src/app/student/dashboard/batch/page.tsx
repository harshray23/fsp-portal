import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarClock, UserCircle } from 'lucide-react';
import Image from 'next/image';

// Mock data
const batchDetails = {
  batchId: "FSP-CSE-2024-A1",
  programName: "Finishing School Program - Computer Science",
  coordinator: {
    name: "Dr. Ananya Roy",
    email: "ananya.roy@aec.edu.in",
    avatar: "https://placehold.co/100x100.png?text=AR",
  },
  startDate: "2024-08-01",
  endDate: "2024-11-30",
  subjects: [
    { id: "S001", name: "Advanced Java Programming", instructor: "Prof. S. Das" },
    { id: "S002", name: "Web Technologies", instructor: "Prof. M. Khan" },
    { id: "S003", name: "Aptitude & Reasoning", instructor: "Mr. P. Kumar" },
    { id: "S004", name: "Communication Skills", instructor: "Ms. R. Singh" },
  ],
  classmates: [ // Sample, limited for display
    { id: "ST002", name: "Priya Singh" },
    { id: "ST003", name: "Rahul Verma" },
    { id: "ST004", name: "Sneha Gupta" },
  ],
  timetableLink: "/path/to/timetable.pdf" // Placeholder
};

export default function StudentBatchPage() {
  return (
    <>
      <PageHeader title="My Batch Details" description={`Information about your assigned batch: ${batchDetails.batchId}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{batchDetails.programName}</CardTitle>
              <CardDescription>Batch ID: {batchDetails.batchId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-primary" />
                <span><strong>Duration:</strong> {new Date(batchDetails.startDate).toLocaleDateString()} - {new Date(batchDetails.endDate).toLocaleDateString()}</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Subjects & Instructors:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {batchDetails.subjects.map(subject => (
                    <li key={subject.id}>{subject.name} - <em>{subject.instructor}</em></li>
                  ))}
                </ul>
              </div>
              {/* <Button asChild variant="outline">
                <Link href={batchDetails.timetableLink} target="_blank">
                  <CalendarDays className="mr-2 h-4 w-4" /> View Full Timetable
                </Link>
              </Button> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Classmates</CardTitle>
              <CardDescription>Some of your peers in this batch.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {batchDetails.classmates.map(student => (
                  <li key={student.id} className="flex items-center p-2 bg-secondary/30 rounded-md">
                    <UserCircle className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>{student.name}</span>
                  </li>
                ))}
                {batchDetails.classmates.length > 3 && <li className="text-sm text-muted-foreground">...and more</li>}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Image 
                src={batchDetails.coordinator.avatar} 
                alt={batchDetails.coordinator.name} 
                width={80} 
                height={80} 
                className="rounded-full mb-2"
                data-ai-hint="person teacher"
              />
              <CardTitle className="text-lg">Batch Coordinator</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-semibold">{batchDetails.coordinator.name}</p>
              <p className="text-sm text-muted-foreground">{batchDetails.coordinator.email}</p>
              <Button variant="outline" size="sm" className="mt-3">Contact Coordinator</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
