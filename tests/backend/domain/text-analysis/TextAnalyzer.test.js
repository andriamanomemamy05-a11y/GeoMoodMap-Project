const { analyzeText } = require('../../../../src/backend/domain/text-analysis/TextAnalyzer');

describe('TextAnalyzer', () => {
  describe('analyzeText', () => {
    test('retourne un score positif pour un texte avec mots positifs', () => {
      const text = 'Je suis heureux et content';
      const score = analyzeText(text);
      expect(score).toBeGreaterThan(0);
      expect(score).toBe(2); // 'heureux' + 'content' = +2
    });

    test('retourne un score négatif pour un texte avec mots négatifs', () => {
      const text = 'Je suis triste et mauvais';
      const score = analyzeText(text);
      expect(score).toBeLessThan(0);
      expect(score).toBe(-2); // 'triste' + 'mauvais' = -2
    });

    test('retourne un score mixte pour un texte avec mots positifs et négatifs', () => {
      const text = 'Je suis heureux mais un peu triste';
      const score = analyzeText(text);
      expect(score).toBe(0); // 'heureux' (+1) + 'triste' (-1) = 0
    });

    test('retourne 0 pour un texte neutre sans mots du dictionnaire', () => {
      const text = 'Bonjour, comment allez-vous ?';
      const score = analyzeText(text);
      expect(score).toBe(0);
    });

    test('retourne 0 pour un texte vide', () => {
      const score = analyzeText('');
      expect(score).toBe(0);
    });

    test('retourne 0 pour null', () => {
      const score = analyzeText(null);
      expect(score).toBe(0);
    });

    test('retourne 0 pour undefined', () => {
      const score = analyzeText(undefined);
      expect(score).toBe(0);
    });

    test('retourne 0 pour un type non-string', () => {
      const score = analyzeText(123);
      expect(score).toBe(0);
    });

    test('applique le clamping pour un score très positif (> MAX_SCORE)', () => {
      // Texte avec beaucoup de mots positifs
      const text = 'bien heureux content joyeux serein love happy ravi cool bien';
      const score = analyzeText(text);
      expect(score).toBe(5); // Clampé à MAX_SCORE = 5
    });

    test('applique le clamping pour un score très négatif (< MIN_SCORE)', () => {
      // Texte avec beaucoup de mots négatifs
      const text = 'mal triste hate déçu colère anxieux stress mauvais deteste mal';
      const score = analyzeText(text);
      expect(score).toBe(-5); // Clampé à MIN_SCORE = -5
    });

    test('est insensible à la casse', () => {
      const text1 = 'HEUREUX';
      const text2 = 'heureux';
      const text3 = 'HeUrEuX';
      expect(analyzeText(text1)).toBe(1);
      expect(analyzeText(text2)).toBe(1);
      expect(analyzeText(text3)).toBe(1);
    });

    test('supporte les mots en anglais', () => {
      const text = 'I love this, it makes me happy';
      const score = analyzeText(text);
      expect(score).toBe(2); // 'love' + 'happy' = +2
    });

    test('supporte les mots en français', () => {
      const text = 'Je me sens bien et serein';
      const score = analyzeText(text);
      expect(score).toBe(2); // 'bien' + 'serein' = +2
    });

    test('gère les mots avec ponctuation', () => {
      const text = 'Heureux! Content? Joyeux.';
      const score = analyzeText(text);
      expect(score).toBe(3); // 'heureux' + 'content' + 'joyeux' = +3
    });

    test('gère les mots répétés', () => {
      const text = 'heureux heureux heureux';
      const score = analyzeText(text);
      expect(score).toBe(3); // 'heureux' x3 = +3
    });

    test('ignore les mots partiels', () => {
      const text = 'heureusement tristesse'; // Pas dans le dictionnaire
      const score = analyzeText(text);
      expect(score).toBe(0);
    });

    test('calcule correctement un texte réaliste mixte', () => {
      const text =
        "Je suis content de cette journée mais un peu triste par la pluie. C'est cool quand même !";
      const score = analyzeText(text);
      // 'content' (+1) + 'triste' (-1) + 'cool' (+1) = +1
      expect(score).toBe(1);
    });
  });
});
