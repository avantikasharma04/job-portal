// Backend: routes/aadhaarRoutes.js
const express = require('express');
const router = express.Router();
const aadhaarController = require('../controllers/aadhaarController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/verify', authMiddleware, aadhaarController.verifyAadhaar);

module.exports = router;

// Don't forget to include this in your main app.js or index.js
// app.use('/api/aadhaar', require('./routes/aadhaarRoutes'));