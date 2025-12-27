/**
 * Tests unitaires pour MoodTrackerApp
 */

import { MoodTrackerApp } from '../../public/js/modules/MoodTrackerApp.js';
import { MapManager } from '../../public/js/modules/MapManager.js';
import { AutocompleteManager } from '../../public/js/modules/AutocompleteManager.js';
import { CameraManager } from '../../public/js/modules/CameraManager.js';
import { ModalManager } from '../../public/js/modules/ModalManager.js';
import { FormManager } from '../../public/js/modules/FormManager.js';

// Mock all dependencies
jest.mock('../../public/js/modules/MapManager.js');
jest.mock('../../public/js/modules/AutocompleteManager.js');
jest.mock('../../public/js/modules/CameraManager.js');
jest.mock('../../public/js/modules/ModalManager.js');
jest.mock('../../public/js/modules/FormManager.js');

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
