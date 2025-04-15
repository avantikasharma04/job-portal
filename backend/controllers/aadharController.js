// Backend: controllers/aadhaarController.js
const axios = require('axios');
const config = require('../config');

exports.verifyAadhaar = async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;
    
    // Generate a unique task_id and group_id (you might want to use UUID)
    const task_id = `task-${Date.now()}`;
    const group_id = `group-${Date.now()}`;
    
    const response = await axios.post('https://eve.idfy.com/v3/tasks/sync/verify_with_source/aadhaar_lite', {
      task_id,
      group_id,
      data: {
        aadhaar_number: aadhaarNumber
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.IDFY_API_KEY}` // You need to get this API key
      }
    });
    
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Aadhaar verification error:', error.response?.data || error.message);
    return res.status(500).json({
      message: 'Failed to verify Aadhaar',
      error: error.response?.data || error.message
    });
  }
};