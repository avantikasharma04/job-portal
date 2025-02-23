import React, { createContext, useState, useEffect } from "react";
import { auth } from "../services/firebaseConfig";
import { signup, login, logout } from "../services/auth";
import { saveUserProfile, getUserProfile } from "../services/database";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        setUser({ ...firebaseUser, ...userProfile });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to register a new user (Employer or Job Seeker)
  const registerUser = async (email, password, name, phone, role) => {
    try {
      const user = await signup(email, password);
      await saveUserProfile(user.uid, { name, email, phone, role, createdAt: new Date() });
      setUser(user);
      return user;
    } catch (error) {
      console.error("Registration Error:", error.message);
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const user = await login(email, password);
      setUser(user);
      return user;
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, registerUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
