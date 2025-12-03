const fetch = require('node-fetch');
const USE_MOCKS = process.env.USE_MOCKS === 'true'; 

async function getWeather(lat, lon) {
  if (!isFinite(lat) || !isFinite(lon)) throw new Error('Invalid coordinates for getWeather');

  if (USE_MOCKS) {
    return {
      source: 'mock',
      data: { temp: 15, weather: 'light rain', humidity: 80, wind_speed: 3.5 }
    };
  }

  if (!OPENWEATHER_KEY) {
    throw new Error('OPENWEATHER_API_KEY not set');
  }


  return { source: 'openweather', data };
}

module.exports = { getWeather };