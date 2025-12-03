// Petit analyseur lexicale : retourne un integer pouvant être négatif ou positif.
// On garde cet util simple pour la phase 1 ; peut être remplacé par du ML plus tard.

const positives = ['bien', 'heureux', 'content'];
const negatives = ['mal', 'triste', 'hate', 'déçu'];

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
