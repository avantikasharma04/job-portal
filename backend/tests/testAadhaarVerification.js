// tests/testAadhaarVerification.js
const fetch = require('node-fetch'); // Use this if Node < 18; otherwise, global fetch exists in Node 18+

async function testAadhaarVerification() {
  try {
    const response = await fetch('http://localhost:3002/api/verify-aadhaar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaarNumber: '499032145371' }),
    });

    if (!response.ok) {
      console.error('Server responded with status:', response.status);
      const text = await response.text();
      console.error('Response Text:', text);
      return;
    }

    const data = await response.json();
    console.log('Verification Response:', data);

    // Log the full source output details from the response
    console.log('Full Verification Result:', JSON.stringify(data.data.result.source_output, null, 2));
  } catch (error) {
    console.error('Error verifying Aadhaar:', error);
  }
}

testAadhaarVerification();
