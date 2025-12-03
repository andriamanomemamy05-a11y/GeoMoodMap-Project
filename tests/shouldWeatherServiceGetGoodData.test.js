process.env.USE_MOCKS = 'true';
const weatherService = require('../src/services/weatherService');


describe('Services weather (avec mocks)', () => {

    test('weatherService.getWeather : test si un des variables passées n"est pas bonne', async () => {
        const result = await weatherService.getWeather('must_not_string', 2.3522);
        expect(result).toHaveProperty('source', 'mock');
        expect(result.data).toHaveProperty('temp');
        expect(result.data).toHaveProperty('weather');
        expect(result.data).toHaveProperty('humidity');
        expect(result.data).toHaveProperty('wind_speed');
    });

    test('weatherService.getWeather : test si la variable passée n"est pas suffisant', async () => {
        const result = await weatherService.getWeather(2.3522);
        expect(result).toHaveProperty('source', 'mock');
        expect(result.data).toHaveProperty('temp');
        expect(result.data).toHaveProperty('weather');
        expect(result.data).toHaveProperty('humidity');
        expect(result.data).toHaveProperty('wind_speed');
    });

});