/**
 * Tests unitaires pour MapManager
 */

import { MapManager } from '../../src/frontend/js/modules/MapManager.js';

// Mock Leaflet
const mockMarker = {
  addTo: jest.fn().mockReturnThis(),
  setLatLng: jest.fn(),
  getLatLng: jest.fn(() => ({ lat: 48.8566, lng: 2.3522 })),
  on: jest.fn(),
};

const mockMap = {
  setView: jest.fn().mockReturnThis(),
  on: jest.fn(),
};

const mockTileLayer = {
  addTo: jest.fn().mockReturnThis(),
};

global.L = {
  map: jest.fn(() => mockMap),
  tileLayer: jest.fn(() => mockTileLayer),
  marker: jest.fn(() => mockMarker),
};

describe('MapManager', () => {
  let mapContainer;

  beforeEach(() => {
    mapContainer = document.createElement('div');
    mapContainer.id = 'map';
    document.body.appendChild(mapContainer);

    jest.clearAllMocks();
    mockMarker.getLatLng.mockReturnValue({ lat: 48.8566, lng: 2.3522 });
  });

  afterEach(() => {
    if (mapContainer.parentNode) {
      document.body.removeChild(mapContainer);
    }
  });

  describe('constructor', () => {
    test('devrait initialiser la carte Leaflet', () => {
      new MapManager();

      expect(global.L.map).toHaveBeenCalledWith('map');
      expect(mockMap.setView).toHaveBeenCalledWith([48.8566, 2.3522], 13);
    });

    test('devrait créer une tile layer OpenStreetMap', () => {
      new MapManager();

      expect(global.L.tileLayer).toHaveBeenCalledWith(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap contributors' }
      );
      expect(mockTileLayer.addTo).toHaveBeenCalledWith(mockMap);
    });

    test('devrait créer un marqueur draggable', () => {
      new MapManager();

      expect(global.L.marker).toHaveBeenCalledWith([48.8566, 2.3522], {
        draggable: true,
      });
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    test('devrait initialiser lat et lon par défaut', () => {
      const manager = new MapManager();

      expect(manager.lat).toBe(48.8566);
      expect(manager.lon).toBe(2.3522);
    });

    test("devrait lever une erreur si Leaflet n'est pas chargé", () => {
      const originalL = global.L;
      delete global.L;

      expect(() => new MapManager()).toThrow(
        'Leaflet is not loaded. Make sure leaflet.js is loaded before app.js'
      );

      global.L = originalL;
    });

    test('devrait enregistrer les event handlers', () => {
      new MapManager();

      expect(mockMap.on).toHaveBeenCalledWith('click', expect.any(Function));
      expect(mockMarker.on).toHaveBeenCalledWith('dragend', expect.any(Function));
    });
  });

  describe('getCoords', () => {
    test('devrait retourner les coordonnées actuelles', () => {
      const manager = new MapManager();

      const coords = manager.getCoords();

      expect(coords).toEqual({ lat: 48.8566, lon: 2.3522 });
    });

    test('devrait retourner les coordonnées mises à jour', () => {
      const manager = new MapManager();

      manager.lat = 45.764;
      manager.lon = 4.8357;

      const coords = manager.getCoords();

      expect(coords).toEqual({ lat: 45.764, lon: 4.8357 });
    });
  });

  describe('setPosition', () => {
    test('devrait mettre à jour lat et lon', () => {
      const manager = new MapManager();

      manager.setPosition(45.764, 4.8357);

      expect(manager.lat).toBe(45.764);
      expect(manager.lon).toBe(4.8357);
    });

    test('devrait déplacer le marqueur', () => {
      const manager = new MapManager();

      manager.setPosition(45.764, 4.8357);

      expect(mockMarker.setLatLng).toHaveBeenCalledWith([45.764, 4.8357]);
    });

    test('devrait centrer la carte sur la nouvelle position', () => {
      const manager = new MapManager();

      manager.setPosition(45.764, 4.8357);

      expect(mockMap.setView).toHaveBeenCalledWith([45.764, 4.8357], 13);
    });
  });

  describe('updateCoords', () => {
    test('devrait mettre à jour les coordonnées depuis un événement avec latlng', () => {
      const manager = new MapManager();

      const event = {
        latlng: { lat: 50.1234, lng: 3.5678 },
      };

      manager.updateCoords(event);

      expect(manager.lat).toBe(50.1234);
      expect(manager.lon).toBe(3.5678);
    });

    test('devrait utiliser getLatLng du marqueur si latlng est absent', () => {
      const manager = new MapManager();
      mockMarker.getLatLng.mockReturnValue({ lat: 47.5555, lng: 1.2222 });

      manager.updateCoords({});

      expect(manager.lat).toBe(47.5555);
      expect(manager.lon).toBe(1.2222);
    });
  });

  describe('Event handlers', () => {
    test('devrait gérer le clic sur la carte', () => {
      const manager = new MapManager();

      const clickHandler = mockMap.on.mock.calls.find((call) => call[0] === 'click')[1];

      const clickEvent = {
        latlng: { lat: 49.1234, lng: 2.9876 },
      };

      clickHandler(clickEvent);

      expect(mockMarker.setLatLng).toHaveBeenCalledWith({ lat: 49.1234, lng: 2.9876 });
      expect(manager.lat).toBe(49.1234);
      expect(manager.lon).toBe(2.9876);
    });

    test('devrait gérer le drag du marqueur', () => {
      const manager = new MapManager();

      const dragHandler = mockMarker.on.mock.calls.find(
        (call) => call[0] === 'dragend'
      )[1];

      mockMarker.getLatLng.mockReturnValue({ lat: 47.5555, lng: 1.2222 });

      dragHandler({});

      expect(manager.lat).toBe(47.5555);
      expect(manager.lon).toBe(1.2222);
    });
  });
});
