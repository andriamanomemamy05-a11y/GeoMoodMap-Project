/**
 * Unit tests for CameraManager (SOLID refactored)
 */

import { CameraManager } from '../../../../src/frontend/js/modules/CameraManager.js';
import { SELECTORS } from '../../../../src/frontend/js/constants.js';

describe('CameraManager', () => {
  beforeEach(() => {
    // Mock alert
    global.alert = jest.fn();

    // Créer les éléments DOM nécessaires
    const elements = [
      { id: SELECTORS.VIDEO, type: 'video' },
      { id: SELECTORS.CANVAS, type: 'canvas' },
      { id: SELECTORS.SNAP_BTN, type: 'button' },
      { id: SELECTORS.SELFIE_PREVIEW, type: 'img' },
      { id: SELECTORS.DELETE_PHOTO, type: 'button' },
      { id: SELECTORS.CAMERA_CONTAINER, type: 'div' },
      { id: SELECTORS.UPLOAD_CONTAINER, type: 'div' },
      { id: SELECTORS.PHOTO_CONTAINER, type: 'div' },
      { id: SELECTORS.SELFIE_BTN, type: 'button' },
      { id: SELECTORS.UPLOAD_BTN, type: 'button' },
      { id: SELECTORS.FILE_INPUT, type: 'input' },
    ];

    elements.forEach(elInfo => {
      const el = document.createElement(elInfo.type);
      el.id = elInfo.id;
      document.body.appendChild(el);
    });

    // Mock canvas context et toDataURL
    const canvas = document.getElementById(SELECTORS.CANVAS);
    canvas.getContext = jest.fn(() => ({ drawImage: jest.fn() }));
    canvas.toDataURL = jest.fn(() => 'data:image/png;base64,test');

    // Mock video dimensions
    const video = document.getElementById(SELECTORS.VIDEO);
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
    jest.resetAllMocks();
  });

  test('should initialize camera successfully', async () => {
    const mockStream = { getTracks: () => [] };
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue(mockStream) };

    new CameraManager();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ video: true });
  });

  test('should switch to upload if no mediaDevices', () => {
    delete navigator.mediaDevices;

    new CameraManager();
    expect(document.getElementById(SELECTORS.UPLOAD_BTN).classList.contains('active')).toBe(true);
  });

  test('should capture a photo', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    manager.capturePhoto();

    const preview = document.getElementById(SELECTORS.SELFIE_PREVIEW);
    expect(preview.src).toContain('data:image/png');
  });

  test('should switch to selfie mode', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    manager.switchToSelfie();

    expect(document.getElementById(SELECTORS.SELFIE_BTN).classList.contains('active')).toBe(true);
  });

  test('should switch to upload mode', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    manager.switchToUpload();

    expect(document.getElementById(SELECTORS.UPLOAD_BTN).classList.contains('active')).toBe(true);
  });

  test('should delete current photo', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    document.getElementById(SELECTORS.SELFIE_BTN).classList.add('active');
    const preview = document.getElementById(SELECTORS.SELFIE_PREVIEW);
    preview.src = 'test.jpg';

    manager.deleteCurrentPhoto();

    expect(preview.src === '' || preview.src === 'http://localhost/').toBe(true);
  });

  test('should reset and show camera in selfie mode', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    document.getElementById(SELECTORS.SELFIE_BTN).classList.add('active');

    manager.reset();

    expect(document.getElementById(SELECTORS.CAMERA_CONTAINER).classList.contains('d-none')).toBe(false);
  });

  test('should return image URL', () => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    const preview = document.getElementById(SELECTORS.SELFIE_PREVIEW);
    preview.src = 'test.png';

    expect(manager.getImageUrl()).toContain('test.png');
  });

  test('should handle image file upload', done => {
    navigator.mediaDevices = { getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [] }) };

    const manager = new CameraManager();
    const file = new Blob(['test'], { type: 'image/jpeg' });

    const event = { target: { files: [file] } };
    manager.handleFileUpload(event);

    setTimeout(() => {
      const preview = document.getElementById(SELECTORS.SELFIE_PREVIEW);
      expect(preview.src).toBeTruthy();
      done();
    }, 10);
  });
});
