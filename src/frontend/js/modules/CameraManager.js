import { SELECTORS } from '../constants.js';

export class CameraManager {
  constructor() {
    this.video = document.getElementById(SELECTORS.VIDEO);
    this.canvas = document.getElementById(SELECTORS.CANVAS);
    this.snapBtn = document.getElementById(SELECTORS.SNAP_BTN);
    this.selfiePreview = document.getElementById(SELECTORS.SELFIE_PREVIEW);
    this.deletePhoto = document.getElementById(SELECTORS.DELETE_PHOTO);

    this.cameraContainer = document.getElementById(SELECTORS.CAMERA_CONTAINER);
    this.uploadContainer = document.getElementById(SELECTORS.UPLOAD_CONTAINER);
    this.photoContainer = document.getElementById(SELECTORS.PHOTO_CONTAINER);

    this.selfieBtn = document.getElementById(SELECTORS.SELFIE_BTN);
    this.uploadBtn = document.getElementById(SELECTORS.UPLOAD_BTN);
    this.fileInput = document.getElementById(SELECTORS.FILE_INPUT);

    this.cameraStream = null;

    this.initCamera();
    this.initEvents();
  }

  initCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera API not available. HTTPS is required for camera access.');
      alert(
        "⚠️ La caméra n'est pas disponible.\n\nPour utiliser la caméra:\n- Utilisez HTTPS (pas HTTP)\n- Ou accédez via localhost\n- Ou utilisez le mode Upload à la place"
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
        console.error('Erreur caméra:', err);
        alert(
          `⚠️ Impossible d'accéder à la caméra.\n\nErreur: ${err.message}\n\nVeuillez:\n- Autoriser l'accès à la caméra dans votre navigateur\n- Ou utiliser le mode Upload`
        );
        this.switchToUpload();
      });
  }

  switchToSelfie() {
    this.selfieBtn.classList.add('active');
    this.uploadBtn.classList.remove('active');

    this.cameraContainer.classList.remove('d-none');
    this.uploadContainer.classList.add('d-none');
    this.photoContainer.classList.add('d-none');

    if (!this.cameraStream) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
          this.video.srcObject = stream;
          this.cameraStream = stream;
        })
        .catch(err => console.error('Erreur caméra:', err));
    }
  }

  switchToUpload() {
    this.uploadBtn.classList.add('active');
    this.selfieBtn.classList.remove('active');

    this.uploadContainer.classList.remove('d-none');
    this.cameraContainer.classList.add('d-none');
    this.photoContainer.classList.add('d-none');
  }

  capturePhoto() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0);

    this.selfiePreview.src = this.canvas.toDataURL('image/png');

    this.cameraContainer.classList.add('d-none');
    this.photoContainer.classList.remove('d-none');
  }

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

  initEvents() {
    this.selfieBtn.addEventListener('click', () => this.switchToSelfie());
    this.uploadBtn.addEventListener('click', () => this.switchToUpload());
    this.snapBtn.addEventListener('click', () => this.capturePhoto());
    this.fileInput.addEventListener('change', e => this.handleFileUpload(e));
    this.deletePhoto.addEventListener('click', () => this.deleteCurrentPhoto());
  }

  getImageUrl() {
    return this.selfiePreview.src || null;
  }

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
