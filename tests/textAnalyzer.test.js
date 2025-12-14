const { analyzeText } = require('../src/utils/textAnalyzer');

describe('textAnalyzer', () => {

  describe('analyzeText', () => {
    test('retourne un score positif pour un texte avec des mots positifs', () => {
      expect(analyzeText('Je suis heureux et content')).toBeGreaterThan(0);
      expect(analyzeText('bien cool')).toBeGreaterThan(0);
      expect(analyzeText('joyeux serein')).toBeGreaterThan(0);
    });

    test('retourne un score négatif pour un texte avec des mots négatifs', () => {
      expect(analyzeText('Je suis triste et anxieux')).toBeLessThan(0);
      expect(analyzeText('mal stress')).toBeLessThan(0);
      expect(analyzeText('colère deteste')).toBeLessThan(0);
    });

    test('retourne 0 pour un texte neutre', () => {
      expect(analyzeText('La voiture est bleue')).toBe(0);
      expect(analyzeText('Il fait jour')).toBe(0);
      expect(analyzeText('')).toBe(0);
    });

    test('compte plusieurs occurrences du même mot', () => {
      const score1 = analyzeText('heureux');
      const score2 = analyzeText('heureux heureux');
      expect(score2).toBeGreaterThan(score1);
    });

    test('est insensible à la casse', () => {
      expect(analyzeText('HEUREUX')).toBeGreaterThan(0);
      expect(analyzeText('Heureux')).toBeGreaterThan(0);
      expect(analyzeText('heureux')).toBeGreaterThan(0);
    });

    test('gère les textes mixtes (positifs et négatifs)', () => {
      const score = analyzeText('Je suis heureux mais triste');
      // Le score devrait être proche de 0 (un mot positif, un mot négatif)
      expect(Math.abs(score)).toBeLessThan(3);
    });
  });
});
