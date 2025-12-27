import { SELECTORS } from '../constants.js';

/**
 * ModalManager
 * ----------------------
 * Responsable de l'affichage et de l'export des résultats d'humeur via un modal Bootstrap.
 * - SRP : Une seule responsabilité (affichage + export d'un mood).
 * - DIP : Ne dépend que de Bootstrap Modal et du DOM.
 */
export class ModalManager {
  constructor() {
    // Élément DOM du modal
    this.feedbackModalEl = document.getElementById(SELECTORS.FEEDBACK_MODAL);

    // Vérifie que Bootstrap est chargé
    if (typeof bootstrap === 'undefined') {
      throw new Error(
        'Bootstrap is not loaded. Make sure bootstrap.bundle.min.js is loaded before app.js'
      );
    }

    // Instance Bootstrap Modal
    this.feedbackModal = new bootstrap.Modal(this.feedbackModalEl);
    this.modalBody = document.getElementById(SELECTORS.MODAL_BODY);
    this.exportBtn = document.getElementById(SELECTORS.EXPORT_BTN);

    // Stocke les données du mood affiché
    this.currentMoodData = null;

    this.initEvents();
  }

  /**
   * Affiche les détails d'un mood dans le modal
   * @param {Object} mood - Objet contenant les informations du mood
   */
  show(mood) {
    const score = mood.scoreResult ?? 'N/A';
    const { weather } = mood;

    // Génère le HTML météo
    const weatherHTML = weather
      ? `<ul>
         <li>Température : ${weather.temp ?? 'N/A'} °C</li>
         <li>Humidité : ${weather.humidity ?? 'N/A'} %</li>
         <li>Conditions : ${weather.weather ?? 'N/A'}</li>
         <li>Vent : ${weather.wind_speed ?? 'N/A'} m/s</li>
       </ul>`
      : 'Pas de météo disponible';

    // Génère le HTML de l'image
    const imgHTML = mood.imageUrl
      ? `<img src="${mood.imageUrl.replace(/\\/g, '/')}" class="img-fluid rounded mt-2" alt="Selfie">`
      : '';

    // Injection du contenu dans le modal
    this.modalBody.innerHTML = `
      <p><strong>Humeur :</strong> ${mood.text}</p>
      <p><strong>Note :</strong> ${mood.rating}</p>
      <p><strong>Score :</strong> ${score}%</p>
      <p><strong>Adresse :</strong> ${mood.place?.name || mood.address || 'N/A'}</p>
      <h6><strong>Météo :</strong></h6>
      ${weatherHTML}
      ${imgHTML}
    `;

    this.currentMoodData = mood;
    this.feedbackModal.show();
  }

  /**
   * Exporte le mood courant dans un fichier .txt
   */
  exportToFile() {
    const mood = this.currentMoodData;
    if (!mood) return;

    const content = `==============================================
      RAPPORT D'HUMEUR - ${new Date(mood.createdAt).toLocaleString('fr-FR')}
      ==============================================

      HUMEUR
      ------
      Description : ${mood.text}
      Note : ${mood.rating}/5
      Score final : ${mood.scoreResult ?? 'N/A'}%

      LOCALISATION
      ------------
      Adresse : ${mood.place?.name || mood.address || 'N/A'}
      Coordonnées : ${mood.lat}, ${mood.lon}

      MÉTÉO
      -----
      ${
        mood.weather
          ? `Température : ${mood.weather.temp} °C
      Humidité : ${mood.weather.humidity} %
      Conditions : ${mood.weather.weather}
      Vent : ${mood.weather.wind_speed} m/s`
          : 'Pas de données météo disponibles'
      }

      ==============================================
    `;

    // Création et téléchargement du fichier
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `humeur_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Initialise les événements sur le modal (bouton export)
   */
  initEvents() {
    this.exportBtn.addEventListener('click', () => this.exportToFile());
  }
}
