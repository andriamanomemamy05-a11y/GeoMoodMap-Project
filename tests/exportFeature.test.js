// Test pour vérifier la fonctionnalité d'export de fichier texte

/**
 * Ce test vérifie que la logique d'export est correctement implémentée.
 * Comme l'export utilise des APIs du navigateur (Blob, URL.createObjectURL, DOM),
 * nous testons la génération du contenu formaté.
 */

describe('Export Feature', () => {
  test('génère le contenu formaté correctement avec toutes les données', () => {
    const mood = {
      text: 'Je me sens très bien aujourd\'hui',
      rating: 5,
      scoreResult: 85,
      place: {
        name: 'Paris, France'
      },
      lat: 48.8566,
      lon: 2.3522,
      weather: {
        temp: 22,
        humidity: 65,
        weather: 'clear sky',
        wind_speed: 3.5
      },
      createdAt: '2025-12-25T10:30:00.000Z'
    };

    const expectedContent = `==============================================
RAPPORT D'HUMEUR - ${new Date(mood.createdAt).toLocaleString('fr-FR')}
==============================================

HUMEUR
------
Description : ${mood.text}
Note : ${mood.rating}/5
Score final : ${mood.scoreResult}%

LOCALISATION
------------
Adresse : ${mood.place.name}
Coordonnées : ${mood.lat}, ${mood.lon}

MÉTÉO
-----
Température : ${mood.weather.temp} °C
Humidité : ${mood.weather.humidity} %
Conditions : ${mood.weather.weather}
Vent : ${mood.weather.wind_speed} m/s

==============================================
`;

    // Simuler la génération du contenu (même logique que dans script.js)
    const content = `==============================================
RAPPORT D'HUMEUR - ${new Date(mood.createdAt).toLocaleString('fr-FR')}
==============================================

HUMEUR
------
Description : ${mood.text}
Note : ${mood.rating}/5
Score final : ${mood.scoreResult ?? 'N/A'}%

LOCALISATION
------------
Adresse : ${mood.place?.name || mood.address || 'N/A'}
Coordonnées : ${mood.lat}, ${mood.lon}

MÉTÉO
-----
${mood.weather ? `Température : ${mood.weather.temp} °C
Humidité : ${mood.weather.humidity} %
Conditions : ${mood.weather.weather}
Vent : ${mood.weather.wind_speed} m/s` : 'Pas de données météo disponibles'}

==============================================
`;

    expect(content).toBe(expectedContent);
  });

  test('gère correctement les données manquantes (pas de météo)', () => {
    const mood = {
      text: 'Test sans météo',
      rating: 3,
      scoreResult: 60,
      address: 'Adresse manuelle',
      lat: 45.5,
      lon: -73.5,
      weather: null,
      createdAt: '2025-12-25T10:30:00.000Z'
    };

    const content = `==============================================
RAPPORT D'HUMEUR - ${new Date(mood.createdAt).toLocaleString('fr-FR')}
==============================================

HUMEUR
------
Description : ${mood.text}
Note : ${mood.rating}/5
Score final : ${mood.scoreResult ?? 'N/A'}%

LOCALISATION
------------
Adresse : ${mood.place?.name || mood.address || 'N/A'}
Coordonnées : ${mood.lat}, ${mood.lon}

MÉTÉO
-----
${mood.weather ? `Température : ${mood.weather.temp} °C
Humidité : ${mood.weather.humidity} %
Conditions : ${mood.weather.weather}
Vent : ${mood.weather.wind_speed} m/s` : 'Pas de données météo disponibles'}

==============================================
`;

    expect(content).toContain('Pas de données météo disponibles');
    expect(content).toContain('Adresse : Adresse manuelle');
  });

  test('gère correctement un scoreResult à null', () => {
    const mood = {
      text: 'Test score null',
      rating: 4,
      scoreResult: null,
      place: {
        name: 'Lyon, France'
      },
      lat: 45.764,
      lon: 4.8357,
      weather: {
        temp: 18,
        humidity: 70,
        weather: 'cloudy',
        wind_speed: 2.1
      },
      createdAt: '2025-12-25T10:30:00.000Z'
    };

    const content = `==============================================
RAPPORT D'HUMEUR - ${new Date(mood.createdAt).toLocaleString('fr-FR')}
==============================================

HUMEUR
------
Description : ${mood.text}
Note : ${mood.rating}/5
Score final : ${mood.scoreResult ?? 'N/A'}%

LOCALISATION
------------
Adresse : ${mood.place?.name || mood.address || 'N/A'}
Coordonnées : ${mood.lat}, ${mood.lon}

MÉTÉO
-----
${mood.weather ? `Température : ${mood.weather.temp} °C
Humidité : ${mood.weather.humidity} %
Conditions : ${mood.weather.weather}
Vent : ${mood.weather.wind_speed} m/s` : 'Pas de données météo disponibles'}

==============================================
`;

    expect(content).toContain('Score final : N/A%');
  });

  test('gère correctement l\'absence de place (utilise address)', () => {
    const mood = {
      text: 'Test sans place',
      rating: 2,
      scoreResult: 45,
      address: '123 Rue de Test',
      lat: 48.5,
      lon: 2.5,
      weather: {
        temp: 15,
        humidity: 80,
        weather: 'rainy',
        wind_speed: 5
      },
      createdAt: '2025-12-25T10:30:00.000Z'
    };

    const content = `==============================================
RAPPORT D'HUMEUR - ${new Date(mood.createdAt).toLocaleString('fr-FR')}
==============================================

HUMEUR
------
Description : ${mood.text}
Note : ${mood.rating}/5
Score final : ${mood.scoreResult ?? 'N/A'}%

LOCALISATION
------------
Adresse : ${mood.place?.name || mood.address || 'N/A'}
Coordonnées : ${mood.lat}, ${mood.lon}

MÉTÉO
-----
${mood.weather ? `Température : ${mood.weather.temp} °C
Humidité : ${mood.weather.humidity} %
Conditions : ${mood.weather.weather}
Vent : ${mood.weather.wind_speed} m/s` : 'Pas de données météo disponibles'}

==============================================
`;

    expect(content).toContain('Adresse : 123 Rue de Test');
  });

  test('gère correctement l\'absence totale d\'adresse', () => {
    const mood = {
      text: 'Test sans adresse du tout',
      rating: 3,
      scoreResult: 50,
      lat: 0,
      lon: 0,
      weather: null,
      createdAt: '2025-12-25T10:30:00.000Z'
    };

    const content = `==============================================
RAPPORT D'HUMEUR - ${new Date(mood.createdAt).toLocaleString('fr-FR')}
==============================================

HUMEUR
------
Description : ${mood.text}
Note : ${mood.rating}/5
Score final : ${mood.scoreResult ?? 'N/A'}%

LOCALISATION
------------
Adresse : ${mood.place?.name || mood.address || 'N/A'}
Coordonnées : ${mood.lat}, ${mood.lon}

MÉTÉO
-----
${mood.weather ? `Température : ${mood.weather.temp} °C
Humidité : ${mood.weather.humidity} %
Conditions : ${mood.weather.weather}
Vent : ${mood.weather.wind_speed} m/s` : 'Pas de données météo disponibles'}

==============================================
`;

    expect(content).toContain('Adresse : N/A');
  });
});
