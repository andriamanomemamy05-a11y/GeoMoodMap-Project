/**
 * Tests de structure pour les modules frontend ES6
 *
 * Note: Ces tests vérifient la structure et l'existence des modules.
 * Les tests fonctionnels complets nécessiteraient JSDOM ou un environnement de navigateur.
 * Pour tester le comportement réel, utiliser des tests E2E (Cypress, Playwright, etc.)
 */

const fs = require('fs');
const path = require('path');

describe('Frontend ES6 Modules Structure', () => {
  const modulesPath = path.join(__dirname, '../public/js/modules');
  const constantsPath = path.join(__dirname, '../public/js/constants.js');
  const appPath = path.join(__dirname, '../public/js/app.js');

  describe('Files exist', () => {
    test('constants.js devrait exister', () => {
      expect(fs.existsSync(constantsPath)).toBe(true);
    });

    test('app.js devrait exister', () => {
      expect(fs.existsSync(appPath)).toBe(true);
    });

    test('Le dossier modules/ devrait exister', () => {
      expect(fs.existsSync(modulesPath)).toBe(true);
      expect(fs.statSync(modulesPath).isDirectory()).toBe(true);
    });

    test('MapManager.js devrait exister', () => {
      expect(fs.existsSync(path.join(modulesPath, 'MapManager.js'))).toBe(true);
    });

    test('AutocompleteManager.js devrait exister', () => {
      expect(fs.existsSync(path.join(modulesPath, 'AutocompleteManager.js'))).toBe(true);
    });

    test('CameraManager.js devrait exister', () => {
      expect(fs.existsSync(path.join(modulesPath, 'CameraManager.js'))).toBe(true);
    });

    test('ModalManager.js devrait exister', () => {
      expect(fs.existsSync(path.join(modulesPath, 'ModalManager.js'))).toBe(true);
    });

    test('FormManager.js devrait exister', () => {
      expect(fs.existsSync(path.join(modulesPath, 'FormManager.js'))).toBe(true);
    });

    test('MoodTrackerApp.js devrait exister', () => {
      expect(fs.existsSync(path.join(modulesPath, 'MoodTrackerApp.js'))).toBe(true);
    });
  });

  describe('Module structure', () => {
    test('constants.js devrait exporter CONFIG et SELECTORS', () => {
      const content = fs.readFileSync(constantsPath, 'utf8');

      expect(content).toContain('export const CONFIG');
      expect(content).toContain('export const SELECTORS');
    });

    test('MapManager devrait être une classe exportée', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'MapManager.js'), 'utf8');

      expect(content).toContain('export class MapManager');
      expect(content).toContain('constructor()');
      expect(content).toContain('getCoords()');
      expect(content).toContain('setPosition(');
    });

    test('AutocompleteManager devrait être une classe exportée avec mapManager en dépendance', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'AutocompleteManager.js'), 'utf8');

      expect(content).toContain('export class AutocompleteManager');
      expect(content).toContain('constructor(mapManager)');
      expect(content).toContain('getValue()');
    });

    test('CameraManager devrait être une classe exportée', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'CameraManager.js'), 'utf8');

      expect(content).toContain('export class CameraManager');
      expect(content).toContain('constructor()');
      expect(content).toContain('getImageUrl()');
      expect(content).toContain('reset()');
      expect(content).toContain('capturePhoto()');
      expect(content).toContain('handleFileUpload(');
    });

    test('ModalManager devrait être une classe exportée', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'ModalManager.js'), 'utf8');

      expect(content).toContain('export class ModalManager');
      expect(content).toContain('constructor()');
      expect(content).toContain('show(');
      expect(content).toContain('exportToFile()');
    });

    test('FormManager devrait être une classe exportée avec toutes les dépendances', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'FormManager.js'), 'utf8');

      expect(content).toContain('export class FormManager');
      expect(content).toContain(
        'constructor(mapManager, autocompleteManager, cameraManager, modalManager)'
      );
      expect(content).toContain('handleSubmit(');
    });

    test('MoodTrackerApp devrait être une classe exportée qui orchestre tous les managers', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'MoodTrackerApp.js'), 'utf8');

      expect(content).toContain('export class MoodTrackerApp');
      expect(content).toContain('import { MapManager }');
      expect(content).toContain('import { AutocompleteManager }');
      expect(content).toContain('import { CameraManager }');
      expect(content).toContain('import { ModalManager }');
      expect(content).toContain('import { FormManager }');
    });

    test('app.js devrait importer et instancier MoodTrackerApp avec gestion erreurs', () => {
      const content = fs.readFileSync(appPath, 'utf8');

      expect(content).toContain('import { MoodTrackerApp }');
      expect(content).toContain('new MoodTrackerApp()');
      expect(content).toContain('try');
      expect(content).toContain('catch');
    });
  });

  describe('Critical bug fixes', () => {
    test('CameraManager.reset() devrait restaurer les conteneurs UI', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'CameraManager.js'), 'utf8');

      const resetMethod = content.match(/reset\(\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/s);
      expect(resetMethod).not.toBeNull();

      const methodBody = resetMethod[1];
      expect(methodBody).toContain('photoContainer.classList.add');
      expect(methodBody).toContain('cameraContainer.classList.remove');
      // Le conteneur upload peut être add ou remove selon le mode actif
      expect(methodBody).toContain('uploadContainer.classList');
    });

    test('CameraManager devrait avoir des checks pour MediaDevices API', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'CameraManager.js'), 'utf8');

      expect(content).toContain('navigator.mediaDevices');
      expect(content).toContain('getUserMedia');
      expect(content).toContain('switchToUpload');
    });

    test('MapManager devrait checker si Leaflet est chargé', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'MapManager.js'), 'utf8');

      expect(content).toContain('typeof L ===');
      expect(content).toContain('Leaflet is not loaded');
    });

    test('ModalManager devrait checker si Bootstrap est chargé', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'ModalManager.js'), 'utf8');

      expect(content).toContain('typeof bootstrap ===');
      expect(content).toContain('Bootstrap is not loaded');
    });

    test('FormManager devrait avoir une gestion erreur complète', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'FormManager.js'), 'utf8');

      expect(content).toContain('try');
      expect(content).toContain('catch');
      expect(content).toContain('console.log');
      expect(content).toContain('console.error');
      expect(content).toContain('alert');
    });
  });

  describe('Dependency injection pattern', () => {
    test('AutocompleteManager devrait recevoir mapManager', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'AutocompleteManager.js'), 'utf8');

      expect(content).toContain('constructor(mapManager)');
      expect(content).toContain('this.mapManager = mapManager');
    });

    test('FormManager devrait recevoir les 4 managers', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'FormManager.js'), 'utf8');

      expect(content).toContain('this.mapManager = mapManager');
      expect(content).toContain('this.autocompleteManager = autocompleteManager');
      expect(content).toContain('this.cameraManager = cameraManager');
      expect(content).toContain('this.modalManager = modalManager');
    });

    test('MoodTrackerApp devrait injecter les dépendances dans FormManager', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'MoodTrackerApp.js'), 'utf8');

      const formManagerInstantiation = content.match(/new FormManager\(([\s\S]*?)\)/);
      expect(formManagerInstantiation).not.toBeNull();

      const args = formManagerInstantiation[1];
      expect(args).toContain('this.mapManager');
      expect(args).toContain('this.autocompleteManager');
      expect(args).toContain('this.cameraManager');
      expect(args).toContain('this.modalManager');
    });
  });

  describe('API Integration', () => {
    test('FormManager devrait utiliser les bonnes routes API', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'FormManager.js'), 'utf8');

      expect(content).toContain('CONFIG.API.MOODS');
      expect(content).toContain("method: 'POST'");
      expect(content).toContain("'Content-Type': 'application/json'");
    });

    test('AutocompleteManager devrait utiliser API de recherche', () => {
      const content = fs.readFileSync(path.join(modulesPath, 'AutocompleteManager.js'), 'utf8');

      expect(content).toContain('CONFIG.API.SEARCH');
      expect(content).toContain('fetch');
    });

    test('constants.js devrait définir les routes API', () => {
      const content = fs.readFileSync(constantsPath, 'utf8');

      expect(content).toContain("SEARCH: '/api/search'");
      expect(content).toContain("MOODS: '/api/moods'");
    });
  });
});
