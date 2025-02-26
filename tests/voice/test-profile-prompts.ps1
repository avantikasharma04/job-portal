# tests/voice/test-profile-prompts.ps1
# Get profile prompts - PowerShell
curl.exe `
  http://localhost:3002/api/voice/profile-prompts/en-US `
  -v