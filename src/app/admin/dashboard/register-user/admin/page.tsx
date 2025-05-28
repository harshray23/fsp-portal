
"use client";

import { PageHeader } from '@/components/common/PageHeader';
import { UserRegistrationForm } from '@/components/admin/UserRegistrationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react'; 
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

// Cleared initial mock admins for the displayed list.
// The UserRegistrationForm will still have default values for "Harsh Ray" for new admin creation.
const generateInitialMockAdmins = (): AdminUser[] => [];


export default function RegisterAdminPage() {
  const initialAdmins = useMemo(() => generateInitialMockAdmins(), []);
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const { toast } = useToast();

  const handleDeleteAdmin = (adminId: string) => {
    // This check is for the default admin details pre-filled in the form,
    // in case an admin with these exact details was somehow added to the list.
    if (adminId === 'admin_default_harsh' && admins.find(a => a.id === adminId)?.email === 'harshray2007@gmail.com') {
      toast({
        title: "Deletion Restricted",
        description: "The default admin account details (Harsh Ray) cannot be deleted through this interface if it were listed. This is a conceptual restriction.",
        variant: "destructive",
      });
      return;
    }
    setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== adminId));
    toast({
      title: "Admin Deleted",
      description: `Admin account has been removed.`,
    });
  };

  return (
    <>
      <PageHeader 
        title="Register New Admin" 
        description="Create accounts for new administrative staff."
      />
      <div className="max-w-2xl mb-8">
        <UserRegistrationForm mode="admin" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Existing Admins</CardTitle>
          <CardDescription>View and remove existing admin accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No admins found.
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        // Disable deletion if it matches the default admin's email, as a safeguard
                        disabled={admin.email === 'harshray2007@gmail.com'}
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
