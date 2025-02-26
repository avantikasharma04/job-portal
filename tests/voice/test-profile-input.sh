# tests/voice/test-profile-input.sh
#!/bin/bash
# Test profile input - Bash
curl -X POST \
  http://localhost:3002/api/voice/profile-input \
  -F "audio=@./test.wav" \
  -F "fieldName=name" \
  -F "languageCode=en-US" \
  -v