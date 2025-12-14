jest.mock('../src/utils/imageHandler');

const { saveBase64Image } = require('../src/utils/imageHandler');
const { uploadSelfie } = require('../src/controllers/selfieController');

describe('selfieController', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('uploadSelfie', () => {
    test('retourne une erreur 400 si aucune image n\'est fournie', () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      uploadSelfie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No image provided' });
    });

    test('retourne une erreur 400 si l\'image ne peut pas être sauvegardée', () => {
      saveBase64Image.mockReturnValue(null);

      const req = { body: { image: 'data:image/png;base64,invalid' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      uploadSelfie(req, res);

      expect(saveBase64Image).toHaveBeenCalledWith('data:image/png;base64,invalid');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to save image' });
    });

    test('retourne le chemin de l\'image sauvegardée avec succès', () => {
      saveBase64Image.mockReturnValue('selfies/selfie_123456.png');

      const req = { body: { image: 'data:image/png;base64,validbase64' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      uploadSelfie(req, res);

      expect(saveBase64Image).toHaveBeenCalledWith('data:image/png;base64,validbase64');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        path: 'selfies/selfie_123456.png'
      });
    });

    test('retourne une erreur 500 en cas d\'exception', () => {
      saveBase64Image.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      const req = { body: { image: 'data:image/png;base64,validbase64' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      uploadSelfie(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to save image' });
    });
  });
});
