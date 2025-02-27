import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert, TextInput } from "react-native";
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
  const [activeField, setActiveField] = useState(null);
  const [spokenText, setSpokenText] = useState(""); // For job selection

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
      micOn: "Microphone is on, please speak...",
      hearInput: "Tap to hear your input",
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
      micOn: "माइक्रोफ़ोन चालू है, कृपया बोलें...",
      hearInput: "अपना इनपुट सुनने के लिए टैप करें",
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

  // Play the input text that the user has spoken
  const playInputText = (field) => {
    let textToSpeak = "";
    let language = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
    
    if (field === 'job') {
      textToSpeak = spokenText || "";
    } else {
      textToSpeak = userData[field] || "";
    }
    
    if (textToSpeak) {
      Speech.speak(textToSpeak, { language });
    }
  };

  // Modified to simulate speech-to-text and update the corresponding field
  const handleVoiceInput = (field) => {
    setIsListening(true);
    setActiveField(field);
    
    // Simulate speech recognition (in a real app, you would use speechToTextService)
    setTimeout(() => {
      setIsListening(false);
      
      let simulatedText = "";
      if (field === 'job') {
        simulatedText = "House Maid";
        setSpokenText(simulatedText);
        
        // Find the corresponding job from the list
        const matchedJob = jobs[selectedLanguage].find(
          job => job.title.toLowerCase().includes(simulatedText.toLowerCase())
        );
        
        if (matchedJob) {
          setSelectedJob(matchedJob);
        } else {
          setSelectedJob(jobs[selectedLanguage][0]); // Default to first job if no match
        }
      } else {
        // For user details fields
        simulatedText = field === 'name' ? 'John Doe' : 
                         field === 'phone' ? '9876543210' : 
                         'Mumbai, India';
                         
        setUserData(prev => ({
          ...prev,
          [field]: simulatedText
        }));
      }
    }, 2000);
  };

  const handleFinalSubmission = () => {
    // Handle final submission logic here
    Alert.alert("Success", "Your profile has been created successfully!");
    navigation.navigate("HomeScreen");
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

      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <User size={20} color="#666" />
          <Text style={styles.inputLabel}>{getText("name")}</Text>
        </View>
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={userData.name}
            onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
            placeholder={getText("speakName")}
          />
          <View style={styles.iconsContainer}>
            <TouchableOpacity 
              onPress={() => handleVoiceInput("name")}
              activeOpacity={0.6}
              style={styles.iconButton}
            >
              <View style={[
                styles.micIconWrapper,
                isListening && activeField === "name" && styles.activeMicWrapper
              ]}>
                <Mic 
                  size={20} 
                  color={isListening && activeField === "name" ? "#fff" : "#666"} 
                />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => playInputText("name")}
              activeOpacity={0.6}
              style={styles.iconButton}
              disabled={!userData.name}
            >
              <View style={[
                styles.speakerIconWrapper,
                !userData.name && styles.disabledIcon
              ]}>
                <Volume2 size={20} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Phone size={20} color="#666" />
          <Text style={styles.inputLabel}>{getText("phone")}</Text>
        </View>
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={userData.phone}
            onChangeText={(text) => setUserData(prev => ({ ...prev, phone: text }))}
            placeholder={getText("speakPhone")}
            keyboardType="phone-pad"
          />
          <View style={styles.iconsContainer}>
            <TouchableOpacity 
              onPress={() => handleVoiceInput("phone")}
              activeOpacity={0.6}
              style={styles.iconButton}
            >
              <View style={[
                styles.micIconWrapper,
                isListening && activeField === "phone" && styles.activeMicWrapper
              ]}>
                <Mic 
                  size={20} 
                  color={isListening && activeField === "phone" ? "#fff" : "#666"} 
                />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => playInputText("phone")}
              activeOpacity={0.6}
              style={styles.iconButton}
              disabled={!userData.phone}
            >
              <View style={[
                styles.speakerIconWrapper,
                !userData.phone && styles.disabledIcon
              ]}>
                <Volume2 size={20} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <MapPin size={20} color="#666" />
          <Text style={styles.inputLabel}>{getText("location")}</Text>
        </View>
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={userData.location}
            onChangeText={(text) => setUserData(prev => ({ ...prev, location: text }))}
            placeholder={getText("speakLocation")}
          />
          <View style={styles.iconsContainer}>
            <TouchableOpacity 
              onPress={() => handleVoiceInput("location")}
              activeOpacity={0.6}
              style={styles.iconButton}
            >
              <View style={[
                styles.micIconWrapper,
                isListening && activeField === "location" && styles.activeMicWrapper
              ]}>
                <Mic 
                  size={20} 
                  color={isListening && activeField === "location" ? "#fff" : "#666"} 
                />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => playInputText("location")}
              activeOpacity={0.6}
              style={styles.iconButton}
              disabled={!userData.location}
            >
              <View style={[
                styles.speakerIconWrapper,
                !userData.location && styles.disabledIcon
              ]}>
                <Volume2 size={20} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeTitle}>{getText("userTypeQuestion")}</Text>
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
            navigation.navigate("SignupScreen"); 
          } else if (userData.userType === "employee") {
            setStep("job"); 
          } else {
            Alert.alert("Error", "Please select a user type first!");
          }}
        }
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
        
        <View style={styles.jobInputContainer}>
          <View style={styles.jobInputRow}>
            <TextInput
              style={styles.jobTextInput}
              value={spokenText}
              onChangeText={setSpokenText}
              placeholder={getText('jobInstruction')}
            />
            <View style={styles.jobIconsContainer}>
              <TouchableOpacity
                onPress={() => handleVoiceInput('job')}
                style={[styles.jobMicButton, isListening && styles.micButtonActive]}
                activeOpacity={0.6}
              >
                <Mic size={20} color={isListening ? "#fff" : "#fff"} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => playInputText('job')}
                style={styles.jobSpeakerButton}
                activeOpacity={0.6}
                disabled={!spokenText}
              >
                <Volume2 size={20} color={!spokenText ? "#ccc" : "#fff"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
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
  // New styles for input containers with text inputs
  inputContainer: {
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
  },
  // Container for mic and speaker icons
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginHorizontal: 4,
  },
  micIconWrapper: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  speakerIconWrapper: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeMicWrapper: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
    transform: [{scale: 1.1}],
  },
  disabledIcon: {
    opacity: 0.5,
    borderColor: '#eee',
  },
  // Job input specific styles
  jobInputContainer: {
    width: '100%',
    marginVertical: 10,
  },
  jobInputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
  },
  jobTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  jobIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobMicButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  jobSpeakerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: '#FF3B30',
  },
  userTypeContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  userTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default HomeScreen1;