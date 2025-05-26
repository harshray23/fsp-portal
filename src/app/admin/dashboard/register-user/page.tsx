'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterUserRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/dashboard/register-user/admin');
  }, [router]);
  return null; // Or a loading spinner
}
