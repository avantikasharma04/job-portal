// controllers/verifyAadhaarController.js

const fetch = require('node-fetch'); // Use if Node < 18; for Node 18+ you can use global fetch.
const { v4: uuidv4 } = require('uuid'); // For generating unique identifiers.
require('dotenv').config(); // Loads variables from .env file

exports.verify = async (req, res) => {
  try {
    // Extract the Aadhaar number from the request body.
    const { aadhaarNumber } = req.body;
    if (!aadhaarNumber) {
      return res.status(400).json({ error: 'Aadhaar number is required' });
    }

    // Generate unique IDs for task_id and group_id.
    const taskId = uuidv4();
    const groupId = uuidv4(); // You may want to generate this once per profile or session.

    // Define the API endpoint
    const idfyUrl = 'https://eve.idfy.com/v3/tasks/sync/verify_with_source/aadhaar_lite';

    // Prepare headers with your API credentials from the .env file
    const headers = {
      'api-key': process.env.IDFY_API_KEY,
      'account-id': process.env.IDFY_ACCOUNT_ID,
      'Content-Type': 'application/json',
    };

    // Construct the request body according to the documentation
    const body = {
      task_id: taskId,
      group_id: groupId,
      data: {
        aadhaar_number: aadhaarNumber,
      },
    };

    console.log("Sending request to IDfy with body:", body); // Debug log

    // Send the POST request to IDfy API
    const response = await fetch(idfyUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // Check for non-OK responses
    if (!response.ok) {
      const errorDetails = await response.text();
      return res.status(response.status).json({ error: `IDfy API error: ${errorDetails}` });
    }

    // Parse the JSON response from the API
    const result = await response.json();
    res.json({ success: true, data: result });
    
  } catch (error) {
    console.error("Error verifying Aadhaar:", error);
    res.status(500).json({ error: 'Server error while verifying Aadhaar' });
  }
};
