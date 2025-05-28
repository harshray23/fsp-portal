
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo, useCallback } from "react"; // Added useMemo, useCallback
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(["admin", "teacher"], { required_error: "Role is required." }),
  department: z.string().optional(), // Optional, maybe only for teachers
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type UserRegistrationFormValues = z.infer<typeof formSchema>;

interface UserRegistrationFormProps {
  mode: 'admin' | 'teacher'; // To pre-select or customize form
}

export function UserRegistrationForm({ mode }: UserRegistrationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getInitialValues = useCallback(() => {
    if (mode === 'admin') {
      return {
        name: "Harsh Ray",
        email: "harshray2007@gmail.com",
        role: mode,
        department: "CSE(AIML)", 
        password: "Harsh@2007",
      };
    }
    return {
      name: "",
      email: "",
      role: mode,
      department: "",
      password: "",
    };
  }, [mode]);

  const defaultValues = useMemo(() => getInitialValues(), [getInitialValues]);

  const form = useForm<UserRegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const selectedRole = form.watch("role");

  async function onSubmit(values: UserRegistrationFormValues) {
    setIsLoading(true);
    console.log(`Registering new ${values.role}:`, values);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: "User Registered",
      description: `${values.name} (${values.role}) has been successfully registered.`,
    });
    form.reset(getInitialValues());
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New {mode === 'admin' ? 'Admin' : 'Teacher'}</CardTitle>
        <CardDescription>Fill in the details to create a new user account.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="user@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={true}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedRole === 'teacher' && (
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl><Input placeholder="e.g., Computer Science" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temporary Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register User
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
