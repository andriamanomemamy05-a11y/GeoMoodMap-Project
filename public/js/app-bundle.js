// app-bundle.js - Version bundle de tous les modules

// ==========================================
// MAP MANAGER
// ==========================================
class MapManager {
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

// ==========================================
// CAMERA MANAGER
// ==========================================
class CameraManager {
  constructor(videoElementId, canvasElementId, previewElementId, snapButtonId) {
    this.video = document.getElementById(videoElementId);
    this.canvas = document.getElementById(canvasElementId);
    this.preview = document.getElementById(previewElementId);
    this.snapButton = document.getElementById(snapButtonId);
    this.stream = null;

    this.init();
  }

  async init() {
    await this.startCamera();
    this.setupEventListeners();
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      this.video.srcObject = this.stream;
      console.log("Caméra démarrée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'accès à la caméra:", error);
      this.handleCameraError(error);
    }
  }

  setupEventListeners() {
    this.snapButton.addEventListener("click", () => {
      this.capturePhoto();
    });
  }

  capturePhoto() {
    if (!this.video.srcObject) {
      alert("La caméra n'est pas disponible");
      return;
    }

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    const ctx = this.canvas.getContext("2d");
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    const imageData = this.canvas.toDataURL("image/png");
    this.preview.src = imageData;
    this.preview.style.display = "block";

    console.log("Photo capturée");
  }

  getImageData() {
    return this.preview.src || null;
  }

  resetPreview() {
    this.preview.src = "";
    this.preview.style.display = "none";
  }

  handleCameraError(error) {
    let errorMessage = "Impossible d'accéder à la caméra. ";

    if (error.name === "NotAllowedError") {
      errorMessage += "Veuillez autoriser l'accès à la caméra.";
    } else if (error.name === "NotFoundError") {
      errorMessage += "Aucune caméra détectée.";
    } else if (error.name === "NotReadableError") {
      errorMessage += "La caméra est déjà utilisée par une autre application.";
    } else {
      errorMessage += error.message;
    }

    alert(errorMessage);
    this.snapButton.disabled = true;
  }
}

// ==========================================
// AUTOCOMPLETE MANAGER
// ==========================================
class AutocompleteManager {
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

// ==========================================
// MODAL MANAGER
// ==========================================
class ModalManager {
  constructor(modalElementId, modalBodyId) {
    this.modalElement = document.getElementById(modalElementId);
    this.modalBody = document.getElementById(modalBodyId);
    this.modal = new bootstrap.Modal(this.modalElement);
  }

  show(moodData) {
    const content = this.generateModalContent(moodData);
    this.modalBody.innerHTML = content;
    this.modal.show();
  }

  generateModalContent(mood) {
    const score = mood.scoreResult ?? "N/A";
    const weatherHTML = this.generateWeatherHTML(mood.weather);
    const imageHTML = this.generateImageHTML(mood.imageUrl);
    const placeHTML = this.generatePlaceHTML(mood);

    return `
      <div class="mood-summary">
        <p><strong>Humeur :</strong> ${this.escapeHtml(mood.text)}</p>
        <p><strong>Note :</strong> ${mood.rating}/5</p>
        <p><strong>Score :</strong> <span class="badge bg-${this.getScoreBadgeColor(
          score
        )}">${score}%</span></p>
        ${placeHTML}
        <h6 class="mt-3">Météo</h6>
        ${weatherHTML}
        ${imageHTML}
      </div>
    `;
  }

  generateWeatherHTML(weather) {
    if (!weather) {
      return '<p class="text-muted">Pas de météo disponible</p>';
    }

    return `
      <ul class="list-unstyled">
        <li>🌡️ Température : <strong>${weather.temp ?? "N/A"} °C</strong></li>
        <li>💧 Humidité : <strong>${weather.humidity ?? "N/A"} %</strong></li>
        <li>🌤️ Conditions : <strong>${weather.weather ?? "N/A"}</strong></li>
        <li>💨 Vent : <strong>${weather.wind_speed ?? "N/A"} m/s</strong></li>
      </ul>
    `;
  }

  generateImageHTML(imageUrl) {
    if (!imageUrl) {
      return "";
    }

    const cleanUrl = imageUrl.replace(/\\/g, "/");

    return `
      <div class="mt-3">
        <h6>Selfie</h6>
        <img src="${cleanUrl}" class="img-fluid rounded" alt="Selfie" style="max-height: 300px;">
      </div>
    `;
  }

