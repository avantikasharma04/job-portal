// LogoutButton.tsx
import React from 'react';
import { Button, View } from 'react-native';
import { auth } from '../../src/services/firebaseConfig'; // Adjust path as needed

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={{ marginRight: 10 }}>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
};

export default LogoutButton;
