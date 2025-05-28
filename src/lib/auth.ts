import { auth } from './firebase'; // Import Firebase auth instance
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser 
} from "firebase/auth";
import type { Role as UserRole } from '@/config/nav';

// Note: The mockUsers array, bcrypt, and jsonwebtoken are no longer needed
// as Firebase Authentication will handle user storage, password hashing, and session management.

interface AppUser {
  uid: string;
  email: string | null;
  name?: string | null; // Firebase user might have displayName
  role: UserRole; // We'll need to determine how to store/retrieve roles with Firebase
                  // For now, we might infer or have a default for newly registered users.
}

// Login using Firebase
export const login = async (identifier: string, passwordPlainText: string, role: UserRole): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    // For student login, we're assuming identifier is email for now, as Firebase Auth uses email.
    // If Student ID login is a hard requirement, it needs a custom lookup or custom claims.
    const email = identifier; // Assuming identifier is email for all roles for Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, passwordPlainText);
    const firebaseUser = userCredential.user;

    // TODO: Role verification. After login, you might need to check if the user's role
    // (stored in Firestore or custom claims) matches the expected 'role' argument.
    // For this initial refactor, we'll assume the login is valid if Firebase auth succeeds.
    // A more robust solution would involve checking a 'role' field in Firestore associated with the user's UID.
    
    // For simplicity, we'll assign the role they logged in as.
    // This is NOT secure and needs to be replaced with actual role data from your database (e.g., Firestore)
    // or custom claims set on the Firebase user.
    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email, // Use displayName or email
      role: role // THIS IS A SIMPLIFICATION - DO NOT USE IN PRODUCTION
    };
    
    // Firebase SDK handles token management internally.
    // The cookie setting for middleware.ts might need to be revisited later for server-side rendering protection.
    // For now, client-side DashboardLayout will handle auth state.
    // Cookies.remove('authToken', { path: '/' }); // Clear old custom token if any
    // Cookies.set('firebaseSession', 'true', { expires: 1/24, path: '/' }); // Example: indicating a Firebase session

    return { success: true, user: appUser };
  } catch (error: any) {
    console.error("Firebase login error:", error);
    return { success: false, error: error.message || 'Login failed' };
  }
};

// Register student using Firebase
export const registerStudent = async (studentData: any): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, studentData.password);
    const firebaseUser = userCredential.user;
    // TODO: Store additional student details (studentId, rollNumber, department, etc.)
    // in Firestore, linked by firebaseUser.uid.
    // And set their role in Firestore.
    console.log("Firebase Student Registered:", firebaseUser.uid, "Additional data to store:", studentData);
    
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
    // TODO: Store additional staff details (department for teacher)
    // in Firestore, linked by firebaseUser.uid.
    // And set their role (admin/teacher) in Firestore.
    console.log(`Firebase ${staffData.role} Registered:`, firebaseUser.uid, "Additional data to store:", staffData);

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
    // Cookies.remove('firebaseSession', { path: '/' }); // Clear session indicator
    // localStorage.removeItem('currentUser'); // Clear any local user storage
  } catch (error) {
    console.error("Firebase logout error:", error);
  }
};

// Get current user state using Firebase
// The callback will be invoked with the FirebaseUser or null
export const onAuthUserChanged = (callback: (user: FirebaseUser | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

// Note: The original getToken, getCurrentUser, verifyToken functions are removed
// as Firebase SDK handles token management. For API route protection, you'd typically
// verify a Firebase ID token passed from the client. This would involve Firebase Admin SDK
// on the backend, which is beyond this client-side refactor.

/**
 * SECURITY NOTE ON CSRF (Cross-Site Request Forgery):
 * Firebase Authentication uses various mechanisms (like ID tokens) that, when used correctly
 * (e.g., verifying ID tokens on the backend for API calls), help mitigate CSRF risks.
 * If implementing custom session cookie solutions with Firebase, ensure standard CSRF protections
 * (like CSRF tokens) are in place for state-changing backend operations.
 * Next.js Server Actions have built-in CSRF protection.
 */