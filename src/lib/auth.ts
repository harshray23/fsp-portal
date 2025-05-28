
// THIS IS A MOCK AUTHENTICATION SERVICE FOR PROTOTYPING
// DO NOT USE IN PRODUCTION AS-IS.
// Real applications require a secure backend for authentication.

import bcrypt from 'bcryptjs';

// Mock user storage - In a real app, this would be a database.
// Passwords for admin/teacher should be pre-hashed.
const mockUsers = [
  { id: 'admin_default_harsh', email: 'harshray2007@gmail.com', passwordHash: '$2a$10$9i5BovgNe5bV.P8.H7OaJevv85a6GgG.E2W0W0C2xS0w8jY6M8P8S', role: 'admin', name: 'Harsh Ray' }, // Hashed "Harsh@2007"
  { id: 'teacher_user_1', email: 'teacher@aec.edu.in', passwordHash: '$2a$10$gY2fX.0oJ.ZzP7N2qY/m2.cW9yG.GqQ9fX0gS0eP0E1vP2H3I4J5K', role: 'teacher', name: 'Teacher User' }, // Hashed "teacherpass"
  { id: 'student_user_1', studentId: 'AEC123', password: 'password123', role: 'student', name: 'Student User' } // Student login might use Student ID
];

// For the prototype, we'll use a simple base64 encoded object as a "JWT".
// In production, JWTs are cryptographically signed by the server using a secret
// like process.env.JWT_SECRET.
const createMockToken = (payload: object): string => {
  try {
    return btoa(JSON.stringify(payload));
  } catch (error) {
    // Fallback for environments where btoa might not be available (e.g., older Node.js server-side)
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
};

const decodeMockToken = (token: string): { id: string; role: string; name: string } | null => {
  try {
    const decodedString = atob(token);
    return JSON.parse(decodedString);
  } catch (error) {
    try {
      // Fallback for environments where atob might not be available
      const decodedString = Buffer.from(token, 'base64').toString('utf-8');
      return JSON.parse(decodedString);
    } catch (e) {
      console.error("Failed to decode token:", e);
      return null;
    }
  }
};

export const login = async (identifier: string, passwordPlainText: string, role: 'student' | 'teacher' | 'admin'): Promise<{ success: boolean; token?: string; error?: string; user?: any }> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  let user;
  if (role === 'student') {
    user = mockUsers.find(u => u.role === 'student' && u.studentId === identifier);
    if (user && user.password === passwordPlainText) { // Plain text check for student mock
      const tokenPayload = { id: user.id, role: user.role, name: user.name };
      const token = createMockToken(tokenPayload);
      if (typeof window !== 'undefined') localStorage.setItem('authToken', token);
      return { success: true, token, user: { name: user.name, email: user.studentId, role: user.role } };
    }
  } else { // Admin or Teacher
    user = mockUsers.find(u => u.role === role && u.email === identifier);
    if (user && user.passwordHash && bcrypt.compareSync(passwordPlainText, user.passwordHash)) {
      const tokenPayload = { id: user.id, role: user.role, name: user.name };
      const token = createMockToken(tokenPayload);
      if (typeof window !== 'undefined') localStorage.setItem('authToken', token);
      return { success: true, token, user: { name: user.name, email: user.email, role: user.role } };
    }
  }
  
  return { success: false, error: 'Invalid credentials' };
};

export const registerStudent = async (studentData: any): Promise<{ success: boolean; error?: string }> => {
  // In a real app, you'd save this to a database.
  // Here we're just showing the hashing.
  const hashedPassword = bcrypt.hashSync(studentData.password, 10);
  console.log("Mock Student Registration:", { ...studentData, password: hashedPassword });
  // Potentially add to mockUsers if needed for the prototype's flow
  return { success: true };
};

export const registerStaff = async (staffData: any): Promise<{ success: boolean; error?: string }> => {
  const hashedPassword = bcrypt.hashSync(staffData.password, 10);
  console.log(`Mock ${staffData.role} Registration:`, { ...staffData, password: hashedPassword });
  // Potentially add to mockUsers
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

export const getCurrentUser = (): { id: string; role: string; name: string; email?: string } | null => {
  const token = getToken();
  if (token) {
    const decoded = decodeMockToken(token);
    if(decoded) {
      const userFromDb = mockUsers.find(u => u.id === decoded.id);
      return {
        id: decoded.id,
        role: decoded.role,
        name: decoded.name,
        email: userFromDb?.email || (userFromDb?.role === 'student' ? (userFromDb as any).studentId : undefined)
      };
    }
  }
  return null;
};

// For API route protection example
export const verifyToken = (token: string): { id: string; role: string; name: string } | null => {
  // In a real app, this would involve cryptographic signature verification using a secret
  // like process.env.JWT_SECRET.
  // For this mock, we just decode it.
  return decodeMockToken(token);
};
