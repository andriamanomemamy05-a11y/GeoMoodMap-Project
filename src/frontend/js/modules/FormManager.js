import { CONFIG, SELECTORS } from '../constants.js';

/**
 * FormManager
 * ----------------------
 * Responsable de la gestion du formulaire "Mood".
 * - SRP : Une seule responsabilité (récupération des données du formulaire et envoi au serveur).
 * - DIP : Dépend de managers abstraits pour récupérer coordonnées, adresse, image et afficher un modal.
 */
export class FormManager {
  /**
   * @param {Object} mapManager - Fournit les coordonnées
   * @param {Object} autocompleteManager - Fournit l'adresse saisie
   * @param {Object} cameraManager - Fournit l'image capturée ou uploadée
   * @param {Object} modalManager - Affiche un modal avec le résultat
   */
  constructor(mapManager, autocompleteManager, cameraManager, modalManager) {
    this.mapManager = mapManager;
    this.autocompleteManager = autocompleteManager;
    this.cameraManager = cameraManager;
    this.modalManager = modalManager;

    // Formulaire et champs
    this.form = document.getElementById(SELECTORS.MOOD_FORM);
    this.textInput = document.getElementById(SELECTORS.TEXT_INPUT);
    this.ratingInput = document.getElementById(SELECTORS.RATING_INPUT);

    this.initEvents();
  }

  /**
   * Gère la soumission du formulaire
   * @param {Event} e - L'événement submit
   */
  async handleSubmit(e) {
    e.preventDefault();

    const coords = this.mapManager.getCoords();

    // Construction de l'objet mood à envoyer
    const data = {
      text: this.textInput.value,
      rating: Number(this.ratingInput.value),
      address: this.autocompleteManager.getValue(),
      lat: coords.lat,
      lon: coords.lon,
      imageUrl: this.cameraManager.getImageUrl(),
    };

    try {
      console.log('Sending mood data:', data);

      const res = await fetch(CONFIG.API.MOODS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('HTTP response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      const result = await res.json();
      console.log('Mood saved successfully:', result);

      // Affichage du résultat dans le modal
      this.modalManager.show(result);

      // Réinitialisation du formulaire et de la caméra
      this.form.reset();
      this.cameraManager.reset();
    } catch (err) {
      console.error('POST /moods error:', err);
      alert(`❌ Error saving mood.\n\nDetails: ${err.message}\nCheck console for more info.`);
    }
  }

  /**
   * Initialise les événements sur le formulaire
   */
  initEvents() {
    this.form.addEventListener('submit', e => this.handleSubmit(e));
  }
}
