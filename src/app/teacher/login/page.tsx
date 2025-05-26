import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function TeacherLoginPage() {
  return (
    <AuthLayout title="Teacher Login" description="Access your teacher dashboard.">
      <LoginForm role="teacher" dashboardPath="/teacher/dashboard" />
    </AuthLayout>
  );
}
