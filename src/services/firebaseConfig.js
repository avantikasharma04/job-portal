// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB-DiDKI66LJfxDT1TCwkjXnaHQmTtVUg",
  authDomain: "jobportal01-2c9ed.firebaseapp.com",
  projectId: "jobportal01-2c9ed",
  storageBucket: "jobportal01-2c9ed.appspot.com", 
  messagingSenderId: "27322884453",
  appId: "1:27322884453:web:03b0629155051dd6a1c18c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
// Debugging: Check if Firebase is initialized
console.log("✅ Firebase Initialized Successfully:", app);
