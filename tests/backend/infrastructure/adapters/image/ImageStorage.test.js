jest.mock('../../../../../src/backend/infrastructure/persistence/json/fileSystemAdapter');

const {
  parseBase64Image,
  isSupportedImageType,
} = require('../../../../../src/backend/infrastructure/adapters/image/ImageParser');
const {
  generateUniqueFileName,
  generateRelativePath,
} = require('../../../../../src/backend/infrastructure/adapters/image/NamingStrategy');
const {
  saveImageFromBase64,
} = require('../../../../../src/backend/infrastructure/adapters/image/ImageStorage');
const fileSystemAdapter = require('../../../../../src/backend/infrastructure/persistence/json/fileSystemAdapter');

describe('ImageParser', () => {
  describe('parseBase64Image', () => {
    test('parse une image PNG base64 valide', () => {
      const base64Image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      const result = parseBase64Image(base64Image);

      expect(result).not.toBeNull();
      expect(result.type).toBe('png');
      expect(result.base64Data).toBe(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      );
    });

    test('parse une image JPEG base64 valide', () => {
      const base64Image =
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/AKp/2Q==';

      const result = parseBase64Image(base64Image);

      expect(result).not.toBeNull();
      expect(result.type).toBe('jpeg');
    });

    test('retourne null si imageUrl est null', () => {
      const result = parseBase64Image(null);
      expect(result).toBeNull();
    });

    test('retourne null si imageUrl ne commence pas par data:image', () => {
      const result = parseBase64Image('http://example.com/image.jpg');
      expect(result).toBeNull();
    });

    test('retourne null si format base64 invalide', () => {
      const result = parseBase64Image('data:image/png;invalid');
      expect(result).toBeNull();
    });
  });

  describe('isSupportedImageType', () => {
    test('retourne true pour png', () => {
      expect(isSupportedImageType('png')).toBe(true);
    });

    test('retourne true pour jpeg', () => {
      expect(isSupportedImageType('jpeg')).toBe(true);
    });

    test('retourne true pour jpg', () => {
      expect(isSupportedImageType('jpg')).toBe(true);
    });

    test('retourne true pour webp', () => {
      expect(isSupportedImageType('webp')).toBe(true);
    });

    test('retourne false pour un type non supporté', () => {
      expect(isSupportedImageType('bmp')).toBe(false);
    });
  });
});

describe('NamingStrategy', () => {
  describe('generateUniqueFileName', () => {
    test('génère un nom de fichier avec extension PNG', () => {
      const fileName = generateUniqueFileName('png');
      expect(fileName).toMatch(/^selfie_\d+\.png$/);
    });

    test('convertit jpeg en jpg', () => {
      const fileName = generateUniqueFileName('jpeg');
      expect(fileName).toMatch(/^selfie_\d+\.jpg$/);
    });

    test('supporte webp', () => {
      const fileName = generateUniqueFileName('webp');
      expect(fileName).toMatch(/^selfie_\d+\.webp$/);
    });
  });

  describe('generateRelativePath', () => {
    test('génère un chemin relatif pour selfies', () => {
      const path = generateRelativePath('selfie_123456.png');
      expect(path).toBe('selfies/selfie_123456.png');
    });
  });
});

describe('ImageStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fileSystemAdapter.ensureDirectory.mockImplementation(() => {});
    fileSystemAdapter.writeFile.mockImplementation(() => {});
  });

  describe('saveImageFromBase64', () => {
    test('sauvegarde une image PNG base64', () => {
      const base64Image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      const result = saveImageFromBase64(base64Image);

      expect(fileSystemAdapter.ensureDirectory).toHaveBeenCalled();
      expect(fileSystemAdapter.writeFile).toHaveBeenCalled();
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
      expect(fileSystemAdapter.writeFile).not.toHaveBeenCalled();
    });

    test('retourne null si imageUrl ne commence pas par data:image', () => {
      const result = saveImageFromBase64('http://example.com/image.jpg');
      expect(result).toBeNull();
      expect(fileSystemAdapter.writeFile).not.toHaveBeenCalled();
    });

    test('retourne null si type image non supporté', () => {
      // Modifier temporairement isSupportedImageType pour simuler un type non supporté
      const base64Image = 'data:image/bmp;base64,Qk0=';

      const result = saveImageFromBase64(base64Image);

      expect(result).toBeNull();
      expect(fileSystemAdapter.writeFile).not.toHaveBeenCalled();
    });
  });
});
