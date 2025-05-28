
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
// bcryptjs is used by Firebase Auth itself for password handling during user creation if you were storing them manually,
// but for Firebase Auth, password hashing is handled by Firebase.
// We keep bcryptjs here if we ever needed to compare against a stored hash for some custom reason,
// but Firebase Auth handles the primary secure password checking.

// IMPORTANT: In a real production app with a backend, JWT_SECRET would be a server-side environment variable
// and NEVER exposed to the client. This constant is NOT USED by the primary Firebase Authentication flow.
// It was part of a mock 'verifyToken' function for a demo API route.

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
    // PRODUCTION SECURITY NOTE: For enhanced security, especially against XSS,
    // this token should ideally be exchanged for a server-set, HttpOnly session cookie.
    // This requires a backend endpoint that:
    // 1. Receives the Firebase ID Token.
    // 2. Verifies it using Firebase Admin SDK (`admin.auth().verifyIdToken(idToken)`).
    // 3. Creates a session cookie using `admin.auth().createSessionCookie(idToken, { expiresIn })`.
    // 4. Sets this session cookie in an HTTP response with `HttpOnly`, `Secure`, and `SameSite` attributes.
    // The current client-set cookie is a simplified approach for this prototype's middleware.
    Cookies.set('authToken', token, { 
      expires: 1, // 1 day
      path: '/', 
      secure: process.env.NODE_ENV === 'production', // Transmit only over HTTPS in production
      sameSite: 'lax' // Provides some CSRF protection
    }); 

    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email,
      role: role // The role is passed in for this prototype. In prod, it might come from custom claims.
    };
    
    return { success: true, user: appUser };
  } catch (error: any) {
    console.error("Firebase login error:", error);
    Cookies.remove('authToken', { path: '/' }); 
    return { success: false, error: 'Invalid credentials.' }; // Generic error for security
  }
};

export const registerStudent = async (studentData: any): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, studentData.password);
    const firebaseUser = userCredential.user;

    await updateProfile(firebaseUser, { displayName: studentData.name });
    
    // In a real app, additional student details (studentId, rollNumber, department, role: 'student')
    // would be stored in a database like Firestore, linked by firebaseUser.uid.
    // Custom claims could be set via Firebase Admin SDK for robust role management.
    console.log("Firebase Student Registered:", firebaseUser.uid, "Name:", studentData.name);
    
    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: studentData.name || firebaseUser.email, 
      role: 'student'
    };
    return { success: true, user: appUser };
  } catch (error: any)
   {
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
    // Custom claims should be set via Firebase Admin SDK to manage roles securely server-side.
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
    // Ensure cookie and localStorage are cleared even if Firebase signout fails
    Cookies.remove('authToken', { path: '/' }); 
    localStorage.removeItem('token');
  }
};

