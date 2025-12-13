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

      this.mapManager = new MapManager("map", 48.8566, 2.3522);
      console.log("✓ Carte initialisée");

      this.cameraManager = new CameraManager(
        "camera",
        "canvas",
        "selfiePreview",
        "snap"
      );
      console.log("✓ Caméra initialisée");

      this.modalManager = new ModalManager("feedbackModal", "modalBody");
      console.log("✓ Modal initialisé");

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
      alert("Une erreur est survenue lors du chargement de l'application.");
    }
  }

  tryGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.mapManager.setLocation(latitude, longitude, 13);
          console.log("✓ Géolocalisation réussie:", latitude, longitude);
        },
        (error) => {
          console.warn("Géolocalisation refusée ou impossible:", error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }
}
