
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
      <ShieldAlert className="w-16 h-16 text-destructive mb-6" />
      <h1 className="text-4xl font-bold text-foreground mb-3">Access Denied</h1>
      <p className="text-lg text-muted-foreground mb-8">
        You do not have permission to view this page.
      </p>
      <Button asChild>
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  );
}
