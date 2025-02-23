// backend/services/speechService.js
const speech = require('@google-cloud/speech');
const { Storage } = require('@google-cloud/storage');

class SpeechService {
  constructor() {
    this.client = new speech.SpeechClient();
    this.storage = new Storage();
  }

  async transcribeAudio(audioBuffer, config = {}) {
    try {
      const audioConfig = {
        encoding: config.encoding || 'LINEAR16',
        sampleRateHertz: config.sampleRateHertz || 16000,
        languageCode: config.languageCode || 'en-US',
      };

      const audio = {
        content: audioBuffer.toString('base64'),
      };

      const request = {
        audio: audio,
        config: audioConfig,
      };

      const [response] = await this.client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      return {
        success: true,
        transcription,
        confidence: response.results[0]?.alternatives[0]?.confidence || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async transcribeAudioFile(gcsUri, config = {}) {
    try {
      const audioConfig = {
        encoding: config.encoding || 'LINEAR16',
        sampleRateHertz: config.sampleRateHertz || 16000,
        languageCode: config.languageCode || 'en-US',
      };

      const audio = {
        uri: gcsUri,
      };

      const request = {
        audio: audio,
        config: audioConfig,
      };

      const [operation] = await this.client.longRunningRecognize(request);
      const [response] = await operation.promise();

      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      return {
        success: true,
        transcription,
        confidence: response.results[0]?.alternatives[0]?.confidence || 0,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

const ttsClient = new textToSpeech.TextToSpeechClient();

const synthesizeSpeech = async (text, languageCode) => {
    const request = {
        input: { text },
        voice: { languageCode, ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    return response.audioContent;
};

module.exports = { synthesizeSpeech };


module.exports = new SpeechService();