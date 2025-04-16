// routes/verifyAadhaar.js

const express = require('express');
const router = express.Router();
const verifyAadhaarController = require('../controllers/verifyAadhaarController');

// Define the endpoint for Aadhaar verification
router.post('/verify-aadhaar', verifyAadhaarController.verify);

module.exports = router;
