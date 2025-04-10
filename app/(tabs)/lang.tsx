import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Mic, AlertCircle, User, Phone, MapPin, Volume2 } from "lucide-react";
import * as Speech from "expo-speech";
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "./home";
import { useNavigation, useRouter } from "expo-router";
import SignupScreen from "./signup";
import speechToTextService from '../../src/services/speechToTextService';
import jobService from '../../src/services/jobService';
import { TextInput, Button, Modal } from 'react-native';
//import auth from '@react-native-firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import '../../src/services/firebaseConfig';
//import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../../src/services/firebaseConfig';
import { ActivityIndicator } from "react-native";


const router=useRouter();


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
  const [listeningField, setListeningField] = useState(null);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const openPhoneKeypad = () => {
    setPhoneModalVisible(true);
  };
  const [otp, setOtp] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const isValidPhoneNumber = (phone: string): boolean => {
    // Regular expression for a 10-digit number (adjust as needed)
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };
  
  
const sendOTP = async (phone: string): Promise<any> => {
  try {
    const formattedPhone = '+91' + phone;
    
    // Create a reCAPTCHA verifier instance using the compat API.
    // We're explicitly typing the response as string.
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response: string) => {
          console.log("reCAPTCHA solved:", response);
        },
        'expired-callback': () => {
          console.log("reCAPTCHA expired");
        }
      }
    );
    
    // Use the compat API's signInWithPhoneNumber method.
    const confirmation = await auth.signInWithPhoneNumber(formattedPhone, recaptchaVerifier);
    return confirmation;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};
  
  
const verifyOTP = async () => {
  try {
    if (confirmationResult && otp.length > 0) {
      const userCredential = await confirmationResult.confirm(otp);
      console.log('Phone number verified successfully!', userCredential);
      console.log("Current user (raw):", auth.currentUser);
      console.log("User UID:", auth.currentUser?.uid);
      console.log("User phone number:", auth.currentUser?.phoneNumber);
      console.log("Current user (full):", JSON.stringify(auth.currentUser, null, 2));

      // Update the phone number in state with the verified number
      setUserData((prev) => ({
        ...prev,
        phone: auth.currentUser?.phoneNumber || prev.phone,
      }));
      
      setOtpModalVisible(false);
      // Proceed with further steps, e.g., saving the user profile, navigating to another screen, etc.
    } else {
      alert('Please enter the OTP.');
    }
  } catch (error) {
    console.error('Invalid OTP:', error);
    alert('Invalid OTP, please try again.');
  }
};

  // Replace single isSpeaking with an object to track each speaker separately
  const [speakingState, setSpeakingState] = useState({
    language: null, // For language speakers
    nameInstructions: false,
    phoneInstructions: false,
    locationInstructions: false,
    userTypeQuestion: false,
    selectJob: false,
    jobInstructions: false,
    jobDescription: null, // For job description speakers
  });

  const translations = {
    en: {
      selectLanguage: "Select Your Language",
      tapToHear: "Tap on a language to hear it, then select your preferred language",
      aboutYourself: "Tell Us About Yourself",
      name: "Name",
      speakName: "Tap mic to speak your name",
      phone: "Phone Number",
      speakPhone: "Tap keypad to enter your phone number",
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
      speakPhone: "अपना फ़ोन नंबर दर्ज करने के लिए कीपैड पर टैप करें",
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
    { id: "hi", name: "हिंदी", voice: "hi-IN" },
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
    // Set only this specific language as speaking
    setSpeakingState(prev => ({
      ...prev,
      language: language.id
    }));
    
    Speech.speak(language.name, { 
      language: language.voice,
      onDone: () => setSpeakingState(prev => ({...prev, language: null})),
      onStopped: () => setSpeakingState(prev => ({...prev, language: null}))
    });
  };

  const speakText = (text, speakerKey) => {
    const language = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
    
    // Set only this specific speaker as active
    setSpeakingState(prev => ({
      ...prev,
      [speakerKey]: true
    }));
    
    Speech.speak(text, { 
      language,
      onDone: () => setSpeakingState(prev => ({...prev, [speakerKey]: false})),
      onStopped: () => setSpeakingState(prev => ({...prev, [speakerKey]: false}))
    });
  };

  const playJobDescription = (job) => {
    try {
      const description = job.description;
      const language = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
  
      // Set the current job description speaker state
      setSpeakingState(prev => ({
        ...prev,
        jobDescription: job.id
      }));
  
      Speech.speak(description, { 
        language,
        onDone: () => setSpeakingState(prev => ({...prev, jobDescription: null})),
        onStopped: () => setSpeakingState(prev => ({...prev, jobDescription: null}))
      });
    } catch (error) {
      setSpeakingState(prev => ({...prev, jobDescription: null}));
      console.error('Error playing description:', error);
    }
  };
  

  const handleVoiceInput = async (field) => {
    try {
      setListeningField(field);
  
      // Get the appropriate language code based on selected language
      const languageCode = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
  
      // Start recording
      const speech = await speechToTextService.recognizeSpeech(languageCode);
  
      // Wait for 3 seconds to get enough speech input
      setTimeout(async () => {
        try {
          // Stop recording and get transcription
          const result = await speech.stop();
          setListeningField(null);
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
          setListeningField(null);
        }
      }, 3000);
    } catch (error) {
      console.error('Error starting voice input:', error);
      setListeningField(null);
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
      router.push("/home")

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
            <Volume2 size={20} color={speakingState.language === lang.id ? "#007bff" : "#666"} />
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
  <View style={styles.inputContent}>
    <Text style={[
      styles.inputText, 
      listeningField === "name" && { color: "#007bff" } // change text color when listening
    ]}>
      {userData.name ? userData.name : getText("speakName")}
    </Text>
    {listeningField === "name" && (
      <ActivityIndicator size="small" color="#007bff" style={styles.loadingIndicator} />
    )}
  </View>
  <View style={styles.inputActions}>
    <TouchableOpacity 
      onPress={() => speakText(getText("speakName"), "nameInstructions")} 
      style={styles.speakerButton}
    >
      <Volume2 size={20} color={speakingState.nameInstructions ? "#007bff" : "#666"} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleVoiceInput("name")}>
      <Mic size={20} color={listeningField === "name" ? "#FF3B30" : "#666"} />
    </TouchableOpacity>
  </View>
</View>



<View style={styles.inputBox}>
  <Phone size={20} color="#666" />
  <Text style={styles.inputText}>
    {userData.phone ? userData.phone : getText("speakPhone")}
  </Text>
  <View style={styles.inputActions}>
    <TouchableOpacity 
      onPress={() => speakText(getText("speakPhone"), "phoneInstructions")} 
      style={styles.speakerButton}
    >
      <Volume2 size={20} color={speakingState.phoneInstructions ? "#007bff" : "#666"} />
    </TouchableOpacity>
    {/* Keypad button replaces the mic for phone input */}
    <TouchableOpacity onPress={openPhoneKeypad} style={styles.keypadButton}>
      <Text style={styles.keypadText}>Keypad</Text>
    </TouchableOpacity>
  </View>
</View>



<View style={styles.inputBox}>
  <MapPin size={20} color="#666" />
  <View style={styles.inputContent}>
    <Text style={[
      styles.inputText,
      listeningField === "location" && { color: "#007bff" } // Change color when listening
    ]}>
      {userData.location ? userData.location : getText("speakLocation")}
    </Text>
    {listeningField === "location" && (
      <ActivityIndicator size="small" color="#007bff" style={styles.loadingIndicator} />
    )}
  </View>
  <View style={styles.inputActions}>
    <TouchableOpacity 
      onPress={() => speakText(getText("speakLocation"), "locationInstructions")} 
      style={styles.speakerButton}
    >
      <Volume2 size={20} color={speakingState.locationInstructions ? "#007bff" : "#666"} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleVoiceInput("location")}>
      <Mic size={20} color={listeningField === "location" ? "#FF3B30" : "#666"} />
    </TouchableOpacity>
  </View>
</View>



      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeTitle}>{getText("userTypeQuestion")}</Text>
        <TouchableOpacity 
          onPress={() => speakText(getText("userTypeQuestion"), "userTypeQuestion")} 
          style={styles.titleSpeakerButton}
        >
          <Volume2 size={20} color={speakingState.userTypeQuestion ? "#007bff" : "#666"} />
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
  onPress={() => {
    if (userData.userType === "employer") {
      router.push("/signup"); // Navigate to employer screen
    } else if (userData.userType === "employee") {
      setStep("job"); // Navigate to employee screen
    } else {
      alert("Please select a user type first!");
    }
  }}
