
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
import { LogOut, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
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
import { logout as authLogout, onAuthUserChanged } from '@/lib/auth'; // Firebase auth functions
import { useToast } from '@/hooks/use-toast';
import type { User as FirebaseUser } from 'firebase/auth';

interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
}

interface AppUser { // Simplified user object for display
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null; // Firebase user.photoURL
  roleFromProps: Role; // The role this layout is for
  // Actual role from Firebase custom claims or Firestore would be used in a full setup
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

        setCurrentUser({
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          imageUrl: firebaseUser.photoURL,
          roleFromProps: role, // Store the expected role
        });
      } else {
        // User is signed out.
        setCurrentUser(null);
        toast({ title: "Unauthorized", description: "Please log in to continue.", variant: "destructive" });
        
        // Redirect to the appropriate login page for the current dashboard role, or homepage
        let loginPath = '/';
        if (role === 'student') loginPath = '/student/login';
        else if (role === 'teacher') loginPath = '/teacher/login';
        else if (role === 'admin') loginPath = '/admin/login';
        router.replace(loginPath);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [role, router, toast]);


  const handleLogout = async () => {
    setIsLoading(true);
    await authLogout();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    // setCurrentUser(null) will be handled by onAuthUserChanged listener, triggering redirect.
    // router.push('/'); // onAuthUserChanged will redirect
  };

  const getInitials = (name?: string | null) => {
    if (!name) return role.charAt(0).toUpperCase(); // Default to role initial
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }
  
  // If still loading or no user after loading (should be caught by effect's redirect)
  if (!currentUser) {
     // This state should ideally be brief or handled by the redirect in useEffect.
     // Display loader just in case to prevent rendering children without user context.
    return (
        <div className="flex items-center justify-center min-h-screen">
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
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider