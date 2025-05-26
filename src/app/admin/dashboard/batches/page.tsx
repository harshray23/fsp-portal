import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Mock data
const batches = [
  { id: "FSP-CSE-A1", name: "Computer Science - Batch A1", students: 60, status: "Active", coordinator: "Dr. S. Sen" },
  { id: "FSP-ECE-B2", name: "Electronics - Batch B2", students: 55, status: "Active", coordinator: "Prof. M. Ali" },
  { id: "FSP-MECH-A1", name: "Mechanical - Batch A1", students: 62, status: "Upcoming", coordinator: "Dr. P. Ghosh" },
  { id: "FSP-IT-C1", name: "Information Technology - Batch C1", students: 58, status: "Finished", coordinator: "Prof. A. Kaur" },
];

export default function AdminBatchesPage() {
  return (
    <>
      <PageHeader 
        title="Manage Batches" 
        description="View, create, and manage FSP batches."
        actions={<Button><PlusCircle className="mr-2 h-4 w-4" /> Create New Batch</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle>Existing Batches</CardTitle>
          <CardDescription>List of all Finishing School Program batches.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Batch Name</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead>Coordinator</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.id}</TableCell>
                  <TableCell>{batch.name}</TableCell>
                  <TableCell className="text-center">{batch.students}</TableCell>
                  <TableCell>{batch.coordinator}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={batch.status === 'Active' ? 'default' : batch.status === 'Upcoming' ? 'secondary' : 'outline'}>
                      {batch.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-1">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
