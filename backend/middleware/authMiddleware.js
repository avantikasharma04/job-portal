const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET; // Fetch from .env

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in the environment variables!");
}

// Authentication Middleware
exports.authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Missing or malformed token. Please log in.' });
        }

        const token = authHeader.split(' ')[1]; // Extract token

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                const errorMessage = err.name === 'TokenExpiredError'
                    ? 'Session expired. Please log in again.'
                    : 'Invalid token. Please log in again.';
                return res.status(403).json({ message: errorMessage });
            }
            req.user = user; // Attach decoded user data to request
            next();
        });

    } catch (error) {
        console.error('JWT Authentication Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
