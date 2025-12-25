// Petit analyseur lexicale : retourne un integer pouvant être négatif ou positif.

// Initialiasation des exemples des mots dans le texte selon humeur
const positives = [
  'bien',
  'heureux',
  'content',
  'joyeux',
  'serein',
  'love',
  'happy',
  'ravi',
  'cool',
];
const negatives = [
  'mal',
  'triste',
  'hate',
  'déçu',
  'colère',
  'anxieux',
  'stress',
  'mauvais',
  'deteste',
];

function analyzeText(text) {
  if (!text || typeof text !== 'string') return 0;
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  let score = 0;

  // On ajoute au fur et à mesure si les textes contiennent des mots positives ou négatives
  words.forEach(w => {
    if (positives.includes(w)) score += 1;
    if (negatives.includes(w)) score -= 1;
  });

  // Limitez le scrore à une plage raisonnable pour éviter une influence excessive
  if (score > 5) score = 5;
  if (score < -5) score = -5;

  // Rétourner le score selon huemreu dans le texte
  return score;
}

module.exports = { analyzeText };
