/**
 * dictionaries.js
 *
 * Responsabilité unique : Fournir les dictionnaires de mots pour l'analyse de sentiment
 */

/**
 * Mots positifs pour l'analyse de sentiment
 * @type {string[]}
 */
const positiveWords = [
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

/**
 * Mots négatifs pour l'analyse de sentiment
 * @type {string[]}
 */
const negativeWords = [
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

module.exports = {
  positiveWords,
  negativeWords,
};
