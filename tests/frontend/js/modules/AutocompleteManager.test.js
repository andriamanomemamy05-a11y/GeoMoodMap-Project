/**
 * Unit tests for AutocompleteManager (SOLID refactored)
 */

import { AutocompleteManager } from '../../../../src/frontend/js/modules/AutocompleteManager.js';
import { SELECTORS, CONFIG } from '../../../../src/frontend/js/constants.js';

describe('AutocompleteManager', () => {
  let mockMapManager;

  beforeEach(() => {
    jest.useFakeTimers();

    // Mock du mapManager injecté
    mockMapManager = { setPosition: jest.fn() };

    // Création du DOM pour l'input et le container des suggestions
    const input = document.createElement('input');
    input.id = SELECTORS.ADDRESS_INPUT;
    document.body.appendChild(input);

    const div = document.createElement('div');
    div.id = SELECTORS.AUTOCOMPLETE;
    document.body.appendChild(div);

    // Mock global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    jest.resetAllMocks();
  });

  test('should clear suggestions if input is empty', () => {
    new AutocompleteManager(mockMapManager);

    const autocomplete = document.getElementById(SELECTORS.AUTOCOMPLETE);
    autocomplete.innerHTML = 'test';

    const input = document.getElementById(SELECTORS.ADDRESS_INPUT);
    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(autocomplete.innerHTML).toBe('');
  });

  test('should call fetch with debounce', async () => {
    global.fetch.mockResolvedValue({ json: () => Promise.resolve([]) });

    new AutocompleteManager(mockMapManager);
    const input = document.getElementById(SELECTORS.ADDRESS_INPUT);

    input.value = 'Paris';
    input.dispatchEvent(new Event('input'));

    // Avancer le debounce
    jest.advanceTimersByTime(CONFIG.AUTOCOMPLETE.DEBOUNCE_DELAY);
    await Promise.resolve();

    expect(global.fetch).toHaveBeenCalledWith(`${CONFIG.API.SEARCH}?q=Paris`);
  });

  test('should display autocomplete suggestions', async () => {
    const results = [{ name: 'Paris, France', lat: 48.8566, lon: 2.3522 }];
    global.fetch.mockResolvedValue({ json: () => Promise.resolve(results) });

    new AutocompleteManager(mockMapManager);
    const input = document.getElementById(SELECTORS.ADDRESS_INPUT);

    input.value = 'Paris';
    input.dispatchEvent(new Event('input'));

    jest.advanceTimersByTime(CONFIG.AUTOCOMPLETE.DEBOUNCE_DELAY);
    await Promise.resolve();
    await Promise.resolve();

    const suggestions = document.querySelectorAll('.autocomplete-suggestion');
    expect(suggestions.length).toBe(1);
    expect(suggestions[0].textContent).toBe('Paris, France');
  });

  test('should handle click on suggestion', async () => {
    const results = [{ name: 'Paris', lat: 48.8566, lon: 2.3522 }];
    global.fetch.mockResolvedValue({ json: () => Promise.resolve(results) });

    new AutocompleteManager(mockMapManager);
    const input = document.getElementById(SELECTORS.ADDRESS_INPUT);

    input.value = 'Paris';
    input.dispatchEvent(new Event('input'));

    jest.advanceTimersByTime(CONFIG.AUTOCOMPLETE.DEBOUNCE_DELAY);
    await Promise.resolve();
    await Promise.resolve();

    const suggestion = document.querySelector('.autocomplete-suggestion');
    suggestion.click();

    expect(input.value).toBe('Paris');
    expect(mockMapManager.setPosition).toHaveBeenCalledWith(48.8566, 2.3522);
  });

  test('should return input value', () => {
    const manager = new AutocompleteManager(mockMapManager);
    document.getElementById(SELECTORS.ADDRESS_INPUT).value = 'Test';

    expect(manager.getValue()).toBe('Test');
  });

  test('should handle fetch error gracefully', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    new AutocompleteManager(mockMapManager);
    const input = document.getElementById(SELECTORS.ADDRESS_INPUT);

    input.value = 'Paris';
    input.dispatchEvent(new Event('input'));

    jest.advanceTimersByTime(CONFIG.AUTOCOMPLETE.DEBOUNCE_DELAY);
    await Promise.resolve();
    await Promise.resolve();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
