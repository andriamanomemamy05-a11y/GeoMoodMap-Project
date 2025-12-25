const { computeScoreWithBreakdown } = require('../src/utils/moodScore');

describe('computeScoreWithBreakdown', () => {
  test('score maximum avec bon rating, texte positif et météo ensoleillée', () => {
    const result = computeScoreWithBreakdown({
      rating: 5,
      textScore: 3,
      weather: { weather: 'clear', temp: 30 },
    });
    expect(result).toBe(100);
  });

  test('score minimum avec mauvais rating, texte négatif et pluie', () => {
    const result = computeScoreWithBreakdown({
      rating: 1,
      textScore: -3,
      weather: { weather: 'rain', temp: 0 },
    });
    expect(result).toBe(0);
  });
});
