/**
 * FormManager - Gère la soumission du formulaire d'humeur
 * Responsabilités :
 * - Validation du formulaire
 * - Collection des données
 * - Soumission à l'API
 * - Réinitialisation du formulaire
 */
import { ERROR_MESSAGES, VALIDATION, API_ENDPOINTS } from './constants.js';

export class FormManager {
  constructor(formElementId, mapManager, cameraManager, modalManager) {
    this.form = document.getElementById(formElementId);
    this.mapManager = mapManager;
    this.cameraManager = cameraManager;
    this.modalManager = modalManager;

    // Réduire le couplage DOM : stocker les références aux éléments
    this.textInput = this.form.querySelector('#text');
    this.ratingInput = this.form.querySelector('#rating');
    this.addressInput = this.form.querySelector('#address');
    this.submitButton = this.form.querySelector('button[type="submit"]');

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

    this.submitButton.disabled = true;
    this.submitButton.textContent = "Enregistrement...";

    try {
      const moodData = this.collectFormData();
      const result = await this.submitMoodData(moodData);
      this.modalManager.show(result);
      this.resetForm();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      this.modalManager.showError(
        error.message || ERROR_MESSAGES.SUBMISSION_ERROR
      );
    } finally {
      this.submitButton.disabled = false;
      this.submitButton.textContent = "Enregistrer l'humeur";
    }
  }

  validateForm() {
    const text = this.textInput.value.trim();
    const rating = this.ratingInput.value;

    if (!text) {
      this.modalManager.showError(ERROR_MESSAGES.MOOD_TEXT_REQUIRED);
      return false;
    }

    if (!rating || rating < VALIDATION.MIN_RATING || rating > VALIDATION.MAX_RATING) {
      this.modalManager.showError(ERROR_MESSAGES.RATING_REQUIRED);
      return false;
    }

    return true;
  }

  collectFormData() {
    const coordinates = this.mapManager.getCoordinates();

    return {
      text: this.textInput.value.trim(),
      rating: Number(this.ratingInput.value),
      address: this.addressInput.value.trim(),
      lat: coordinates.lat,
      lon: coordinates.lon,
      imageUrl: this.cameraManager.getImageData(),
    };
  }

  async submitMoodData(data) {
    const response = await fetch(API_ENDPOINTS.MOODS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: ERROR_MESSAGES.SUBMISSION_ERROR }));
      throw new Error(error.message || `Erreur HTTP ${response.status}`);
    }

    return await response.json();
  }

  resetForm() {
    this.form.reset();
    this.cameraManager.resetPreview();
  }
}
