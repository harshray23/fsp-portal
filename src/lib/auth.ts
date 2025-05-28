// THIS IS A MOCK AUTHENTICATION SERVICE FOR PROTOTYPING
// DO NOT USE IN PRODUCTION AS-IS.
// Real applications require a secure backend for authentication.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import type { UserRole } from '@/config/nav'; // Assuming UserRole is defined in nav.ts, adjust if not

// Mock user storage - In a real app, this would be a database.
// Passwords for admin/teacher should be pre-hashed.
const mockUsers = [
  { id: 'admin_default_harsh', email: 'harshray2007@gmail.com', passwordHash: '$2a$10$9i5BovgNe5bV.P8.H7OaJevv85a6GgG.E2W0W0C2xS0w8jY6M8P8S', role: 'admin' as UserRole, name: 'Harsh Ray' }, // Hashed "Harsh@2007"
  { id: 'teacher_user_1', email: 'teacher@aec.edu.in', passwordHash: '$2a$10$gY2fX.0oJ.ZzP7N2qY/m2.cW9yG.GqQ9fX0gS0eP0E1vP2H3I4J5K', role: 'teacher' as UserRole, name: 'Teacher User' }, // Hashed "teacherpass"
  { id: 'student_user_1', studentId: 'AEC123', password: 'password123', role: 'student' as UserRole, name: 'Student User' } // Student login might use Student ID
];

// In a real backend, JWT signing would use a secret from environment variables
// The .env file might contain: JWT_SECRET=your_super_secret_key_here
// Ensure this is set in your deployment environment.
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-default-dev-secret-key';
// Note: Using NEXT_PUBLIC_ for client-side access for this prototype's mock.
// In a real app, JWT_SECRET should NOT be prefixed with NEXT_PUBLIC_ and only used server-side.

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
  if (role === 'student') {
    user = mockUsers.find(u => u.role === 'student' && u.studentId === identifier);
    if (user && user.password === passwordPlainText) { // Plain text check for student mock
      const tokenPayload: TokenPayload = { id: user.id, role: user.role, name: user.name };
      const token = createActualToken(tokenPayload);
      if (typeof window !== 'undefined') localStorage.setItem('authToken', token);
      return { success: true, token, user: { name: user.name, email: user.studentId, role: user.role } };
    }
  } else { // Admin or Teacher
    user = mockUsers.find(u => u.role === role && u.email === identifier);
    if (user && user.passwordHash && bcrypt.compareSync(passwordPlainText, user.passwordHash)) {
      const tokenPayload: TokenPayload = { id: user.id, role: user.role, name: user.name };
      const token = createActualToken(tokenPayload);
      if (typeof window !== 'undefined') localStorage.setItem('authToken', token);
      return { success: true, token, user: { name: user.name, email: user.email, role: user.role } };
    }
  }
  
  return { success: false, error: 'Invalid credentials' };
};

export const registerStudent = async (studentData: any): Promise<{ success: boolean; error?: string }> => {
  const hashedPassword = bcrypt.hashSync(studentData.password, 10);
  console.log("Mock Student Registration:", { ...studentData, password: hashedPassword });
  // Potentially add to mockUsers if needed for the prototype's flow
  // mockUsers.push({ id: `student_${Date.now()}`, studentId: studentData.studentId, password: hashedPassword, role: 'student', name: studentData.name });
  return { success: true };
};

export const registerStaff = async (staffData: any): Promise<{ success: boolean; error?: string }> => {
  const hashedPassword = bcrypt.hashSync(staffData.password, 10);
  console.log(`Mock ${staffData.role} Registration:`, { ...staffData, password: hashedPassword });
  // mockUsers.push({ id: `${staffData.role}_${Date.now()}`, email: staffData.email, passwordHash: hashedPassword, role: staffData.role, name: staffData.name });
  return { success: true };
};


export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
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
      // Find the full user details from mockUsers to get email if not in token (though it should be for admin/teacher)
      const userFromDb = mockUsers.find(u => u.id === decoded.id);
      return {
        ...decoded,
        email: userFromDb?.email || (userFromDb?.role === 'student' ? (userFromDb as any).studentId : undefined)
      };
    }
  }
  return null;
};

// For API route protection example
export const verifyToken = (token: string): TokenPayload | null => {
  // This function is intended for server-side verification in API routes
  // It now uses the actual JWT verification
  return verifyActualToken(token);
};

/**
 * SECURITY NOTE ON CSRF (Cross-Site Request Forgery):
 * The current authentication uses localStorage for token storage and expects Bearer tokens
 * in API request headers. This method is generally less vulnerable to traditional CSRF attacks
 * compared to cookie-based authentication where cookies are sent automatically by the browser.
 *
 * If this application were to switch to cookie-based sessions (especially HttpOnly cookies for security),
 * robust CSRF protection (e.g., using CSRF tokens validated on the server, SameSite cookie attributes)
 * would be essential for all state-changing requests.
 *
 * Next.js