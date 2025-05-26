import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, PieChart, BarChart3, Users } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

// Mock data
const reportTypes = [
  { id: "attendance_batch", name: "Batch-wise Attendance Report" },
  { id: "attendance_dept", name: "Department-wise Attendance Report" },
  { id: "performance_batch", name: "Batch-wise Performance Report" },
];

const batches = [
  { id: "FSP-CSE-A1", name: "Computer Science - Batch A1" },
  { id: "FSP-ECE-B2", name: "Electronics - Batch B2" },
];

const departments = [
  { id: "CSE", name: "Computer Science & Engineering" },
  { id: "ECE", name: "Electronics & Communication Engineering" },
];

export default function TeacherReportsPage() {
  // State for selections would go here in a client component
  // For this server component, we'll just display the structure.

  return (
    <>
      <PageHeader title="Generate Reports" description="View and download FSP reports." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Select parameters to generate your report.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="report-type">Report Type</Label>
            <Select>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map(rt => (
                  <SelectItem key={rt.id} value={rt.id}>{rt.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="batch-select">Select Batch (if applicable)</Label>
            <Select>
              <SelectTrigger id="batch-select">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dept-select">Select Department (if applicable)</Label>
            <Select>
              <SelectTrigger id="dept-select">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Generate & Download Report
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Report Preview</CardTitle>
          <CardDescription>This is a placeholder for a report preview or summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Report previews would typically show charts and key statistics based on the selected criteria.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center"><PieChart className="mr-2 h-5 w-5 text-primary" /> Attendance Distribution</h3>
              <Image 
                src="https://placehold.co/600x400.png?text=Attendance+Chart" 
                alt="Placeholder Attendance Chart" 
                width={600} 
                height={400} 
                className="rounded-md"
                data-ai-hint="pie chart" 
              />
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-accent" /> Performance Metrics</h3>
               <Image 
                src="https://placehold.co/600x400.png?text=Performance+Graph" 
                alt="Placeholder Performance Graph" 
                width={600} 
                height={400} 
                className="rounded-md"
                data-ai-hint="bar graph"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
