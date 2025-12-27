/**
 * Test de vérification : Jest + Babel + ES6 Modules
 *
 * Ce test confirme que Babel transforme correctement les imports ES6
 */

import { CONFIG, SELECTORS } from '../public/js/constants.js';

describe('Jest + Babel Setup Verification', () => {
  test('devrait importer CONFIG depuis constants.js (ES6 module)', () => {
    expect(CONFIG).toBeDefined();
    expect(CONFIG.MAP).toBeDefined();
    expect(CONFIG.MAP.DEFAULT_LAT).toBe(48.8566);
    expect(CONFIG.MAP.DEFAULT_LON).toBe(2.3522);
  });

  test('devrait importer SELECTORS depuis constants.js (ES6 module)', () => {
    expect(SELECTORS).toBeDefined();
    expect(SELECTORS.MAP).toBe('map');
    expect(SELECTORS.ADDRESS_INPUT).toBe('address');
  });

  test('devrait avoir un environnement JSDOM fonctionnel', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();

    const div = document.createElement('div');
    div.id = 'test';
    expect(div.id).toBe('test');
  });
});
