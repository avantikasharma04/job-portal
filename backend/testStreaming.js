// testStreaming.js
require('dotenv').config();
const mic = require('mic');
const speechService = require('./services/speechService');

(async () => {
  try {
    // Start streaming recognition for Hindi with a custom silence timeout of 3000ms
    const recognizeStream = await speechService.transcribeAudioStreamWithSilenceDetection('en-US', 3000);

    const micInstance = mic({
      rate: '16000',
      channels: '1',
      debug: false,
      exitOnSilence: 2,  // This might also help stop the mic when silence is detected
    });
    
    const micInputStream = micInstance.getAudioStream();
    
    micInputStream.on('error', (err) => {
      console.error("Mic Input Error:", err);
    });

    // When the silence timer triggers inside transcribeAudioStreamWithSilenceDetection,
    // the recognizeStream is ended. We also need to stop the mic instance.
    // One approach is to listen for the "end" event on recognizeStream and then stop the mic:
    recognizeStream.on('end', () => {
      micInstance.stop();
      console.log("Recognition stream ended, microphone stopped.");
    });

    // Pipe the mic input to the recognition stream
    micInputStream.pipe(recognizeStream);

    // Start recording
    micInstance.start();
    console.log('Listening... Speak into the microphone in Hindi.');
  } catch (error) {
    console.error('Error:', error);
  }
})();