  generatePlaceHTML(mood) {
    const placeName = mood.place?.name || mood.address || "N/A";
    const coordinates =
      mood.lat && mood.lon
        ? `(${mood.lat.toFixed(4)}, ${mood.lon.toFixed(4)})`
        : "";

    return `
      <p><strong>📍 Adresse :</strong> ${this.escapeHtml(
        placeName
      )} ${coordinates}</p>
    `;
  }

  getScoreBadgeColor(score) {
    if (score === "N/A") return "secondary";

    const numericScore = parseFloat(score);
    if (numericScore >= 80) return "success";
    if (numericScore >= 60) return "info";
    if (numericScore >= 40) return "warning";
    return "danger";
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  showError(errorMessage) {
    this.modalBody.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <strong>Erreur :</strong> ${this.escapeHtml(errorMessage)}
      </div>
    `;
    this.modal.show();
  }
}

// ==========================================
// FORM MANAGER
// ==========================================
class FormManager {
  constructor(formElementId, mapManager, cameraManager, modalManager) {
    this.form = document.getElementById(formElementId);
    this.mapManager = mapManager;
    this.cameraManager = cameraManager;
    this.modalManager = modalManager;

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form.addEventListener("submit", (e) => {
      this.handleSubmit(e);
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const submitButton = this.form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Enregistrement...";

    try {
      const moodData = this.collectFormData();
      const result = await this.submitMoodData(moodData);
      this.modalManager.show(result);
      this.resetForm();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      this.modalManager.showError(
        error.message || "Une erreur est survenue lors de l'enregistrement."
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enregistrer l'humeur";
    }
  }

  validateForm() {
    const text = document.getElementById("text").value.trim();
    const rating = document.getElementById("rating").value;

    if (!text) {
      alert("Veuillez décrire votre humeur");
      return false;
    }

    if (!rating || rating < 1 || rating > 5) {
      alert("Veuillez saisir une note entre 1 et 5");
      return false;
    }

    return true;
  }

  collectFormData() {
    const coordinates = this.mapManager.getCoordinates();

    return {
      text: document.getElementById("text").value.trim(),
      rating: Number(document.getElementById("rating").value),
      address: document.getElementById("address").value.trim(),
      lat: coordinates.lat,
      lon: coordinates.lon,
      imageUrl: this.cameraManager.getImageData(),
    };
  }

  async submitMoodData(data) {
    const response = await fetch("/api/moods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));
      throw new Error(error.message || `Erreur HTTP ${response.status}`);
    }

    return await response.json();
  }

  resetForm() {
    this.form.reset();
    this.cameraManager.resetPreview();
  }
}

// ==========================================
// APPLICATION PRINCIPALE
// ==========================================
class MoodTrackerApp {
  constructor() {
    this.mapManager = null;
    this.cameraManager = null;
    this.autocompleteManager = null;
    this.modalManager = null;
    this.formManager = null;
  }

  async init() {
    try {
      console.log("Initialisation de MoodTracker...");

      this.mapManager = new MapManager("map", 48.8566, 2.3522);
      console.log("✓ Carte initialisée");

      this.cameraManager = new CameraManager(
        "camera",
        "canvas",
        "selfiePreview",
        "snap"
      );
      console.log("✓ Caméra initialisée");

      this.modalManager = new ModalManager("feedbackModal", "modalBody");
      console.log("✓ Modal initialisé");

      this.autocompleteManager = new AutocompleteManager(
        "address",
        "autocomplete",
        this.mapManager
      );
      console.log("✓ Autocomplétion initialisée");

      this.formManager = new FormManager(
        "moodForm",
        this.mapManager,
        this.cameraManager,
        this.modalManager
      );
      console.log("✓ Formulaire initialisé");

      console.log("🚀 MoodTracker prêt !");

      this.tryGeolocation();
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      alert("Une erreur est survenue lors du chargement de l'application.");
    }
  }

  tryGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.mapManager.setLocation(latitude, longitude, 13);
          console.log("✓ Géolocalisation réussie:", latitude, longitude);
        },
        (error) => {
          console.warn("Géolocalisation refusée ou impossible:", error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  }
}

// Initialiser l'application
document.addEventListener("DOMContentLoaded", () => {
  const app = new MoodTrackerApp();
  app.init();
});
