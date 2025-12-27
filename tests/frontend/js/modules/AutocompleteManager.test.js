/**
 * Tests unitaires pour AutocompleteManager
 */

import { AutocompleteManager } from '../../../../src/frontend/js/modules/AutocompleteManager.js';

describe('AutocompleteManager', () => {
  let mockMapManager;

  beforeEach(() => {
    jest.useFakeTimers();

    mockMapManager = { setPosition: jest.fn() };

    const input = document.createElement('input');
    input.id = 'address';
    document.body.appendChild(input);

    const div = document.createElement('div');
    div.id = 'autocomplete';
    document.body.appendChild(div);

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  test('devrait vider suggestions si requête vide', () => {
    new AutocompleteManager(mockMapManager);
    const autocomplete = document.getElementById('autocomplete');
    autocomplete.innerHTML = 'test';

    const input = document.getElementById('address');
    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(autocomplete.innerHTML).toBe('');
  });

  test('devrait appeler fetch avec debounce', async () => {
    global.fetch.mockResolvedValue({ json: () => Promise.resolve([]) });

    new AutocompleteManager(mockMapManager);
    const input = document.getElementById('address');

    input.value = 'Paris';
    input.dispatchEvent(new Event('input'));

    jest.advanceTimersByTime(300);
    await Promise.resolve();

    expect(global.fetch).toHaveBeenCalledWith('/api/search?q=Paris');
  });

  test('devrait afficher suggestions', async () => {
    const results = [{ name: 'Paris, France', lat: 48.8566, lon: 2.3522 }];
    global.fetch.mockResolvedValue({ json: () => Promise.resolve(results) });

    new AutocompleteManager(mockMapManager);
    const input = document.getElementById('address');

    input.value = 'Paris';
    input.dispatchEvent(new Event('input'));

    jest.advanceTimersByTime(300);
    await Promise.resolve();
    await Promise.resolve();

    const suggestions = document.querySelectorAll('.autocomplete-suggestion');
    expect(suggestions.length).toBe(1);
    expect(suggestions[0].textContent).toBe('Paris, France');
  });

  test('devrait gérer clic sur suggestion', async () => {
    const results = [{ name: 'Paris', lat: 48.8566, lon: 2.3522 }];
    global.fetch.mockResolvedValue({ json: () => Promise.resolve(results) });

    new AutocompleteManager(mockMapManager);
    const input = document.getElementById('address');

    input.value = 'Paris';
    input.dispatchEvent(new Event('input'));

    jest.advanceTimersByTime(300);
    await Promise.resolve();
    await Promise.resolve();

    const suggestion = document.querySelector('.autocomplete-suggestion');
    suggestion.click();

    expect(input.value).toBe('Paris');
    expect(mockMapManager.setPosition).toHaveBeenCalledWith(48.8566, 2.3522);
  });

  test('devrait retourner la valeur', () => {
    const manager = new AutocompleteManager(mockMapManager);
    document.getElementById('address').value = 'Test';

    expect(manager.getValue()).toBe('Test');
  });

  test('devrait gérer erreur fetch', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    new AutocompleteManager(mockMapManager);
    const input = document.getElementById('address');

    input.value = 'Paris';
    input.dispatchEvent(new Event('input'));

    jest.advanceTimersByTime(300);
    await Promise.resolve();
    await Promise.resolve();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
