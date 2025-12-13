/**
 * CameraManager - Gère la capture d'image via la webcam
 * Responsabilités :
 * - Accès à la caméra
 * - Capture de photo
 * - Gestion des erreurs caméra
 */
export class CameraManager {
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
