import React from 'react';
import { Button, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext'; // Adjust the path as needed

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
