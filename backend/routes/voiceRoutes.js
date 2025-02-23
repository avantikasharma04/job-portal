const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const voiceController = require('../controllers/voiceController');

// ✅ PROCESS VOICE COMMAND (Strict validation)
router.post(
    '/command',
    [
        check('text', 'Transcribed text is required').not().isEmpty(),
        check('parameters', 'Parameters must be an object').optional().isObject(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            await voiceController.processVoiceCommand(req, res);
        } catch (error) {
            console.error('Error processing voice command:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// ✅ GET VOICE COMMAND FEEDBACK (Strict error handling)
router.get('/feedback/:id', async (req, res) => {
    try {
        if (!req.params.id || req.params.id.trim() === '') {
            return res.status(400).json({ message: 'Feedback ID is required' });
        }
        
        await voiceController.getVoiceFeedback(req, res);
    } catch (error) {
        console.error('Error fetching voice feedback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
