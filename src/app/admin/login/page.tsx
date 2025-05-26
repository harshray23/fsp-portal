import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function AdminLoginPage() {
  return (
    <AuthLayout title="Admin Login" description="Access the admin dashboard.">
      <LoginForm role="admin" dashboardPath="/admin/dashboard" />
    </AuthLayout>
  );
}
