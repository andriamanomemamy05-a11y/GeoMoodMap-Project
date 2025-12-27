import { CONFIG, SELECTORS } from '../constants.js';

/**
 * MapManager
 * ----------------------
 * Responsable de la gestion de la carte Leaflet.
 * - SRP : Une seule responsabilité (initialisation de la carte, position du marker, récupération des coordonnées).
 * - DIP : N’expose que des méthodes pour interagir avec la carte et le marker.
 */
export class MapManager {
  constructor() {
    // Vérifie que Leaflet est chargé
    if (typeof L === 'undefined') {
      throw new Error('Leaflet is not loaded. Make sure leaflet.js is loaded before app.js');
    }

    // Initialisation de la carte avec vue par défaut
    this.map = L.map(SELECTORS.MAP).setView(
      [CONFIG.MAP.DEFAULT_LAT, CONFIG.MAP.DEFAULT_LON],
      CONFIG.MAP.DEFAULT_ZOOM
    );

    // Ajout du tile layer
    L.tileLayer(CONFIG.MAP.TILE_URL, {
      attribution: CONFIG.MAP.ATTRIBUTION,
    }).addTo(this.map);

    // Coordonnées initiales
    this.lat = CONFIG.MAP.DEFAULT_LAT;
    this.lon = CONFIG.MAP.DEFAULT_LON;

    // Ajout du marker draggable
    this.marker = L.marker([this.lat, this.lon], { draggable: true }).addTo(this.map);

    this.initEvents();
  }

  /**
   * Met à jour les coordonnées internes selon l'événement ou la position du marker
   * @param {Object} e - L'événement Leaflet
   */
  updateCoords(e) {
    const pos = e.latlng || this.marker.getLatLng();
    this.lat = pos.lat;
    this.lon = pos.lng;
  }

  /**
   * Initialise les événements sur la carte et le marker
   * - Click sur la carte pour déplacer le marker
   * - Drag du marker pour mettre à jour les coordonnées
   */
  initEvents() {
    this.map.on('click', e => {
      this.marker.setLatLng(e.latlng);
      this.updateCoords(e);
    });

    this.marker.on('dragend', e => this.updateCoords(e));
  }

  /**
   * Retourne les coordonnées actuelles
   * @returns {{lat: number, lon: number}}
   */
  getCoords() {
    return { lat: this.lat, lon: this.lon };
  }

  /**
   * Déplace la carte et le marker à une position spécifique
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   */
  setPosition(lat, lon) {
    this.lat = lat;
    this.lon = lon;
    this.marker.setLatLng([lat, lon]);
    this.map.setView([lat, lon], CONFIG.MAP.DEFAULT_ZOOM);
  }
}
