/**
 * MapManager - Gère la carte interactive avec Leaflet
 * Responsabilités :
 * - Initialisation de la carte
 * - Gestion du marqueur
 * - Mise à jour de la position
 */
import { MAP_CONFIG } from './constants.js';

export class MapManager {
  constructor(mapElementId, initialLat = MAP_CONFIG.PARIS_LAT, initialLon = MAP_CONFIG.PARIS_LON) {
    this.map = L.map(mapElementId).setView([initialLat, initialLon], MAP_CONFIG.DEFAULT_ZOOM);
    this.marker = null;
    this.lat = initialLat;
    this.lon = initialLon;

    this.initMap();
    this.initMarker();
    this.setupEventListeners();
  }

  initMap() {
    L.tileLayer(MAP_CONFIG.TILE_URL, {
      attribution: MAP_CONFIG.ATTRIBUTION,
      maxZoom: MAP_CONFIG.MAX_ZOOM,
    }).addTo(this.map);
  }

  initMarker() {
    this.marker = L.marker([this.lat, this.lon], {
      draggable: true,
    }).addTo(this.map);
  }

  setupEventListeners() {
    this.map.on("click", (e) => {
      this.updatePosition(e.latlng);
    });

    this.marker.on("dragend", (e) => {
      this.updatePosition(this.marker.getLatLng());
    });
  }

  updatePosition(latlng) {
    this.lat = latlng.lat;
    this.lon = latlng.lng;
    this.marker.setLatLng(latlng);
  }

  setLocation(lat, lon, zoom = MAP_CONFIG.DEFAULT_ZOOM) {
    this.lat = lat;
    this.lon = lon;
    this.marker.setLatLng([lat, lon]);
    this.map.setView([lat, lon], zoom);
  }

  getCoordinates() {
    return {
      lat: this.lat,
      lon: this.lon,
    };
  }

  invalidateSize() {
    this.map.invalidateSize();
  }
}
