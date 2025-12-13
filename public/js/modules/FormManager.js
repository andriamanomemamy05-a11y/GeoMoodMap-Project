/**
 * FormManager - Gère la soumission du formulaire d'humeur
 * Responsabilités :
 * - Validation du formulaire
 * - Collection des données
 * - Soumission à l'API
 * - Réinitialisation du formulaire
 */
export class FormManager {
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
