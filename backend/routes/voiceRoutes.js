// backend/routes/voiceRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const voiceController = require('../controllers/voiceController');

// Existing routes
router.post('/process', upload.single('audio'), voiceController.processVoice);
router.post('/process-long', voiceController.processLongAudio);

// Credentials test route
router.get('/test-credentials', async (req, res) => {
  try {
    const speechService = require('../services/speechService');
    res.json({ message: 'Google Cloud credentials are working!' });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to initialize Speech Service',
      details: error.message
    });
  }
});

// In backend/routes/voiceRoutes.js, modify the process route:
router.post('/process', upload.single('audio'), (req, res, next) => {
  console.log('Form fields received:', req.body);
  console.log('File received:', req.file ? 'Yes' : 'No');
  next();
}, voiceController.processVoice);

// Enhanced synthesis route
router.post('/synthesize', voiceController.synthesizeSpeech);

// New profile-related routes
router.get('/profile-prompts/:languageCode', voiceController.generateProfilePrompts);
router.post('/profile-input', 
  upload.single('audio'), 
  voiceController.processProfileVoiceInput
);

// Add this to your voiceRoutes.js
router.post('/basic-test', upload.single('audio'), (req, res) => {
  console.log('Received request with body:', req.body);
  console.log('Language code received:', req.body.languageCode);
  
  if (!req.file) {
    return res.json({
      success: false,
      error: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    message: 'File received',
    languageCode: req.body.languageCode || 'none provided',
    fileSize: req.file.size
  });
});

module.exports = router;