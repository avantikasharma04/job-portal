# tests/voice/test-stt.sh
#!/bin/bash
# Speech-to-Text test - Bash
curl -X POST \
  http://localhost:3002/api/voice/process \
  -F "audio=@./test.wav" \
  -F "languageCode=en-US" \
  -v