import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader title="Admin Settings" description="Manage system-wide settings and admin preferences." />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Update your personal admin details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Admin User" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@aec.edu.in" disabled />
            </div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <Button>Update Password</Button>
            <div className="flex items-center space-x-2 pt-4">
              <Switch id="2fa-mode" />
              <Label htmlFor="2fa-mode">Enable Two-Factor Authentication</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
            <CardTitle>System Preferences</CardTitle>
            <CardDescription>Configure global application settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">Temporarily disable access for users during updates.</p>
                </div>
                <Switch id="maintenance-mode" />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Enable or disable system-wide email notifications.</p>
                </div>
                <Switch id="email-notifications" checked />
            </div>
            <Button>Save System Preferences</Button>
        </CardContent>
      </Card>
    </>
  );
}
