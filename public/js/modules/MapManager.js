import { CONFIG, SELECTORS } from '../constants.js';

/** **********************************************************
 * INITIALISATION DE LA MAP + MARQUEUR
 *********************************************************** */
export class MapManager {
  constructor() {
    if (typeof L === 'undefined') {
      throw new Error('Leaflet is not loaded. Make sure leaflet.js is loaded before app.js');
    }

    this.map = L.map(SELECTORS.MAP).setView(
      [CONFIG.MAP.DEFAULT_LAT, CONFIG.MAP.DEFAULT_LON],
      CONFIG.MAP.DEFAULT_ZOOM
    );

    L.tileLayer(CONFIG.MAP.TILE_URL, {
      attribution: CONFIG.MAP.ATTRIBUTION,
    }).addTo(this.map);

    this.lat = CONFIG.MAP.DEFAULT_LAT;
    this.lon = CONFIG.MAP.DEFAULT_LON;

    this.marker = L.marker([this.lat, this.lon], { draggable: true }).addTo(this.map);

    this.initEvents();
  }

  /**
   * Met à jour les coordonnées lat/lon
   * @param {*} e - Événement Leaflet contenant latlng
   */
  updateCoords(e) {
    const pos = e.latlng || this.marker.getLatLng();
    this.lat = pos.lat;
    this.lon = pos.lng;
  }

  initEvents() {
    this.map.on('click', (e) => {
      this.marker.setLatLng(e.latlng);
      this.updateCoords(e);
    });
    this.marker.on('dragend', (e) => this.updateCoords(e));
  }

  getCoords() {
    return { lat: this.lat, lon: this.lon };
  }

  setPosition(lat, lon) {
    this.lat = lat;
    this.lon = lon;
    this.marker.setLatLng([lat, lon]);
    this.map.setView([lat, lon], CONFIG.MAP.DEFAULT_ZOOM);
  }
}
