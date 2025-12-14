jest.mock('fs');

const fs = require('fs');
const { loadAll, save } = require('../src/storage/jsonStore');

describe('jsonStore', () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('loadAll', () => {
    test('retourne un tableau vide si le fichier n\'existe pas', () => {
      fs.existsSync.mockReturnValue(false);
      fs.mkdirSync.mockImplementation(() => {});
      fs.writeFileSync.mockImplementation(() => {});

      const result = loadAll();

      expect(result).toEqual([]);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('moods.json'),
        '[]',
        'utf8'
      );
    });

    test('retourne les données si le fichier contient un JSON valide', () => {
      const mockData = [{ id: 1, text: 'Test' }];
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

      const result = loadAll();

      expect(result).toEqual(mockData);
    });

    test('réinitialise le fichier si le JSON est corrompu', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('invalid json');
      fs.writeFileSync.mockImplementation(() => {});

      const result = loadAll();

      expect(result).toEqual([]);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('moods.json'),
        '[]',
        'utf8'
      );
    });

    test('réinitialise le fichier si les données ne sont pas un tableau', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify({ not: 'array' }));
      fs.writeFileSync.mockImplementation(() => {});

      const result = loadAll();

      expect(result).toEqual([]);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('moods.json'),
        '[]',
        'utf8'
      );
    });
  });

  describe('save', () => {
    test('ajoute une entrée au tableau existant', () => {
      const existingData = [{ id: 1, text: 'First' }];
      const newEntry = { id: 2, text: 'Second' };

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(existingData));
      fs.writeFileSync.mockImplementation(() => {});

      save(newEntry);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('moods.json'),
        expect.stringContaining('"id": 2'),
        'utf8'
      );
    });

    test('lance une erreur si entry est null ou undefined', () => {
      expect(() => save(null)).toThrow('entry is required');
      expect(() => save(undefined)).toThrow('entry is required');
    });
  });
});
