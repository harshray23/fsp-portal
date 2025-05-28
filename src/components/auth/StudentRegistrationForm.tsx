
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { registerStudent } from "@/lib/auth"; // Import mock registration
import { useToast } from "@/hooks/use-toast";


const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
  studentId: z.string().min(1, { message: "Student ID is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  rollNumber: z.string().min(1, { message: "Roll number is required." }),
  registrationNumber: z.string().min(1, { message: "Registration number is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  phoneNumber: z.string().regex(phoneRegex, { message: "Invalid phone number."}),
  whatsappNumber: z.string().regex(phoneRegex, { message: "Invalid WhatsApp number."}),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type StudentRegistrationFormValues = z.infer<typeof formSchema>;

export function StudentRegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const defaultValues = useMemo(() => ({
    studentId: "",
    name: "",
    email: "",
    rollNumber: "",
    registrationNumber: "",
    department: "",
    phoneNumber: "",
    whatsappNumber: "",
    password: "",
    confirmPassword: "",
  }), []);

  const form = useForm<StudentRegistrationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: StudentRegistrationFormValues) {
    setIsLoading(true);
    // Password will be hashed by registerStudent (which internally uses bcrypt)
    const result = await registerStudent(values);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: "Registration Successful",
        description: "You can now log in with your Student ID and password.",
      });
      router.push("/student/login"); 
    } else {
      toast({
        title: "Registration Failed",
        description: result.error || "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-3 pt-6 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField control={form.control} name="studentId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl><Input placeholder="AEC12345" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField control={form.control} name="rollNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll Number</FormLabel>
                  <FormControl><Input placeholder="1234567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl><Input placeholder="REG1234567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="department" render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl><Input placeholder="Computer Science" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="whatsappNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl><Input type="tel" placeholder="+91 XXXXX XXXXX" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
