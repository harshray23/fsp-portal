
import { Logo } from '@/components/common/Logo';
import type { ReactNode } from 'react';
import { useMemo } from 'react'; // Added useMemo

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="mb-8 text-center">
        <Logo className="text-3xl justify-center mb-2" />
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
       <footer className="mt-12 text-center text-muted-foreground text-sm">
        &copy; {currentYear} Asansol Engineering College. All rights reserved.
      </footer>
    </div>
  );
}
