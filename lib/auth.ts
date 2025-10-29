import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from './firebase-app';

const auth = getAuth(app);

// TODO: FIX THIS

type AuthReturn<Ret> = {
  value: Ret
} | {
  error: { message: string, code: string }
}

// Sign Up
// Returns a Promise<AuthReturn<User>>

// Use in login page:
// const authReturn = await signIn(email, password)
// if (authReturn.error) {handle error}
// else {handle value}

createUserWithEmailAndPassword(auth, "user@example.com", "password123")
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("User signed up:", user.email);
    return user
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Sign up error:", errorCode, errorMessage);
    return error
  });

// Sign In
signInWithEmailAndPassword(auth, "user@example.com", "password123")
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log("User signed in:", user.email);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Sign in error:", errorCode, errorMessage);
  });