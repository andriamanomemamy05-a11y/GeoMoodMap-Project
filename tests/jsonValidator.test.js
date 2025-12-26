const { parseJSON, validateArray, stringifyJSON } = require('../src/infrastructure/persistence/json/jsonValidator');

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

    test('parse un tableau JSON valide', () => {
      const result = parseJSON('[1, 2, 3]', []);

      expect(result).toEqual([1, 2, 3]);
    });

    test('retourne fallback si JSON invalide', () => {
      const result = parseJSON('invalid json', []);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'jsonValidator: JSON parse error',
        expect.any(String)
      );
    });

    test('retourne fallback si chaîne vide', () => {
      const result = parseJSON('', { default: true });

      expect(result).toEqual({ default: true });
    });

    test('utilise le fallback personnalisé', () => {
      const customFallback = { error: 'invalid' };
      const result = parseJSON('bad json', customFallback);

      expect(result).toEqual(customFallback);
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

    test('retourne fallback si null', () => {
      const result = validateArray(null, []);

      expect(result).toEqual([]);
    });

    test('retourne fallback si undefined', () => {
      const result = validateArray(undefined, []);

      expect(result).toEqual([]);
    });

    test('retourne fallback si string', () => {
      const result = validateArray('not an array', []);

      expect(result).toEqual([]);
    });

    test('utilise le fallback personnalisé', () => {
      const customFallback = ['default'];
      const result = validateArray('invalid', customFallback);

      expect(result).toEqual(customFallback);
    });

    test('accepte un tableau vide', () => {
      const result = validateArray([], []);

      expect(result).toEqual([]);
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('stringifyJSON', () => {
    test('sérialise un objet en JSON formaté', () => {
      const result = stringifyJSON({ test: true });

      expect(result).toBe('{\n  "test": true\n}');
    });

    test('sérialise un tableau en JSON formaté', () => {
      const result = stringifyJSON([1, 2, 3]);

      expect(result).toBe('[\n  1,\n  2,\n  3\n]');
    });

    test('indente avec 2 espaces', () => {
      const result = stringifyJSON({ nested: { value: 42 } });

      expect(result).toContain('  ');
      expect(result).toBe('{\n  "nested": {\n    "value": 42\n  }\n}');
    });

    test('gère les valeurs null', () => {
      const result = stringifyJSON(null);

      expect(result).toBe('null');
    });

    test('gère les tableaux vides', () => {
      const result = stringifyJSON([]);

      expect(result).toBe('[]');
    });
  });
});
