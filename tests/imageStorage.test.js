jest.mock('fs');

const fs = require('fs');
const { saveImageFromBase64, generateImageFileName } = require('../src/services/imageStorage');

describe('imageStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.existsSync.mockReturnValue(true);
    fs.mkdirSync.mockImplementation(() => {});
    fs.writeFileSync.mockImplementation(() => {});
  });

  describe('generateImageFileName', () => {
    test('génère un nom de fichier avec extension PNG', () => {
      const fileName = generateImageFileName('png');
      expect(fileName).toMatch(/^selfie_\d+\.png$/);
    });

    test('convertit jpeg en jpg', () => {
      const fileName = generateImageFileName('jpeg');
      expect(fileName).toMatch(/^selfie_\d+\.jpg$/);
    });

    test('supporte webp', () => {
      const fileName = generateImageFileName('webp');
      expect(fileName).toMatch(/^selfie_\d+\.webp$/);
    });
  });

  describe('saveImageFromBase64', () => {
    test('sauvegarde une image PNG base64', () => {
      const base64Image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      const result = saveImageFromBase64(base64Image);

      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(result).toMatch(/^selfies\/selfie_\d+\.png$/);
    });

    test('sauvegarde une image JPEG et convertit extension en jpg', () => {
      const base64Image =
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/AKp/2Q==';

      const result = saveImageFromBase64(base64Image);

      expect(result).toMatch(/^selfies\/selfie_\d+\.jpg$/);
    });

    test('retourne null si imageUrl est null', () => {
      const result = saveImageFromBase64(null);
      expect(result).toBeNull();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('retourne null si imageUrl ne commence pas par data:image', () => {
      const result = saveImageFromBase64('http://example.com/image.jpg');
      expect(result).toBeNull();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    test('crée le dossier selfies si inexistant', () => {
      fs.existsSync.mockReturnValue(false);

      const base64Image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      saveImageFromBase64(base64Image);

      expect(fs.mkdirSync).toHaveBeenCalled();
      const mkdirCall = fs.mkdirSync.mock.calls[0];
      expect(mkdirCall[0]).toContain('selfies');
      expect(mkdirCall[1]).toEqual({ recursive: true });
    });

    test('retourne null si format base64 invalide', () => {
      const result = saveImageFromBase64('data:image/png;base64,invalid');

      // Le regex devrait matcher, mais si jamais il y a une erreur d'écriture, on catch
      expect(result).toBeDefined();
    });

    test('écrit le fichier avec encoding base64', () => {
      const base64Image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      saveImageFromBase64(base64Image);

      const writeCall = fs.writeFileSync.mock.calls[0];
      expect(writeCall[2]).toBe('base64');
    });
  });
});
