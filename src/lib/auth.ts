
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser 
} from "firebase/auth";
import type { Role as UserRole } from '@/config/nav';
import Cookies from 'js-cookie'; // For setting cookies for middleware

// This file now uses Firebase Authentication.

interface AppUser {
  uid: string;
  email: string | null;
  name?: string | null;
  role: UserRole; 
}

// Login using Firebase
export const login = async (identifier: string, passwordPlainText: string, role: UserRole): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const email = identifier; 
    const userCredential = await signInWithEmailAndPassword(auth, email, passwordPlainText);
    const firebaseUser = userCredential.user;
    
    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email,
      role: role 
    };
    
    // Set a cookie that middleware.ts can check.
    // The content of the cookie is the Firebase user's UID for simplicity in this prototype.
    // In a production scenario with server-side sessions, this might be a session ID or the ID token itself.
    Cookies.set('authToken', firebaseUser.uid, { expires: 1, path: '/' }); // Expires in 1 day

    return { success: true, user: appUser };
  } catch (error: any) {
    console.error("Firebase login error:", error);
    Cookies.remove('authToken', { path: '/' }); // Clear cookie if login fails
    return { success: false, error: error.message || 'Login failed' };
  }
};

// Register student using Firebase
export const registerStudent = async (studentData: any): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, studentData.password);
    const firebaseUser = userCredential.user;
    
    // TODO: Store additional student details (studentId, rollNumber, department, role: 'student')
    // in Firestore, linked by firebaseUser.uid.
    console.log("Firebase Student Registered:", firebaseUser.uid, "Additional data to store (conceptually):", studentData);
    
    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: studentData.name || firebaseUser.email, 
      role: 'student'
    };
    return { success: true, user: appUser };
  } catch (error: any) {
    console.error("Firebase student registration error:", error);
    return { success: false, error: error.message || 'Registration failed' };
  }
};

// Register staff (admin/teacher) using Firebase
export const registerStaff = async (staffData: any): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, staffData.email, staffData.password);
    const firebaseUser = userCredential.user;

    // TODO: Store additional staff details (department for teacher, role: staffData.role)
    // in Firestore, linked by firebaseUser.uid.
    console.log(`Firebase ${staffData.role} Registered:`, firebaseUser.uid, "Additional data to store (conceptually):", staffData);

    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: staffData.name || firebaseUser.email, 
      role: staffData.role as UserRole 
    };
    return { success: true, user: appUser };
  } catch (error: any) {
    console.error("Firebase staff registration error:", error);
    return { success: false, error: error.message || 'Registration failed' };
  }
};

// Logout using Firebase
export const logout = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    Cookies.remove('authToken', { path: '/' }); // Clear the auth cookie
  } catch (error) {
    console.error("Firebase logout error:", error);
    Cookies.remove('authToken', { path: '/' }); // Ensure cookie is cleared even on error
  }
};

// Get current user state using Firebase
export const onAuthUserChanged = (callback: (user: FirebaseUser | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};


/**
 * SECURITY NOTE ON CSRF (Cross-Site Request Forgery):
 * Firebase Authentication, when used with its client SDK, primarily relies on ID tokens
 * sent in Authorization headers for API calls. This is generally less susceptible to CSRF
 * than traditional cookie-based sessions if APIs are properly secured.
 * If using Firebase session cookies (a more advanced server-side setup), ensure standard CSRF protections
 * (like CSRF tokens or SameSite cookie attributes) are in place for state-changing backend operations.
 * Next.js Server Actions have built-in CSRF protection.
 */
