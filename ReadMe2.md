# 🌍 GeoMoodMap

GeoMoodMap est une application web interactive conçue pour suivre et enregistrer vos humeurs en corrélation avec la météo et votre position géographique. Alliant une interface intuitive et des fonctionnalités modernes, elle permet de visualiser l'impact de l'environnement sur votre bien-être.

---

## 📖 Description du projet

L'application offre une expérience utilisateur fluide incluant :
* **Autocomplétion d'adresse** pour une saisie rapide.
* **Capture de selfie** (ou import photo) pour immortaliser l'instant.
* **Visualisation cartographique** des données enregistrées.
* **Export de données** pour un suivi personnel hors ligne.

Ce projet combine un développement **full-stack**, l'intégration d'**API externes** performantes et une approche **UI/UX responsive**.

---

## ⚙️ Installation et Exécution

Suivez ces étapes pour lancer le projet localement :

1.  **Cloner le dépôt :**
    ```bash
    git clone [https://github.com/andriamanomemamy05-a11y/GeoMoodMap-Project.git](https://github.com/andriamanomemamy05-a11y/GeoMoodMap-Project.git)
    cd GeoMoodMap-Project
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Démarrer l'application :**
    ```bash
    npm run start
    ```

4.  **Tester l'application :**
    Accédez à [http://localhost:3000](http://localhost:3000) dans votre navigateur pour tester l'enregistrement d'humeur, la carte et l'export.

---

## 🏛 Structure et Principes d'Architecture

Le projet suit une organisation rigoureuse pour assurer la maintenance et l'évolutivité.


### Arborescence
```text
GeoMoodMap/
├─ src/
│  ├─ controllers/    # Gestion des routes et logique API
│  ├─ services/       # Intégration des API et traitement des données
│  ├─ utils/          # Fonctions utilitaires et helpers
│  └─ tests/          # Tests unitaires pour les services
├─ public/            # Assets statiques (CSS, JS frontend, images)
├─ views/             # Templates HTML / Vues
├─ .env               # Variables d'environnement (Clés API)
└─ package.json       # Dépendances et scripts
```

## Principes d’architecture

* Séparation claire entre backend et frontend

* Services indépendants pour chaque API (OpenWeatherMap et OpenStreetMap)

* Tests unitaires avec mock pour garantir la fiabilité

* Responsive design et UI/UX optimisée

* Approche TDD (Test Driven Development) pour les services principaux


## Technologies et API Utilisées
* **OpenWeatherMap :** 	Récupération des données météo en temps réel.
* **OpenStreetMap:** 	Géocodage des adresses (Nominatim) et affichage de la carte.
* **Express.js :**	Framework backend Node.js pour la gestion du serveur.
* **Bootstrap 5 :** 	Framework CSS pour un design responsive et moderne.
* **Postman	:** Outil utilisé pour le debug et le test des routes API.


## Fonctionnalités Principales
* **✅ Score d'humeur :** Enregistrement sur une échelle de 1 à 5.

* **✅ Algorithme Mood-Weather :** Calcul automatique d'un score combinant météo et ressenti.

* **✅ Géolocalisation intelligente :** Autocomplétion d'adresses intégrée.

* **✅ Module Photo :** Capture de selfie via webcam ou importation de fichiers.

* **✅ Historique Visuel :** Visualisation des humeurs passées sur une carte interactive.

* **✅ Portabilité :** Export complet des données au format .txt.

