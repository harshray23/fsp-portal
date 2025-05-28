
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
import { useState, useMemo } from "react";
import { login } from "@/lib/auth"; 
import { useToast } from "@/hooks/use-toast";
import type { Role } from "@/config/nav";

interface LoginFormProps {
  role: Role;
  dashboardPath: string;
}

const createFormSchema = (role: LoginFormProps['role']) => {
  const schema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  });

  if (role === 'student') {
    return schema.extend({
      identifier: z.string().min(1, { message: "Student ID is required." }), // Student ID
    });
  }
  return schema.extend({
    identifier: z.string().email({ message: "Valid email is required." }), // Email for admin/teacher
  });
};

type LoginFormValues = z.infer<ReturnType<typeof createFormSchema>>;

export function LoginForm({ role, dashboardPath }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = useMemo(() => createFormSchema(role), [role]);

  const defaultValues = useMemo(() => ({
    identifier: role === 'admin' ? "harshray2007@gmail.com" : "", 
    password: role === 'admin' ? "Harsh@2007" : "",
  }), [role]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    // PRODUCTION SECURITY NOTE:
    // Login routes should be protected against brute-force attacks.
    // Implement rate limiting (e.g., with Redis/rate-limiter-flexible on the backend)
    // and consider CAPTCHA challenges (e.g., Google reCAPTCHA) after several failed attempts.
    // This requires backend logic and cannot be fully implemented client-side.
    const result = await login(values.identifier, values.password, role);
    setIsLoading(false);

    if (result.success && result.user) {
      router.push(dashboardPath); 
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials.", // Generic error message for security
        variant: "destructive",
      });
    }
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
                      type={role === 'student' ? 'text' : 'email'}
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
                 Forgot password? <button type="button" onClick={() => alert("Password reset functionality uses Firebase's built-in email-based reset flow. Ensure it's configured in your Firebase project.")} className="font-medium text-primary hover:underline">Reset here</button>
               </p>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
