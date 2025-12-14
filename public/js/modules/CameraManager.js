/**
 * CameraManager - Gère la capture d'image via la webcam
 * Responsabilités :
 * - Accès à la caméra
 * - Capture de photo
 * - Gestion des erreurs caméra
 */
import { CAMERA_CONFIG, ERROR_MESSAGES } from './constants.js';

export class CameraManager {
  constructor(videoElementId, canvasElementId, previewElementId, snapButtonId, modalManager = null) {
    this.video = document.getElementById(videoElementId);
    this.canvas = document.getElementById(canvasElementId);
    this.preview = document.getElementById(previewElementId);
    this.snapButton = document.getElementById(snapButtonId);
    this.modalManager = modalManager;
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
          facingMode: CAMERA_CONFIG.FACING_MODE,
          width: { ideal: CAMERA_CONFIG.IDEAL_WIDTH },
          height: { ideal: CAMERA_CONFIG.IDEAL_HEIGHT },
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
      this.showError(ERROR_MESSAGES.CAMERA_UNAVAILABLE);
      return;
    }

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    const ctx = this.canvas.getContext("2d");
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    const imageData = this.canvas.toDataURL(CAMERA_CONFIG.IMAGE_FORMAT);
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
      errorMessage += ERROR_MESSAGES.CAMERA_PERMISSION_DENIED;
    } else if (error.name === "NotFoundError") {
      errorMessage += ERROR_MESSAGES.CAMERA_NOT_FOUND;
    } else if (error.name === "NotReadableError") {
      errorMessage += ERROR_MESSAGES.CAMERA_IN_USE;
    } else {
      errorMessage += error.message;
    }

    this.showError(errorMessage);
    this.snapButton.disabled = true;
  }

  showError(message) {
    if (this.modalManager) {
      this.modalManager.showError(message);
    } else {
      alert(message);
    }
  }
}
