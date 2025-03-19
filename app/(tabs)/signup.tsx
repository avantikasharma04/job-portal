import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Text, RadioButton, Checkbox, Surface, Provider as PaperProvider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack"
import { useNavigation } from 'expo-router';
import AuthScreen from './login';
import { useRouter } from 'expo-router';

const router = useRouter()

const Stack = createStackNavigator();


const SignupScreen = () => {
  const navigation=useNavigation()

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("male"); // Default selection
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = () => {
    setError("");
    setMessage("");

    if (!termsAccepted) {
      setError("⚠️ You must accept the terms and conditions.");
      return;
    }

    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match.");
      return;
    }

    setMessage("✅ Signup Successful!");
  };

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.formCard}>
          <Text style={styles.title}>Sign Up</Text>

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

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            style={styles.input}
          />

          {/* Gender Selection */}
          <Text style={styles.label}>Select Gender:</Text>
          <View style={styles.radioContainer}>
            <RadioButton.Item
              label="Male"
              value="male"
              status={gender === "male" ? "checked" : "unchecked"}
              onPress={() => setGender("male")}
            />
            <RadioButton.Item
              label="Female"
              value="female"
              status={gender === "female" ? "checked" : "unchecked"}
              onPress={() => setGender("female")}
            />
            <RadioButton.Item
              label="Other"
              value="other"
              status={gender === "other" ? "checked" : "unchecked"}
              onPress={() => setGender("other")}
            />
          </View>

          {/* Terms & Conditions Checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={termsAccepted ? "checked" : "unchecked"}
              onPress={() => setTermsAccepted(!termsAccepted)}
            />
            <Text onPress={() => setTermsAccepted(!termsAccepted)} style={styles.checkboxText}>
              I accept the Terms & Conditions
            </Text>
          </View>

          <Button mode="contained" onPress={() => router.push("/login")} style={styles.button}>
            Sign Up
          </Button>

          {message ? <Text style={styles.successText}>{message}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Surface>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
  },
  formCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxText: {
    fontSize: 14,
    marginLeft: 6,
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


export default SignupScreen;


