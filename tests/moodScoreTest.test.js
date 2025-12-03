const { computeScoreWithBreakdown } = require('../src/utils/moodScore');

describe('computeScoreWithBreakdown', () => {

    test('test avec valeur de score faux selon calcul ', () => {
        const result = computeScoreWithBreakdown({
            rating: 3,
            textScore: 0,
            weather: { weather: 'cloud', temp: 15 }
        });
        expect(result).toBe(100);
    });

    test('test score qui doit être négatif selon météo', () => {
        const result = computeScoreWithBreakdown({
            rating: 4,
            textScore: 1,
            weather: { weather: 'snow', temp: -2 }
        });
        expect(result).toBe(90);
    });

});
