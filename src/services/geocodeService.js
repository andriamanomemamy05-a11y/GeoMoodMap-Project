const fetch = require('node-fetch');
const USE_MOCKS = process.env.USE_MOCKS === 'true';

// User-Agent obligatoire pour Nominatim
const USER_AGENT = process.env.NOMINATIM_USER_AGENT || 'MoodApp/1.0 (andriamanomemamy05@gmail.com)';

/**
 * reverseGeocode(lat, lon)
 * Utilise Nominatim (OpenStreetMap) pour récupérer le lieu réel.
 */
async function reverseGeocode(lat, lon) {
    // Les coordonnées géographiquessont obligatoires
    if (!isFinite(lat) || !isFinite(lon)) {
        throw new Error('Invalid coordinates for reverseGeocode');
    }

    // Si mock true, on utilise les données de test
    if (USE_MOCKS) {
        return { display_name: 'Mock Place', type: 'park', lat, lon, name: 'Mock Place' };
    }

    // Appel de Nominatim pour récupérer le lieu exacte venant des données géographiques réçues
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error(`Nominatim reverse error: ${res.status}`);
    const json = await res.json();

    // Retourner les données nécessaires sur le lieu
    return {
        name: json.display_name || 'unknown',
        type: json.type || 'unknown',
        lat,
        lon
    };
}


/**
 * forwardGeocode(address)
 * Utilise Nominatim pour transformer une adresse en coordonnées
 */
async function forwardGeocode(address) {
    // L'adresse est obligatoire
    if (!address || typeof address !== 'string') throw new Error('address must be a non-empty string');
    
    // Si mock est true, on utilise les données de test
    if (USE_MOCKS) {
        return { name: address, type: 'mock', lat: 48.8566, lon: 2.3522 };
    }

    // Appel de Nominatim avec l'adresse réçue pour récupérer les lat et lon exacte de l'adresse
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error(`Nominatim forward error: ${res.status}`);
    const json = await res.json();
    const first = json[0] || {};

    // Retourner les données nécessaires sur le lieu selon l'adresse
    return {
        name: first.display_name || address,
        type: first.type || 'unknown',
        lat: first.lat ? Number(first.lat) : null,
        lon: first.lon ? Number(first.lon) : null
    };
}

module.exports = { reverseGeocode, forwardGeocode };
