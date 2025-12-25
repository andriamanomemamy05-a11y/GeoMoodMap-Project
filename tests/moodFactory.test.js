const { buildMood } = require('../src/factories/moodFactory');

describe('moodFactory', () => {
  describe('buildMood', () => {
    test('construit un objet mood complet avec toutes les données', () => {
      const params = {
        text: 'Je me sens bien',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        place: { name: 'Paris, France', type: 'city' },
        weather: { temp: 22, humidity: 65, weather: 'clear sky', wind_speed: 3.5 },
        textScore: 2,
        scoreResult: 75,
        imageUrl: 'selfies/selfie_123456.png',
      };

      const mood = buildMood(params);

      expect(mood.text).toBe('Je me sens bien');
      expect(mood.rating).toBe(4);
      expect(mood.lat).toBe(48.8566);
      expect(mood.lon).toBe(2.3522);
      expect(mood.place).toEqual({ name: 'Paris, France', type: 'city' });
      expect(mood.weather).toEqual({ temp: 22, humidity: 65, weather: 'clear sky', wind_speed: 3.5 });
      expect(mood.textScore).toBe(2);
      expect(mood.scoreResult).toBe(75);
      expect(mood.imageUrl).toBe('selfies/selfie_123456.png');
    });

    test('génère un ID basé sur timestamp', () => {
      const params = {
        text: 'Test',
        rating: 3,
        lat: 0,
        lon: 0,
        place: null,
        weather: null,
        textScore: 0,
        scoreResult: 50,
        imageUrl: null,
      };

      const mood1 = buildMood(params);
      const mood2 = buildMood(params);

      expect(mood1.id).toBeDefined();
      expect(mood2.id).toBeDefined();
      expect(typeof mood1.id).toBe('number');
      // Les IDs devraient être différents (ou égaux si exécutés au même millisecond)
      expect(mood2.id).toBeGreaterThanOrEqual(mood1.id);
    });

    test('génère un createdAt au format ISO', () => {
      const params = {
        text: 'Test',
        rating: 3,
        lat: 0,
        lon: 0,
        place: null,
        weather: null,
        textScore: 0,
        scoreResult: 50,
        imageUrl: null,
      };

      const mood = buildMood(params);

      expect(mood.createdAt).toBeDefined();
      expect(typeof mood.createdAt).toBe('string');
      // Vérifie que c'est une date ISO valide
      expect(new Date(mood.createdAt).toISOString()).toBe(mood.createdAt);
    });

    test('gère imageUrl null correctement', () => {
      const params = {
        text: 'Test sans image',
        rating: 3,
        lat: 48.8566,
        lon: 2.3522,
        place: null,
        weather: null,
        textScore: 0,
        scoreResult: 50,
        imageUrl: null,
      };

      const mood = buildMood(params);

      expect(mood.imageUrl).toBeNull();
    });

    test('gère place et weather null correctement', () => {
      const params = {
        text: 'Test minimal',
        rating: 3,
        lat: null,
        lon: null,
        place: null,
        weather: null,
        textScore: 0,
        scoreResult: 50,
        imageUrl: null,
      };

      const mood = buildMood(params);

      expect(mood.place).toBeNull();
      expect(mood.weather).toBeNull();
      expect(mood.lat).toBeNull();
      expect(mood.lon).toBeNull();
    });

    test('conserve tous les champs dans la structure finale', () => {
      const params = {
        text: 'Test',
        rating: 5,
        lat: 45.764,
        lon: 4.8357,
        place: { name: 'Lyon' },
        weather: { temp: 18 },
        textScore: 3,
        scoreResult: 85,
        imageUrl: 'selfies/test.jpg',
      };

      const mood = buildMood(params);

      // Vérifie que tous les champs attendus sont présents
      expect(Object.keys(mood)).toEqual([
        'id',
        'text',
        'rating',
        'lat',
        'lon',
        'place',
        'weather',
        'textScore',
        'scoreResult',
        'imageUrl',
        'createdAt',
      ]);
    });
  });
});
