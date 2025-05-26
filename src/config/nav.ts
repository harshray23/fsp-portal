
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, CalendarDays, UserPlus, FileText, CheckSquare, BookUser, Settings, UserCircle } from 'lucide-react'; // Added UserCircle

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
    title: 'Profile', // Renamed from Settings
    href: '/student/dashboard/settings',
    icon: UserCircle, // Changed icon
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
    title: 'Profile', // Renamed from Settings
    href: '/teacher/dashboard/settings',
    icon: UserCircle, // Changed icon
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
    items: [ 
        { title: 'Register Admin', href: '/admin/dashboard/register-user/admin', icon: UserPlus },
        { title: 'Register Teacher', href: '/admin/dashboard/register-user/teacher', icon: UserPlus },
    ]
  },
   {
    title: 'Profile', // Renamed from Settings
    href: '/admin/dashboard/settings',
    icon: UserCircle, // Changed icon
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
