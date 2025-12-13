/**
 * MapManager - Gère la carte interactive avec Leaflet
 * Responsabilités :
 * - Initialisation de la carte
 * - Gestion du marqueur
 * - Mise à jour de la position
 */
export class MapManager {
  constructor(mapElementId, initialLat = 48.8566, initialLon = 2.3522) {
    this.map = L.map(mapElementId).setView([initialLat, initialLon], 13);
    this.marker = null;
    this.lat = initialLat;
    this.lon = initialLon;

    this.initMap();
    this.initMarker();
    this.setupEventListeners();
  }

  initMap() {
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
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

  setLocation(lat, lon, zoom = 13) {
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
