require('dotenv').config();
console.log('Google credentials path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3002;

// Import routes
const voiceRoutes = require('./routes/voiceRoutes');
const speechRoutes = require('./routes/speechRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Job Portal API!" });
});

// Use routes
app.use('/api/voice', voiceRoutes);
app.use('/api/speech', speechRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});