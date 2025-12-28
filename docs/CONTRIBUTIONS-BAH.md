# CONTRIBUTIONS - Sulaiman Bah

## 1. Tâches réalisées

### Backend / Architecture & Infrastructure

- **Refactoring et application des principes SOLID**
  - Application du SRP (Single Responsibility Principle) à `moodController.js` avec extraction de 5 modules : `moodValidator.js`, `imageStorage.js`, `locationResolver.js`, `moodBusinessService.js`, `moodFactory.js`
  - Application du pattern Strategy pour le moteur de scoring avec création de `RatingRule.js`, `SentimentRule.js`, `WeatherRule.js` et `ScoreEngine.js`
  - Application du SRP à `imageStorage.js` avec création de `ImageParser.js`, `ImageStorage.js`, `NamingStrategy.js`
  - Application du pattern Repository à `jsonStore.js` avec création de `fileSystemAdapter.js` et `jsonValidator.js`
  - Application du OCP/SRP à `textAnalyzer.js` pour améliorer la modularité
  - Extraction de la logique de routing dans des contrôleurs dédiés : `searchController.js`, `selfieController.js`
  - Élimination de la violation du DIP dans `moodController` (getAllMoods)

- **Injection de dépendances et testabilité**
  - Implémentation de factory functions pour injection de dépendances dans `MoodService` et `LocationResolver`
  - Suppression des contrôleurs obsolètes après migration vers composition root

- **Migration vers architecture hexagonale**
  - Restructuration complète du projet en architecture hexagonale avec séparation Domain/Application/Infrastructure
  - Création des couches `src/backend/domain/`, `src/backend/application/`, `src/backend/infrastructure/`
  - Implémentation du pattern Repository pour la persistance des données
  - Mise en place d'une composition root pour l'injection de dépendances

### Frontend / Interface Utilisateur

- **Modularisation de l'architecture frontend**
  - Refactorisation de l'ancien code `script.js` pour créer les modules: `MapManager.js`, `CameraManager.js`, `FormManager.js`, `ModalManager.js`,`AutocompleteManager.js`, `MoodTrackerApp.js`
  - Reorganisation et déplacement de l'ancien dossier `public` en dossier `frontend` que j'ai déplacé dans src pour obtenir une meilleure clarté visuel

- **Amélioration de la qualité du code frontend**
  - Création de `constants.js` pour centraliser les constantes magiques
  - Ajout de validation XSS pour sécuriser les entrées utilisateur
  - Réduction du couplage au DOM pour améliorer la maintenabilité

- **Nouvelles fonctionnalités UI**
  - Implémentation de l'upload de photo en alternative à la capture selfie
  - Ajout de la fonctionnalité de téléchargement du rapport d'humeur (mood) en fichier texte

### Tests / Qualité de Code

- Mise en place de ESLint avec configuration Airbnb
- Intégration de Prettier pour formatage automatique du code
- Configuration de Jest avec Babel pour support des modules ES6
- Création et refactorisation de test unitaires pour l'ensemble du dossier `src\backend` dont domaine, application et infrastructure
- Création et refactorisation de test unitaires pour les fichiers `MoodTrackerApp`, `MapManager`, `CameraManager`, `FormManager`, `ModalManager`, `AutocompleteManager` dans le dossier `src\frontend`
- Suppression de tests redondants et inutiles
- Réorganisation complète du dossiers tests pour refléter la strucutre `src/backend/` et `src/frontend`

### Pipeline CI/CD

- Implémentation d'un pipeline CI/CD complet sous GitHub Actions orchestrant l'automatisation des tests (avec coverage) et la validation stricte du code (ESLint/Prettier) à chaque push.

### Gestion de Projet

- **Restructuration du projet en monorepo**
  - Migration vers architecture monorepo avec séparation claire `src/frontend/` et `src/backend/`

---

## 2. Commits notables

### Architecture & Refactoring Majeur

- refactor: migrate to Hexagonal Architecture
  → Restructuration complète du projet en architecture hexagonale
- chore: restructure project to monorepo architecture
  → Migration vers architecture monorepo avec séparation src/frontend/ et src/backend/
- refactor: implement dependency injection, refactor MoodService and LocationResolver
  → Implémentation de l'injection de dépendances avec factory functions

### Principes SOLID

- refactor: apply SRP to moodController (God Object → Service Layer)
  → Extraction de 5 modules : moodValidator, imageStorage, locationResolver, moodBusinessService, moodFactory
- refactor: apply modular scoring rules pattern (SRP)
  → Pattern Strategy pour le scoring : RatingRule, SentimentRule, WeatherRule, ScoreEngine
