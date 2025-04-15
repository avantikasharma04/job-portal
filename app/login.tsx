
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { TextInput, Button, Text, Surface, ActivityIndicator, Divider } from "react-native-paper";
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth } from '../src/services/firebaseConfig';
import { PhoneAuthProvider } from 'firebase/auth';

const LoginScreen = () => {
  const router = useRouter();
  const { login, error: authError, loading: authLoading, user, userData, setError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [localError, setLocalError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
  
  const recaptchaVerifier = React.useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && userData) {
      router.push("/home");
    }
  }, [user, userData]);
  

  // Set up voice recognition
  useEffect(() => {
    Voice.onSpeechStart = () => setListening(true);
    Voice.onSpeechEnd = () => setListening(false);
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value[0]) {
        const text = e.value[0];
        if (currentField === 'email') {
          setEmail(text.toLowerCase().replace(/\s+/g, ''));
        } else if (currentField === 'password') {
          setPassword(text);
        } else if (currentField === 'phone') {
          setPhoneNumber(text.replace(/\D/g, ''));
        } else if (currentField === 'code') {
          setVerificationCode(text.replace(/\D/g, ''));
        }
        setCurrentField(null);
      }
    };
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [currentField]);

  const startListening = async (field) => {
    setCurrentField(field);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  const speakPrompt = (text) => {
    Speech.speak(text, {
      language: 'en',
      pitch: 1,
      rate: 0.8,
    });
  };

  const handleEmailLogin = async () => {
    setLocalError("");
    setMessage("");
    
    if (!email.trim() || !password.trim()) {
      setLocalError("Please fill in all fields");
      if (voiceMode) {
        speakPrompt("Please provide both email and password");
      }
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      setMessage("Login successful!");
      // Navigation will happen automatically due to the useEffect
    } else if (voiceMode && authError) {
      speakPrompt("Login failed. " + authError);
      setLocalError(authError);
    }
  };

  const handleSendVerificationCode = async () => {
    setLocalError("");
    setMessage("");
    setLoading(true);
    
    try {
      if (!phoneNumber || phoneNumber.length < 10) {
        setLocalError("Please enter a valid phone number");
        if (voiceMode) {
          speakPrompt("Please enter a valid phone number");
        }
        setLoading(false);
        return;
      }
      
      // Format phone number with country code if needed
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        formattedPhone,
        recaptchaVerifier.current
      );
      
      setVerificationId(verificationId);
      setMessage("Verification code sent! Please enter the code you received.");
      
      if (voiceMode) {
        speakPrompt("Verification code sent! Please enter the code you received.");
      }
    } catch (error) {
      console.error(error);
      setLocalError(error.message);
      if (voiceMode) {
        speakPrompt("Failed to send verification code. " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async () => {
    setLocalError("");
    setMessage("");
    
    if (!verificationId || !verificationCode) {
      setLocalError("Please enter the verification code");
      if (voiceMode) {
        speakPrompt("Please enter the verification code");
      }
      return;
    }
    
    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await auth.signInWithCredential(credential);
      setMessage("Login successful!");
      // Navigation will happen automatically due to the useEffect
    } catch (error) {
      console.error(error);
      setLocalError(error.message);
      if (voiceMode) {
        speakPrompt("Login failed. " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    setVoiceMode(!voiceMode);
    if (!voiceMode) {
      speakPrompt("Voice mode activated. Tap each field and speak to enter information.");
    }
  };

  const displayError = authError || localError;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification={true}
      />
      
      <Surface style={styles.formCard}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.toggleContainer}>
          <Button
            mode={loginMethod === "email" ? "contained" : "outlined"}
            onPress={() => setLoginMethod("email")}
            style={[styles.toggleButton, loginMethod === "email" && styles.activeToggle]}
          >
            Email
          </Button>
          <Button
            mode={loginMethod === "phone" ? "contained" : "outlined"}
            onPress={() => setLoginMethod("phone")}
            style={[styles.toggleButton, loginMethod === "phone" && styles.activeToggle]}
          >
            Phone
          </Button>
        </View>

        {loginMethod === "email" ? (
          // Email Login Form
          <>
            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                mode="outlined"
                style={styles.input}
                disabled={listening && currentField === 'email'}
              />
              {voiceMode && (
                <TouchableOpacity 
                  style={styles.voiceButton}
                  onPress={() => {
                    speakPrompt("Please say your email address");
                    startListening('email');
                  }}
                >
                  <Text style={styles.voiceButtonText}>🎤</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!voiceMode || !listening || currentField !== 'password'}
                mode="outlined"
                style={styles.input}
                disabled={listening && currentField === 'password'}
              />
              {voiceMode && (
                <TouchableOpacity 
                  style={styles.voiceButton}
                  onPress={() => {
                    speakPrompt("Please say your password");
                    startListening('password');
                  }}
                >
                  <Text style={styles.voiceButtonText}>🎤</Text>
                </TouchableOpacity>
              )}
            </View>

            <Button 
              mode="contained" 
              onPress={handleEmailLogin} 
              style={styles.button}
              loading={authLoading}
              disabled={authLoading}
            >
              Login with Email
            </Button>
          </>
        ) : (
          // Phone Login Form
          <>
            {!verificationId ? (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    mode="outlined"
                    style={styles.input}
                    placeholder="+91XXXXXXXXXX"
                    disabled={listening && currentField === 'phone'}
                  />
                  {voiceMode && (
                    <TouchableOpacity 
                      style={styles.voiceButton}
                      onPress={() => {
                        speakPrompt("Please say your phone number");
                        startListening('phone');
                      }}
                    >
                      <Text style={styles.voiceButtonText}>🎤</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Button 
                  mode="contained" 
                  onPress={handleSendVerificationCode} 
                  style={styles.button}
                  loading={loading}
                  disabled={loading}
                >
                  Send Verification Code
                </Button>
              </>
            ) : (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Verification Code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    mode="outlined"
                    style={styles.input}
                    disabled={listening && currentField === 'code'}
                  />
                  {voiceMode && (
                    <TouchableOpacity 
                      style={styles.voiceButton}
                      onPress={() => {
                        speakPrompt("Please say the verification code");
                        startListening('code');
                      }}
                    >
                      <Text style={styles.voiceButtonText}>🎤</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.buttonRow}>
                  <Button 
                    mode="outlined" 
                    onPress={() => setVerificationId("")} 
                    style={[styles.button, styles.halfButton]}
                  >
                    Back
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={handlePhoneLogin} 
                    style={[styles.button, styles.halfButton]}
                    loading={loading}
                    disabled={loading}
                  >
                    Verify & Login
                  </Button>
                </View>
              </>
            )}
          </>
        )}
        
        {listening && (
          <View style={styles.listeningContainer}>
            <Text style={styles.listeningText}>Listening...</Text>
            <Button mode="contained" onPress={stopListening}>Stop</Button>
          </View>
        )}

        <Button
          mode="outlined"
          onPress={toggleVoiceMode}
          style={styles.voiceModeButton}
        >
          {voiceMode ? "Disable Voice Mode" : "Enable Voice Mode"}
        </Button>

        {displayError ? <Text style={styles.errorText}>{displayError}</Text> : null}
        {message ? <Text style={styles.successText}>{message}</Text> : null}

        <Divider style={styles.divider} />

        <View style={styles.registerContainer}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
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
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activeToggle: {
    backgroundColor: '#6200EE',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
  },
  voiceButton: {
    marginLeft: 8,
    backgroundColor: '#6200EE',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonText: {
    fontSize: 20,
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 10,
  },
  halfButton: {
    flex: 0.48,
  },
  voiceModeButton: {
    marginTop: 16,
    borderColor: '#6200EE',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  registerLink: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  successText: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  listeningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  listeningText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
});

export default LoginScreen;