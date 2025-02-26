# tests/voice/test-tts.ps1
# Text-to-Speech test - PowerShell
curl.exe -X POST `
  http://localhost:3002/api/voice/synthesize `
  -H "Content-Type: application/json" `
  -d "{\"text\": \"Hello, how are you?\", \"languageCode\": \"en-US\"}" `
  -o output.mp3