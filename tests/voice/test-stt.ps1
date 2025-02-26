# Modified test-stt.ps1
Write-Host "Testing speech-to-text with default parameters..."
curl.exe -X POST `
  http://localhost:3002/api/voice/process `
  -F "audio=@.\tests\voice\audio\test.wav" `
  -F "languageCode=en-US" `
  -F "encoding=LINEAR16" `
  -F "sampleRate=16000" `
  -v