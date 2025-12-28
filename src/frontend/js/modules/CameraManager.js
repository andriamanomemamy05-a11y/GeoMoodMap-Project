import { SELECTORS } from '../constants.js';

/**
 * CameraManager
 * ----------------------
 * Responsable de la gestion de la caméra et de l'upload de photos.
 * - SRP : Une seule responsabilité (capture et gestion des photos).
 * - DIP : Ne dépend pas d'une implémentation spécifique pour afficher la photo, juste du DOM.
 */
export class CameraManager {
  constructor() {
    // Elements HTML
    this.video = document.getElementById(SELECTORS.VIDEO);
    this.canvas = document.getElementById(SELECTORS.CANVAS);
    this.snapBtn = document.getElementById(SELECTORS.SNAP_BTN);
    this.selfiePreview = document.getElementById(SELECTORS.SELFIE_PREVIEW);
    this.deletePhoto = document.getElementById(SELECTORS.DELETE_PHOTO);

    // Containers
    this.cameraContainer = document.getElementById(SELECTORS.CAMERA_CONTAINER);
    this.uploadContainer = document.getElementById(SELECTORS.UPLOAD_CONTAINER);
    this.photoContainer = document.getElementById(SELECTORS.PHOTO_CONTAINER);

    // Buttons et input
    this.selfieBtn = document.getElementById(SELECTORS.SELFIE_BTN);
    this.uploadBtn = document.getElementById(SELECTORS.UPLOAD_BTN);
    this.fileInput = document.getElementById(SELECTORS.FILE_INPUT);

    // Stocke le flux vidéo si la caméra est active
    this.cameraStream = null;

    this.initCamera();
    this.initEvents();
  }

  /**
   * Initialise la caméra si disponible
   * Si non disponible, bascule en mode upload
   */
  initCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      console.error('Camera API not available. HTTPS is required.');
      alert(
        "⚠️ La caméra n'est pas disponible.\n- Utilisez HTTPS ou localhost\n- Ou utilisez le mode Upload"
      );
      this.switchToUpload();
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        this.video.srcObject = stream;
        this.cameraStream = stream;
      })
      .catch(err => {
        console.error('Camera error:', err);
        alert(
          `⚠️ Impossible d'accéder à la caméra.\nErreur: ${err.message}\n- Autorisez la caméra ou utilisez Upload`
        );
        this.switchToUpload();
      });
  }

  /**
   * Affiche le mode caméra pour selfie
   */
  switchToSelfie() {
    this.selfieBtn.classList.add('active');
    this.uploadBtn.classList.remove('active');

    this.cameraContainer.classList.remove('d-none');
    this.uploadContainer.classList.add('d-none');
    this.photoContainer.classList.add('d-none');

    // Lance la caméra si elle n'est pas déjà activée
    if (!this.cameraStream) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          this.video.srcObject = stream;
          this.cameraStream = stream;
        })
        .catch(err => console.error('Camera error:', err));
    }
  }

  /**
   * Affiche le mode upload pour choisir une photo depuis l'ordinateur
   */
  switchToUpload() {
    this.uploadBtn.classList.add('active');
    this.selfieBtn.classList.remove('active');

    this.uploadContainer.classList.remove('d-none');
    this.cameraContainer.classList.add('d-none');
    this.photoContainer.classList.add('d-none');
  }

  /**
   * Capture la photo depuis la caméra et l'affiche dans la preview
   */
  capturePhoto() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0);

    this.selfiePreview.src = this.canvas.toDataURL('image/png');

    this.cameraContainer.classList.add('d-none');
    this.photoContainer.classList.remove('d-none');
  }

  /**
   * Gère l'upload d'une image depuis l'ordinateur
   * @param {Event} e - L'événement change sur l'input file
   */
  handleFileUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = event => {
        this.selfiePreview.src = event.target.result;
        this.uploadContainer.classList.add('d-none');
        this.photoContainer.classList.remove('d-none');
      };

      reader.readAsDataURL(file);
    }
  }

  /**
   * Supprime la photo actuelle et remet le mode actif (selfie ou upload)
   */
  deleteCurrentPhoto() {
    this.selfiePreview.src = '';
    this.fileInput.value = '';
    this.photoContainer.classList.add('d-none');

    if (this.selfieBtn.classList.contains('active')) {
      this.cameraContainer.classList.remove('d-none');
    } else {
      this.uploadContainer.classList.remove('d-none');
    }
  }

  /**
   * Initialise les événements sur les boutons et input
   */
  initEvents() {
    this.selfieBtn.addEventListener('click', () => this.switchToSelfie());
    this.uploadBtn.addEventListener('click', () => this.switchToUpload());
    this.snapBtn.addEventListener('click', () => this.capturePhoto());
    this.fileInput.addEventListener('change', e => this.handleFileUpload(e));
    this.deletePhoto.addEventListener('click', () => this.deleteCurrentPhoto());
  }

  /**
   * Retourne l'URL de la photo actuelle ou null si aucune
   * @returns {string|null}
   */
  getImageUrl() {
    return this.selfiePreview.src || null;
  }

  /**
   * Réinitialise le manager en effaçant la photo et en rétablissant le mode actif
   */
  reset() {
    this.selfiePreview.src = '';
    this.fileInput.value = '';
    this.photoContainer.classList.add('d-none');

    if (this.selfieBtn.classList.contains('active')) {
      this.cameraContainer.classList.remove('d-none');
      this.uploadContainer.classList.add('d-none');
    } else {
      this.uploadContainer.classList.remove('d-none');
      this.cameraContainer.classList.add('d-none');
    }
  }
}
