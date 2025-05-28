
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarClock, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; 

// Mock data cleared or set to default
const batchDetails = {
  batchId: "N/A",
  programName: "No Batch Assigned",
  coordinator: {
    name: "N/A",
    email: "N/A",
    avatar: "https://placehold.co/100x100.png?text=?",
  },
  startDate: "",
  endDate: "",
  subjects: [],
  classmates: [],
  timetableLink: "#" 
};

export default function StudentBatchPage() {
  return (
    <>
      <PageHeader title="My Batch Details" description={batchDetails.batchId === "N/A" ? "No batch assigned." : `Information about your assigned batch: ${batchDetails.batchId}`} />

      {batchDetails.batchId === "N/A" ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">You are not currently assigned to any batch.</p>
          </CardContent>
        </Card>
      ) : (
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
                  <span><strong>Duration:</strong> {batchDetails.startDate ? `${new Date(batchDetails.startDate).toLocaleDateString()} - ${new Date(batchDetails.endDate).toLocaleDateString()}` : "N/A"}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Subjects & Instructors:</h3>
                  {batchDetails.subjects.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {batchDetails.subjects.map((subject: any) => (
                        <li key={subject.id}>{subject.name} - <em>{subject.instructor}</em></li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No subjects listed for this batch.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Classmates</CardTitle>
                <CardDescription>Some of your peers in this batch.</CardDescription>
              </CardHeader>
              <CardContent>
                {batchDetails.classmates.length > 0 ? (
                  <ul className="space-y-2">
                    {batchDetails.classmates.map((student: any) => (
                      <li key={student.id} className="flex items-center p-2 bg-secondary/30 rounded-md">
                        <UserCircle className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{student.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No classmates to display.</p>
                )}
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
                  data-ai-hint="placeholder avatar"
                />
                <CardTitle className="text-lg">Batch Coordinator</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold">{batchDetails.coordinator.name}</p>
                <p className="text-sm text-muted-foreground">{batchDetails.coordinator.email}</p>
                {batchDetails.coordinator.email !== "N/A" && (
                  <Button variant="outline" size="sm" className="mt-3">Contact Coordinator</Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
