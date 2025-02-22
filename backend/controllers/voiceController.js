// backend/controllers/voiceController.js
const speechService = require('../services/speechService');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.processVoice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No audio file provided' 
      });
    }

    const audioConfig = {
      encoding: req.body.encoding || 'LINEAR16',
      sampleRateHertz: parseInt(req.body.sampleRate) || 16000,
      languageCode: req.body.languageCode || 'en-US'
    };

    const result = await speechService.transcribeAudio(
      req.file.buffer,
      audioConfig
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

// For handling long audio files through Google Cloud Storage
exports.processLongAudio = async (req, res) => {
  try {
    const { gcsUri } = req.body;
    
    if (!gcsUri) {
      return res.status(400).json({ 
        success: false, 
        error: 'No GCS URI provided' 
      });
    }

    const audioConfig = {
      encoding: req.body.encoding || 'LINEAR16',
      sampleRateHertz: parseInt(req.body.sampleRate) || 16000,
      languageCode: req.body.languageCode || 'en-US'
    };

    const result = await speechService.transcribeAudioFile(
      gcsUri,
      audioConfig
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};