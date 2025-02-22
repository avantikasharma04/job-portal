#!/bin/bash
curl -X POST http://localhost:3002/api/voice/process -F "audio=@./test.wav" -v