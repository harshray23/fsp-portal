
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
import jwt from 'jsonwebtoken'; // For mock backend token verification example

// IMPORTANT: In a real production app with a backend, JWT_SECRET would be a server-side environment variable
// and NEVER exposed to the client. The process.env.JWT_SECRET here is used by the mock `verifyToken` function
// below, which simulates what a backend API route would do.
const JWT_MOCK_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-for-mock-only';

interface AppUser {
  uid: string;
  email: string | null;
  name?: string | null;
  role: UserRole; 
}

/**
 * Logs in a user using Firebase Authentication.
 * The Firebase ID token obtained here is a signed JWT issued by Firebase.
 */
export const login = async (identifier: string, passwordPlainText: string, role: UserRole): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const email = identifier; 
    const userCredential = await signInWithEmailAndPassword(auth, email, passwordPlainText);
    const firebaseUser = userCredential.user;
    
    const token = await firebaseUser.getIdToken(); // This IS the Firebase ID Token (a JWT)
    
    // Storing the Firebase ID Token in a client-accessible cookie for middleware.
    // PRODUCTION SECURITY NOTE on HttpOnly cookies is detailed below.
    Cookies.set('authToken', token, { expires: 1, path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'lax' }); 

    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email,
      role: role 
    };
    
    return { success: true, user: appUser };
  } catch (error: any) {
    console.error("Firebase login error:", error);
    Cookies.remove('authToken', { path: '/' }); 
    return { success: false, error: 'Invalid credentials.' }; 
  }
};

export const registerStudent = async (studentData: any): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, studentData.password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: studentData.name });
    
    // In a real app, additional student details (studentId, rollNumber, department, role: 'student')
    // would be stored in a database like Firestore, linked by firebaseUser.uid.
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

    // In a real app, additional staff details (department for teacher, role: staffData.role)
    // would be stored in Firestore, linked by firebaseUser.uid.
    // Custom claims could also be set via Firebase Admin SDK to manage roles securely.
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
    localStorage.removeItem('token'); // Clear any other legacy or non-HttpOnly token
  } catch (error) {
    console.error("Firebase logout error:", error);
    Cookies.remove('authToken', { path: '/' }); 
    localStorage.removeItem('token');
  }
};

export const onAuthUserChanged = (callback: (user: FirebaseUser | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

/**
 * MOCK TOKEN VERIFICATION - SIMULATES BACKEND LOGIC
 * This function is a placeholder to demonstrate how a backend API route might verify a JWT.
 * It is NOT used for the primary login/registration flow, which relies on Firebase Authentication.
 * In a real application, token verification MUST happen on a secure server using Firebase Admin SDK
 * (for Firebase ID tokens) or a library like 'jsonwebtoken' with a server-side secret (for custom JWTs).
 * The JWT_MOCK_SECRET used here would be a server-side environment variable (e.g., process.env.JWT_SECRET)
 * and NEVER exposed to the client-side if this were real backend code.
 */
export const verifyToken = (token: string): AppUser | null => {
  try {
    // This simulates a backend verifying a token it might have issued.
    // For Firebase ID tokens (which are in 'authToken' cookie), verification uses Firebase Admin SDK.
    // This example uses 'jsonwebtoken' as if it were a custom JWT flow.
    const decoded = jwt.verify(token, JWT_MOCK_SECRET) as any; 
    return { 
      uid: decoded.uid, 
      email: decoded.email, 
      name: decoded.name, 
      role: decoded.role 
    };
  } catch (error) {
    console.error("Mock token verification error (simulating backend):", error);
    return null;
  }
};

/**
 * =========================================================================
 * PRODUCTION SECURITY NOTES (IMPORTANT!)
 * =========================================================================
 * 
 * 1. HttpOnly Cookies for Session Tokens:
 *    - The current prototype uses a client-set cookie ('authToken') for middleware convenience.
 *      This cookie, containing the Firebase ID Token, is accessible to client-side JavaScript.
 *    - FOR PRODUCTION: Transition to HttpOnly, Secure, SameSite cookies. This requires a backend
 *      component (e.g., a Next.js API route or Server Action) to:
 *      a. Receive the Firebase ID Token from the client after Firebase SDK login.
 *      b. Verify this ID Token using the Firebase Admin SDK (`admin.auth().verifyIdToken(idToken)`).
 *      c. Create a Firebase session cookie using `admin.auth().createSessionCookie(idToken, { expiresIn })`.
 *      d. Set this session cookie in the HTTP response with `HttpOnly`, `Secure`, and `SameSite` attributes.
 *    - The middleware would then verify this server-set HttpOnly session cookie using 
 *      `admin.auth().verifySessionCookie(sessionCookie, true)` via the Firebase Admin SDK.
 *    - This protects the session token from XSS attacks.
 *
 * 2. Server-Side Token Verification in Middleware:
 *    - The current `middleware.ts` only checks for the *presence* of the 'authToken' cookie.
 *    - FOR PRODUCTION: The Firebase ID token (or the HttpOnly session cookie) MUST be
 *      cryptographically verified on the server-side (e.g., within the middleware by calling a
 *      backend function that uses Firebase Admin SDK, or directly if middleware can run server-side Node.js code
 *      with Firebase Admin SDK initialized). This confirms the token's integrity, signature, and expiry.
 * 
 * 3. CSRF Protection:
 *    - If using cookie-based sessions (especially HttpOnly cookies), CSRF protection
 *      (e.g., using anti-CSRF tokens like the double submit cookie pattern or synchronizer token pattern)
 *      is essential for all state-changing requests (POST, PUT, DELETE).
 *    - Next.js Server Actions have built-in CSRF protection. For traditional API routes with cookies,
 *      manual implementation or a library is needed.
 * 
 * 4. Rate Limiting & CAPTCHA for Login/Registration:
 *    - Implement rate limiting on login and registration endpoints to prevent brute-force attacks.
 *    - Consider CAPTCHA challenges after several failed attempts.
 *    - This requires backend logic.
 *
 * This prototype uses Firebase client-side SDK for authentication, which is secure for managing
 * Firebase sessions on the client. The notes above pertain to integrating it with custom backends
 * or server-side logic for enhanced security, especially regarding HttpOnly cookies and middleware verification.
 */