- refactor: apply Repository pattern to jsonStore
  → Création de fileSystemAdapter et jsonValidator
- refactor: apply SRP to imageStorage module
  → Séparation en ImageParser, ImageStorage, NamingStrategy
- refactor: eliminate DIP violation in moodController (getAllMoods)

### Modularisation Frontend

- refactor: refactor frontend to module architecture
  → Restructuration complète du frontend en modules ES6
- refactor: decompose app-bundle.js into modular architecture
  → Création des modules MapManager, CameraManager, FormManager, ModalManager, AutocompleteManager
- refactor: improve Clean Code with constants and error handling
  → Création de constants.js, remplacement des alert() par modals, validation XSS

### Tests & Couverture

- test: add frontend unit tests with Jest and Babel
  → Configuration Jest + Babel pour support ES6 modules
- feat: add test coverage
- test: reorganize backend tests to mirror src/backend structure
- test: reorganize frontend tests to mirror src/frontend structure
- test: remove useless and duplicate test
- test: improve test coverage for geocode and weather services

### CI/CD & Outillage

- feat: Add CI/CD pipeline with ESLint and Prettier
  → Configuration ESLint (Airbnb) + Prettier
- ci: add GitHub Actions pipeline for automated testing
- chore: apply Prettier and ESLint formatting across entire codebase

### Nouvelles Fonctionnalités

- feat: add photo upload option alongside selfie capture
- feat: add download mood report as text file

## 3. Rôle dans le projet

Au cours du projet, j’ai touché à plusieurs aspects, mais mon principal apport a porté sur la refactorisation. Pour être totalement transparent, lors de la phase 1 , ma contribution en termes de nouvelles fonctionnalités a été limitée.

Suite à une discussion collective où il nous a été expliqué que chacun devait produire à la fois le code volontairement peu propre et faire ensuite de la refactorisation. De base, nous avions initialement prévu que je me concentre uniquement sur la refactorisation tandis que mon binôme produirait le code « sale ».

Cependant, afin de respecter l’esprit du projet j’ai développé en urgence du code volontairement non optimisé, notamment une fonctionnalité d’upload de photo en alternative au selfie via la caméra, ainsi qu’une fonctionnalité d’export du rapport d’humeur au format texte.

Lors de la phase 2, j’ai eu un rôle central dans la conception et l’implémentation de l’architecture backend. J’ai conçu et mis en place une architecture hexagonale, accompagnée d’une refactorisation complète du backend selon les principes SOLID. Ce travail a inclus la mise en oeuvre de l’injection de dépendances ainsi qu’une création/refactorisation significative des tests unitaires sur l’ensemble du projet, contribuant aussi a améliorer le coverage globale du projet.

En parallèle, j’ai également refactorisé le code JavaScript du frontend, en découpant le fichier monolithique script.js en plusieurs modules afin d’améliorer la lisibilité, la maintenabilité et de respecter le principe de responsabilité unique (SRP).

J’ai aussi conçu et implémenté, refactorisé des tests unitaires côté frontend, puis mis en place l’outillage de qualité de code (ESLint, Prettier, Babel, Jest), ainsi que le pipeline CI/CD, garantissant une meilleure fiabilité, une qualité de code homogène et une automatisation des vérifications à chaque évolution du projet.

## 4. Auto-évaluation

Ma première tentative de refactoring sur la branche `develop2` s’est soldée par un échec. J’ai alors revu ma stratégie, plutôt que d’appliquer les principes SOLID de manière linéaire sur les premiers fichiers rencontrés, j’ai choisi de me concentrer en priorité sur le(s) God Object. Cette décision, bien que difficile car elle impliquait de « repartir de zéro », s’est révélée pertinente. Elle m’a permis de structurer progressivement une architecture hexagonale cohérente et exploitable. Ce projet était stimulant, car il m’a demandé d’analyser et de créer un code "sale", puis de le transformer en une base de code plus claire et maintenable, cela ma démontrée l'importance de faire du Clean Code dès le départ.

## 5. Évaluation des pairs

Membre évalué : ANDRIAMANOMEMAMY Todisoa Bien Aimée

- Note: 20/20
- Elle s’est fortement investie dès le début du projet en mettant en place le squelette de l’application et les premières fonctionnalités. Elle a intégré les API externes, développé les services initiaux et posé les bases des tests. Elle a également travaillé sur l’interface utilisateur et l’expérience UX. C’est une personne sérieuse, impliquée, qui communique bien et est toujours à l’écoute, dont le travail a constitué une base solide pour la suite du projet.
