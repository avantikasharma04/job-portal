// src/services/speechToTextService.js
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

class SpeechToTextService {
  constructor() {
    this.recording = null;
    this.apiUrl = 'http://localhost:3002/api/speech'; // Update with your backend URL
    this.audioUri = null;
    this.webRecorder = null;
    this.webAudioChunks = [];
  }

  // Request permissions for audio recording
  async requestPermissions() {
    try {
      if (Platform.OS === 'web') {
        // Request permissions for web
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
      } else {
        // Request permissions for native
        const { status } = await Audio.requestPermissionsAsync();
        return status === 'granted';
      }
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }

  // Start recording audio
  async startRecording() {
    try {
      // Make sure we have permissions
      const permissionGranted = await this.requestPermissions();
      if (!permissionGranted) {
        throw new Error('Audio recording permissions not granted');
      }

      if (Platform.OS === 'web') {
        // Web implementation
        return this.startWebRecording();
      } else {
        // Native implementation
        return this.startNativeRecording();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  // Start recording on web
  async startWebRecording() {
    try {
      // Get user media stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Reset audio chunks
      this.webAudioChunks = [];
      
      // Create media recorder
      this.webRecorder = new MediaRecorder(stream);
      
      // Set up data handler
      this.webRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.webAudioChunks.push(event.data);
        }
      };
      
      // Start recording
      this.webRecorder.start();
      console.log('Web recording started');
      return true;
    } catch (error) {
      console.error('Error starting web recording:', error);
      return false;
    }
  }

  // Start recording on native platforms
  async startNativeRecording() {
    // Configure audio mode for voice recording
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Prepare the recording
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync({
      android: {
        extension: '.wav',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 16000,
      },
      ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 16000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
    });

    // Start recording
    await recording.startAsync();
    this.recording = recording;
    console.log('Native recording started');
    return true;
  }

  // Stop recording and get the audio file
  async stopRecording() {
    try {
      if (Platform.OS === 'web') {
        return this.stopWebRecording();
      } else {
        return this.stopNativeRecording();
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  }

  // Stop web recording
  async stopWebRecording() {
    return new Promise((resolve, reject) => {
      if (!this.webRecorder) {
        reject(new Error('No web recorder found'));
        return;
      }

      // Set up stop event handler
      this.webRecorder.onstop = async () => {
        try {
          // Create blob from audio chunks
          const audioBlob = new Blob(this.webAudioChunks, { type: 'audio/webm' });
          console.log('Web recording stopped, blob size:', audioBlob.size);
          
          // We don't save a URI for web, but we'll return the blob for transcription
          resolve(audioBlob);
        } catch (error) {
          reject(error);
        }
      };

      // Stop recording
      this.webRecorder.stop();
    });
  }

  // Stop native recording
  async stopNativeRecording() {
    if (!this.recording) {
      return null;
    }

    // Stop the recording
    await this.recording.stopAndUnloadAsync();

    // Get the recorded URI
    const uri = this.recording.getURI();
    this.audioUri = uri;

    // Reset recording object
    this.recording = null;

    console.log('Native recording stopped, URI:', uri);
    return uri;
  }

  // Upload audio to backend for transcription
  async transcribeAudio(languageCode = 'en-US') {
    try {
      if (Platform.OS === 'web') {
        // Web version
        return this.transcribeWebAudio(languageCode);
      } else {
        // Native version
        return this.transcribeNativeAudio(languageCode);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Transcribe web audio
  async transcribeWebAudio(languageCode) {
    // First try browser's SpeechRecognition if available
    const browserResult = await this.tryBrowserSpeechRecognition(languageCode);
    if (browserResult.success) {
      return browserResult;
    }

    // Fallback to server-side transcription
    try {
      if (this.webAudioChunks.length === 0) {
        throw new Error('No audio recorded');
      }

      // Create a blob from the chunks
      const audioBlob = new Blob(this.webAudioChunks, { type: 'audio/webm' });
      
      // Convert blob to base64
      const base64Audio = await this.blobToBase64(audioBlob);
      
      // Send to backend
      const response = await fetch(`${this.apiUrl}/transcribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          languageCode,
          isWebAudio: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Web transcription response:', result);

      return {
        success: true,
        transcription: result.text || ''
      };
    } catch (error) {
      console.error('Error transcribing web audio:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Try using browser's built-in SpeechRecognition
  async tryBrowserSpeechRecognition(languageCode) {
    try {
      // Check if SpeechRecognition is available
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        return { success: false };
      }

      // Use the browser's speech recognition
      return new Promise((resolve) => {
        const recognition = new SpeechRecognition();
        recognition.lang = languageCode;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          resolve({
            success: true,
            transcription: transcript
          });
        };

        recognition.onerror = (event) => {
          resolve({
            success: false,
            error: event.error
          });
        };

        recognition.onend = () => {
          resolve({
            success: false,
            error: 'No speech detected'
          });
        };

        // Start recognition
        recognition.start();
      });
    } catch (error) {
      console.log('Browser speech recognition not available:', error);
      return { success: false };
    }
  }

  // Helper to convert blob to base64
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Get base64 string (remove data:audio/webm;base64, prefix)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Transcribe native audio
  async transcribeNativeAudio(languageCode) {
    if (!this.audioUri) {
      throw new Error('No audio recorded');
    }

    // Read the audio file as base64
    const base64Audio = await FileSystem.readAsStringAsync(this.audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Send to backend for processing
    const response = await fetch(`${this.apiUrl}/transcribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: base64Audio,
        languageCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Native transcription response:', result);

    // Clean up temporary audio file
    await FileSystem.deleteAsync(this.audioUri);
    this.audioUri = null;

    return {
      success: true,
      transcription: result.text || ''
    };
  }

  // Method to recognize speech and return text
  async recognizeSpeech(languageCode = 'en-US') {
    try {
      // Start recording
      const recordingStarted = await this.startRecording();
      if (!recordingStarted) {
        throw new Error('Failed to start recording');
      }

      // Return a promise that can be awaited or resolved with a timeout
      return {
        stop: async () => {
          try {
            // Stop recording
            await this.stopRecording();
            
            // Transcribe the audio
            const result = await this.transcribeAudio(languageCode);
            return result;
          } catch (error) {
            console.error('Error in speech recognition stop:', error);
            return {
              success: false,
              error: error.message
            };
          }
        },
      };
    } catch (error) {
      console.error('Error in recognizeSpeech:', error);
      return {
        stop: async () => ({
          success: false,
          error: error.message,
        }),
      };
    }
  }
}

export default new SpeechToTextService();