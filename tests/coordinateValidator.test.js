const { validateCoordinates, areCoordinatesUsable } = require('../src/utils/coordinateValidator');

describe('coordinateValidator', () => {

  describe('validateCoordinates', () => {
    test('accepte des coordonnées valides', () => {
      expect(() => validateCoordinates(48.8566, 2.3522)).not.toThrow();
      expect(() => validateCoordinates(0, 0)).not.toThrow();
      expect(() => validateCoordinates(-90, -180)).not.toThrow();
      expect(() => validateCoordinates(90, 180)).not.toThrow();
    });

    test('rejette des coordonnées non finies (NaN, Infinity)', () => {
      expect(() => validateCoordinates(NaN, 0)).toThrow('Invalid coordinates');
      expect(() => validateCoordinates(0, NaN)).toThrow('Invalid coordinates');
      expect(() => validateCoordinates(Infinity, 0)).toThrow('Invalid coordinates');
      expect(() => validateCoordinates(0, Infinity)).toThrow('Invalid coordinates');
    });
  });

  describe('areCoordinatesUsable', () => {
    test('retourne true pour des coordonnées valides', () => {
      expect(areCoordinatesUsable(48.8566, 2.3522)).toBe(true);
      expect(areCoordinatesUsable(0, 0)).toBe(true);
      expect(areCoordinatesUsable(-90, -180)).toBe(true);
      expect(areCoordinatesUsable(90, 180)).toBe(true);
    });

    test('retourne false pour des coordonnées null ou undefined', () => {
      expect(areCoordinatesUsable(null, null)).toBe(false);
      expect(areCoordinatesUsable(null, 2.3522)).toBe(false);
      expect(areCoordinatesUsable(48.8566, null)).toBe(false);
    });

    test('retourne false pour des coordonnées NaN', () => {
      expect(areCoordinatesUsable(NaN, 0)).toBe(false);
      expect(areCoordinatesUsable(0, NaN)).toBe(false);
    });
  });
});
