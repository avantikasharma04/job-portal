require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Load environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobsDB';

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins for now, restrict in production
app.use(helmet()); // Security headers
app.use(compression()); // Improve performance
app.use(morgan('dev')); // Log API requests
app.use(express.json()); // Parse JSON request body

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
      console.error('❌ MongoDB Connection Error:', err);
      process.exit(1); // Stop app if DB connection fails
  });

// Job Model
const Job = mongoose.model('Job', new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
}));

// Routes
app.post('/api/jobs', async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({ success: true, message: 'Job created successfully', job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.get('/api/jobs', async (req, res) => {
    const jobs = await Job.find();
    res.status(200).json({ success: true, jobs });
});

app.get('/api/jobs/:id', async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, job });
});

app.put('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.status(200).json({ success: true, message: 'Job updated successfully', job });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.delete('/api/jobs/:id', async (req, res) => {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.status(200).json({ success: true, message: 'Job deleted successfully' });
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
