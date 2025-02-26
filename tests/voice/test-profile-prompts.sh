# tests/voice/test-profile-prompts.sh
#!/bin/bash
# Get profile prompts - Bash
curl \
  http://localhost:3002/api/voice/profile-prompts/en-US \
  -v