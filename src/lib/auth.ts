
// THIS IS A MOCK AUTHENTICATION SERVICE FOR PROTOTYPING
// DO NOT USE IN PRODUCTION AS-IS.
// Real applications require a secure backend for authentication.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie'; // For managing cookies
import type { Role as UserRole } from '@/config/nav'; 

// Mock user storage - In a real app, this would be a database.
// Passwords for all users should be pre-hashed.
const mockUsers = [
  { id: 'admin_default_harsh', email: 'harshray2007@gmail.com', passwordHash: '$2a$10$9i5BovgNe5bV.P8.H7OaJevv85a6GgG.E2W0W0C2xS0w8jY6M8P8S', role: 'admin' as UserRole, name: 'Harsh Ray' }, // Hashed "Harsh@2007"
  { id: 'teacher_user_1', email: 'teacher@aec.edu.in', passwordHash: '$2a$10$gY2fX.0oJ.ZzP7N2qY/m2.cW9yG.GqQ9fX0gS0eP0E1vP2H3I4J5K', role: 'teacher' as UserRole, name: 'Teacher User' }, // Hashed "teacherpass"
  { id: 'student_user_1', studentId: 'AEC123', passwordHash: '$2a$10$3.XkYJ5e0.L6Z/rGzBvQ2e3n.P3F.I0H.kC9wB1xU.G5zB6J8P7qG', role: 'student' as UserRole, name: 'Student User' } // Hashed "password123"
];

// In a real backend, JWT signing would use a secret from environment variables
// For this client-side mock, we'll use the NEXT_PUBLIC_ prefixed variable.
// IMPORTANT: Real backend JWT secrets should NOT be prefixed with NEXT_PUBLIC_
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-default-dev-secret-key-if-not-set';

interface TokenPayload {
  id: string;
  role: UserRole;
  name: string;
  // Add other relevant user fields you want in the token
}

const createActualToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

const verifyActualToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Failed to verify token:", error);
    return null;
  }
};

export const login = async (identifier: string, passwordPlainText: string, role: UserRole): Promise<{ success: boolean; token?: string; error?: string; user?: any }> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  let user;
  let passwordMatch = false;

  if (role === 'student') {
    user = mockUsers.find(u => u.role === 'student' && u.studentId === identifier);
    if (user && user.passwordHash && bcrypt.compareSync(passwordPlainText, user.passwordHash)) {
      passwordMatch = true;
    }
  } else { // Admin or Teacher
    user = mockUsers.find(u => u.role === role && u.email === identifier);
    if (user && user.passwordHash && bcrypt.compareSync(passwordPlainText, user.passwordHash)) {
      passwordMatch = true;
    }
  }
  
  if (user && passwordMatch) {
    const tokenPayload: TokenPayload = { id: user.id, role: user.role, name: user.name };
    const token = createActualToken(tokenPayload);
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      Cookies.set('authToken', token, { expires: 1/24, path: '/' }); // Expires in 1 hour
    }
    return { success: true, token, user: { name: user.name, email: role === 'student' ? user.studentId : user.email, role: user.role } };
  }
  
  return { success: false, error: 'Invalid credentials' };
};

export const registerStudent = async (studentData: any): Promise<{ success: boolean; error?: string }> => {
  // In a real app, check if studentId or email already exists.
  const hashedPassword = bcrypt.hashSync(studentData.password, 10);
  const newStudent = { 
    id: `student_${Date.now()}`, 
    studentId: studentData.studentId, 
    passwordHash: hashedPassword, 
    role: 'student' as UserRole, 
    name: studentData.name,
    email: studentData.email // Assuming email is collected during registration
  };
  // mockUsers.push(newStudent); // Optionally add to mockUsers array if persistence is needed for the prototype session
  console.log("Mock Student Registration:", { ...studentData, password: hashedPassword, id: newStudent.id });
  return { success: true };
};

export const registerStaff = async (staffData: any): Promise<{ success: boolean; error?: string }> => {
  // In a real app, check if email already exists.
  const hashedPassword = bcrypt.hashSync(staffData.password, 10);
  const newStaff = {
    id: `${staffData.role}_${Date.now()}`,
    email: staffData.email,
    passwordHash: hashedPassword,
    role: staffData.role as UserRole,
    name: staffData.name
  };
  // mockUsers.push(newStaff); // Optionally add to mockUsers array
  console.log(`Mock ${staffData.role} Registration:`, { ...staffData, password: hashedPassword, id: newStaff.id });
  return { success: true };
};


export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    Cookies.remove('authToken', { path: '/' });
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken'); 
  }
  return null;
};

export const getCurrentUser = (): TokenPayload & { email?: string } | null => {
  const token = getToken(); 
  if (token) {
    const decoded = verifyActualToken(token);
    if(decoded) {
      const userFromDb = mockUsers.find(u => u.id === decoded.id);
      return {
        ...decoded,
        email: userFromDb?.email || (userFromDb?.role === 'student' ? (userFromDb as any).studentId : undefined)
      };
    }
  }
  return null;
};

// For API route protection example (uses Bearer token from header)
export const verifyToken = (token: string): TokenPayload | null => {
  return verifyActualToken(token);
};

/**
 * SECURITY NOTE ON CSRF (Cross-Site Request Forgery):
 * The current page navigation authentication uses a combination of localStorage and a client-set cookie.
 * The cookie is primarily for the Next.js middleware.
 * For API routes expecting `Authorization: Bearer` tokens (like /api/secure-info),
 * CSRF is less of a concern as these tokens are not sent automatically by browsers.
 * 
 * If the application were to switch to rely solely on cookies for session management,
 * especially HttpOnly cookies set by a backend, then robust CSRF protection
 * (e.g., using CSRF tokens validated on the server, SameSite cookie attributes)
 * would be essential for all state-changing requests.
 *
 * Next.js Server Actions have built-in CSRF protection.
 */
