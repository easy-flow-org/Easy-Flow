import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Helper function to check if a value is a placeholder
const isPlaceholder = (value: string | undefined): boolean => {
  if (!value) return true;
  return value.includes('your_') || value.includes('YOUR_') || value === 'your_api_key_here';
};

// Firebase configuration - uses environment variables with fallback to your project values
// For production, update .env.local with actual values (see FIREBASE_SETUP.md)
const firebaseConfig = {
  apiKey: (!isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) || 'AIzaSyDHiiIJ-DCSxvLeBnz5KcPfefYdSufplWs',
  authDomain: (!isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) || 'easy-flow-5a461.firebaseapp.com',
  projectId: (!isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) || 'easy-flow-5a461',
  storageBucket: (!isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) && process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) || 'easy-flow-5a461.firebasestorage.app',
  messagingSenderId: (!isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) && process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || '78582552661',
  appId: (!isPlaceholder(process.env.NEXT_PUBLIC_FIREBASE_APP_ID) && process.env.NEXT_PUBLIC_FIREBASE_APP_ID) || '1:78582552661:web:7bd232e6b19625cbf4dcdc',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to Functions emulator in development (optional)
// if (process.env.NODE_ENV === 'development') {
//   connectFunctionsEmulator(functions, 'localhost', 5001);
// }

// Google provider for sign in / sign up
export const googleProvider = new GoogleAuthProvider();