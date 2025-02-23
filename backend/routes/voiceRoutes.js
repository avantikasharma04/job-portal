const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const voiceController = require('../controllers/voiceController');
const { synthesizeSpeech } = require('../services/speechService');


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

  router.post('/synthesize', async (req, res) => {
    try {
        const { text, language } = req.body;
        if (!text || !language) {
            return res.status(400).json({ error: "Text and language are required" });
        }

        const audioContent = await synthesizeSpeech(text, language);
        res.set({ 'Content-Type': 'audio/mpeg' });
        res.send(audioContent);
    } catch (error) {
        console.error("TTS Error:", error);
        res.status(500).json({ error: "Failed to generate speech" });
    }
});


module.exports = router;