import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, CalendarDays, UserPlus, FileText, CheckSquare, BookUser, Settings } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItem[]; // For sub-menus
}

export const studentNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/student/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Batch',
    href: '/student/dashboard/batch',
    icon: Users,
  },
  {
    title: 'My Attendance',
    href: '/student/dashboard/attendance',
    icon: CheckSquare,
  },
   {
    title: 'Settings',
    href: '/student/dashboard/settings',
    icon: Settings,
  },
];

export const teacherNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/teacher/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Assign Students',
    href: '/teacher/dashboard/assign-students',
    icon: BookUser,
  },
  {
    title: 'Manage Timetables',
    href: '/teacher/dashboard/manage-timetables',
    icon: CalendarDays,
  },
  {
    title: 'Manage Attendance',
    href: '/teacher/dashboard/manage-attendance',
    icon: CheckSquare,
  },
  {
    title: 'Reports',
    href: '/teacher/dashboard/reports',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/teacher/dashboard/settings',
    icon: Settings,
  },
];

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'View Batches',
    href: '/admin/dashboard/batches',
    icon: Users,
  },
  {
    title: 'View Timetables',
    href: '/admin/dashboard/timetables',
    icon: CalendarDays,
  },
  {
    title: 'Register User',
    href: '/admin/dashboard/register-user',
    icon: UserPlus,
    items: [ // Example of sub-menu
        { title: 'Register Admin', href: '/admin/dashboard/register-user/admin', icon: UserPlus },
        { title: 'Register Teacher', href: '/admin/dashboard/register-user/teacher', icon: UserPlus },
    ]
  },
   {
    title: 'Settings',
    href: '/admin/dashboard/settings',
    icon: Settings,
  },
];

export type Role = 'student' | 'teacher' | 'admin';

export const getNavItemsByRole = (role: Role): NavItem[] => {
  switch (role) {
    case 'student':
      return studentNavItems;
    case 'teacher':
      return teacherNavItems;
    case 'admin':
      return adminNavItems;
    default:
      return [];
  }
};
