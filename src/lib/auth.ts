
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
// The old mockUsers, bcrypt, and jsonwebtoken logic is replaced.

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

    // TODO: Role verification. After login, check if the user's role
    // (from Firestore or custom claims) matches the expected 'role' argument.
    // This is crucial for security and preventing users from logging into incorrect dashboards.
    // For this prototype, we're proceeding with the passed role argument.
    
    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email,
      role: role // THIS IS A SIMPLIFICATION - REPLACE WITH ACTUAL ROLE DATA
    };
    
    // Set a simple cookie that middleware.ts can check for route protection
    // The content of the cookie here is just a placeholder. In a real app with server-side
    // token verification, you'd store the actual Firebase ID token or a session token.
    // For Firebase, the SDK manages the actual session; this cookie is just for basic middleware checks.
    Cookies.set('authToken', firebaseUser.uid, { expires: 1, path: '/' }); // Expires in 1 day

    return { success: true, user: appUser };
  } catch (error: any) {
    console.error("Firebase login error:", error);
    // Clear cookie if login fails to prevent inconsistent states
    Cookies.remove('authToken', { path: '/' });
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
    // For example:
    // import { db } from './firebase'; // Assuming db is your Firestore instance
    // import { doc, setDoc } from "firebase/firestore"; 
    // await setDoc(doc(db, "users", firebaseUser.uid), {
    //   email: studentData.email,
    //   name: studentData.name,
    //   studentId: studentData.studentId,
    //   rollNumber: studentData.rollNumber,
    //   department: studentData.department,
    //   phoneNumber: studentData.phoneNumber,
    //   whatsappNumber: studentData.whatsappNumber,
    //   role: 'student' // Explicitly set role
    // });
    console.log("Firebase Student Registered:", firebaseUser.uid, "Additional data to store (conceptually):", studentData);
    
    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: studentData.name || firebaseUser.email, 
      role: 'student' // Default role for this registration type
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
    // For example:
    // await setDoc(doc(db, "users", firebaseUser.uid), {
    //   email: staffData.email,
    //   name: staffData.name,
    //   department: staffData.role === 'teacher' ? staffData.department : null,
    //   role: staffData.role
    // });
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
    // Attempt to clear cookie even if Firebase signout fails
    Cookies.remove('authToken', { path: '/' });
  }
};

// Get current user state using Firebase
// The callback will be invoked with the FirebaseUser or null
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
