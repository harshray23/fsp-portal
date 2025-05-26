import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, PieChart, BarChart3 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

// Mock data cleared
const reportTypes: any[] = [];
const batches: any[] = [];
const departments: any[] = [];


export default function TeacherReportsPage() {
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
            <Select disabled={reportTypes.length === 0}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder={reportTypes.length === 0 ? "No report types available" : "Select report type"} />
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
            <Select disabled={batches.length === 0}>
              <SelectTrigger id="batch-select">
                <SelectValue placeholder={batches.length === 0 ? "No batches available" : "Select batch"} />
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
            <Select disabled={departments.length === 0}>
              <SelectTrigger id="dept-select">
                <SelectValue placeholder={departments.length === 0 ? "No departments available" : "Select department"} />
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
          <Button disabled={reportTypes.length === 0}>
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
            Currently, no data is available to generate previews.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center"><PieChart className="mr-2 h-5 w-5 text-primary" /> Attendance Distribution</h3>
              <Image 
                src="https://placehold.co/600x400.png?text=No+Data" 
                alt="Placeholder Attendance Chart - No Data" 
                width={600} 
                height={400} 
                className="rounded-md"
                data-ai-hint="empty chart" 
              />
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-accent" /> Performance Metrics</h3>
               <Image 
                src="https://placehold.co/600x400.png?text=No+Data" 
                alt="Placeholder Performance Graph - No Data" 
                width={600} 
                height={400} 
                className="rounded-md"
                data-ai-hint="empty graph"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
