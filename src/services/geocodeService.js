// Les services contiennent la logique métier 


const fetch = require('node-fetch');
const USE_MOCKS = process.env.USE_MOCKS === 'true';

async function reverseGeocode(lat, lon) {
    if (!isFinite(lat) || !isFinite(lon)) {
        throw new Error('Invalid coordinates for reverseGeocode');
    }

    if (USE_MOCKS) {
        return { display_name: 'Mock Place name', type: 'park', lat, lon, name: 'Mock Place' };
    }

    return ;
}

async function forwardGeocode(address) {
  if (!address || typeof address !== 'string') throw new Error('address must be a non-empty string');
  if (USE_MOCKS) {
    return { name: address, type: 'mock', lat: 48.8566, lon: 2.3522 };
  }

}

module.exports = { reverseGeocode, forwardGeocode };