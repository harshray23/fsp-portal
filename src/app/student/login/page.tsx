import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import Link from 'next/link';

export default function StudentLoginPage() {
  return (
    <AuthLayout title="Student Login" description="Access your student dashboard.">
      <LoginForm role="student" dashboardPath="/student/dashboard" />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/student/register" className="font-medium text-primary hover:underline">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}
