// Test pour vérifier la gestion des images (selfie et upload)
jest.mock('../src/infrastructure/adapters/geocode/geocodeService');
jest.mock('../src/infrastructure/adapters/weather/weatherService');
jest.mock('fs');

const fs = require('fs');
const geocodeService = require('../src/infrastructure/adapters/geocode/geocodeService');
const weatherService = require('../src/infrastructure/adapters/weather/weatherService');

const { addMood } = require('../src/infrastructure/web/controllers/moodController');

describe('Image Upload (Selfie and File Upload)', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Mocks fs pour éviter l'écriture réelle
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('[]');
    fs.writeFileSync.mockImplementation(() => {});
    fs.mkdirSync.mockImplementation(() => {});

    // Mocks services
    geocodeService.reverseGeocode.mockResolvedValue({
      name: 'Test Location',
      type: 'city',
      lat: 48.8566,
      lon: 2.3522,
    });
    weatherService.getWeather.mockResolvedValue({
      source: 'mock',
      data: {
        temp: 20,
        weather: 'clear sky',
        humidity: 60,
        wind_speed: 5,
      },
    });
  });

  test('sauvegarde une image base64 depuis selfie', async () => {
    const base64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const req = {
      body: {
        text: 'Humeur avec selfie',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        imageUrl: base64Image,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addMood(req, res);

    // Vérifie que fs.writeFileSync a été appelé pour sauvegarder l'image
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writeCall = fs.writeFileSync.mock.calls.find(
      call => call[0].includes('selfie_') && call[0].endsWith('.png')
    );
    expect(writeCall).toBeDefined();
    expect(writeCall[2]).toBe('base64');

    // Vérifie que la réponse contient le chemin de l'image
    expect(res.status).toHaveBeenCalledWith(201);
    const returned = res.json.mock.calls[0][0];
    expect(returned.imageUrl).toMatch(/^selfies\/selfie_\d+\.png$/);
  });

  test('sauvegarde une image base64 depuis upload de fichier JPEG', async () => {
    // Une image uploadée via FileReader est aussi convertie en base64
    const base64Image =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/AKp/2Q==';

    const req = {
      body: {
        text: 'Humeur avec photo uploadée',
        rating: 5,
        lat: 48.8566,
        lon: 2.3522,
        imageUrl: base64Image,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addMood(req, res);

    // Vérifie que l'image a bien été sauvegardée en .jpg (jpeg → jpg)
    expect(fs.writeFileSync).toHaveBeenCalled();
    const writeCall = fs.writeFileSync.mock.calls.find(
      call => call[0].includes('selfie_') && call[0].endsWith('.jpg')
    );
    expect(writeCall).toBeDefined();

    // Vérifie la réponse (jpeg devient .jpg)
    expect(res.status).toHaveBeenCalledWith(201);
    const returned = res.json.mock.calls[0][0];
    expect(returned.imageUrl).toMatch(/^selfies\/selfie_\d+\.jpg$/);
  });

  test("ne sauvegarde pas d'image si imageUrl est null", async () => {
    const req = {
      body: {
        text: 'Humeur sans photo',
        rating: 3,
        lat: 48.8566,
        lon: 2.3522,
        imageUrl: null,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addMood(req, res);

    // Vérifie qu'aucune image n'a été sauvegardée
    const writeCall = fs.writeFileSync.mock.calls.find(call => call[0].includes('selfie_'));
    expect(writeCall).toBeUndefined();

    // Vérifie que imageUrl est null dans la réponse
    expect(res.status).toHaveBeenCalledWith(201);
    const returned = res.json.mock.calls[0][0];
    expect(returned.imageUrl).toBeNull();
  });

  test("ne sauvegarde pas d'image si imageUrl n'est pas en base64", async () => {
    const req = {
      body: {
        text: 'Humeur avec URL invalide',
        rating: 3,
        lat: 48.8566,
        lon: 2.3522,
        imageUrl: 'http://example.com/image.jpg',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addMood(req, res);

    // Vérifie qu'aucune image n'a été sauvegardée (pas de data:image)
    const writeCall = fs.writeFileSync.mock.calls.find(call => call[0].includes('selfie_'));
    expect(writeCall).toBeUndefined();

    // Vérifie que imageUrl est null
    const returned = res.json.mock.calls[0][0];
    expect(returned.imageUrl).toBeNull();
  });

  test("crée le dossier selfies s'il n'existe pas", async () => {
    // Simule que le dossier n'existe pas
    fs.existsSync.mockReturnValue(false);

    const base64Image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const req = {
      body: {
        text: 'Test création dossier',
        rating: 4,
        lat: 48.8566,
        lon: 2.3522,
        imageUrl: base64Image,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addMood(req, res);

    // Vérifie que mkdirSync a été appelé
    expect(fs.mkdirSync).toHaveBeenCalled();
    const mkdirCall = fs.mkdirSync.mock.calls.find(call => call[0].includes('selfies'));
    expect(mkdirCall).toBeDefined();
    expect(mkdirCall[1]).toEqual({ recursive: true });
  });
});
