/**
 * Point d'entrée de l'application
 * Initialise l'application MoodTracker au chargement du DOM
 */
import { MoodTrackerApp } from './modules/MoodTrackerApp.js';

document.addEventListener("DOMContentLoaded", () => {
  const app = new MoodTrackerApp();
  app.init();
});
