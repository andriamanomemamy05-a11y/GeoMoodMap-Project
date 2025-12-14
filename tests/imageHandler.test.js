jest.mock('fs');

const fs = require('fs');
const { saveBase64Image } = require('../src/utils/imageHandler');

describe('imageHandler', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockImplementation(() => {});
    fs.writeFileSync.mockImplementation(() => {});
  });

  describe('saveBase64Image', () => {
    test('retourne null si imageUrl est null ou undefined', () => {
      expect(saveBase64Image(null)).toBeNull();
      expect(saveBase64Image(undefined)).toBeNull();
    });

    test('retourne null si imageUrl ne commence pas par data:image', () => {
      expect(saveBase64Image('invalidformat')).toBeNull();
      expect(saveBase64Image('http://example.com/image.png')).toBeNull();
    });

    test('sauvegarde l\'image et retourne le chemin relatif', () => {
      const validBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
      const result = saveBase64Image(validBase64);

      expect(result).toMatch(/^selfies\/selfie_\d+\.png$/);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('crée le dossier si il n\'existe pas', () => {
      fs.existsSync.mockReturnValue(false);
      const validBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';

      saveBase64Image(validBase64);

      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    test('retourne null en cas d\'erreur lors de l\'écriture', () => {
      fs.writeFileSync.mockImplementation(() => {
        throw new Error('Write error');
      });

      const validBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
      const result = saveBase64Image(validBase64);

      expect(result).toBeNull();
    });
  });
});
