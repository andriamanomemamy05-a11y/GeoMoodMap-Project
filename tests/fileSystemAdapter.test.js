jest.mock('fs');

const fs = require('fs');
const path = require('path');
const {
  ensureDirectory,
  ensureFile,
  readFile,
  writeFile,
} = require('../src/storage/fileSystemAdapter');

describe('fileSystemAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureDirectory', () => {
    test('crée un dossier si inexistant', () => {
      fs.existsSync.mockReturnValue(false);

      ensureDirectory('/test/dir');

      expect(fs.mkdirSync).toHaveBeenCalledWith('/test/dir', { recursive: true });
    });

    test('ne crée pas de dossier si existant', () => {
      fs.existsSync.mockReturnValue(true);

      ensureDirectory('/test/dir');

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('ensureFile', () => {
    test('crée un fichier avec contenu par défaut si inexistant', () => {
      fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);

      ensureFile('/test/file.json', '[]');

      expect(fs.writeFileSync).toHaveBeenCalledWith('/test/file.json', '[]', 'utf8');
    });

    test('crée le dossier parent si nécessaire', () => {
      fs.existsSync.mockReturnValue(false);

      ensureFile('/test/dir/file.json', '[]');

      expect(fs.mkdirSync).toHaveBeenCalledWith('/test/dir', { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith('/test/dir/file.json', '[]', 'utf8');
    });

    test('ne fait rien si le fichier existe déjà', () => {
      fs.existsSync.mockReturnValue(true);

      ensureFile('/test/file.json', '[]');

      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
  });

  describe('readFile', () => {
    test('lit le contenu du fichier', () => {
      fs.readFileSync.mockReturnValue('{"test": true}');

      const result = readFile('/test/file.json');

      expect(fs.readFileSync).toHaveBeenCalledWith('/test/file.json', 'utf8');
      expect(result).toBe('{"test": true}');
    });

    test('lance une erreur si la lecture échoue', () => {
      fs.readFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file');
      });

      expect(() => readFile('/test/missing.json')).toThrow(
        'Failed to read file /test/missing.json: ENOENT: no such file'
      );
    });
  });

  describe('writeFile', () => {
    test('écrit du contenu dans un fichier', () => {
      writeFile('/test/file.json', '{"data": []}');

      expect(fs.writeFileSync).toHaveBeenCalledWith('/test/file.json', '{"data": []}', 'utf8');
    });

    test('lance une erreur si l\'écriture échoue', () => {
      fs.writeFileSync.mockImplementation(() => {
        throw new Error('EACCES: permission denied');
      });

      expect(() => writeFile('/test/file.json', 'data')).toThrow(
        'Failed to write file /test/file.json: EACCES: permission denied'
      );
    });
  });
});
