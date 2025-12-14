const { clamp } = require('../src/utils/mathHelpers');

describe('mathHelpers', () => {

  describe('clamp', () => {
    test('retourne la valeur si elle est entre min et max', () => {
      expect(clamp(50, 0, 100)).toBe(50);
      expect(clamp(0, 0, 100)).toBe(0);
      expect(clamp(100, 0, 100)).toBe(100);
    });

    test('retourne max si la valeur dépasse max', () => {
      expect(clamp(150, 0, 100)).toBe(100);
      expect(clamp(101, 0, 100)).toBe(100);
    });

    test('retourne min si la valeur est inférieure à min', () => {
      expect(clamp(-10, 0, 100)).toBe(0);
      expect(clamp(-1, 0, 100)).toBe(0);
    });

    test('fonctionne avec des nombres négatifs', () => {
      expect(clamp(-50, -100, 0)).toBe(-50);
      expect(clamp(-150, -100, 0)).toBe(-100);
      expect(clamp(10, -100, 0)).toBe(0);
    });
  });
});
