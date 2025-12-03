// Petit analyseur lexicale : retourne un integer pouvant être négatif ou positif.

const positives = ['bien', 'heureux', 'content', 'joyeux', 'serein', 'love', 'happy', 'ravi', 'cool'];
const negatives = ['mal', 'triste', 'hate', 'déçu', 'colère', 'anxieux', 'stress', 'mauvais', 'deteste'];

function analyzeText(text) {
  if (!text || typeof text !== 'string') return 0;
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  let score = 0;
  for (const w of words) {
    if (positives.includes(w)) score += 1;
    if (negatives.includes(w)) score -= 1;
  }
  return score;
}

module.exports = { analyzeText };
