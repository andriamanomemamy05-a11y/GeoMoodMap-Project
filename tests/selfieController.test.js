jest.mock('../src/infrastructure/adapters/image/ImageStorage');

const { saveImageFromBase64 } = require('../src/infrastructure/adapters/image/ImageStorage');
const { saveSelfie } = require('../src/infrastructure/web/controllers/selfieController');

describe('selfieController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveSelfie', () => {
    test('sauvegarde une image base64 valide', () => {
      const base64Image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      saveImageFromBase64.mockReturnValue('selfies/selfie_123456.png');

      const req = {
        body: {
          image: base64Image,
        },
      };

      const res = {
        json: jest.fn(),
      };

      saveSelfie(req, res);

      expect(saveImageFromBase64).toHaveBeenCalledWith(base64Image);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          relativePath: 'selfies/selfie_123456.png',
        })
      );
    });

    test('retourne 400 si aucune image fournie', () => {
      const req = {
        body: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      saveSelfie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No image provided' });
      expect(saveImageFromBase64).not.toHaveBeenCalled();
    });

    test('retourne 400 si image est null', () => {
      const req = {
        body: {
          image: null,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      saveSelfie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No image provided' });
    });

    test('retourne 400 si format image invalide (saveImageFromBase64 retourne null)', () => {
      saveImageFromBase64.mockReturnValue(null);

      const req = {
        body: {
          image: 'invalid-format',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      saveSelfie(req, res);

      expect(saveImageFromBase64).toHaveBeenCalledWith('invalid-format');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid image format' });
    });

    test('retourne chemin absolu et relatif dans la réponse', () => {
      saveImageFromBase64.mockReturnValue('selfies/test.jpg');

      const req = {
        body: {
          image: 'data:image/jpeg;base64,abc',
        },
      };

      const res = {
        json: jest.fn(),
      };

      saveSelfie(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.relativePath).toBe('selfies/test.jpg');
      expect(response.path).toContain('public');
      expect(response.path).toContain('selfies');
      expect(response.path).toContain('test.jpg');
    });

    test('gère les erreurs internes avec status 500', () => {
      saveImageFromBase64.mockImplementation(() => {
        throw new Error('Filesystem error');
      });

      const req = {
        body: {
          image: 'data:image/png;base64,abc',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      saveSelfie(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to save image' });
    });
  });
});
