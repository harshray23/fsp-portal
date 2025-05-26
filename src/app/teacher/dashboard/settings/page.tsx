
"use client";
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from 'react';

// const mockUser = { imageUrl: undefined };

export default function TeacherSettingsPage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setAvatarPreview(null);
    }
  };
  
  const handleProfileSave = () => {
    console.log("Saving profile including picture:", avatarPreview);
  };

  return (
    <>
      <PageHeader title="Profile Settings" description="Manage your account settings and preferences." />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details and profile picture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || "https://placehold.co/100x100.png?text=AV"} alt="Teacher Avatar" data-ai-hint="avatar placeholder"/>
                  <AvatarFallback>TEA</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <Input 
                    id="profilePicture" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="max-w-xs file:mr-2 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary hover:file:cursor-pointer hover:file:bg-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">Upload a new profile picture. JPG, PNG, GIF up to 2MB.</p>
                </div>
              </div>
            </div>
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
            <Button onClick={handleProfileSave}>Save Profile</Button>
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
