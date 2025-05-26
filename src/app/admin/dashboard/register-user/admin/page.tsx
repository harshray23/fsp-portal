import { PageHeader } from '@/components/common/PageHeader';
import { UserRegistrationForm } from '@/components/admin/UserRegistrationForm';

export default function RegisterAdminPage() {
  return (
    <>
      <PageHeader 
        title="Register New Admin" 
        description="Create accounts for new administrative staff."
      />
      <div className="max-w-2xl">
        <UserRegistrationForm mode="admin" />
      </div>
    </>
  );
}
