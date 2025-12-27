import { MoodTrackerApp } from './modules/MoodTrackerApp.js';
import { AppInitializer } from './modules/AppInitializer.js';

try {

  const managers = AppInitializer.init();
  const app = new MoodTrackerApp(managers);

  app.start();

  console.log('MoodTrackerApp initialized', app);
} catch (error) {
  console.error('Failed to initialize MoodTrackerApp:', error);
  alert(
    `❌ Erreur d'initialisation de l'application.\n\nDétails: ${
      error.message
    }\n\nVeuillez rafraîchir la page.`
  );
}
