/**
 * Tests unitaires pour ModalManager
 */

import { ModalManager } from '../../../../src/frontend/js/modules/ModalManager.js';

global.bootstrap = {
  Modal: jest.fn(function MockModal(element) {
    this.element = element;
    this.show = jest.fn();
    this.hide = jest.fn();
  }),
};

describe('ModalManager', () => {
  beforeEach(() => {
    const modal = document.createElement('div');
    modal.id = 'feedbackModal';
    document.body.appendChild(modal);

    const body = document.createElement('div');
    body.id = 'modalBody';
    document.body.appendChild(body);

    const btn = document.createElement('button');
    btn.id = 'exportBtn';
    document.body.appendChild(btn);

    global.URL = {
      createObjectURL: jest.fn(() => 'blob:test'),
      revokeObjectURL: jest.fn(),
    };

    global.Blob = jest.fn(function MockBlob(parts, options) {
      this.parts = parts;
      this.options = options;
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('devrait initialiser avec Bootstrap', () => {
    new ModalManager();
    expect(global.bootstrap.Modal).toHaveBeenCalled();
  });

  test('devrait afficher mood avec météo', () => {
    const manager = new ModalManager();
    const mood = {
      text: 'Super',
      rating: 5,
      scoreResult: 90,
      place: { name: 'Paris' },
      weather: { temp: 20, humidity: 60, weather: 'Soleil', wind_speed: 5 },
    };

    manager.show(mood);

    const body = document.getElementById('modalBody');
    expect(body.innerHTML).toContain('Super');
    expect(body.innerHTML).toContain('90%');
    expect(body.innerHTML).toContain('Paris');
    expect(body.innerHTML).toContain('20');
  });

  test('devrait afficher mood sans météo', () => {
    const manager = new ModalManager();
    const mood = {
      text: 'Test',
      rating: 3,
      weather: null,
    };

    manager.show(mood);

    const body = document.getElementById('modalBody');
    expect(body.innerHTML).toContain('Pas de météo disponible');
  });

  test('devrait exporter en fichier', () => {
    const manager = new ModalManager();
    manager.currentMoodData = {
      text: 'Test',
      rating: 4,
      scoreResult: 75,
      lat: 48.8566,
      lon: 2.3522,
      createdAt: '2025-01-01T12:00:00Z',
    };

    manager.exportToFile();

    expect(global.Blob).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  test('ne devrait rien faire si pas de mood', () => {
    const manager = new ModalManager();
    manager.currentMoodData = null;

    manager.exportToFile();

    expect(global.Blob).not.toHaveBeenCalled();
  });

  test('devrait gérer backslash dans imageUrl', () => {
    const manager = new ModalManager();
    const mood = {
      text: 'Test',
      rating: 3,
      imageUrl: 'uploads\\test.png',
    };

    manager.show(mood);

    const body = document.getElementById('modalBody');
    expect(body.innerHTML).toContain('uploads/test.png');
  });
});
