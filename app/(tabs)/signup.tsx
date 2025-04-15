// app/employer/signup.tsx (example path)

import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Text, RadioButton, Checkbox, Surface } from "react-native-paper";
import { useRouter } from 'expo-router';
import { auth, db } from "../../src/services/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignupScreen = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("male");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (!termsAccepted) {
        setError("⚠️ You must accept the terms and conditions.");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("⚠️ Passwords do not match.");
        setLoading(false);
        return;
      }

      if (!email || !password || !name || !phone || !address) {
        setError("⚠️ All fields are required.");
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        phone,
        email,
        address,
        gender,
        userType: "employer",
        createdAt: new Date(),
      });

      setMessage("✅ Signup Successful!");
      router.push("/jobpost");
    } catch (error) {
      console.error("Error during signup:", error);
      setError(`⚠️ ${error.message || "Failed to create account. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.formCard}>
        <Text style={styles.title}>Sign Up as Employer</Text>

        <TextInput label="Full Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
        <TextInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" mode="outlined" style={styles.input} />
        <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" mode="outlined" style={styles.input} />
        <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />
        <TextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry mode="outlined" style={styles.input} />
        <TextInput label="Address" value={address} onChangeText={setAddress} mode="outlined" style={styles.input} />

        <Text style={styles.label}>Select Gender:</Text>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Male" value="male" status={gender === "male" ? "checked" : "unchecked"} onPress={() => setGender("male")} />
          <RadioButton.Item label="Female" value="female" status={gender === "female" ? "checked" : "unchecked"} onPress={() => setGender("female")} />
          <RadioButton.Item label="Other" value="other" status={gender === "other" ? "checked" : "unchecked"} onPress={() => setGender("other")} />
        </View>

        <View style={styles.checkboxContainer}>
          <Checkbox status={termsAccepted ? "checked" : "unchecked"} onPress={() => setTermsAccepted(!termsAccepted)} />
          <Text onPress={() => setTermsAccepted(!termsAccepted)} style={styles.checkboxText}>
            I accept the Terms & Conditions
          </Text>
        </View>

        <Button mode="contained" onPress={handleSignup} style={styles.button} loading={loading} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>

        {message ? <Text style={styles.successText}>{message}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Surface>
    </ScrollView>
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
