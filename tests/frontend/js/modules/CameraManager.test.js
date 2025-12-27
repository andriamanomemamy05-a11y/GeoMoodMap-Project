/**
 * Tests unitaires pour CameraManager
 */

import { CameraManager } from '../../../../src/frontend/js/modules/CameraManager.js';

describe('CameraManager', () => {
  beforeEach(() => {
    // Mock alert
    global.alert = jest.fn();

    // Créer les éléments DOM
    const ids = [
      'camera',
      'canvas',
      'snap',
      'selfiePreview',
      'deletePhoto',
      'cameraContainer',
      'uploadContainer',
      'photoContainer',
      'selfieBtn',
      'uploadBtn',
      'fileInput',
    ];

    const elementTypes = {
      camera: 'video',
      canvas: 'canvas',
      fileInput: 'input',
      selfiePreview: 'img',
    };

    ids.forEach(id => {
      const elementType = elementTypes[id] || 'div';
      const el = document.createElement(elementType);
      el.id = id;
      document.body.appendChild(el);
    });

    // Mock canvas
    const canvas = document.getElementById('canvas');
    canvas.getContext = jest.fn(() => ({ drawImage: jest.fn() }));
    canvas.toDataURL = jest.fn(() => 'data:image/png;base64,test');

    // Mock video
    const video = document.getElementById('camera');
    Object.defineProperty(video, 'videoWidth', { value: 640 });
    Object.defineProperty(video, 'videoHeight', { value: 480 });

    // Mock FileReader
    global.FileReader = jest.fn(function () {
      this.readAsDataURL = jest.fn(function () {
        setTimeout(() => {
          this.onload({ target: { result: 'data:image/jpeg;base64,test' } });
        }, 0);
      });
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('devrait initialiser la caméra avec succès', async () => {
    const mockStream = { getTracks: () => [] };
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue(mockStream) };

    new CameraManager();
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: true });
  });

  test('devrait basculer vers upload si pas de MediaDevices', () => {
    delete navigator.mediaDevices;

    new CameraManager();

    const uploadBtn = document.getElementById('uploadBtn');
    expect(uploadBtn.classList.contains('active')).toBe(true);
  });

  test('devrait capturer une photo', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    manager.capturePhoto();

    const preview = document.getElementById('selfiePreview');
    expect(preview.src).toContain('data:image/png');
  });

  test('devrait switcher vers selfie', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    manager.switchToSelfie();

    expect(document.getElementById('selfieBtn').classList.contains('active')).toBe(true);
  });

  test('devrait switcher vers upload', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    manager.switchToUpload();

    expect(document.getElementById('uploadBtn').classList.contains('active')).toBe(true);
  });

  test('devrait supprimer la photo courante', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    document.getElementById('selfieBtn').classList.add('active');
    const preview = document.getElementById('selfiePreview');
    preview.src = 'test.jpg';

    manager.deleteCurrentPhoto();

    // JSDOM sets empty src to "http://localhost/" or ""
    expect(preview.src === '' || preview.src === 'http://localhost/').toBe(true);
  });

  test('devrait reset et afficher caméra en mode selfie', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    document.getElementById('selfieBtn').classList.add('active');

    manager.reset();

    expect(document.getElementById('cameraContainer').classList.contains('d-none')).toBe(false);
  });

  test('devrait retourner imageUrl', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    const preview = document.getElementById('selfiePreview');
    preview.src = 'test.png';

    expect(manager.getImageUrl()).toContain('test.png');
  });

  test('devrait gérer upload de fichier image', done => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    const file = new Blob(['test'], { type: 'image/jpeg' });

    const event = { target: { files: [file] } };
    manager.handleFileUpload(event);

    setTimeout(() => {
      const preview = document.getElementById('selfiePreview');
      expect(preview.src).toBeTruthy();
      done();
    }, 10);
  });
});
