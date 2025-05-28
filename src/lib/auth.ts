
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

// bcryptjs was previously used for client-side password hashing in mock auth.
// With Firebase Auth, Firebase handles password hashing securely on its servers.

export interface AppUser {
  uid: string;
  email: string | null;
  name?: string | null;
  role: UserRole; // In production, this should come from verified Firebase Custom Claims.
}

/**
 * Logs in a user using Firebase Authentication.
 */
export const login = async (identifier: string, passwordPlainText: string, role: UserRole): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const email = identifier; 
    const userCredential = await signInWithEmailAndPassword(auth, email, passwordPlainText);
    const firebaseUser = userCredential.user;
    
    const token = await firebaseUser.getIdToken();
    
    // For middleware route protection in this prototype, we set the Firebase ID Token in a client-accessible cookie.
    // PRODUCTION SECURITY (HttpOnly Cookies): For enhanced security against XSS, the Firebase ID Token
    // should be sent to a backend endpoint. That backend (using Firebase Admin SDK) would verify the ID token,
    // then create a session cookie (e.g., using admin.auth().createSessionCookie()) and set it in an HTTP response
    // with `HttpOnly`, `Secure`, and `SameSite` attributes. The middleware would then verify this server-set HttpOnly session cookie.
    // This is the most secure method as HttpOnly cookies are not accessible via client-side JavaScript.
    Cookies.set('authToken', token, { 
      expires: 1, // 1 day
      path: '/', 
      secure: process.env.NODE_ENV === 'production', // Transmit only over HTTPS in production
      sameSite: 'lax' // Provides some CSRF protection
    }); 

    // PRODUCTION AUTHORIZATION (Firebase Custom Claims): For robust role-based access control,
    // roles (student, teacher, admin) should be managed using Firebase Custom Claims.
    // These claims are set server-side (via Firebase Admin SDK, e.g., after registration or by an admin).
    // Custom claims are included in the ID token and can be securely read on the client or server
    // (after token verification) to make authorization decisions. This prototype infers role from
    // login context, which is less secure than server-set custom claims.
    // Example: const customClaims = (await firebaseUser.getIdTokenResult()).claims;
    // const userRoleFromClaims = customClaims.role || role; // Fallback if claims not set
    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email,
      role: role // In production, this should be derived from customClaims
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
    
    // In a real app, additional student details (studentId, rollNumber, department)
    // would be stored in a database like Firestore, linked by firebaseUser.uid.
    // The 'role' ('student') should be set as a Firebase Custom Claim via the Admin SDK for security.
    // Example (server-side, e.g., in a Cloud Function triggered on user creation):
    // await admin.auth().setCustomUserClaims(firebaseUser.uid, { role: 'student' });
    console.log("Firebase Student Registered:", firebaseUser.uid, "Name:", studentData.name);
    
    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: studentData.name || firebaseUser.email, 
      role: 'student' // Role should be set via Custom Claims in production.
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

    // In a real app, additional staff details (department for teacher)
    // would be stored in Firestore, linked by firebaseUser.uid.
    // The role (staffData.role) should be set as a Firebase Custom Claim via the Admin SDK for security.
    // Example (server-side):
    // await admin.auth().setCustomUserClaims(firebaseUser.uid, { role: staffData.role });
    console.log(`Firebase ${staffData.role} Registered:`, firebaseUser.uid, "Name:", staffData.name);

    const appUser: AppUser = { 
      uid: firebaseUser.uid, 
      email: firebaseUser.email,
      name: staffData.name || firebaseUser.email, 
      role: staffData.role as UserRole // Role should be set via Custom Claims in production.
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
 * MOCK TOKEN VERIFICATION for the demo /api/secure-info route.
 * This function SIMULATES backend logic. In a real production application:
 * 1. The client would send its Firebase ID Token in the Authorization header to your backend API.
 * 2. Your backend API (e.g., a Next.js API Route, or a separate server) MUST use the
 *    Firebase Admin SDK (`admin.auth().verifyIdToken(tokenString)`) to cryptographically
 *    verify the token's signature, expiry, and integrity.
 * This client-side mock does NOT perform any actual cryptographic verification.
 * A JWT_SECRET from .env is NOT used here because Firebase ID tokens are verified using Firebase's public keys.
 * This function only serves to illustrate where backend verification would occur.
 */
export const verifyToken = (token: string): AppUser | null => {
  if (!token) {
    return null;
  }
  // This is a MOCK. A real backend would use Firebase Admin SDK to verify the Firebase ID token.
  // Example: const decodedToken = await admin.auth().verifyIdToken(token);
  // Then, it would extract UID, email, and custom claims (for role).
  // const userRoleFromClaims = decodedToken.role || 'unknown'; 
  
  // For this demo, we'll assume any non-empty token string passed here is "valid"
  // and belongs to an admin, as the demo /api/secure-info route expects an admin.
  // This is a placeholder and does NOT represent secure token validation.
  return {
    uid: 'mock-uid-simulating-backend-verification',
    email: 'simulated-admin-from-backend@example.com', 
    name: 'Simulated Admin (Backend Mock Verification)',
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
 *         `res.setHeader('Set-Cookie', serializedCookie);`
 *    - The middleware (`src/middleware.ts`) would then verify this server-set HttpOnly session cookie using 
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
 *    - If using server-set cookie-based sessions (especially HttpOnly cookies), CSRF protection
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
 * 5. Role Management with Firebase Custom Claims:
 *    - For robust, secure role-based access control, roles (student, teacher, admin) should be managed
 *      using Firebase Custom Claims. These claims are set via the Firebase Admin SDK on a backend
 *      (e.g., after user registration or by an admin).
 *    - Custom claims are then included in the Firebase ID token and can be securely read on the client
 *      (e.g., using `firebaseUser.getIdTokenResult().then(idTokenResult => idTokenResult.claims.role)`)
 *      or server (after token verification via Admin SDK) to make authorization decisions.
 *    - The current prototype passes the role around on the client or infers it contextually, which is
 *      less secure than server-set custom claims.
 *
 * This prototype uses Firebase client-side SDK for authentication, which is secure for managing
 * Firebase sessions on the client. The notes above pertain to integrating it with custom backends
 * or server-side logic for enhanced security and functionality in a production environment.
 */
