const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');

router.post('/process', voiceController.processVoice);
router.post('/transcribe', voiceController.transcribeVoice);

module.exports = router;