export const onAuthUserChanged = (callback: (user: FirebaseUser | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

/**
 * MOCK TOKEN VERIFICATION - SIMULATES BACKEND LOGIC FOR A DEMO API ROUTE
 * This function is a placeholder used by the example `/api/secure-info` route.
 * It simulates what a backend would do when verifying a Firebase ID Token.
 * In a real production application:
 * 1. The client would send its Firebase ID Token in the Authorization header to your backend API.
 * 2. Your backend API (e.g., a Next.js API Route, or a separate server) MUST use the
 *    Firebase Admin SDK (`admin.auth().verifyIdToken(tokenString)`) to cryptographically
 *    verify the token's signature, expiry, and integrity.
 * This client-side mock does NOT perform any actual cryptographic verification.
 */
export const verifyToken = (token: string): AppUser | null => {
  if (!token) {
    // console.warn("Mock verifyToken (for demo API): No token provided."); // Too noisy for general use
    return null;
  }

  // In this simplified mock for the demo API, we assume if a token string exists,
  // it's "valid" for the demo's purpose. The actual user details (UID, email, roles via custom claims)
  // would be extracted from the token by the Firebase Admin SDK on the backend.
  // The `/api/secure-info` route expects an 'admin' role, so we return that here.
  // console.warn(
  //   "Mock verifyToken (for demo API): This is a mock function simulating token verification. " +
  //   "Real verification uses Firebase Admin SDK on a backend."
  // );
  return {
    uid: 'mock-uid-from-simulated-verification',
    email: 'simulated-admin@example.com', 
    name: 'Simulated Admin (from Mock Verification)',
    role: 'admin', // Hardcoded for the demo API which checks for 'admin' role
  };
};


/**
 * =========================================================================
 * PRODUCTION SECURITY NOTES (IMPORTANT!)
 * =========================================================================
 * 
 * 1. HttpOnly Cookies for Session Tokens:
 *    - The current prototype uses a client-set cookie ('authToken') containing the Firebase ID Token.
 *      This cookie is accessible to client-side JavaScript.
 *    - FOR PRODUCTION: Transition to server-set HttpOnly, Secure, SameSite cookies. This requires a backend
 *      component (e.g., a Next.js API route or Server Action) to:
 *      a. Receive the Firebase ID Token from the client after Firebase SDK login.
 *      b. Verify this ID Token using the Firebase Admin SDK (`admin.auth().verifyIdToken(idToken)`).
 *      c. Create a Firebase session cookie using `admin.auth().createSessionCookie(idToken, { expiresIn })`.
 *         (Example: `const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days`)
 *      d. Set this session cookie in the HTTP response with `HttpOnly`, `Secure`, and `SameSite=Lax` (or `Strict`) attributes.
 *         Example with Next.js API route:
 *         `res.setHeader('Set-Cookie', serializedCookie, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', sameSite: 'lax' });`
 *    - The middleware would then verify this server-set HttpOnly session cookie using 
 *      `admin.auth().verifySessionCookie(sessionCookie, true)` via the Firebase Admin SDK.
 *    - This protects the session token from XSS attacks.
 *
 * 2. Server-Side Token Verification in Middleware & API Routes:
 *    - The current `middleware.ts` only checks for the *presence* of the 'authToken' cookie.
 *    - FOR PRODUCTION: The Firebase ID token (or the HttpOnly session cookie) MUST be
 *      cryptographically verified on the server-side (e.g., within the middleware by calling a
 *      backend function that uses Firebase Admin SDK, or directly in API routes).
 *      This confirms the token's integrity, signature, and expiry.
 * 
 * 3. CSRF Protection:
 *    - If using cookie-based sessions (especially HttpOnly cookies), CSRF protection
 *      (e.g., using anti-CSRF tokens like the double submit cookie pattern or synchronizer token pattern)
 *      is essential for all state-changing requests (POST, PUT, DELETE).
 *    - Next.js Server Actions have built-in CSRF protection. For traditional API routes with cookies,
 *      manual implementation or a library might be needed.
 *
 * 4. Rate Limiting & CAPTCHA for Login/Registration:
 *    - Implement rate limiting on login and registration endpoints to prevent brute-force attacks.
 *    - Consider CAPTCHA challenges after several failed attempts.
 *    - This requires backend logic (e.g., using `rate-limiter-flexible` with a store like Redis).
 *
 * 5. Role Management with Custom Claims:
 *    - For robust, secure role-based access control, roles (student, teacher, admin) should ideally be managed
 *      using Firebase Custom Claims. These claims are set via the Firebase Admin SDK on a backend
 *      (e.g., after user registration or by an admin).
 *    - Custom claims are then included in the Firebase ID token and can be securely read on the client
 *      or server (after token verification) to make authorization decisions.
 *    - The current prototype passes the role around on the client or infers it contextually, which is
 *      less secure than server-set custom claims.
 *
 * This prototype uses Firebase client-side SDK for authentication, which is secure for managing
 * Firebase sessions on the client. The notes above pertain to integrating it with custom backends
 * or server-side logic for enhanced security and functionality in a production environment.
 */
