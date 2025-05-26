import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function TeacherSettingsPage() {
  return (
    <>
      <PageHeader title="Teacher Settings" description="Manage your account settings and preferences." />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Teacher User" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="teacher@aec.edu.in" disabled />
            </div>
             <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Computer Science & Engineering" />
            </div>
             <div>
              <Label htmlFor="bio">Short Bio (Optional)</Label>
              <Textarea id="bio" placeholder="Tell us a bit about your expertise..." rows={3}/>
            </div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password & Security</CardTitle>
            <CardDescription>Manage your account security settings.</CardDescription>
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
            <div>
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input id="confirm-new-password" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications-new-assignment">Email for new student assignments</Label>
            <Switch id="email-notifications-new-assignment" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications-schedule-changes">Email for schedule changes</Label>
            <Switch id="email-notifications-schedule-changes" defaultChecked/>
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="app-notifications-pending-tasks">In-app notifications for pending tasks</Label>
            <Switch id="app-notifications-pending-tasks" defaultChecked/>
          </div>
          <Button>Save Notification Preferences</Button>
        </CardContent>
      </Card>
    </>
  );
}
