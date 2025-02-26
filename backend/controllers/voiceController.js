// backend/controllers/voiceController.js
const speechService = require('../services/speechService');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.processVoice = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Language code received:', req.body.languageCode);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided'
      });
    }
    
    const languageCode = req.body.languageCode || 'en-US';
    console.log('Language code being used:', languageCode);
    

    // Just pass the language code, not the whole config object
    const result = await speechService.transcribeAudio(
      req.file.buffer,
      languageCode
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
// Existing long audio processing
exports.processLongAudio = async (req, res) => {
  try {
    const { gcsUri } = req.body;
        
    if (!gcsUri) {
      return res.status(400).json({
        success: false,
        error: 'No GCS URI provided'
      });
    }
    
    // Extract just the language code
    const languageCode = req.body.languageCode || 'en-US';
    
    // Pass only the language code
    const result = await speechService.transcribeAudioFile(
      gcsUri,
      languageCode
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
// New profile-related controllers
exports.generateProfilePrompts = async (req, res) => {
  try {
    const { languageCode = 'en-US' } = req.params;
    const result = await speechService.generateProfilePrompts(languageCode);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Enhanced text-to-speech synthesis with error handling
exports.synthesizeSpeech = async (req, res) => {
  try {
    const { text, languageCode = 'en-US' } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    const result = await speechService.synthesizeSpeech(text, languageCode);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.set('Content-Type', 'audio/mpeg');
    res.send(result.audioContent);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// New controller for processing profile voice inputs
exports.processProfileVoiceInput = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No audio file provided' 
      });
    }

    const { fieldName, languageCode = 'en-US' } = req.body;
    
    if (!fieldName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Field name is required' 
      });
    }

    const result = await speechService.transcribeAudio(
      req.file.buffer,
      languageCode
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      fieldName,
      value: result.transcription,
      confidence: result.confidence
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};