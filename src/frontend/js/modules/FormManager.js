import { CONFIG, SELECTORS } from '../constants.js';

export class FormManager {
  constructor(mapManager, autocompleteManager, cameraManager, modalManager) {
    this.mapManager = mapManager;
    this.autocompleteManager = autocompleteManager;
    this.cameraManager = cameraManager;
    this.modalManager = modalManager;

    this.form = document.getElementById(SELECTORS.MOOD_FORM);
    this.textInput = document.getElementById(SELECTORS.TEXT_INPUT);
    this.ratingInput = document.getElementById(SELECTORS.RATING_INPUT);

    this.initEvents();
  }

  async handleSubmit(e) {
    e.preventDefault();

    const coords = this.mapManager.getCoords();

    const data = {
      text: this.textInput.value,
      rating: Number(this.ratingInput.value),
      address: this.autocompleteManager.getValue(),
      lat: coords.lat,
      lon: coords.lon,
      imageUrl: this.cameraManager.getImageUrl(),
    };

    try {
      console.log('Envoi des données:', data);

      const res = await fetch(CONFIG.API.MOODS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('Réponse HTTP status:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Erreur serveur:', errorData);
        throw new Error(errorData.error || `Erreur HTTP ${res.status}`);
      }

      const result = await res.json();
      console.log('Mood enregistré:', result);

      this.modalManager.show(result);
      this.form.reset();
      this.cameraManager.reset();
    } catch (err) {
      console.error('Erreur POST /moods:', err);
      alert(
        `❌ Erreur lors de l'enregistrement.\n\nDétails: ${err.message}\n\nVérifiez la console pour plus d'infos.`
      );
    }
  }

  initEvents() {
    this.form.addEventListener('submit', e => this.handleSubmit(e));
  }
}
