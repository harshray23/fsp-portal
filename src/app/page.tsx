import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Shield, BookOpen } from 'lucide-react';
import { Logo } from '@/components/common/Logo';

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  loginPath: string;
  registerPath?: string;
}

function RoleCard({ title, description, icon: Icon, loginPath, registerPath }: RoleCardProps) {
  return (
    <Card className="w-full max-w-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="items-center text-center">
        <div className="p-3 bg-primary/10 rounded-full mb-2">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-3">
        <Button asChild size="lg" className="w-full">
          <Link href={loginPath}>
            Login <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        {registerPath && (
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href={registerPath}>Register</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function RoleSelectionPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-background to-secondary">
      <div className="text-center mb-12">
        <Logo className="text-4xl justify-center mb-4" />
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to the Finishing School Program Portal for Asansol Engineering College. Please select your role to continue.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <RoleCard
          title="Student"
          description="Access your batch details, attendance, and learning materials."
          icon={User}
          loginPath="/student/login"
          registerPath="/student/register"
        />
        <RoleCard
          title="Teacher"
          description="Manage batches, timetables, attendance, and student performance."
          icon={BookOpen}
          loginPath="/teacher/login"
        />
        <RoleCard
          title="Admin"
          description="Oversee the FSP, manage users, and view system-wide analytics."
          icon={Shield}
          loginPath="/admin/login"
        />
      </div>
      <footer className="mt-16 text-center text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} Asansol Engineering College. All rights reserved.
      </footer>
    </main>
  );
}
