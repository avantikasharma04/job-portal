import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Mic, AlertCircle, User, Phone, MapPin } from "lucide-react";
import { useNavigation } from "@react-navigation/native";
import * as Speech from "expo-speech";

// LanguageOnboarding Component
const LanguageOnboarding = () => {
  const [step, setStep] = useState("language");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const navigation = useNavigation();

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
    },
  };

  const languages = [
    { id: "hi", name: "हिंदी (Hindi)", voice: "hi-IN" },
    { id: "en", name: "English", voice: "en-US" },
  ];

  const getText = (key) => translations[selectedLanguage]?.[key] || translations.en[key];

  const playLanguageVoice = (language) => {
    Speech.speak(language.name, { language: language.voice });
  };

  return (
    <View style={styles.container}>
      {step === "language" ? (
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
      ) : (
        <View>
          <Text style={styles.title}>{getText("aboutYourself")}</Text>

          <View style={styles.inputBox}>
            <User size={20} color="#666" />
            <Text style={styles.inputText}>{getText("speakName")}</Text>
            <TouchableOpacity>
              <Mic size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputBox}>
            <Phone size={20} color="#666" />
            <Text style={styles.inputText}>{getText("speakPhone")}</Text>
            <TouchableOpacity>
              <Mic size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputBox}>
            <MapPin size={20} color="#666" />
            <Text style={styles.inputText}>{getText("speakLocation")}</Text>
            <TouchableOpacity>
              <Mic size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.continueText}>{getText("continue")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
});

export default LanguageOnboarding;
