jest.mock('../../../../../src/backend/infrastructure/persistence/json/fileSystemAdapter');
jest.mock('../../../../../src/backend/infrastructure/persistence/json/jsonValidator');

const fileSystemAdapter = require('../../../../../src/backend/infrastructure/persistence/json/fileSystemAdapter');
const jsonValidator = require('../../../../../src/backend/infrastructure/persistence/json/jsonValidator');
const {
  loadAll,
  save,
} = require('../../../../../src/backend/infrastructure/persistence/json/jsonStore');

describe('jsonStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadAll', () => {
    test('charge tous les moods depuis le fichier', () => {
      const mockRawData = '[{"id": 1, "text": "Test"}]';
      const mockParsedData = [{ id: 1, text: 'Test' }];

      fileSystemAdapter.ensureFile.mockImplementation(() => {});
      fileSystemAdapter.readFile.mockReturnValue(mockRawData);
      jsonValidator.parseJSON.mockReturnValue(mockParsedData);
      jsonValidator.validateArray.mockReturnValue(mockParsedData);

      const result = loadAll();

      expect(fileSystemAdapter.ensureFile).toHaveBeenCalledWith(
        expect.stringContaining('moods.json'),
        '[]'
      );
      expect(fileSystemAdapter.readFile).toHaveBeenCalledWith(
        expect.stringContaining('moods.json')
      );
      expect(jsonValidator.parseJSON).toHaveBeenCalledWith(mockRawData, []);
      expect(jsonValidator.validateArray).toHaveBeenCalledWith(mockParsedData, []);
      expect(result).toEqual(mockParsedData);
    });

    test('retourne un tableau vide si le fichier est vide', () => {
      fileSystemAdapter.ensureFile.mockImplementation(() => {});
      fileSystemAdapter.readFile.mockReturnValue('[]');
      jsonValidator.parseJSON.mockReturnValue([]);
      jsonValidator.validateArray.mockReturnValue([]);

      const result = loadAll();

      expect(result).toEqual([]);
    });

    test('réinitialise le fichier si les données sont invalides', () => {
      const mockRawData = 'invalid json';
      const mockParsedData = 'not an array';
      const fallbackData = [];

      fileSystemAdapter.ensureFile.mockImplementation(() => {});
      fileSystemAdapter.readFile.mockReturnValue(mockRawData);
      fileSystemAdapter.writeFile.mockImplementation(() => {});
      jsonValidator.parseJSON.mockReturnValue(mockParsedData);
      jsonValidator.validateArray.mockReturnValue(fallbackData);

      const result = loadAll();

      expect(jsonValidator.validateArray).toHaveBeenCalledWith(mockParsedData, []);
      expect(fileSystemAdapter.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('moods.json'),
        '[]'
      );
      expect(result).toEqual([]);
    });

    test('ne réinitialise pas le fichier si données valides mais tableau vide', () => {
      const parsedArray = [];

      fileSystemAdapter.ensureFile.mockImplementation(() => {});
      fileSystemAdapter.readFile.mockReturnValue('[]');
      fileSystemAdapter.writeFile.mockImplementation(() => {});
      jsonValidator.parseJSON.mockReturnValue(parsedArray);
      jsonValidator.validateArray.mockReturnValue(parsedArray);

      loadAll();

      expect(fileSystemAdapter.writeFile).not.toHaveBeenCalled();
    });

    test('charge plusieurs moods correctement', () => {
      const mockMoods = [
        { id: 1, text: 'Mood 1', rating: 4 },
        { id: 2, text: 'Mood 2', rating: 5 },
        { id: 3, text: 'Mood 3', rating: 3 },
      ];

      fileSystemAdapter.ensureFile.mockImplementation(() => {});
      fileSystemAdapter.readFile.mockReturnValue(JSON.stringify(mockMoods));
      jsonValidator.parseJSON.mockReturnValue(mockMoods);
      jsonValidator.validateArray.mockReturnValue(mockMoods);

      const result = loadAll();

      expect(result).toEqual(mockMoods);
      expect(result).toHaveLength(3);
    });
  });

  describe('save', () => {
    test('sauvegarde un nouveau mood', () => {
      const existingMoods = [{ id: 1, text: 'Existing' }];
      const newMood = { id: 2, text: 'New mood', rating: 4 };
      const updatedMoods = [...existingMoods, newMood];

      fileSystemAdapter.ensureFile.mockImplementation(() => {});
      fileSystemAdapter.readFile.mockReturnValue(JSON.stringify(existingMoods));
      fileSystemAdapter.writeFile.mockImplementation(() => {});
      jsonValidator.parseJSON.mockReturnValue(existingMoods);
      jsonValidator.validateArray.mockReturnValue(existingMoods);
      jsonValidator.stringifyJSON.mockReturnValue(JSON.stringify(updatedMoods));

      save(newMood);

      expect(jsonValidator.stringifyJSON).toHaveBeenCalledWith(updatedMoods);
      expect(fileSystemAdapter.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('moods.json'),
        JSON.stringify(updatedMoods)
      );
    });

    test('sauvegarde le premier mood dans un fichier vide', () => {
      const newMood = { id: 1, text: 'First mood', rating: 5 };

      fileSystemAdapter.ensureFile.mockImplementation(() => {});
      fileSystemAdapter.readFile.mockReturnValue('[]');
      fileSystemAdapter.writeFile.mockImplementation(() => {});
      jsonValidator.parseJSON.mockReturnValue([]);
      jsonValidator.validateArray.mockReturnValue([]);
      jsonValidator.stringifyJSON.mockReturnValue(JSON.stringify([newMood]));

      save(newMood);

      expect(jsonValidator.stringifyJSON).toHaveBeenCalledWith([newMood]);
      expect(fileSystemAdapter.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('moods.json'),
        JSON.stringify([newMood])
      );
    });

    test('throw une erreur si entry est null', () => {
      expect(() => save(null)).toThrow('entry is required');
      expect(fileSystemAdapter.writeFile).not.toHaveBeenCalled();
    });

    test('throw une erreur si entry est undefined', () => {
      expect(() => save(undefined)).toThrow('entry is required');
      expect(fileSystemAdapter.writeFile).not.toHaveBeenCalled();
    });

    test('ajoute le mood à la fin du tableau existant', () => {
      const existingMoods = [
        { id: 1, text: 'Mood 1' },
        { id: 2, text: 'Mood 2' },
      ];
      const newMood = { id: 3, text: 'Mood 3' };

      fileSystemAdapter.ensureFile.mockImplementation(() => {});
      fileSystemAdapter.readFile.mockReturnValue(JSON.stringify(existingMoods));
      fileSystemAdapter.writeFile.mockImplementation(() => {});
      jsonValidator.parseJSON.mockReturnValue(existingMoods);
      jsonValidator.validateArray.mockReturnValue(existingMoods);
      jsonValidator.stringifyJSON.mockImplementation(data => JSON.stringify(data));

      save(newMood);

      expect(jsonValidator.stringifyJSON).toHaveBeenCalledWith([
        { id: 1, text: 'Mood 1' },
        { id: 2, text: 'Mood 2' },
        { id: 3, text: 'Mood 3' },
      ]);
    });

    test('sauvegarde correctement un mood avec toutes les propriétés', () => {
      const fullMood = {
        id: 123,
        text: 'Je me sens bien',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        place: { name: 'Paris, France' },
        weather: { temp: 20, weather: 'clear' },
        textScore: 2,
        scoreResult: 75,
        imageUrl: 'selfies/test.png',
        createdAt: '2025-12-27T10:00:00.000Z',
      };

      fileSystemAdapter.ensureFile.mockImplementation(() => {});
      fileSystemAdapter.readFile.mockReturnValue('[]');
      fileSystemAdapter.writeFile.mockImplementation(() => {});
      jsonValidator.parseJSON.mockReturnValue([]);
      jsonValidator.validateArray.mockReturnValue([]);
      jsonValidator.stringifyJSON.mockReturnValue(JSON.stringify([fullMood]));

      save(fullMood);

      expect(jsonValidator.stringifyJSON).toHaveBeenCalledWith([fullMood]);
      expect(fileSystemAdapter.writeFile).toHaveBeenCalled();
    });
  });
});
