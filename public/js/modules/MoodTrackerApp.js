/**
 * MoodTrackerApp - Classe principale de l'application
 * Responsabilités :
 * - Orchestration de tous les managers
 * - Initialisation de l'application
 * - Géolocalisation de l'utilisateur
 */
import { MapManager } from './MapManager.js';
import { CameraManager } from './CameraManager.js';
import { AutocompleteManager } from './AutocompleteManager.js';
import { ModalManager } from './ModalManager.js';
import { FormManager } from './FormManager.js';
import { MAP_CONFIG, GEOLOCATION_CONFIG, ERROR_MESSAGES } from './constants.js';

export class MoodTrackerApp {
  constructor() {
    this.mapManager = null;
    this.cameraManager = null;
    this.autocompleteManager = null;
    this.modalManager = null;
    this.formManager = null;
  }

  async init() {
    try {
      console.log("Initialisation de MoodTracker...");

      this.mapManager = new MapManager("map", MAP_CONFIG.PARIS_LAT, MAP_CONFIG.PARIS_LON);
      console.log("✓ Carte initialisée");

      this.modalManager = new ModalManager("feedbackModal", "modalBody");
      console.log("✓ Modal initialisé");

      this.cameraManager = new CameraManager(
        "camera",
        "canvas",
        "selfiePreview",
        "snap",
        this.modalManager
      );
      console.log("✓ Caméra initialisée");

      this.autocompleteManager = new AutocompleteManager(
        "address",
        "autocomplete",
        this.mapManager
      );
      console.log("✓ Autocomplétion initialisée");

      this.formManager = new FormManager(
        "moodForm",
        this.mapManager,
        this.cameraManager,
        this.modalManager
      );
      console.log("✓ Formulaire initialisé");

      console.log("🚀 MoodTracker prêt !");

      this.tryGeolocation();
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      if (this.modalManager) {
        this.modalManager.showError(ERROR_MESSAGES.APP_LOAD_ERROR);
      } else {
        alert(ERROR_MESSAGES.APP_LOAD_ERROR);
      }
    }
  }

  tryGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.mapManager.setLocation(latitude, longitude, MAP_CONFIG.DEFAULT_ZOOM);
          console.log("✓ Géolocalisation réussie:", latitude, longitude);
        },
        (error) => {
          console.warn("Géolocalisation refusée ou impossible:", error.message);
        },
        {
          enableHighAccuracy: GEOLOCATION_CONFIG.ENABLE_HIGH_ACCURACY,
          timeout: GEOLOCATION_CONFIG.TIMEOUT,
          maximumAge: GEOLOCATION_CONFIG.MAXIMUM_AGE,
        }
      );
    }
  }
}
