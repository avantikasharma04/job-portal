// tests/voice/run-tests.js
const { execSync } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const scriptExt = isWindows ? 'ps1' : 'sh';

const tests = [
  'test-stt',
  'test-tts',
  'test-profile-prompts',
  'test-profile-input'
];

async function runTests() {
  console.log('Starting voice API tests...\n');

  for (const test of tests) {
    const scriptPath = path.join(__dirname, `${test}.${scriptExt}`);
    console.log(`Running ${test}...`);
    
    try {
      if (isWindows) {
        execSync(`powershell -File "${scriptPath}"`, { stdio: 'inherit' });
      } else {
        execSync(`bash "${scriptPath}"`, { stdio: 'inherit' });
      }
      console.log(`✓ ${test} completed successfully\n`);
    } catch (error) {
      console.error(`✗ ${test} failed:`, error.message, '\n');
    }
  }
}

runTests().catch(console.error);