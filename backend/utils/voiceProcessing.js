// Voice command processing utilities
exports.parseVoiceCommand = (text) => {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error('Invalid input: Voice command text must be a non-empty string.');
    }

    const categories = ['construction', 'cleaning', 'driving', 'delivery'];
    const locations = ['mumbai', 'delhi', 'chennai', 'kolkata'];

    const lowerCaseText = text.toLowerCase();

    // ✅ Extract **all** matching categories and locations
    const matchedCategories = categories.filter(cat => lowerCaseText.includes(` ${cat} `) || lowerCaseText.endsWith(cat));
    const matchedLocations = locations.filter(loc => lowerCaseText.includes(` ${loc} `) || lowerCaseText.endsWith(loc));

    return {
        category: matchedCategories.length > 0 ? matchedCategories[0] : null,  // Return first matched category
        location: matchedLocations.length > 0 ? matchedLocations[0] : null      // Return first matched location
    };
};
