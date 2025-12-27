import { CONFIG, SELECTORS } from '../constants.js';

/**
 * AutocompleteManager
 * ----------------------
 * Responsable uniquement de la logique d'autocomplétion pour le champ d'adresse.
 * Applique le principe SRP : une seule responsabilité.
 * 
 * Dépend d'une abstraction mapManager pour mettre à jour la position sur la carte (DIP).
 */
export class AutocompleteManager {
  /**
   * @param {Object} mapManager - Instance d'un manager qui gère la carte et les positions
   */
  constructor(mapManager) {
    this.mapManager = mapManager;

    // Input pour la saisie de l'adresse
    this.addressInput = document.getElementById(SELECTORS.ADDRESS_INPUT);
    // Conteneur pour afficher les suggestions
    this.autocompleteDiv = document.getElementById(SELECTORS.AUTOCOMPLETE);

    this.timeout = null; // Timer pour le debounce

    this.initEvents();
  }

  /**
   * Initialise les événements sur le champ d'adresse
   * - Écoute les changements de saisie
   * - Applique un debounce pour limiter les appels API
   */
  initEvents() {
    this.addressInput.addEventListener('input', () => {
      const query = this.addressInput.value;

      // Si le champ est vide, on vide les suggestions
      if (!query.trim()) {
        this.clearSuggestions();
        return;
      }

      // Debounce : attendre avant d'envoyer la requête API
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.fetchSuggestions(query), CONFIG.AUTOCOMPLETE.DEBOUNCE_DELAY);
    });
  }

  /**
   * Appelle l'API pour récupérer les suggestions d'adresse
   * @param {string} query - Texte saisi par l'utilisateur
   */
  async fetchSuggestions(query) {
    try {
      const res = await fetch(`${CONFIG.API.SEARCH}?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      this.clearSuggestions();
      if (!data || data.length === 0) return;

      const results = Array.isArray(data) ? data : [data];
      results.forEach(item => this.renderSuggestion(item));
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
  }

  /**
   * Crée un élément HTML pour chaque suggestion et gère le clic
   * @param {Object} item - Objet contenant name, lat, lon
   */
  renderSuggestion(item) {
    const div = document.createElement('div');
    div.className = 'autocomplete-suggestion';
    div.textContent = item.name;

    div.addEventListener('click', () => {
      this.addressInput.value = item.name;
      this.mapManager.setPosition(item.lat, item.lon); // Dépendance injectée
      this.clearSuggestions();
    });

    this.autocompleteDiv.appendChild(div);
  }

  /**
   * Vide la liste des suggestions
   */
  clearSuggestions() {
    this.autocompleteDiv.innerHTML = '';
  }

  /**
   * Retourne la valeur actuelle de l'input
   * @returns {string}
   */
  getValue() {
    return this.addressInput.value;
  }
}
