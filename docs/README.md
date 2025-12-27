# GeoMood Map

GeoMoodMap est une application web interactive conçue pour suivre et enregistrer vos humeurs en corrélation avec la météo et votre position géographique. Alliant une interface intuitive et des fonctionnalités modernes, elle permet de visualiser l'impact de l'environnement sur votre bien-être.

## Description du projet

L'application offre une expérience utilisateur fluide incluant :

- **Autocomplétion d'adresse** pour une saisie rapide.
- **Capture de selfie** (ou import photo)
- **Visualisation cartographique** des données enregistrées.
- **Export de données** pour un suivi personnel hors ligne.

## Installation / Exécution

### Prérequis

- Node.js >= 18.x
- npm >= 9.x

### 1. Cloner le repository

```bash
git clone https://github.com/andriamanomemamy05-a11y/GeoMoodMap-Project
cd GeoMoodMap-Project
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer l'application

```bash
npm start
```

L'application sera accessible sur `http://localhost:3030`

### Exécuter les tests

```bash
npm test
```

### Obtenir le coverage

```bash
npm run test:coverage
```

### Qualité du Code

```bash
npm run lint            # Vérifie le code avec ESLint
npm run lint:fix        # Corrige automatiquement les erreurs
npm run format          # Formate le code avec Prettier
npm run format:check    # Vérifie le formatage
```

---

## Structure et principes d'architecture

Ce projet suit une architecture **Monorepository** avec séparation claire entre le code **Frontend** et **Backend**.

```
GeoMoodMap-Project/
├── .github/workflows         # Contient la CI Github Actions
├── docs/                     # Contient la doc du Projet
├── src/
│   ├── backend/
│   │   ├── application/      # Services métier
│   │   ├── domain/           # Logique métier pure
│   │   └── infrastructure/   # Adapters (DB, API, Web)
│   │       └── web/
│   │           └── server.js # Point d'entrée du serveur
│   │
│   └── frontend/             # Code client (navigateur)
│       ├── index.html        # Page HTML principale
│       ├── js/               # Modules JavaScript ES6
│       │   ├── app.js        # Point d'entrée frontend
│       │   ├── constants.js  # Configuration globale
│       │   └── modules/      # Managers (Map, Camera, etc.)
│       ├── styles/           # CSS
│       └── selfies/          # Images uploadées
│
├── tests/
│   ├── backend/              # Tests unitaires backend
│   └── frontend/             # Tests unitaires frontend
│
├── data/
│   └── moods.json            # Données persistées
│
├── .eslintignore             # Configuration ESlint
├── .eslintrc.json            # Configuration ESlint
├── .prettierignore           # Configuration Prettier
├── .prettierrc               # Configuration Prettier
├── package.json              # Scripts et dépendances
├── jest.config.js            # Configuration des tests
└── babel.config.js           # Transformation ES6

```

### Architecture Hexagonale (Backend)

Le backend suit le pattern **Architecture Hexagonale** avec injection de dépendances:

- **Domain**: Logique métier pure (scoring, analyse de texte)
- **Application**: Services métier (MoodService, LocationResolver)
- **Infrastructure**: Adapters externes (API météo, géocodage, stockage)

Le fichier [src/backend/infrastructure/web/server.js](src/backend/infrastructure/web/server.js) est le **Composition Root** où toutes les dépendances sont assemblées.

### Architecture Frontend

Le frontend utilise des **ES6 Modules** avec le pattern **Manager**:

- `MapManager`: Gestion de la carte Leaflet
- `CameraManager`: Capture de photos et upload
- `FormManager`: Soumission des formulaires
- `ModalManager`: Affichage des modales Bootstrap
- `AutocompleteManager`: Autocomplétion d'adresses
- `MoodTrackerApp`: Orchestrateur principal
- `AppInitializer`: Initialisation des managers

## Sources API utilisées

- **OpenWeatherMap** : Récupération des données météo en temps réel.
- **OpenStreetMap**: Géocodage des adresses (Nominatim) et affichage de la carte.

## Technologies utilisées

### Backend

- **Express.js** : Framework backend Node.js pour la gestion du serveur.

### Frontend

- **JavaScript** : Logique interactive
- **Leaflet.js** : Cartographie interactive
- **Bootstrap** : Interface utilisateur
- **MediaDevices API** : Capture photo (webcam)

### Qualité de code

- **ESLint** (Airbnb config) : Linting
- **Prettier** : Formatage automatique
- **Jest** : Tests et couverture
