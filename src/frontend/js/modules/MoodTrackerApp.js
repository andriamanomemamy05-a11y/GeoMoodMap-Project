/**
 * MoodTrackerApp
 * ----------------
 * Classe principale de l'application.
 * Orchestration des différents managers (injection de dépendances via le constructeur).
 * Applique le principe DIP : dépendance sur des abstractions (managers injectés), pas sur des implémentations concrètes.
 */
export class MoodTrackerApp {
  /**
   * @param {Object} managers - Les managers injectés pour l'application
   * @param {MapManager} managers.mapManager
   * @param {AutocompleteManager} managers.autocompleteManager
   * @param {CameraManager} managers.cameraManager
   * @param {ModalManager} managers.modalManager
   * @param {FormManager} managers.formManager
   */
  constructor({ mapManager, autocompleteManager, cameraManager, modalManager, formManager }) {
    this.mapManager = mapManager;
    this.autocompleteManager = autocompleteManager;
    this.cameraManager = cameraManager;
    this.modalManager = modalManager;
    this.formManager = formManager;
  }

  /**
   * Démarre l'application.
   * Permet d'initialiser ou de lancer les managers si nécessaire.
   */
  start() {
    // On peut appeler les méthodes init() de chaque manager si elles existent
    this.mapManager.init?.();
    this.autocompleteManager.init?.();
    this.cameraManager.init?.();
    this.modalManager.init?.();
    this.formManager.init?.();

    console.log('MoodTrackerApp started successfully!');
  }
}
