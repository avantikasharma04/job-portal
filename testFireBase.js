import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDB-DiDKI66LJfxDT1TCwkjXnaHQmTtVUg",
  authDomain: "jobportal01-2c9ed.firebaseapp.com",
  projectId: "jobportal01-2c9ed",
  storageBucket: "jobportal01-2c9ed.appspot.com",
  messagingSenderId: "27322884453",
  appId: "1:27322884453:web:03b0629155051dd6a1c18c",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Test Email & Password
const testEmail = "testuser@example.com"; // Change this if needed
const testPassword = "Test@1234";

// ✅ Test Authentication (Create or Sign In User)
async function testAuth() {
  let user;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    user = userCredential.user;
    console.log("✅ New user created:", user.uid);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.warn("⚠️ Email already in use. Signing in instead...");
      const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
      user = userCredential.user;
    } else {
      console.error("❌ Authentication Test Failed:", error.message);
      return;
    }
  }

  // ✅ Add user to Firestore "users" collection
  await addUserToFirestore(user.uid, user.email);
}

// ✅ Add user to Firestore "users" collection
async function addUserToFirestore(userId, email) {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { email, createdAt: new Date() }, { merge: true });
    console.log("✅ Firestore Test Passed: User added to 'users' collection with UID:", userId);
  } catch (error) {
    console.error("❌ Firestore Test Failed:", error.message);
  }
}

// ✅ Run Test
testAuth();
