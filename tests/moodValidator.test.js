const { validateMoodInput } = require('../src/application/validators/moodValidator');

describe('moodValidator', () => {
  describe('validateMoodInput', () => {
    test('valide des données complètes avec coordonnées', () => {
      const input = {
        text: 'Je me sens bien',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        imageUrl: null,
      };

      const result = validateMoodInput(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.data).toEqual({
        text: 'Je me sens bien',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        address: null,
        imageUrl: null,
      });
    });

    test('valide des données avec adresse au lieu de coordonnées', () => {
      const input = {
        text: 'Test avec adresse',
        rating: 3,
        address: '123 Rue de Paris',
      };

      const result = validateMoodInput(input);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.data.address).toBe('123 Rue de Paris');
      expect(result.data.lat).toBeNull();
      expect(result.data.lon).toBeNull();
    });

    test('rejette un texte vide', () => {
      const input = {
        text: '',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
      };

      const result = validateMoodInput(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('text is required and must be a non-empty string');
    });

    test('rejette un rating invalide', () => {
      const input = {
        text: 'Test',
        rating: 'invalid',
        lat: 48.8566,
        lon: 2.3522,
      };

      const result = validateMoodInput(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('rating is required and must be a number (1-5 recommended)');
    });

    test('rejette absence de coordonnées ET adresse', () => {
      const input = {
        text: 'Test',
        rating: 3,
      };

      const result = validateMoodInput(input);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Provide either lat+lon or address');
    });

    test('normalise le rating en nombre', () => {
      const input = {
        text: 'Test',
        rating: '5',
        lat: 48.8566,
        lon: 2.3522,
      };

      const result = validateMoodInput(input);

      expect(result.isValid).toBe(true);
      expect(result.data.rating).toBe(5);
      expect(typeof result.data.rating).toBe('number');
    });

    test('trim les espaces du texte', () => {
      const input = {
        text: '  Test avec espaces  ',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
      };

      const result = validateMoodInput(input);

      expect(result.data.text).toBe('Test avec espaces');
    });

    test('gère imageUrl correctement', () => {
      const input = {
        text: 'Test',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        imageUrl: 'data:image/png;base64,abc123',
      };

      const result = validateMoodInput(input);

      expect(result.data.imageUrl).toBe('data:image/png;base64,abc123');
    });
  });
});
