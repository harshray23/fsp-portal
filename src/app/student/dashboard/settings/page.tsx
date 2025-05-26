
"use client";
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from 'react';

// Assume user object might be available from a context or props in a real app
// For this mock, we'll manage preview locally.
// const mockUser = { imageUrl: undefined }; 

export default function StudentSettingsPage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result as string);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      setAvatarPreview(null); // Clear preview if no file is selected or selection is cancelled
    }
  };

  const handleSaveChanges = () => {
    // Logic to save all changes including profile picture
    console.log("Saving changes including profile picture:", avatarPreview);
    // In a real app, you would upload avatarPreview (if it's a new base64 string)
    // or the file object itself, then update user data.
  };
  
  return (
    <>
      <PageHeader title="Profile Settings" description="Manage your account settings and preferences." />
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
                <AvatarImage src={avatarPreview || "https://placehold.co/100x100.png?text=AV"} alt="Student Avatar" data-ai-hint="avatar placeholder" />
                <AvatarFallback>STU</AvatarFallback>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Student User" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="student@aec.edu.in" disabled />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="+91 XXXXX XXXXX" />
          </div>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
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
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </>
  );
}
