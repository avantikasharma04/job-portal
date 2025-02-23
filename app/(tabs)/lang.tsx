import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Mic, AlertCircle, User, Phone, MapPin, Volume2 } from "lucide-react";
import * as Speech from "expo-speech";
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "./home";
import { useNavigation } from "expo-router";

const Stack = createStackNavigator();

const OnboardingFlow = () => {
  const navigation=useNavigation()
  const [step, setStep] = useState("language"); // language -> details -> job
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    location: "",
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const translations = {
    en: {
      selectLanguage: "Select Your Language",
      tapToHear: "Tap on a language to hear it, then select your preferred language",
      aboutYourself: "Tell Us About Yourself",
      name: "Name",
      speakName: "Tap mic to speak your name",
      phone: "Phone Number",
      speakPhone: "Tap mic to speak your phone number",
      location: "Location",
      speakLocation: "Tap mic to speak your location",
      continue: "Continue",
      selectJob: "Select Your Preferred Job",
      jobInstruction: "Tap the microphone and speak the job you want",
      listening: "Listening...",
      confirm: "Is this the job you want?",
      yes: "Yes",
      no: "No",
      playDescription: "Tap to hear job description",
      finish: "Finish",
    },
    hi: {
      selectLanguage: "अपनी भाषा चुनें",
      tapToHear: "भाषा सुनने के लिए टैप करें, फिर अपनी पसंदीदा भाषा चुनें",
      aboutYourself: "अपने बारे में बताएं",
      name: "नाम",
      speakName: "अपना नाम बोलने के लिए माइक पर टैप करें",
      phone: "फ़ोन नंबर",
      speakPhone: "अपना फ़ोन नंबर बोलने के लिए माइक पर टैप करें",
      location: "स्थान",
      speakLocation: "अपना स्थान बोलने के लिए माइक पर टैप करें",
      continue: "जारी रखें",
      selectJob: "अपनी पसंदीदा नौकरी चुनें",
      jobInstruction: "माइक पर टैप करें और बताएं आप कौन सी नौकरी करना चाहते हैं",
      listening: "सुन रहा हूं...",
      confirm: "क्या यह वह नौकरी है जो आप चाहते हैं?",
      yes: "हां",
      no: "नहीं",
      playDescription: "नौकरी का विवरण सुनने के लिए टैप करें",
      finish: "समाप्त करें",
    },
  };

  const languages = [
    { id: "hi", name: "हिंदी (Hindi)", voice: "hi-IN" },
    { id: "en", name: "English", voice: "en-US" },
  ];

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

  const getText = (key) => translations[selectedLanguage]?.[key] || translations.en[key];

  const playLanguageVoice = (language) => {
    Speech.speak(language.name, { language: language.voice });
  };

  const playJobDescription = async (job) => {
    try {
      const description = job.description;
      const language = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
      await Speech.speak(description, { language });
    } catch (error) {
      console.error('Error playing description:', error);
    }
  };

  const handleVoiceInput = (field) => {
    setIsListening(true);
    // Simulate voice input (replace with actual voice recognition logic)
    setTimeout(() => {
      setIsListening(false);
      if (field === 'job') {
        setSelectedJob(jobs[selectedLanguage][0]);
      } else {
        setUserData(prev => ({
          ...prev,
          [field]: `Sample ${field}` // Replace with actual voice input
        }));
      }
    }, 2000);
  };

  const renderLanguageSelection = () => (
    <View>
      <Text style={styles.title}>{getText("selectLanguage")}</Text>
      <View style={styles.alertBox}>
        <AlertCircle size={18} color="#333" />
        <Text style={styles.alertText}>{getText("tapToHear")}</Text>
      </View>

      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.id}
          style={[
            styles.languageButton,
            selectedLanguage === lang.id && styles.selectedLanguage,
          ]}
          onPress={() => {
            setSelectedLanguage(lang.id);
            setStep("details");
          }}
        >
          <Text style={styles.languageText}>{lang.name}</Text>
          <TouchableOpacity onPress={() => playLanguageVoice(lang)}>
            <Mic size={20} color="#666" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderUserDetails = () => (
    <View>
      <Text style={styles.title}>{getText("aboutYourself")}</Text>

      <View style={styles.inputBox}>
        <User size={20} color="#666" />
        <Text style={styles.inputText}>{getText("speakName")}</Text>
        <TouchableOpacity onPress={() => handleVoiceInput("name")}>
          <Mic size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputBox}>
        <Phone size={20} color="#666" />
        <Text style={styles.inputText}>{getText("speakPhone")}</Text>
        <TouchableOpacity onPress={() => handleVoiceInput("phone")}>
          <Mic size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputBox}>
        <MapPin size={20} color="#666" />
        <Text style={styles.inputText}>{getText("speakLocation")}</Text>
        <TouchableOpacity onPress={() => handleVoiceInput("location")}>
          <Mic size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={() => setStep("job")}
      >
        <Text style={styles.continueText}>{getText("continue")}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderJobSelection = () => (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>{getText('selectJob')}</Text>
      </View>

      <View style={styles.voiceSection}>
        <Text style={styles.instruction}>{getText('jobInstruction')}</Text>
        <TouchableOpacity
          onPress={() => handleVoiceInput('job')}
          style={[styles.micButton, isListening && styles.micButtonActive]}
        >
          <View style={styles.micIconContainer}>
            <Text>🎤</Text>
          </View>
        </TouchableOpacity>
        {isListening && (
          <Text style={styles.listeningText}>{getText('listening')}</Text>
        )}
      </View>

      <View style={styles.jobList}>
        {jobs[selectedLanguage]?.map((job) => (
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
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => {
              // Handle final submission
              console.log ("Final submission:", {
                language: selectedLanguage,
                userData,
                selectedJob
              }
            );
            navigation.navigate('HomeScreen')
            }}
            
          >
            
            <Text style={styles.buttonText}>{getText('finish')}</Text>
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

  return (
    <View style={styles.container}>
      {step === "language" && renderLanguageSelection()}
      {step === "details" && renderUserDetails()}
      {step === "job" && renderJobSelection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  alertText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  languageButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedLanguage: {
    borderColor: "#007bff",
    backgroundColor: "#e8f0ff",
  },
  languageText: {
    fontSize: 16,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  continueText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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

const HomeScreen1 = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OnboardingFlow" component={OnboardingFlow} options={{ headerShown: false }} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeScreen1;