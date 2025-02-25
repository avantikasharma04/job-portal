// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./src/services/firebaseConfig.js"; // Ensure correct path

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Get Firebase Authentication Token
auth.currentUser?.getIdToken(true).then((idToken) => {
    console.log("Your Firebase Auth Token:", idToken);
}).catch((error) => {
    console.error("Error fetching token:", error);
});
