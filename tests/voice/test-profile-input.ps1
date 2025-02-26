# tests/voice/test-profile-input.ps1
# Test profile input - PowerShell
curl.exe -X POST `
  http://localhost:3002/api/voice/profile-input `
  -F "audio=@.\test.wav" `
  -F "fieldName=name" `
  -F "languageCode=en-US" `
  -v