/**
 * Tests unitaires pour MoodTrackerApp
 */

import { MoodTrackerApp } from '../../src/frontend/js/modules/MoodTrackerApp.js';
import { MapManager } from '../../src/frontend/js/modules/MapManager.js';
import { AutocompleteManager } from '../../src/frontend/js/modules/AutocompleteManager.js';
import { CameraManager } from '../../src/frontend/js/modules/CameraManager.js';
import { ModalManager } from '../../src/frontend/js/modules/ModalManager.js';
import { FormManager } from '../../src/frontend/js/modules/FormManager.js';

// Mock all dependencies
jest.mock('../../src/frontend/js/modules/MapManager.js');
jest.mock('../../src/frontend/js/modules/AutocompleteManager.js');
jest.mock('../../src/frontend/js/modules/CameraManager.js');
jest.mock('../../src/frontend/js/modules/ModalManager.js');
jest.mock('../../src/frontend/js/modules/FormManager.js');

describe('MoodTrackerApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('devrait initialiser tous les managers', () => {
    const app = new MoodTrackerApp();

    expect(MapManager).toHaveBeenCalledTimes(1);
    expect(CameraManager).toHaveBeenCalledTimes(1);
    expect(ModalManager).toHaveBeenCalledTimes(1);
  });

  test('devrait passer mapManager à AutocompleteManager', () => {
    const app = new MoodTrackerApp();

    expect(AutocompleteManager).toHaveBeenCalledWith(app.mapManager);
  });

  test('devrait passer tous les managers à FormManager', () => {
    const app = new MoodTrackerApp();

    expect(FormManager).toHaveBeenCalledWith(
      app.mapManager,
      app.autocompleteManager,
      app.cameraManager,
      app.modalManager
    );
  });

  test('devrait exposer tous les managers comme propriétés', () => {
    const app = new MoodTrackerApp();

    expect(app.mapManager).toBeDefined();
    expect(app.autocompleteManager).toBeDefined();
    expect(app.cameraManager).toBeDefined();
    expect(app.modalManager).toBeDefined();
    expect(app.formManager).toBeDefined();
  });
});
