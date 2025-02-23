const request = require('supertest');
const app = require('../../server'); // Adjust the path to your Express server
const fs = require('fs');
const path = require('path');

// Mock test audio file
const testAudioPath = path.join(__dirname, '../test-files/test.wav');

describe('Voice API Integration Tests', () => {
    
    // 🟢 Test: POST /api/voice/process (Transcription)
    test('POST /api/voice/process should return transcription', async () => {
        const response = await request(app)
            .post('/api/voice/process')
            .attach('file', testAudioPath)
            .field('language', 'en-US');

        expect(response.status).toBe(200);
        expect(response.body.transcription).toBeDefined();
    });

    // 🔴 Error Case: Missing file
    test('POST /api/voice/process should return error for missing file', async () => {
        const response = await request(app)
            .post('/api/voice/process')
            .field('language', 'en-US');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('No file uploaded');
    });

    // 🟢 Test: POST /api/voice/synthesize (Text-to-Speech)
    test('POST /api/voice/synthesize should return an audio buffer', async () => {
        const response = await request(app)
            .post('/api/voice/synthesize')
            .send({ text: 'Hello', language: 'en-US' });

        expect(response.status).toBe(200);
        expect(response.body.audio).toBeDefined();
    });

    // 🔴 Error Case: Unsupported language
    test('POST /api/voice/synthesize should return error for unsupported language', async () => {
        const response = await request(app)
            .post('/api/voice/synthesize')
            .send({ text: 'Hello', language: 'xx-XX' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Unsupported language');
    });

    // 🟢 Test: GET /api/voice/languages (Supported languages)
    test('GET /api/voice/languages should return a list of languages', async () => {
        const response = await request(app).get('/api/voice/languages');

        expect(response.status).toBe(200);
        expect(response.body.languages).toBeInstanceOf(Array);
        expect(response.body.languages).toContain('en-US');
    });
});
