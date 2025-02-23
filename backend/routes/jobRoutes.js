const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken } = require('../middleware/authMiddleware'); 
const { validateJobPost } = require('../middleware/validationMiddleware'); 

// ✅ Create a new job posting (Protected)
router.post('/create', authenticateToken, validateJobPost, jobController.createJob);

// ✅ Get all job listings (Public)
router.get('/all', jobController.getAllJobs);

// ✅ Get a specific job by ID (Public)
router.get('/:id', jobController.getJobById);

// ✅ Update a job listing (Only job owner or admin can update)
router.put('/update/:id', authenticateToken, jobController.updateJob);

// ✅ Delete a job listing (Only job owner or admin can delete)
router.delete('/delete/:id', authenticateToken, jobController.deleteJob);

module.exports = router;
