import { createContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setUser(userDoc.exists() ? { ...currentUser, ...userDoc.data() } : currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ User Signup Function
  const signUp = async (email, password, name, phone, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Store user in Firestore (common "users" collection)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phone,
        role,
        createdAt: new Date(),
      });

      // ✅ Store in role-specific collection
      if (role === "employer") {
        await setDoc(doc(db, "employerProfile", user.uid), { name, email, phone });
      } else {
        await setDoc(doc(db, "jobSeekerProfile", user.uid), { name, email, phone });
      }

      console.log("✅ User signed up and stored in Firestore.");
      return user;
    } catch (error) {
      console.error("❌ Signup error:", error.message);
      throw error;
    }
  };

  // ✅ User Login Function
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ User logged in.");
    } catch (error) {
      console.error("❌ Login error:", error.message);
      throw error;
    }
  };

  // ✅ User Logout Function
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("✅ User logged out.");
    } catch (error) {
      console.error("❌ Logout error:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, logOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
