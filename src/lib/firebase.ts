// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
// import { getFirestore, type Firestore } from "firebase/firestore"; // Will be used later for Firestore

// TODO: Add your Firebase project's configuration details here
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);
// const db: Firestore = getFirestore(app); // Will be used later for Firestore

export { app, auth /*, db */ };

// Instructions for user:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. In your Project settings > General, find your web app's SDK setup and configuration.
// 3. Create a .env.local file in the root of your project.
// 4. Add your Firebase config values to .env.local, prefixed with NEXT_PUBLIC_:
//    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
//    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
//    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id" // Optional
// 5. Ensure you have enabled Email/Password sign-in in Firebase Authentication > Sign-in method.