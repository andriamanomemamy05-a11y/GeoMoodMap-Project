/**
 * AutocompleteManager - Gère l'autocomplétion des adresses
 * Responsabilités :
 * - Recherche d'adresses via API
 * - Affichage des suggestions
 * - Debouncing des requêtes
 */
export class AutocompleteManager {
  constructor(inputElementId, suggestionsElementId, mapManager) {
    this.input = document.getElementById(inputElementId);
    this.suggestionsContainer = document.getElementById(suggestionsElementId);
    this.mapManager = mapManager;
    this.timeout = null;
    this.debounceDelay = 300;

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.input.addEventListener("input", () => {
      this.handleInput();
    });

    document.addEventListener("click", (e) => {
      if (
        !this.input.contains(e.target) &&
        !this.suggestionsContainer.contains(e.target)
      ) {
        this.clearSuggestions();
      }
    });
  }

  handleInput() {
    const query = this.input.value.trim();

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (!query) {
      this.clearSuggestions();
      return;
    }

    this.timeout = setTimeout(() => {
      this.searchAddress(query);
    }, this.debounceDelay);
  }

  async searchAddress(query) {
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche d'adresse");
      }

      const data = await response.json();
      this.displaySuggestions(data);
    } catch (error) {
      console.error("Erreur autocomplétion:", error);
      this.clearSuggestions();
    }
  }

  displaySuggestions(data) {
    this.clearSuggestions();

    if (!data || data.length === 0) {
      return;
    }

    const suggestions = Array.isArray(data) ? data : [data];

    suggestions.forEach((item) => {
      const suggestionElement = this.createSuggestionElement(item);
      this.suggestionsContainer.appendChild(suggestionElement);
    });
  }

  createSuggestionElement(item) {
    const div = document.createElement("div");
    div.className = "autocomplete-suggestion";
    div.textContent = item.name || item.display_name || "Adresse inconnue";

    div.addEventListener("click", () => {
      this.selectSuggestion(item);
    });

    return div;
  }

  selectSuggestion(item) {
    this.input.value = item.name || item.display_name;

    if (item.lat && item.lon) {
      this.mapManager.setLocation(
        parseFloat(item.lat),
        parseFloat(item.lon),
        15
      );
    }

    this.clearSuggestions();
  }

  clearSuggestions() {
    this.suggestionsContainer.innerHTML = "";
  }

  reset() {
    this.input.value = "";
    this.clearSuggestions();
  }
}
