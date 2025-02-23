// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Register a new user (with validation)
router.post('/register', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], authController.registerUser);

// Login a user (with validation)
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
], authController.loginUser);

// Logout a user
router.post('/logout', authController.logoutUser);  // 🆕 ADDED Logout Route

// Get user details by ID (Protected Route ✅)
router.get('/:id', authenticateToken, authController.getUserById);

module.exports = router;
