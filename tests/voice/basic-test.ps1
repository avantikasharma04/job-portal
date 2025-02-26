# basic-test.ps1
Write-Host "Running basic test..."
curl.exe -X POST `
  http://localhost:3002/api/voice/basic-test `
  -F "audio=@.\tests\voice\audio\test.wav" `
  -F "languageCode=en-US" `
  -v