>
  <Text style={styles.continueText}>{getText("continue")}</Text>
</TouchableOpacity>

    </View>
  );

  const renderJobSelection = () => (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>{getText('selectJob')}</Text>
        <TouchableOpacity 
          onPress={() => speakText(getText('selectJob'), "selectJob")} 
          style={styles.titleSpeakerButton}
        >
          <Volume2 size={20} color={speakingState.selectJob ? "#007bff" : "#666"} />
        </TouchableOpacity>
      </View>

      <View style={styles.voiceSection}>
        <Text style={styles.instruction}>{getText('jobInstruction')}</Text>
        <TouchableOpacity 
          onPress={() => speakText(getText('jobInstruction'), "jobInstructions")} 
          style={styles.instructionSpeakerButton}
        >
          <Volume2 size={20} color={speakingState.jobInstructions ? "#007bff" : "#666"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleVoiceInput('job')}
          style={[styles.micButton, listeningField === 'job' && styles.micButtonActive]}
        >
          <View style={styles.micIconContainer}>
            <Text>🎤</Text>
          </View>
        </TouchableOpacity>
        {listeningField === 'job' && (
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
              <Volume2 size={20} color={speakingState.jobDescription === job.id ? "#007bff" : "#666"} />
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
      <div id="recaptcha-container"></div>
  
      {/* Phone Modal */}
      {phoneModalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={phoneModalVisible}
          onRequestClose={() => setPhoneModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Phone Number</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.inputField}
                placeholder="Phone Number"
                value={userData.phone}
                onChangeText={(text) =>
                  setUserData((prev) => ({ ...prev, phone: text }))
                }
              />
              <Button
                title="Done"
                onPress={() => {
                  if (!isValidPhoneNumber(userData.phone)) {
                    alert('Please enter a valid 10-digit phone number.');
                    return;
                  }
                  sendOTP(userData.phone)
                    .then((confirmation) => {
                      setConfirmationResult(confirmation);
                      // Open OTP modal after successful OTP sending.
                      setOtpModalVisible(true);
                    })
                    .catch((error) => {
                      alert('Failed to send OTP. Please try again.');
                    });
                  // Close the phone modal.
                  setPhoneModalVisible(false);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
  
      {/* OTP Modal (rendered as a sibling) */}
      {otpModalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={otpModalVisible}
          onRequestClose={() => setOtpModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter OTP</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.inputField}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={(text) => setOtp(text)}
              />
              <Button title="Verify OTP" onPress={verifyOTP} />
            </View>
          </View>
        </Modal>
      )}
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
  keypadButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginLeft: 10,
  },
  keypadText: {
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
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
  inputContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
});



export default OnboardingFlow