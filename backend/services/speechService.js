const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const { Storage } = require('@google-cloud/storage');

class SpeechService {
  constructor() {
    this.speechClient = new speech.SpeechClient();
    this.ttsClient = new textToSpeech.TextToSpeechClient();
    this.storage = new Storage();

    // Supported languages configuration
    this.supportedLanguages = {
      'en-US': {
        name: 'English',
        sampleRateHertz: 16000,
      },
      'hi-IN': {
        name: 'Hindi',
        sampleRateHertz: 16000,
      },
    };
  }

  /**
   * Validate and clean the language code.
   * @param {string} languageCode - The language code to validate.
   * @returns {string} - The validated and cleaned language code.
   */
  validateLanguageCode = (languageCode) => {
    const cleanedLanguageCode = languageCode.trim();
    if (!this.supportedLanguages[cleanedLanguageCode]) {
      console.warn(`Unsupported language code: ${cleanedLanguageCode}. Falling back to en-US.`);
      return 'en-US'; // Fallback to English
    }
    return cleanedLanguageCode;
  };

  // Text to Speech conversion
  async synthesizeSpeech(text, languageCode = 'en-US') {
    try {
      const request = {
        input: { text },
        voice: {
          languageCode,
          ssmlGender: 'NEUTRAL',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.9, // Slightly slower for better clarity
          pitch: 0,
        },
      };

      const [response] = await this.ttsClient.synthesizeSpeech(request);
      return {
        success: true,
        audioContent: response.audioContent,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Real-time speech recognition for short audio
  async transcribeAudio(audioBuffer, languageCode = 'en-US', isWebAudio = false) {
    try {
      const validatedLanguageCode = this.validateLanguageCode(languageCode);

      // Set encoding and sample rate based on WebAudio flag
      const encoding = isWebAudio ? 'WEBM_OPUS' : 'LINEAR16';
      const sampleRateHertz = isWebAudio ? 48000 : this.supportedLanguages[validatedLanguageCode].sampleRateHertz;

      const request = {
        audio: {
          content: audioBuffer.toString('base64'),
        },
        config: {
          encoding: encoding,
          sampleRateHertz: sampleRateHertz,
          languageCode: validatedLanguageCode,
          enableAutomaticPunctuation: false,
          model: validatedLanguageCode === 'hi-IN' ? 'default' : 'phone_call',
          audioChannelCount: 1, // Mono audio
        },
      };

      console.log('Sending request to Google Speech API...');
      const [response] = await this.speechClient.recognize(request);
      console.log('Google API response received:', response ? 'yes' : 'no');

      if (!response.results || response.results.length === 0) {
        return {
          success: false,
          error: 'No speech detected',
        };
      }

      return {
        success: true,
        transcription: response.results
          .map(result => result.alternatives[0].transcript)
          .join(' '),
        confidence: response.results[0].alternatives[0].confidence,
      };
    } catch (error) {
      console.error('Error in transcribeAudio:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Long audio file transcription from Google Cloud Storage
  async transcribeAudioFile(gcsUri, languageCode = 'en-US') {
    try {
      const validatedLanguageCode = this.validateLanguageCode(languageCode);

      const request = {
        audio: { uri: gcsUri },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: this.supportedLanguages[validatedLanguageCode].sampleRateHertz,
          languageCode: validatedLanguageCode,
          enableAutomaticPunctuation: true,
          model: 'default',
        },
      };

      const [operation] = await this.speechClient.longRunningRecognize(request);
      const [response] = await operation.promise();

      return {
        success: true,
        transcription: response.results
          .map(result => result.alternatives[0].transcript)
          .join(' '),
        confidence: response.results[0].alternatives[0].confidence,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Generate voice prompts for the profile creation flow
  async generateProfilePrompts(languageCode = 'en-US') {
    const prompts = {
      'en-US': {
        welcome: 'Welcome to the job portal. Please speak your responses clearly.',
        name: 'What is your name?',
        age: 'What is your age?',
        skills: 'What work skills do you have?',
        experience: 'How many years of work experience do you have?',
        location: 'Which city do you live in?',
        contact: 'Please speak your contact number.',
      },
      'hi-IN': {
        welcome: 'रोजगार पोर्टल में आपका स्वागत है। कृपया अपने जवाब स्पष्ट रूप से बोलें।',
        name: 'आपका नाम क्या है?',
        age: 'आपकी उम्र क्या है?',
        skills: 'आपके पास कौन से काम के कौशल हैं?',
        experience: 'आपके पास कितने साल का काम का अनुभव है?',
        location: 'आप किस शहर में रहते हैं?',
        contact: 'कृपया अपना संपर्क नंबर बोलें।',
      },
    };

    try {
      const promptAudio = {};
      for (const [key, text] of Object.entries(prompts[languageCode])) {
        const result = await this.synthesizeSpeech(text, languageCode);
        if (result.success) {
          promptAudio[key] = result.audioContent;
        } else {
          throw new Error(`Failed to generate prompt for ${key}`);
        }
      }
      return {
        success: true,
        prompts: promptAudio,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new SpeechService();