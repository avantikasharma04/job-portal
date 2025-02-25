import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { auth, db } from "../../src/services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PostJobScreen = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePostJob = async () => {
    const employer = auth.currentUser; // Get logged-in employer

    if (!employer) {
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
        employerId: employer.uid,
        title: jobTitle,
        location: location,
        salary: salary,
        requirements: requirements,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Job posted successfully!");
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
    <ScrollView style={{ padding: 16 }}>
      <Title>Post a Job</Title>
      <TextInput label="Job Title" value={jobTitle} onChangeText={setJobTitle} style={{ marginBottom: 10 }} />
      <TextInput label="Location" value={location} onChangeText={setLocation} style={{ marginBottom: 10 }} />
      <TextInput label="Salary" value={salary} onChangeText={setSalary} style={{ marginBottom: 10 }} />
      <TextInput label="Requirements" value={requirements} onChangeText={setRequirements} multiline style={{ marginBottom: 10 }} />

      <Button mode="contained" onPress={handlePostJob} loading={loading} disabled={loading}>
        {loading ? "Posting..." : "Post Job"}
      </Button>
    </ScrollView>
  );
};

export default PostJobScreen;
