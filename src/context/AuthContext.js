import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import { auth, db } from '../services/firebaseConfig';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import * as SecureStore from 'expo-secure-store';

// Create a helper function to delete user data based on the platform
const deleteUserSecurely = async (key) => {
  if (Platform.OS === 'web') {
    // When running on the web, use localStorage
    localStorage.removeItem(key);
  } else {
    // On native (iOS/Android), use SecureStore
    await SecureStore.deleteItemAsync(key);
  }
};

// Create context with null default
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userJson = await SecureStore.getItemAsync('user');
        if (userJson) {
          setUserData(JSON.parse(userJson));
        }
      } catch (e) {
        console.log('Failed to load user from storage', e);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userProfile = userDoc.data();
            setUser(firebaseUser);
            setUserData(userProfile);
            await SecureStore.setItemAsync('user', JSON.stringify(userProfile));
          } else {
            console.log('No user document found!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
        // Use our helper function here
        await deleteUserSecurely('user');
      }
      setLoading(false);
    });

    bootstrapAsync();
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (e) {
      console.error('Login error:', e);
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Use our helper function here as well
      await deleteUserSecurely('user');
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  const loginWithPhone = async (phoneNumber, verificationId, verificationCode) => {
    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
      return true;
    } catch (e) {
      console.error('Phone login error:', e);
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        error,
        login,
        logout,
        loginWithPhone,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
