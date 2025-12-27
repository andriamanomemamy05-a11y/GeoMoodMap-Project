import { MapManager } from './MapManager.js';
import { AutocompleteManager } from './AutocompleteManager.js';
import { CameraManager } from './CameraManager.js';
import { ModalManager } from './ModalManager.js';
import { FormManager } from './FormManager.js';

/**
 * AppInitializer
 * ----------------
 * Classe responsable uniquement de l'initialisation des différents managers de l'application.
 * Applique le principe SRP : chaque classe a une seule responsabilité.
 * 
 * La méthode statique init() crée toutes les instances et les connecte entre elles si nécessaire.
 */
export class AppInitializer {
  static init() {
    // Initialisation du gestionnaire de carte
    const mapManager = new MapManager();

    // Initialisation du gestionnaire d'autocomplétion, dépendant de la carte
    const autocompleteManager = new AutocompleteManager(mapManager);

    // Initialisation des autres managers
    const cameraManager = new CameraManager();
    const modalManager = new ModalManager();

    // Initialisation du gestionnaire de formulaire avec toutes les dépendances
    const formManager = new FormManager(
      mapManager,
      autocompleteManager,
      cameraManager,
      modalManager
    );

    // Retourne tous les managers pour l'injection dans MoodTrackerApp (DIP)
    return { mapManager, autocompleteManager, cameraManager, modalManager, formManager };
  }
}
