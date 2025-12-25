process.env.USE_MOCKS = 'true';
const weatherService = require('../src/services/weatherService');

describe('Services weather (avec mocks)', () => {
  test('weatherService.getWeather : retourner des données météo simulées avec les variables demandées', async () => {
    const result = await weatherService.getWeather(43.3587255, 5.3576592);
    expect(result).toHaveProperty('source', 'mock');
    expect(result.data).toHaveProperty('temp');
    expect(result.data).toHaveProperty('weather');
    expect(result.data).toHaveProperty('humidity');
    expect(result.data).toHaveProperty('wind_speed');
  });
});
