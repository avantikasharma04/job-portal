// backend/routes/speechRoutes.js
const express = require('express');
const router = express.Router();
const speechService = require('../services/speechService');

// Endpoint for speech transcription
router.post('/transcribe', async (req, res) => {
    try {
      const { audio, languageCode, isWebAudio } = req.body;
      
      if (!audio) {
        return res.status(400).json({ 
          success: false, 
          error: 'No audio data provided' 
        });
      }
      
      // Log info for debugging
      console.log('Received audio transcription request:');
      console.log(`- Language: ${languageCode}`);
      console.log(`- Audio data length: ${audio.length}`);
      console.log(`- Source: ${isWebAudio ? 'Web' : 'Native'}`);
      
      // Process with your speech service
      const transcription = await speechService.transcribeAudio(audio, languageCode, isWebAudio);
      
      // Return the result
      res.json({
        success: true,
        text: transcription
      });
    } catch (error) {
      console.error('Speech transcription error:', error);
      res.status(500).json({
        success: false,
        error: 'Speech recognition failed. Please try again.'
      });
    }
  });
  
// Generate voice prompts for a given language
router.get('/prompts/:languageCode', async (req, res) => {
  try {
    const { languageCode } = req.params;
    const result = await speechService.generateProfilePrompts(languageCode);
    
    return res.json(result);
  } catch (error) {
    console.error('Error generating prompts:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;