
"use client";

import type { ReactNode } from 'react';
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
import { LogOut, ChevronDown, ChevronUp } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu"


interface DashboardLayoutProps {
  children: ReactNode;
  role: Role;
  user?: { name?: string; email?: string; imageUrl?: string }; // Optional user prop for avatar
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


export function DashboardLayout({ children, role, user = { name: "User", email: "user@example.com" } }: DashboardLayoutProps) {
  const navItems = getNavItemsByRole(role);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Mock logout
    router.push('/');
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4 flex justify-center items-center"> {/* Adjusted for image centering */}
             <Logo
                inSheet={false}
             />
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
            <div className="flex-1" /> {/* Spacer */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    {user.imageUrl ? (
                       <AvatarImage src={user.imageUrl} alt={user.name || "User"} />
                    ) : (
                       <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.name)}`} alt={user.name || "User"} data-ai-hint="user avatar" />
                    )}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/${role}/dashboard/settings`)}>
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
    </SidebarProvider>
  );
}
