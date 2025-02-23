const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Protect routes
const adminMiddleware = require('../middleware/adminMiddleware'); // Only for admins

const router = express.Router();

// ✅ 1️⃣ REGISTER A NEW USER
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ message: 'User already exists' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({ name, email, password: hashedPassword, role: 'user' }); // Default role is 'user'
            await user.save();

            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({ message: 'User registered successfully', token });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
);

// ✅ 2️⃣ LOGIN USER
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
);

// ✅ 3️⃣ LOGOUT USER (Invalidate Token - Requires Frontend Support)
router.post('/logout', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
});

// ✅ 4️⃣ GET USER PROFILE (Protected)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ 5️⃣ UPDATE USER INFO (Protected)
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ 6️⃣ CHANGE PASSWORD (Protected)
router.put('/change-password', authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ 7️⃣ DELETE USER (Only Admins or User Themselves)
router.delete('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.findByIdAndDelete(req.user.userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ 8️⃣ ADMIN: DELETE ANY USER (Only Admins)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully by admin' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
