import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, PlusCircle } from 'lucide-react';

// Mock data
const timetables = [
  { id: "TT-CSE-A1", batchId: "FSP-CSE-A1", version: "v2.1", lastUpdated: "2024-07-25", status: "Active" },
  { id: "TT-ECE-B2", batchId: "FSP-ECE-B2", version: "v1.0", lastUpdated: "2024-07-20", status: "Active" },
  { id: "TT-MECH-A1", batchId: "FSP-MECH-A1", version: "v0.9", lastUpdated: "2024-07-15", status: "Draft" },
];

export default function AdminTimetablesPage() {
  return (
    <>
      <PageHeader 
        title="Manage Timetables" 
        description="View and manage FSP timetables for all batches."
        actions={<Button><PlusCircle className="mr-2 h-4 w-4" /> Create New Timetable</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle>Existing Timetables</CardTitle>
          <CardDescription>List of all program timetables.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timetable ID</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetables.map((tt) => (
                <TableRow key={tt.id}>
                  <TableCell className="font-medium">{tt.id}</TableCell>
                  <TableCell>{tt.batchId}</TableCell>
                  <TableCell>{tt.version}</TableCell>
                  <TableCell>{new Date(tt.lastUpdated).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">{tt.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-1">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <p className="text-sm text-muted-foreground mt-4">This is a placeholder view. Actual timetable management would be more complex.</p>
        </CardContent>
      </Card>
    </>
  );
}
