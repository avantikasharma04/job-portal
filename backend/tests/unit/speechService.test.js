const SpeechService = require('../../services/SpeechService'); // Adjust the path based on your project
const fs = require('fs');
const path = require('path');

// Mock test audio file
const testAudioPath = path.join(__dirname, '../test-files/test.wav');

describe('SpeechService Tests', () => {
    let speechService;

    beforeAll(() => {
        speechService = new SpeechService();
    });

    // 🟢 Test: transcribeAudio() with different languages
    test('transcribeAudio() should return text for English audio', async () => {
        const result = await speechService.transcribeAudio(testAudioPath, 'en-US');
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
    });

    test('transcribeAudio() should return text for French audio', async () => {
        const result = await speechService.transcribeAudio(testAudioPath, 'fr-FR');
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
    });

    // 🔴 Error Case: Invalid audio file
    test('transcribeAudio() should throw an error for an invalid file', async () => {
        await expect(speechService.transcribeAudio('invalidPath.wav', 'en-US'))
            .rejects.toThrow('File not found');
    });

    // 🟢 Test: synthesizeSpeech() with different languages
    test('synthesizeSpeech() should generate speech for English text', async () => {
        const speechBuffer = await speechService.synthesizeSpeech('Hello World', 'en-US');
        expect(speechBuffer).toBeInstanceOf(Buffer);
    });

    test('synthesizeSpeech() should generate speech for Spanish text', async () => {
        const speechBuffer = await speechService.synthesizeSpeech('Hola Mundo', 'es-ES');
        expect(speechBuffer).toBeInstanceOf(Buffer);
    });

    // 🔴 Error Case: Unsupported language
    test('synthesizeSpeech() should throw an error for an unsupported language', async () => {
        await expect(speechService.synthesizeSpeech('Hello', 'xx-XX'))
            .rejects.toThrow('Unsupported language');
    });

    // 🟢 Test: getSupportedLanguages()
    test('getSupportedLanguages() should return a list of languages', () => {
        const languages = speechService.getSupportedLanguages();
        expect(languages).toBeInstanceOf(Array);
        expect(languages).toContain('en-US');
        expect(languages).toContain('fr-FR');
    });
});
