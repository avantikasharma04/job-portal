import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Mic, AlertCircle, User, Phone, MapPin, Volume2 } from "lucide-react";
import * as Speech from "expo-speech";
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "./home";
import { useNavigation } from "expo-router";
import SignupScreen from "./signup";
import speechToTextService from '../../src/services/speechToTextService';
import jobService from '../../src/services/jobService';

const Stack = createStackNavigator();

const OnboardingFlow = () => {
  const navigation = useNavigation()
  const [step, setStep] = useState("language");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    location: "",
    userType: "",
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
      job: "Job",
      job1: "Are you an employer or employee?",
      userTypeQuestion: "Are you an employer or employee?",
      employer: "Employer",
      employee: "Employee",
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
      job: "नौकरी",
      job1: "क्या आप एक नियोक्ता या कर्मचारी हैं?",
      userTypeQuestion: "क्या आप एक नियोक्ता या कर्मचारी हैं?",
      employer: "नियोक्ता",
      employee: "कर्मचारी",
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

  const speakText = (text) => {
    const language = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
    Speech.speak(text, { language });
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

  const handleVoiceInput = async (field) => {
    try {
      setIsListening(true);
  
      // Get the appropriate language code based on selected language
      const languageCode = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
  
      // Start recording
      const speech = await speechToTextService.recognizeSpeech(languageCode);
  
      // Wait for 3 seconds to get enough speech input
      setTimeout(async () => {
        try {
          // Stop recording and get transcription
          const result = await speech.stop();
          setIsListening(false);
  
          // Log the result object to inspect its structure
          console.log('Speech recognition result:', result);
  
          if (result.success) {
            // Check if result.text exists and has a transcription property
            if (result.transcription && result.transcription.transcription) {
              const transcription = result.transcription.transcription;
              const spokenText = transcription.toLowerCase();
  
              if (field === 'job') {
                // For job field, try to match with available jobs or create custom job
                let matchedJob = null;
  
                // Try to find a matching job in our predefined list
                for (const job of jobs[selectedLanguage]) {
                  if (
                    job.title.toLowerCase().includes(spokenText) ||
                    spokenText.includes(job.title.toLowerCase())
                  ) {
                    matchedJob = job;
                    break;
                  }
                }
  
                // If no match found, create a custom job entry
                if (!matchedJob && spokenText.length > 0) {
                  matchedJob = {
                    id: 'custom',
                    title: transcription, // Use the original transcription (not lowercase)
                    description: getText('customJobDescription') || 'Custom job based on voice input',
                  };
                }
  
                if (matchedJob) {
                  setSelectedJob(matchedJob);
                } else {
                  // If no match and no clear speech detected
                  alert(
                    translations[selectedLanguage]?.noSpeechDetected ||
                    'No speech detected. Please try again.'
                  );
                }
              } else {
                // For other fields (name, phone, location), directly update the state
                setUserData((prev) => ({
                  ...prev,
                  [field]: transcription, // Use the original transcription (not lowercase)
                }));
              }
            } else {
              console.error('Transcription is missing in the result:', result);
              alert(
                translations[selectedLanguage]?.speechRecognitionFailed ||
                'Speech recognition failed. Please try again.'
              );
            }
          } else {
            console.error('Speech recognition failed:', result.error);
            alert(
              translations[selectedLanguage]?.speechRecognitionFailed ||
              'Speech recognition failed. Please try again.'
            );
          }
        } catch (error) {
          console.error('Error in voice input handling:', error);
          setIsListening(false);
        }
      }, 3000);
    } catch (error) {
      console.error('Error starting voice input:', error);
      setIsListening(false);
    }
  };
  
const handleFinalSubmission = async () => {
  try {
    // Prepare complete user data
    const completeUserData = {
      ...userData,
      language: selectedLanguage,
      jobPreference: selectedJob.title,
      jobDescription: selectedJob.description,
      userType: 'employee' // Since this is for job seekers
    };

    // First create the user profile
    const profileResult = await jobService.createUserProfile(completeUserData);

    if (!profileResult.success) {
      throw new Error('Failed to create user profile');
    }

    // Then create a job listing if this is an employee
    if (userData.userType === 'employee') {
      const jobData = {
        jobTitle: selectedJob.title,
        jobDescription: selectedJob.description,
        userProfile: profileResult.profileId,
        contactPhone: userData.phone,
        location: userData.location,
        name: userData.name,
        language: selectedLanguage
      };

      const jobResult = await jobService.createJobListing(jobData);

      if (!jobResult.success) {
        throw new Error('Failed to create job listing');
      }
    }

    // Navigate to home screen on success
    console.log("Final submission successful");
    navigation.navigate('HomeScreen');

  } catch (error) {
    console.error('Error in final submission:', error);
    alert('There was an error saving your information. Please try again.');
  }
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
        <View style={styles.inputActions}>
          <TouchableOpacity onPress={() => speakText(getText("speakName"))} style={styles.speakerButton}>
            <Volume2 size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleVoiceInput("name")}>
            <Mic size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputBox}>
        <Phone size={20} color="#666" />
        <Text style={styles.inputText}>{getText("speakPhone")}</Text>
        <View style={styles.inputActions}>
          <TouchableOpacity onPress={() => speakText(getText("speakPhone"))} style={styles.speakerButton}>
            <Volume2 size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleVoiceInput("phone")}>
            <Mic size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputBox}>
        <MapPin size={20} color="#666" />
        <Text style={styles.inputText}>{getText("speakLocation")}</Text>
        <View style={styles.inputActions}>
          <TouchableOpacity onPress={() => speakText(getText("speakLocation"))} style={styles.speakerButton}>
            <Volume2 size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleVoiceInput("location")}>
            <Mic size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeTitle}>{getText("userTypeQuestion")}</Text>
        <TouchableOpacity 
          onPress={() => speakText(getText("userTypeQuestion"))} 
          style={styles.titleSpeakerButton}
        >
          <Volume2 size={20} color="#666" />
        </TouchableOpacity>
        <View style={styles.userTypeButtons}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userData.userType === "employer" && styles.selectedUserType
            ]}
            onPress={() => setUserData(prev => ({ ...prev, userType: "employer" }))}
          >
            <Text style={[
              styles.userTypeText,
              userData.userType === "employer" && styles.selectedUserTypeText
            ]}>
              {getText("employer")}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userData.userType === "employee" && styles.selectedUserType
            ]}
            onPress={() => setUserData(prev => ({ ...prev, userType: "employee" }))}
          >
            <Text style={[
              styles.userTypeText,
              userData.userType === "employee" && styles.selectedUserTypeText
            ]}>
              {getText("employee")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.continueButton,
          !userData.userType && styles.disabledButton
        ]} 
        onPress={()=>
          {if (userData.userType === "employer") {
            navigation.navigate("SignupScreen"); // Navigate to employer screen
          } else if (userData.userType === "employee") {
            setStep("job"); // Navigate to employee screen
          } else {
            alert("Please select a user type first!");
          }}
        }
        //onPress={() => userData.userType && setStep("job")}
      >
        <Text style={styles.continueText}>{getText("continue")}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderJobSelection = () => (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>{getText('selectJob')}</Text>
        <TouchableOpacity onPress={() => speakText(getText('selectJob'))} style={styles.titleSpeakerButton}>
          <Volume2 size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.voiceSection}>
        <Text style={styles.instruction}>{getText('jobInstruction')}</Text>
        <TouchableOpacity onPress={() => speakText(getText('jobInstruction'))} style={styles.instructionSpeakerButton}>
          <Volume2 size={20} color="#666" />
        </TouchableOpacity>
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
              <Volume2 size={20} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {selectedJob && (
        <View style={styles.confirmationSection}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleFinalSubmission}
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
  inputActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  speakerButton: {
    marginRight: 15,
  },
  userTypeContainer: {
    marginTop: 20,
    marginBottom: 10,
    position: "relative",
  },
  userTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  titleSpeakerButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  instructionSpeakerButton: {
    marginBottom: 10,
  },
  userTypeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  userTypeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  selectedUserType: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  userTypeText: {
    fontSize: 16,
    color: "#333",
  },
  selectedUserTypeText: {
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.5,
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
    position: 'relative',
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
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default HomeScreen1;