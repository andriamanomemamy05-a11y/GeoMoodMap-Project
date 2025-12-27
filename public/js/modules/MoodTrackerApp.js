import { MapManager } from './MapManager.js';
import { AutocompleteManager } from './AutocompleteManager.js';
import { CameraManager } from './CameraManager.js';
import { ModalManager } from './ModalManager.js';
import { FormManager } from './FormManager.js';

export class MoodTrackerApp {
  constructor() {
    this.mapManager = new MapManager();
    this.autocompleteManager = new AutocompleteManager(this.mapManager);
    this.cameraManager = new CameraManager();
    this.modalManager = new ModalManager();
    this.formManager = new FormManager(
      this.mapManager,
      this.autocompleteManager,
      this.cameraManager,
      this.modalManager
    );
  }
}
