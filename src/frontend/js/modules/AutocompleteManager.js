import { CONFIG, SELECTORS } from '../constants.js';

export class AutocompleteManager {
  constructor(mapManager) {
    this.mapManager = mapManager;
    this.addressInput = document.getElementById(SELECTORS.ADDRESS_INPUT);
    this.autocompleteDiv = document.getElementById(SELECTORS.AUTOCOMPLETE);
    this.timeout = null;

    this.initEvents();
  }

  initEvents() {
    this.addressInput.addEventListener('input', () => {
      const query = this.addressInput.value;

      if (!query.trim()) {
        this.autocompleteDiv.innerHTML = '';
        return;
      }

      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        try {
          const res = await fetch(`${CONFIG.API.SEARCH}?q=${encodeURIComponent(query)}`);
          const data = await res.json();

          this.autocompleteDiv.innerHTML = '';
          if (!data || data.length === 0) return;

          const results = Array.isArray(data) ? data : [data];

          results.forEach((item) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-suggestion';
            div.textContent = item.name;

            div.addEventListener('click', () => {
              this.addressInput.value = item.name;
              this.mapManager.setPosition(item.lat, item.lon);
              this.autocompleteDiv.innerHTML = '';
            });

            this.autocompleteDiv.appendChild(div);
          });
        } catch (err) {
          console.error('Erreur autocomplete:', err);
        }
      }, CONFIG.AUTOCOMPLETE.DEBOUNCE_DELAY);
    });
  }

  getValue() {
    return this.addressInput.value;
  }
}
