const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const voiceController = require('../controllers/voiceController');

router.post('/process', upload.single('audio'), voiceController.processVoice);
router.post('/process-long', voiceController.processLongAudio);

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

module.exports = router;