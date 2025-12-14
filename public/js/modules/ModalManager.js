/**
 * ModalManager - Gère l'affichage des modales de feedback
 * Responsabilités :
 * - Affichage des données d'humeur
 * - Génération du contenu HTML
 * - Gestion des erreurs
 */
import { MODAL_CONFIG, SCORE_THRESHOLDS, SCORE_BADGE_COLORS } from './constants.js';

export class ModalManager {
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

    // Validation de sécurité : vérifier que l'URL est sûre
    if (!this.isValidImageUrl(imageUrl)) {
      console.warn('URL d\'image potentiellement dangereuse détectée');
      return "";
    }

    const cleanUrl = imageUrl.replace(/\\/g, "/");

    return `
      <div class="mt-3">
        <h6>Selfie</h6>
        <img src="${cleanUrl}" class="img-fluid rounded" alt="Selfie" style="max-height: ${MODAL_CONFIG.MAX_IMAGE_HEIGHT}px;">
      </div>
    `;
  }

  isValidImageUrl(url) {
    // Accepte uniquement les data URLs et les chemins relatifs vers selfies/
    return url.startsWith('data:image/') || url.startsWith('selfies/');
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
    if (score === "N/A") return SCORE_BADGE_COLORS.UNKNOWN;

    const numericScore = parseFloat(score);
    if (numericScore >= SCORE_THRESHOLDS.EXCELLENT) return SCORE_BADGE_COLORS.EXCELLENT;
    if (numericScore >= SCORE_THRESHOLDS.GOOD) return SCORE_BADGE_COLORS.GOOD;
    if (numericScore >= SCORE_THRESHOLDS.AVERAGE) return SCORE_BADGE_COLORS.AVERAGE;
    return SCORE_BADGE_COLORS.POOR;
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
