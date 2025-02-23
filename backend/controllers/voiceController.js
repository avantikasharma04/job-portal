const { parseVoiceCommand } = require('../utils/voiceProcessing');
const Job = require('../models/Job'); // Import the Job model
const VoiceCommand = require('../models/VoiceCommand'); // Store voice commands in MongoDB

// Process Voice Command
exports.processVoiceCommand = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No command received' });

    const parsedCommand = parseVoiceCommand(text);

    const newCommand = new VoiceCommand({
      text,
      category: parsedCommand.category || 'unknown',
      location: parsedCommand.location || 'unknown',
      status: 'processing'
    });

    await newCommand.save(); // Save to MongoDB

    // Search for jobs based on the command
    const jobResults = await Job.find({
      category: parsedCommand.category,
      location: parsedCommand.location
    }).limit(3);

    newCommand.status = 'completed';
    newCommand.result = jobResults;
    await newCommand.save(); // Update status in MongoDB

    const responseMessage = parsedCommand.category && parsedCommand.location
      ? `Looking for ${parsedCommand.category} jobs in ${parsedCommand.location}. We'll update you shortly.`
      : 'Please specify a job category and location.';

    res.json({ message: responseMessage, commandId: newCommand._id });

  } catch (error) {
    console.error('Error processing voice command:', error);
    res.status(500).json({ error: 'Could not process your request. Please try again.' });
  }
};

// Get Voice Command Status
exports.getCommandFeedback = async (req, res) => {
  try {
    const command = await VoiceCommand.findById(req.params.id);
    if (!command) return res.status(404).json({ error: 'Command not found' });

    if (command.status === 'completed') {
      const results = command.result.length
        ? command.result.map(job => `${job.title} at ${job.location}. Pays ${job.salary}`).join('. ')
        : 'No jobs found matching your request';

      return res.json({ message: results });
    } else {
      return res.json({ message: 'Still searching for jobs. Please wait...' });
    }
  } catch (error) {
    console.error('Error fetching command feedback:', error);
    res.status(500).json({ error: 'Could not retrieve feedback. Please try again.' });
  }
};
