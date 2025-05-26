import { PageHeader } from '@/components/common/PageHeader';
import { UserRegistrationForm } from '@/components/admin/UserRegistrationForm';

export default function RegisterTeacherPage() {
  return (
    <>
      <PageHeader 
        title="Register New Teacher" 
        description="Create accounts for new teaching staff."
      />
      <div className="max-w-2xl">
        <UserRegistrationForm mode="teacher" />
      </div>
    </>
  );
}
