const { positiveWords, negativeWords } = require('../../../../src/backend/domain/text-analysis/dictionaries');

describe('dictionaries', () => {
  describe('positiveWords', () => {
    test('est défini et est un tableau', () => {
      expect(positiveWords).toBeDefined();
      expect(Array.isArray(positiveWords)).toBe(true);
    });

    test('contient au moins un mot', () => {
      expect(positiveWords.length).toBeGreaterThan(0);
    });

    test('contient uniquement des chaînes de caractères', () => {
      positiveWords.forEach(word => {
        expect(typeof word).toBe('string');
      });
    });

    test('tous les mots sont en minuscules', () => {
      positiveWords.forEach(word => {
        expect(word).toBe(word.toLowerCase());
      });
    });

    test('ne contient pas de doublons', () => {
      const uniqueWords = [...new Set(positiveWords)];
      expect(uniqueWords.length).toBe(positiveWords.length);
    });

    test('contient des mots français attendus', () => {
      expect(positiveWords).toContain('bien');
      expect(positiveWords).toContain('heureux');
      expect(positiveWords).toContain('content');
      expect(positiveWords).toContain('joyeux');
    });

    test('contient des mots anglais attendus', () => {
      expect(positiveWords).toContain('love');
      expect(positiveWords).toContain('happy');
    });
  });

  describe('negativeWords', () => {
    test('est défini et est un tableau', () => {
      expect(negativeWords).toBeDefined();
      expect(Array.isArray(negativeWords)).toBe(true);
    });

    test('contient au moins un mot', () => {
      expect(negativeWords.length).toBeGreaterThan(0);
    });

    test('contient uniquement des chaînes de caractères', () => {
      negativeWords.forEach(word => {
        expect(typeof word).toBe('string');
      });
    });

    test('tous les mots sont en minuscules', () => {
      negativeWords.forEach(word => {
        expect(word).toBe(word.toLowerCase());
      });
    });

    test('ne contient pas de doublons', () => {
      const uniqueWords = [...new Set(negativeWords)];
      expect(uniqueWords.length).toBe(negativeWords.length);
    });

    test('contient des mots français attendus', () => {
      expect(negativeWords).toContain('mal');
      expect(negativeWords).toContain('triste');
      expect(negativeWords).toContain('colère');
    });

    test('contient des mots anglais attendus', () => {
      expect(negativeWords).toContain('hate');
    });
  });

  describe('séparation positif/négatif', () => {
    test('positiveWords et negativeWords ne partagent aucun mot', () => {
      const intersection = positiveWords.filter(word => negativeWords.includes(word));
      expect(intersection.length).toBe(0);
    });

    test('les deux dictionnaires sont de tailles comparables', () => {
      // Vérifie qu'on a un équilibre raisonnable entre positif et négatif
      const ratio = positiveWords.length / negativeWords.length;
      expect(ratio).toBeGreaterThan(0.5); // Au moins 50% de mots positifs par rapport aux négatifs
      expect(ratio).toBeLessThan(2); // Pas plus de 2x plus de positifs que de négatifs
    });
  });
});
