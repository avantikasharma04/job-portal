# tests/voice/test-tts.sh
#!/bin/bash
# Text-to-Speech test - Bash
curl -X POST \
  http://localhost:3002/api/voice/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you?", "languageCode": "en-US"}' \
  -o output.mp3
