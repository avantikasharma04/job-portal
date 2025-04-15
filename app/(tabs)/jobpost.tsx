import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { TextInput, Button, Title, Surface, Provider as PaperProvider, Text } from "react-native-paper";
import { auth, db } from "../../src/services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from 'expo-router';
import ProtectedRoute from '../../src/components/protectedRoute';

const PostJobScreen = () => {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        // If no user is logged in, redirect to login
        Alert.alert("Not logged in", "You need to be logged in to post jobs", [
          { text: "OK", onPress: () => router.push("/login") }
        ]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePostJob = async () => {
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to post a job.");
      return;
    }

    if (!jobTitle || !location || !salary || !requirements) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "jobListings"), {
        employerId: currentUser.uid,
        title: jobTitle,
        location: location,
        salary: salary,
        requirements: requirements,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Job posted successfully!", [
        { text: "OK", onPress: () => router.push("/home") }
      ]);
      
      setJobTitle("");
      setLocation("");
      setSalary("");
      setRequirements("");
    } catch (error) {
      console.error("Error posting job:", error);
      Alert.alert("Error", "Could not post job.");
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.formCard}>
          <Title style={styles.title}>Post a Job</Title>
          
          <TextInput 
            label="Job Title" 
            value={jobTitle} 
            onChangeText={setJobTitle} 
            mode="outlined"
            style={styles.input} 
          />
          
          <TextInput 
            label="Location" 
            value={location} 
            onChangeText={setLocation} 
            mode="outlined"
            style={styles.input} 
          />
          
          <TextInput 
            label="Salary" 
            value={salary} 
            onChangeText={setSalary} 
            mode="outlined"
            style={styles.input} 
          />
          
          <TextInput 
            label="Requirements" 
            value={requirements} 
            onChangeText={setRequirements} 
            multiline
            numberOfLines={4}
            mode="outlined"
            style={styles.input} 
          />

          <Button 
            mode="contained" 
            onPress={handlePostJob} 
            loading={loading} 
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Posting..." : "Post Job"}
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => router.push("/home")}
            style={styles.secondaryButton}
          >
            Go to Home
          </Button>
        </Surface>
      </ScrollView>
    </PaperProvider>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  secondaryButton: {
    marginTop: 12,
  }
});

export default PostJobScreen;