// On mocke modules externes avant de require le controller
jest.mock('../src/services/geocodeService');
jest.mock('../src/services/weatherService');
jest.mock('fs');

const fs = require('fs');
const geocodeService = require('../src/services/geocodeService');
const weatherService = require('../src/services/weatherService');

// Après les mocks, on importe le controller (module qui utilise les services)
const { addMood } = require('../src/controllers/moodController');

describe('moodController addMood behavior', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Mocks fs basiques pour éviter écriture réelle
    fs.existsSync.mockReturnValue(false);
    fs.readFileSync.mockReturnValue('[]');
    fs.writeFileSync.mockImplementation(() => {});
    fs.mkdirSync.mockImplementation(() => {});
  });

  test('privilégie lat/lon quand lat+lon ET address fournis (appel reverseGeocode)', async () => {
    // Préparation des mocks
    geocodeService.reverseGeocode.mockResolvedValue({
      name: 'PlaceFromCoords',
      type: 'park',
      lat: 43.2820455,
      lon: 5.3812726,
    });
    geocodeService.forwardGeocode.mockResolvedValue({
      name: 'PlaceFromAddress',
      type: 'street',
      lat: '43.999',
      lon: '5.999',
    }); // ne doit pas être appelé
    weatherService.getWeather.mockResolvedValue({
      source: 'mock',
      data: { temp: 20, weather: 'clear sky' },
    });

    // Data simulées
    const req = {
      body: {
        text: 'Je suis quoi',
        rating: 3,
        lat: 43.2820455,
        lon: 5.3812726,
        address: 'Avenue de la Viste, La Viste, Marseille',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addMood(req, res);

    // assertions dans les services
    expect(geocodeService.reverseGeocode).toHaveBeenCalledWith(43.2820455, 5.3812726);
    expect(geocodeService.forwardGeocode).not.toHaveBeenCalled();
    expect(weatherService.getWeather).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);

    // vérifier que json a été appelé et que l'objet contient lat/lon venant des coords
    const returned = res.json.mock.calls[0][0];
    expect(returned).toHaveProperty('lat', 43.2820455);
    expect(returned).toHaveProperty('lon', 5.3812726);
    expect(returned).toHaveProperty('place');
    expect(returned.place.name).toBe('PlaceFromCoords');
  });

  test('utilise forwardGeocode quand seule address fournie', async () => {
    // Appel des mocks dans les services
    geocodeService.reverseGeocode.mockResolvedValue(null);
    geocodeService.forwardGeocode.mockResolvedValue({
      name: 'PlaceFromAddress',
      type: 'street',
      lat: '43.999',
      lon: '5.999',
    });
    weatherService.getWeather.mockResolvedValue({
      source: 'mock',
      data: { temp: 15, weather: 'light rain' },
    });

    const req = {
      body: {
        text: 'Tranquille',
        rating: 4,
        address: 'Avenue de la Viste, La Viste, Marseille',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await addMood(req, res);

    // forwardGeocode doit avoir été appelé
    expect(geocodeService.forwardGeocode).toHaveBeenCalledWith(
      'Avenue de la Viste, La Viste, Marseille'
    );
    expect(geocodeService.reverseGeocode).not.toHaveBeenCalled();
    expect(weatherService.getWeather).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    const returned = res.json.mock.calls[0][0];

    // lat/lon dans returned viennent de forwardGeocode et ont été parseFloat
    expect(returned.lat).toBeCloseTo(43.999, 3);
    expect(returned.lon).toBeCloseTo(5.999, 3);
    expect(returned.place.name).toBe('PlaceFromAddress');
  });
});
