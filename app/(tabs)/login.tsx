import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Menu, Divider, Provider as PaperProvider, Surface } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

import { useNavigation } from 'expo-router';
import SignupScreen from "./signup";
import HomeScreen from "./home";
import { createStackNavigator } from "@react-navigation/stack"

const Stack = createStackNavigator();

const AuthScreen = () => {
  const navigation=useNavigation()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Job Seeker");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSignup = () => {
    setError("");
    setMessage("✅ User signed up successfully!");
  };

  const handleLogin = () => {
    setError("");
    setMessage("✅ User logged in successfully!");
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Surface style={styles.formCard}>
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />

          {/* Role Selection Dropdown */}
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.menuButton}
                contentStyle={{ flexDirection: "row-reverse" }}
                icon={() => <MaterialIcons name="arrow-drop-down" size={24} color="black" />}
              >
                {role}
              </Button>
            }
          >
            <Menu.Item onPress={() => setRole("Job Seeker")} title="Job Seeker" />
            <Divider />
            <Menu.Item onPress={() => setRole("Employer")} title="Employer" />
          </Menu>

          <Button mode="contained"  onPress={() => navigation.navigate('HomeScreen')}  style={styles.button}>
            Sign Up
          </Button>
       

          {message ? <Text style={styles.successText}>{message}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Surface>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  formCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  menuButton: {
    marginBottom: 12,
    borderColor: "#6200EE",
  },
  button: {
    marginTop: 10,
  },
  successText: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

const Login1 = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};


export default Login1;

