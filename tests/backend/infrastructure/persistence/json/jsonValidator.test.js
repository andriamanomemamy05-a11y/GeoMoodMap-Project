const {
  parseJSON,
  validateArray,
  stringifyJSON,
} = require('../../../../../src/backend/infrastructure/persistence/json/jsonValidator');

describe('jsonValidator', () => {
  beforeEach(() => {
    // Spy sur console.error et console.warn pour éviter les logs pendant les tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  describe('parseJSON', () => {
    test('parse un JSON valide', () => {
      const result = parseJSON('{"test": true}', {});

      expect(result).toEqual({ test: true });
    });

    test('retourne fallback si JSON invalide', () => {
      const result = parseJSON('invalid json', []);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'jsonValidator: JSON parse error',
        expect.any(String)
      );
    });
  });

  describe('validateArray', () => {
    test('retourne le tableau si valide', () => {
      const result = validateArray([1, 2, 3], []);

      expect(result).toEqual([1, 2, 3]);
    });

    test('retourne fallback si pas un tableau', () => {
      const result = validateArray({ test: true }, []);

      expect(result).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        'jsonValidator: data is not an array, using fallback'
      );
    });
  });

  describe('stringifyJSON', () => {
    test('sérialise un objet en JSON formaté', () => {
      const result = stringifyJSON({ test: true });

      expect(result).toBe('{\n  "test": true\n}');
    });

    test('indente avec 2 espaces', () => {
      const result = stringifyJSON({ nested: { value: 42 } });

      expect(result).toContain('  ');
      expect(result).toBe('{\n  "nested": {\n    "value": 42\n  }\n}');
    });
  });
});
