/**
 * Tests unitaires pour FormManager
 */

import { FormManager } from '../../src/frontend/js/modules/FormManager.js';

describe('FormManager', () => {
  let mockManagers;

  beforeEach(() => {
    mockManagers = {
      mapManager: { getCoords: jest.fn(() => ({ lat: 48.8566, lon: 2.3522 })) },
      autocompleteManager: { getValue: jest.fn(() => 'Paris') },
      cameraManager: { getImageUrl: jest.fn(() => null), reset: jest.fn() },
      modalManager: { show: jest.fn() },
    };

    const form = document.createElement('form');
    form.id = 'moodForm';
    document.body.appendChild(form);

    const textInput = document.createElement('input');
    textInput.id = 'text';
    textInput.value = 'Bonne journée';
    document.body.appendChild(textInput);

    const ratingInput = document.createElement('input');
    ratingInput.id = 'rating';
    ratingInput.value = '4';
    document.body.appendChild(ratingInput);

    global.fetch = jest.fn();
    global.alert = jest.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('devrait envoyer les données au backend', async () => {
    const mockResponse = { id: 1, text: 'Bonne journée', rating: 4 };
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve(mockResponse),
    });

    const manager = new FormManager(
      mockManagers.mapManager,
      mockManagers.autocompleteManager,
      mockManagers.cameraManager,
      mockManagers.modalManager
    );

    const event = new Event('submit');
    event.preventDefault = jest.fn();

    await manager.handleSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('/api/moods', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    expect(mockManagers.modalManager.show).toHaveBeenCalledWith(mockResponse);
    expect(mockManagers.cameraManager.reset).toHaveBeenCalled();
  });

  test('devrait gérer erreur 400', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Champ requis' }),
    });

    const manager = new FormManager(
      mockManagers.mapManager,
      mockManagers.autocompleteManager,
      mockManagers.cameraManager,
      mockManagers.modalManager
    );

    const event = new Event('submit');
    event.preventDefault = jest.fn();

    await manager.handleSubmit(event);

    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Champ requis'));
  });

  test('devrait gérer erreur réseau', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    const manager = new FormManager(
      mockManagers.mapManager,
      mockManagers.autocompleteManager,
      mockManagers.cameraManager,
      mockManagers.modalManager
    );

    const event = new Event('submit');
    event.preventDefault = jest.fn();

    await manager.handleSubmit(event);

    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Network error'));
  });

  test('devrait convertir rating en nombre', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 1 }),
    });

    const manager = new FormManager(
      mockManagers.mapManager,
      mockManagers.autocompleteManager,
      mockManagers.cameraManager,
      mockManagers.modalManager
    );

    const event = new Event('submit');
    event.preventDefault = jest.fn();

    await manager.handleSubmit(event);

    const call = global.fetch.mock.calls[0][1];
    const body = JSON.parse(call.body);
    expect(typeof body.rating).toBe('number');
    expect(body.rating).toBe(4);
  });
});
