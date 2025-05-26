import { StudentRegistrationForm } from '@/components/auth/StudentRegistrationForm';
import { AuthLayout } from '@/components/auth/AuthLayout';
import Link from 'next/link';

export default function StudentRegisterPage() {
  return (
    <AuthLayout title="Student Registration" description="Create your student account for the FSP Portal.">
      <StudentRegistrationForm />
       <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/student/login" className="font-medium text-primary hover:underline">
          Login here
        </Link>
      </p>
    </AuthLayout>
  );
}
