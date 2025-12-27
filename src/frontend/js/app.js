import { MoodTrackerApp } from './modules/MoodTrackerApp.js';

try {
  const app = new MoodTrackerApp();
  console.log('MoodTrackerApp initialized', app);
} catch (error) {
  console.error('Failed to initialize MoodTrackerApp:', error);
  alert(
    `❌ Erreur d'initialisation de l'application.\n\nDétails: ${
      error.message
    }\n\nVeuillez rafraîchir la page.`
  );
}
