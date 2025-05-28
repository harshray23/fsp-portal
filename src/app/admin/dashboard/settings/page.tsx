
"use client";
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState, useEffect } from 'react';
import { getToken } from '@/lib/auth'; // For API call example
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const { toast } = useToast();

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
    console.log("Saving admin profile including picture:", avatarPreview);
    toast({ title: "Profile Saved", description: "Your profile details have been updated." });
  };

  const fetchSecureData = async () => {
    setApiResponse("Loading...");
    const token = getToken();
    if (!token) {
      setApiResponse("Error: Not logged in or token not found.");
      toast({ title: "API Error", description: "Not logged in or token not found.", variant: "destructive"});
      return;
    }

    try {
      const response = await fetch('/api/secure-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setApiResponse(JSON.stringify(data, null, 2));
        toast({ title: "API Success", description: "Secure data fetched successfully."});
      } else {
        setApiResponse(`Error ${response.status}: ${data.error || 'Failed to fetch secure data'}`);
        toast({ title: "API Error", description: data.error || 'Failed to fetch secure data', variant: "destructive"});
      }
    } catch (error) {
      console.error("Fetch secure data error:", error);
      setApiResponse(`Error: ${(error as Error).message}`);
      toast({ title: "API Error", description: (error as Error).message, variant: "destructive"});
    }
  };


  return (
    <>
      <PageHeader title="Profile Settings" description="Manage system-wide settings and admin preferences." />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Update your personal admin details and profile picture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview || "https://placehold.co/100x100.png?text=AV"} alt="Admin Avatar" data-ai-hint="avatar placeholder"/>
                  <AvatarFallback>ADM</AvatarFallback>
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
              <Input id="name" defaultValue="Admin User" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@aec.edu.in" disabled />
            </div>
            <Button onClick={handleProfileSave}>Save Profile</Button>
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Test Protected API</CardTitle>
          <CardDescription>Click to fetch data from a sample protected API route.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchSecureData}>Fetch Secure Data</Button>
          {apiResponse && (
            <pre className="mt-4 p-4 bg-muted rounded-md text-sm overflow-x-auto">
              <code>{apiResponse}</code>
            </pre>
          )}
        </CardContent>
      </Card>
    </>
  );
}
