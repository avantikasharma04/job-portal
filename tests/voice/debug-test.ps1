Write-Host "Testing with explicit language code..."
curl.exe -X POST `
  http://localhost:3002/api/voice/process `
  -F "audio=@.\tests\voice\audio\test.wav" `
  -F "languageCode=en-US" `
  -v