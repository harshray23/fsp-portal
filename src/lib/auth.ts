
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  type User as FirebaseUser 
} from "firebase/auth";
import type { Role as UserRole } from '@/config/nav';
import Cookies from 'js-cookie'; 
import bcrypt from 'bcryptjs'; // Assuming bcryptjs is used for any legacy non-Firebase password checks if needed
import jwt from 'jsonwebtoken'; // For creating/verifying JWTs if we were managing them manually

// This file now uses Firebase Authentication.

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-default-super-secret-key-for-prototyping';

interface AppUser {
  uid: string;
  email: string | null;
  name?: string | null;
  role: UserRole; 
  // Add any other user properties you need
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
      name: firebaseUser.displayName || firebaseUser.email, // Use displayName if available
      role: role // Role needs to be determined/stored separately, Firebase Auth doesn't store custom roles directly
    };
    
    // For production, consider server-side session management with HttpOnly cookies.
    // The 'authToken' cookie set here is client-accessible and used by middleware.ts for basic route protection.
    // It could store the Firebase ID token or a session identifier if using server-side sessions.
    // For simplicity in this prototype, it might just signify an active session (e.g., storing user UID).
    const token = await firebaseUser.getIdToken();
    Cookies.set('authToken', token, { expires: 1, path: '/' }); // Store Firebase ID token

    return { success: true, user: appUser };
  } catch (error: any) {
    console.error("Firebase login error:", error);
    Cookies.remove('authToken', { path: '/' }); 
    return { success: false, error: error.message || 'Login failed' };
  }
};

// Register student using Firebase
export const registerStudent = async (studentData: any): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, studentData.password);
    const firebaseUser = userCredential.user;

    // Update Firebase user profile with name
    await updateProfile(firebaseUser, { displayName: studentData.name });
    
    // TODO: Store additional student details (studentId, rollNumber, department, role: 'student')
    // in Firestore, linked by firebaseUser.uid.
    // This step is crucial for associating custom data with the Firebase user.
    console.log("Firebase Student Registered:", firebaseUser.uid, "Name:", studentData.name);
    console.log("Firestore TODO: Store for student:", { 
      studentId: studentData.studentId, 
      rollNumber: studentData.rollNumber,
      department: studentData.department,
      phoneNumber: studentData.phoneNumber,
      whatsappNumber: studentData.whatsappNumber,
      role: 'student' 
      // Link this data to firebaseUser.uid in Firestore
    });
    
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

    // Update Firebase user profile with name
    await updateProfile(firebaseUser, { displayName: staffData.name });

    // TODO: Store additional staff details (department for teacher, role: staffData.role)
    // in Firestore, linked by firebaseUser.uid.
    console.log(`Firebase ${staffData.role} Registered:`, firebaseUser.uid, "Name:", staffData.name);
    console.log("Firestore TODO: Store for staff:", { 
      department: staffData.department, // Only if teacher
      role: staffData.role 
      // Link this data to firebaseUser.uid in Firestore
    });

    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: staffData.name || firebaseUser.email, 
      role: staffData.role as UserRole 
    };
    return { success: true, user: appUser };
  } catch (error: any)_token
    console.error("Firebase staff registration error:", error);
    return { success: false, error: error.message || 'Registration failed' };
  }
};

// Logout using Firebase
export const logout = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    Cookies.remove('authToken', { path: '/' }); 
    localStorage.removeItem('token'); // Clearing any legacy or general 'token'
    // Consider also clearing other relevant localStorage items if any
  } catch (error) {
    console.error("Firebase logout error:", error);
    Cookies.remove('authToken', { path: '/' }); 
    localStorage.removeItem('token');
  }
};

// Get current user state using Firebase
// The callback will receive a FirebaseUser object or null.
// You might need to fetch additional user profile data (like role) from Firestore
// based on the firebaseUser.uid.
export const onAuthUserChanged = (callback: (user: FirebaseUser | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};


// Mock token verification (replace with server-side Firebase Admin SDK verification for production)
// This is a simplified client-side "verification" for prototype purposes
// In production, ID tokens should be sent to a backend and verified there.
export const verifyToken = (token: string): AppUser | null => {
  try {
    // For Firebase ID tokens, actual verification must happen on a backend using Firebase Admin SDK.
    // This client-side "verification" is a placeholder.
    // If 'authToken' cookie stores the Firebase ID token, then:
    // const decoded = jwt.decode(token); // Using jwt.decode as client-side verification isn't secure
    // if (decoded && typeof decoded === 'object' && decoded.uid && decoded.email) {
    //   return { uid: decoded.uid, email: decoded.email, role: (decoded.role || 'student') as UserRole, name: decoded.name };
    // }

    // For this prototype, if a token exists, we assume it's valid.
    // The DashboardLayout will fetch the actual Firebase user state.
    if (token) {
        // This is highly insecure for production. It's just to make the API route work in the prototype.
        // A real app would verify the token's signature and expiry against Firebase Admin SDK on the backend.
        const decoded = jwt.decode(token) as any; // Basic decode, no signature verification
         if (decoded && decoded.user_id && decoded.email) {
            // This is a simplified structure, assuming structure of Firebase ID token
            // Roles need to be fetched from your database (e.g. Firestore) based on UID (decoded.user_id)
            // Hardcoding role for this example, which is NOT secure or scalable.
            let role: UserRole = 'student'; // Default
            if (decoded.email === 'harshray2007@gmail.com') role = 'admin'; // Example, extremely insecure
            
            return { uid: decoded.user_id, email: decoded.email, name: decoded.name || decoded.email, role: role };
        }
    }
    return null;
  } catch (error) {
    console.error("Token verification error (mock):", error);
    return null;
  }
};


/**
 * SECURITY NOTE ON CSRF (Cross-Site Request Forgery):
 * Firebase Authentication, when used with its client SDK, primarily relies on ID tokens
 * sent in Authorization headers for API calls. This is generally less susceptible to CSRF
 * than traditional cookie-based sessions if APIs are properly secured.
 * 
 * If you were to implement server-side sessions with HttpOnly cookies (recommended for production),
 * you would need to implement CSRF protection (e.g., using anti-CSRF tokens like csurf or NextAuth.js's built-in protection).
 * Next.js Server Actions also have built-in CSRF protection.
 * 
 * HTTPONLY COOKIES:
 * For enhanced security, especially against XSS attacks trying to steal tokens, sensitive session tokens
 * should be stored in HttpOnly cookies. These cookies can only be set and read by the server, not by client-side JavaScript.
 * Implementing this with Firebase typically involves:
 * 1. A backend endpoint (e.g., Next.js API route) that handles login/registration.
 * 2. This endpoint verifies credentials with Firebase Admin SDK.
 * 3. Upon success, it creates a Firebase session cookie (Admin SDK's `createSessionCookie`) and sets it as an HttpOnly cookie in the response.
 * 4. Subsequent requests to protected server-side resources would have this cookie automatically sent by the browser.
 * 5. Middleware or API routes would then verify this session cookie using the Admin SDK.
 */
