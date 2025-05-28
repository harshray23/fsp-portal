
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
// bcryptjs is used by Firebase on the backend for password storage.
// For client-side operations involving JWTs (if we weren't using Firebase client SDK directly for session),
// 'jsonwebtoken' would be used here. Since Firebase SDK handles ID tokens, direct use of 'jsonwebtoken'
// for session management is abstracted away by Firebase.
// import jwt from 'jsonwebtoken'; 

// const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-default-super-secret-key-for-prototyping';
// NEXT_PUBLIC_ prefix makes env var available client-side. For a REAL JWT_SECRET used server-side, it MUST NOT have this prefix.

interface AppUser {
  uid: string;
  email: string | null;
  name?: string | null;
  role: UserRole; 
}

export const login = async (identifier: string, passwordPlainText: string, role: UserRole): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const email = identifier; 
    const userCredential = await signInWithEmailAndPassword(auth, email, passwordPlainText);
    const firebaseUser = userCredential.user;
    
    // In a production scenario with a dedicated backend, the backend would verify the Firebase ID token
    // and then issue its own session token, potentially stored in an HttpOnly cookie.
    // For this prototype, we store the Firebase ID token in a client-accessible cookie
    // for the middleware to perform basic route protection.
    const token = await firebaseUser.getIdToken();
    Cookies.set('authToken', token, { expires: 1, path: '/' }); // Expires in 1 day

    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email,
      role: role // Role ideally comes from a custom claim or Firestore
    };
    
    return { success: true, user: appUser };
  } catch (error: any) {
    console.error("Firebase login error:", error);
    Cookies.remove('authToken', { path: '/' }); 
    return { success: false, error: error.code || 'Login failed' }; // Return error.code for potential specific handling if needed, but UI shows generic message
  }
};

export const registerStudent = async (studentData: any): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, studentData.password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: studentData.name });
    
    // TODO: Store additional student details (studentId, rollNumber, department, role: 'student')
    // in Firestore, linked by firebaseUser.uid.
    console.log("Firebase Student Registered:", firebaseUser.uid, "Name:", studentData.name);
    
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

export const registerStaff = async (staffData: any): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, staffData.email, staffData.password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: staffData.name });

    // TODO: Store additional staff details (department for teacher, role: staffData.role)
    // in Firestore, linked by firebaseUser.uid.
    console.log(`Firebase ${staffData.role} Registered:`, firebaseUser.uid, "Name:", staffData.name);

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

export const logout = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    Cookies.remove('authToken', { path: '/' }); 
    localStorage.removeItem('token'); // Clear any other legacy token
  } catch (error) {
    console.error("Firebase logout error:", error);
    Cookies.remove('authToken', { path: '/' }); 
    localStorage.removeItem('token');
  }
};

export const onAuthUserChanged = (callback: (user: FirebaseUser | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

// This function is a placeholder for how a backend might verify a token.
// With Firebase Client SDK, token verification for API calls usually involves
// sending the ID token to a backend, which then uses Firebase Admin SDK to verify it.
export const verifyToken = (token: string): AppUser | null => {
  try {
    // In a real backend: admin.auth().verifyIdToken(token)
    // This client-side mock is NOT secure for actual token validation.
    // For prototype, we're assuming if a token exists and can be "decoded" (not truly verified here), it's okay.
    // const decoded = jwt.decode(token) as any; // jwt.decode only decodes, doesn't verify signature
    // if (decoded && decoded.user_id && decoded.email) {
    //   return { uid: decoded.user_id, email: decoded.email, name: decoded.name || decoded.email, role: (decoded.role || 'student') as UserRole };
    // }
    // The actual 'authToken' cookie contains Firebase ID Token. Secure verification happens on backend.
    // For client-side middleware, we primarily check for existence.
    // DashboardLayout does more robust check with onAuthUserChanged.
    if(token) {
        // Simplified: if token exists, pass for this mock. Real verification is server-side.
        return { uid: "mock-uid", email: "mock-email@example.com", role: 'student', name: "Mock User"}; // Example, not real user data
    }
    return null;
  } catch (error) {
    console.error("Token verification error (mock):", error);
    return null;
  }
};

/**
 * SECURITY NOTE ON HTTPONLY COOKIES & CSRF with FIREBASE:
 * 
 * For production applications, using HttpOnly cookies to store session tokens is highly recommended
 * as it prevents client-side JavaScript from accessing them, mitigating XSS attacks.
 * 
 * With Firebase Authentication, to achieve this:
 * 1. Client logs in using Firebase SDK (email/password, Google, etc.).
 * 2. Client sends the Firebase ID Token to your backend (e.g., a Next.js API route).
 * 3. Your backend, using the Firebase Admin SDK, verifies the ID token.
 * 4. Upon successful verification, the backend creates a Firebase session cookie using 
 *    `admin.auth().createSessionCookie(idToken, { expiresIn })`.
 * 5. The backend sets this session cookie in the HTTP response with `HttpOnly`, `Secure` (in production),
 *    and `SameSite` attributes.
 *    Example (in a Next.js API route):
 *    `res.setHeader('Set-Cookie', serializedSessionCookie);`
 * 6. Subsequent requests from the client to your backend will automatically include this HttpOnly cookie.
 * 7. Your backend middleware or API routes then verify this session cookie using `admin.auth().verifySessionCookie(sessionCookie, true)`.
 * 
 * This pattern moves session management to be server-controlled via HttpOnly cookies, 
 * which is more secure than client-side token storage for sensitive operations.
 * 
 * CSRF Protection:
 * When using cookie-based sessions (especially HttpOnly cookies), CSRF protection (e.g., using anti-CSRF tokens like 
 * csurf or NextAuth.js's built-in protection, or Next.js Server Actions' built-in protection)
 * would be essential for all state-changing requests.
 * 
 * The current prototype uses client-side Firebase SDK for auth state and a client-set cookie for middleware convenience.
 * This is simpler for rapid prototyping but should be upgraded for production security.
 */
