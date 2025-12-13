/**
 * ModalManager - Gère l'affichage des modales de feedback
 * Responsabilités :
 * - Affichage des données d'humeur
 * - Génération du contenu HTML
 * - Gestion des erreurs
 */
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
