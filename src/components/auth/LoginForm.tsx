
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useMemo } from "react"; // Added useMemo

interface LoginFormProps {
  role: 'student' | 'teacher' | 'admin';
  dashboardPath: string;
}

const createFormSchema = (role: LoginFormProps['role']) => {
  return z.object({
    identifier: z.string().min(1, { message: role === 'student' ? "Student ID is required." : "Email is required." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  }).refine(
    (data) => {
      if (role !== 'student') { // For admin and teacher, identifier must be an email
        return z.string().email().safeParse(data.identifier).success;
      }
      return true; // For student, any non-empty string is fine for identifier (studentId)
    },
    {
      message: "Invalid email address. Please use a valid email.", // This message applies if role is not student and email is invalid
      path: ["identifier"],
    }
  );
};

type LoginFormValues = z.infer<ReturnType<typeof createFormSchema>>;

export function LoginForm({ role, dashboardPath }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = useMemo(() => createFormSchema(role), [role]);

  const defaultValues = useMemo(() => ({
    identifier: "",
    password: "",
  }), []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Mock login: In a real app, this would call an API
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    console.log(`Logging in ${role} with:`, values);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push(dashboardPath); 
  }

  return (
    <Card className="shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{role === 'student' ? 'Student ID' : 'Email'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={role === 'student' ? 'Enter your Student ID' : 'your.email@example.com'} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
            {role === 'student' && (
                 <p className="mt-2 text-xs text-center text-muted-foreground">
                 Forgot password? <a href="#" className="font-medium text-primary hover:underline">Reset here</a>
               </p>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
