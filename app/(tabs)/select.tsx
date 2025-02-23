// First, create a new file called JobPreferencePage.js
// src/screens/JobPreferencePage.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Mic, Volume2 } from 'lucide-react';
import * as Speech from 'expo-speech';

const JobPreferencePage = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const translations = {
    en: {
      title: "Select Your Preferred Job",
      instruction: "Tap the microphone and speak the job you want",
      listen: "Listening...",
      confirm: "Is this the job you want?",
      yes: "Yes",
      no: "No",
      playDescription: "Tap to hear job description"
    },
    hi: {
      title: "अपनी पसंदीदा नौकरी चुनें",
      instruction: "माइक पर टैप करें और बताएं आप कौन सी नौकरी करना चाहते हैं",
      listen: "सुन रहा हूं...",
      confirm: "क्या यह वह नौकरी है जो आप चाहते हैं?",
      yes: "हां",
      no: "नहीं",
      playDescription: "नौकरी का विवरण सुनने के लिए टैप करें"
    }
  };

  const jobs = {
    en: [
      { id: 'maid', title: 'House Maid', description: 'Cleaning, cooking, and household work' },
      { id: 'driver', title: 'Driver', description: 'Driving and vehicle maintenance' },
      { id: 'cook', title: 'Cook', description: 'Cooking and food preparation' },
      { id: 'security', title: 'Security Guard', description: 'Building and property security' },
      { id: 'gardener', title: 'Gardener', description: 'Garden maintenance and plant care' }
    ],
    hi: [
      { id: 'maid', title: 'घरेलू कामगार', description: 'सफाई, खाना बनाना और घर का काम' },
      { id: 'driver', title: 'ड्राइवर', description: 'गाड़ी चलाना और रखरखाव' },
      { id: 'cook', title: 'रसोइया', description: 'खाना पकाना और तैयारी' },
      { id: 'security', title: 'सुरक्षा गार्ड', description: 'भवन और संपत्ति की सुरक्षा' },
      { id: 'gardener', title: 'माली', description: 'बागवानी और पौधों की देखभाल' }
    ]
  };

  const getText = (key) => translations[selectedLanguage][key];

  const playJobDescription = async (job) => {
    try {
      const description = job.description;
      const language = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
      await Speech.speak(description, { language });
    } catch (error) {
      console.error('Error playing description:', error);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // For now, we'll simulate selection after a delay
    setTimeout(() => {
      setIsListening(false);
      setSelectedJob(jobs[selectedLanguage][0]);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getText('title')}</Text>
      </View>

      <View style={styles.voiceSection}>
        <Text style={styles.instruction}>{getText('instruction')}</Text>
        <TouchableOpacity
          onPress={handleVoiceInput}
          style={[styles.micButton, isListening && styles.micButtonActive]}
        >
          <View style={styles.micIconContainer}>
            <Text>🎤</Text>
          </View>
        </TouchableOpacity>
        {isListening && (
          <Text style={styles.listeningText}>{getText('listen')}</Text>
        )}
      </View>

      <View style={styles.jobList}>
        {jobs[selectedLanguage].map((job) => (
          <TouchableOpacity
            key={job.id}
            style={[
              styles.jobCard,
              selectedJob?.id === job.id && styles.selectedJobCard
            ]}
            onPress={() => setSelectedJob(job)}
          >
            <Text style={styles.jobTitle}>{job.title}</Text>
            <TouchableOpacity
              onPress={() => playJobDescription(job)}
              style={styles.speakerButton}
            >
              <Text>🔊</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {selectedJob && (
        <View style={styles.confirmationSection}>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.buttonText}>{getText('yes')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.rejectButton}
            onPress={() => setSelectedJob(null)}
          >
            <Text style={styles.buttonText}>{getText('no')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  voiceSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  micButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: '#FF3B30',
  },
  micIconContainer: {
    alignItems: 'center',
  },
  listeningText: {
    marginTop: 10,
    color: '#FF3B30',
  },
  jobList: {
    padding: 10,
  },
  jobCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedJobCard: {
    borderColor: '#007AFF',
    backgroundColor: '#e8f0fe',
  },
  jobTitle: {
    fontSize: 18,
  },
  speakerButton: {
    padding: 10,
  },
  confirmationSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  confirmButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobPreferencePage;