const Job = require('../models/Job'); // Assuming you have a Job model
const User = require('../models/User'); // Assuming you have a User model

// ✅ Update Job (Only Job Owner or Admin)
exports.updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id; // Extracted from JWT token

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // ✅ Check if the user is admin
        const user = await User.findById(userId);
        if (user.role !== 'admin' && job.postedBy.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this job" });
        }

        const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true });
        res.status(200).json(updatedJob);

    } catch (error) {
        res.status(500).json({ message: "Error updating job", error });
    }
};

// ✅ Delete Job (Only Job Owner or Admin)
exports.deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.user.id; // Extracted from JWT token

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // ✅ Check if the user is admin
        const user = await User.findById(userId);
        if (user.role !== 'admin' && job.postedBy.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this job" });
        }

        await Job.findByIdAndDelete(jobId);
        res.status(200).json({ message: "Job deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting job", error });
    }
};
