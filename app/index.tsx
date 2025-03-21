// index.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from "expo-router";
import { auth } from '../src/services/firebaseConfig'; // adjust path if needed

const AuthWrapper = () => {
  console.log("AuthWrapper rendered");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log('Auth state changed:', currentUser);
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  

  if (loading) {
    // While waiting for the auth state, show a loading spinner
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // If a user is logged in, redirect to home; otherwise, redirect to onboarding (lang)
  return user ? <Redirect href="/home" /> : <Redirect href="/lang" />;
};

export default AuthWrapper;
