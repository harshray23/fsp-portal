
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import type { NavItem, Role } from '@/config/nav';
import { getNavItemsByRole } from '@/config/nav';
import { Logo } from '@/components/common/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronDown, ChevronUp, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout as authLogout, onAuthUserChanged } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import type { User as FirebaseUser } from 'firebase/auth';
import Cookies from 'js-cookie';

interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
}

interface AppUser {
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
  roleFromProps: Role;
}

function NavMenuItem({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const { state: sidebarState } = useSidebar();
  const [isSubMenuOpen, setIsSubMenuOpen] = React.useState(currentPath.startsWith(item.href) && item.items && item.items.length > 0);

  const isActive = item.items
    ? currentPath.startsWith(item.href)
    : currentPath === item.href;

  if (item.items && item.items.length > 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
          isActive={isActive}
          className="justify-between"
          tooltip={item.title}
        >
          <div className="flex items-center gap-2">
            <item.icon />
            <span>{item.title}</span>
          </div>
          {sidebarState === 'expanded' && (isSubMenuOpen ? <ChevronUp /> : <ChevronDown />)}
        </SidebarMenuButton>
        {isSubMenuOpen && sidebarState === 'expanded' && (
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.href}>
                <SidebarMenuSubButton
                  asChild
                  size="sm"
                  isActive={currentPath === subItem.href}
                >
                  <Link href={subItem.href}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.href}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}


export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const navItems = getNavItemsByRole(role);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthUserChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in.
        // TODO: In a real app, fetch user's role from Firestore or custom claims.
        // For this prototype, we'll trust the 'role' prop passed to DashboardLayout.
        // This is a simplification and not secure for actual role enforcement.
        // A mismatch check could be: if (userRoleFromDB !== role) { /* redirect or deny */ }

        // Simulating fetching actual role - for now, just check if the cookie exists
        // as a basic check for the middleware having allowed access.
        const token = Cookies.get('authToken');
        if (!token) {
          // This case should ideally be caught by middleware, but as a fallback:
          router.replace('/'); // Redirect to home if no token, even if Firebase user exists
          return;
        }
        
        // TODO: Verify token if needed, and fetch role from token or Firestore.
        // For now, assuming the role prop is the source of truth after middleware pass.
        setCurrentUser({
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          imageUrl: firebaseUser.photoURL,
          roleFromProps: role,
        });
      } else {
        // User is signed out.
        setCurrentUser(null);
        // Middleware should handle redirecting to login, but as a fallback:
        let loginPath = '/'; 
        if (role === 'student') loginPath = '/student/login';
        else if (role === 'teacher') loginPath = '/teacher/login';
        else if (role === 'admin') loginPath = '/admin/login';
        router.replace(loginPath);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [role]); // Dependency: only re-run if role changes


  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authLogout(); // This will clear the cookie as well
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      // onAuthUserChanged listener will handle redirect
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: "An error occurred during logout.", variant: "destructive"});
      setIsLoading(false);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return role.charAt(0).toUpperCase();
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }
  
  if (!currentUser && !isLoading) { // If done loading and still no user, redirect (should be handled by effect)
    // This state implies onAuthUserChanged determined no user, and redirection should occur.
    // To prevent brief flash of content, a loader is shown, or redirect handled by effect.
    // If middleware is working, this might not even be hit often for dashboard routes.
     let loginPath = '/'; 
     if (role === 'student') loginPath = '/student/login';
     else if (role === 'teacher') loginPath = '/teacher/login';
     else if (role === 'admin') loginPath = '/admin/login';
     router.replace(loginPath);
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }
  
  // If currentUser is null but still loading, the loader above handles it.
  // If currentUser exists, render the dashboard.
  if (!currentUser) { 
    // This is a safeguard, should ideally be handled by the isLoading state or the redirect logic.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4 flex justify-center items-center">
             <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <NavMenuItem key={item.href} item={item} currentPath={pathname} />
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-6 shrink-0">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="flex-1" /> 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    {currentUser.imageUrl ? (
                       <AvatarImage src={currentUser.imageUrl} alt={currentUser.name || "User"} />
                    ) : (
                       <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(currentUser.name)}`} alt={currentUser.name || "User"} data-ai-hint="user avatar" />
                    )}
                    <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email} ({currentUser.roleFromProps})
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/${currentUser.roleFromProps}/dashboard/settings`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
