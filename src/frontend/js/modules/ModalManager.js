import { SELECTORS } from '../constants.js';

/** **********************************************************
 * MODAL BOOTSTRAP (résultat)
 *********************************************************** */
export class ModalManager {
  constructor() {
    this.feedbackModalEl = document.getElementById(SELECTORS.FEEDBACK_MODAL);

    if (typeof bootstrap === 'undefined') {
      throw new Error(
        'Bootstrap is not loaded. Make sure bootstrap.bundle.min.js is loaded before app.js'
      );
    }

    this.feedbackModal = new bootstrap.Modal(this.feedbackModalEl);
    this.modalBody = document.getElementById(SELECTORS.MODAL_BODY);
    this.exportBtn = document.getElementById(SELECTORS.EXPORT_BTN);

    this.currentMoodData = null;

    this.initEvents();
  }

  /**
   * Affiche les résultats dans le modal
   * @param {*} mood - Objet renvoyé par backend
   */
  show(mood) {
    const score = mood.scoreResult ?? 'N/A';
    const { weather } = mood;

    const weatherHTML = weather
      ? `<ul>
         <li>Température : ${weather.temp ?? 'N/A'} °C</li>
         <li>Humidité : ${weather.humidity ?? 'N/A'} %</li>
         <li>Conditions : ${weather.weather ?? 'N/A'}</li>
         <li>Vent : ${weather.wind_speed ?? 'N/A'} m/s</li>
       </ul>`
      : 'Pas de météo disponible';

    const imgHTML = mood.imageUrl
      ? `<img src="${mood.imageUrl.replace(/\\/g, '/')}" class="img-fluid rounded mt-2" alt="Selfie">`
      : '';

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

  /** **********************************************************
   * EXPORT EN FICHIER TEXTE
   *********************************************************** */
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

  initEvents() {
    this.exportBtn.addEventListener('click', () => this.exportToFile());
  }
}
