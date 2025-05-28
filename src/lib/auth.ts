
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

// For a real backend using JWTs, you would use 'jsonwebtoken' on the server.
// import jwt from 'jsonwebtoken'; 
// const JWT_SECRET = process.env.JWT_SECRET; // Loaded from server-side environment variables

interface AppUser {
  uid: string;
  email: string | null;
  name?: string | null;
  role: UserRole; 
}

/**
 * Logs in a user using Firebase Authentication.
 * The Firebase ID token obtained here is a signed JWT issued by Firebase.
 * This token is then stored in a client-accessible cookie for the middleware to perform basic checks.
 * 
 * PRODUCTION SECURITY NOTE:
 * For enhanced security, especially to use HttpOnly cookies:
 * 1. Client signs in with Firebase SDK.
 * 2. Client sends the Firebase ID Token to a backend API endpoint (e.g., a Next.js API route).
 * 3. Backend verifies the ID token using Firebase Admin SDK (`admin.auth().verifyIdToken(idToken)`).
 * 4. Backend creates a session cookie using `admin.auth().createSessionCookie(idToken, { expiresIn })`.
 * 5. Backend sets this session cookie in the HTTP response with `HttpOnly`, `Secure`, 
 *    `SameSite=Lax` (or `Strict`), and `Path=/` attributes.
 * 6. Subsequent requests to the backend are authenticated using this server-set HttpOnly session cookie,
 *    which the middleware would then verify using `admin.auth().verifySessionCookie(sessionCookie, true)`.
 * 
 * This prototype uses client-side Firebase SDK for auth state and sets a regular cookie 
 * containing the Firebase ID Token for middleware convenience, which is not HttpOnly.
 */
export const login = async (identifier: string, passwordPlainText: string, role: UserRole): Promise<{ success: boolean; user?: AppUser; error?: string }> => {
  try {
    const email = identifier; 
    const userCredential = await signInWithEmailAndPassword(auth, email, passwordPlainText);
    const firebaseUser = userCredential.user;
    
    // This IS the Firebase ID Token (a cryptographically signed JWT issued by Firebase)
    const token = await firebaseUser.getIdToken(); 
    
    // Storing the Firebase ID Token in a client-accessible cookie for middleware.
    // See PRODUCTION SECURITY NOTE above for recommendations on HttpOnly cookies.
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
    // Return a generic error for the UI, avoid exposing specific Firebase error codes directly.
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
    // For this prototype, the role is assumed 'student'.
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
    // Still attempt to clear tokens even if Firebase signout fails
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
  // THIS IS A MOCK VERIFICATION AND IS NOT SECURE FOR PRODUCTION.
  // In a real application, this function would not exist on the client-side.
  // Token verification must happen on a server using Firebase Admin SDK's verifyIdToken()
  // or verifySessionCookie().
  try {
    if(token) {
        // Simplified: if token exists, pass for this mock. Real verification is server-side.
        // Decoding without verification is unsafe. This is just a placeholder.
        // In a real app, this function would live on the server and use Firebase Admin SDK.
        // The role and other details would come from the verified token or associated DB record.
        const mockDecoded = { uid: "mock-uid-from-verify", email: "mock-email@example.com", role: 'student' as UserRole, name: "Mock User"}; // Example
        return mockDecoded; 
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
 * 2. Client sends the Firebase ID Token to your backend (e.g., a Next.js API route or Server Action).
 * 3. Your backend, using the Firebase Admin SDK, verifies the ID token (`admin.auth().verifyIdToken(idToken)`).
 * 4. Upon successful verification, the backend creates a Firebase session cookie using 
 *    `admin.auth().createSessionCookie(idToken, { expiresIn })`.
 * 5. The backend sets this session cookie in the HTTP response with `HttpOnly`, `Secure` (in production),
 *    and `SameSite` attributes (e.g., 'Lax' or 'Strict').
 *    Example (in a Next.js API route):
 *    `res.setHeader('Set-Cookie', serializedSessionCookie);`
 * 6. Subsequent requests from the client to your backend will automatically include this HttpOnly cookie.
 * 7. Your backend middleware or API routes then verify this session cookie using `admin.auth().verifySessionCookie(sessionCookie, true)`.
 * 
 * This pattern moves session management to be server-controlled via HttpOnly cookies, 
 * which is more secure than client-side token storage for sensitive operations.
 * 
 * CSRF Protection:
 * When using cookie-based sessions (especially HttpOnly cookies), CSRF protection (e.g., using anti-CSRF tokens,
 * or leveraging Next.js Server Actions' built-in protection if applicable)
 * is essential for all state-changing requests. Double Submit Cookie pattern or Synchronizer Token Pattern are common.
 * 
 * The current prototype uses client-side Firebase SDK for auth state and a client-set cookie (containing the Firebase ID Token)
 * for middleware convenience. This should be upgraded for production security as outlined above.
 */
    
