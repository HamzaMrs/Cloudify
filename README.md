# CLOUD² - Le SaaS de Location de Nuages# CLOUD² - Le SaaS de Location de Nuages# CLOUD² - Le SaaS de Location de Nuages# CLOUD² - Le SaaS de Location de Nuages<div align="center">



> **Projet : Architecture Micro-services Conteneurisée**

> "Une complexité inutile pour un problème absurde."

> **Projet : Architecture Micro-services Conteneurisée**

Cloudify est une plateforme SaaS permettant de louer des nuages atmosphériques en temps réel.

> "Une complexité inutile pour un problème absurde."

---

> **Projet : Architecture Micro-services Conteneurisée**<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

## 🚀 Architecture (4-Tiers)

Cloudify est une plateforme SaaS (Silly-as-a-Service) permettant de louer, acheter et analyser des nuages en temps réel. L'application repose sur une architecture robuste de 4 tiers, entièrement conteneurisée.

```

┌─────────────────────────────────────────────────────────────────┐> "Une complexité inutile pour un problème absurde."

│                     TIER 1 : Frontend                           │

│                 React + Vite + TailwindCSS                      │---

│                       (Nginx :80)                               │

└─────────────────────────┬───────────────────────────────────────┘> **Projet : Architecture Micro-services Conteneurisée**</div>

                          │

                          ▼## 🚀 Architecture Technique (4-Tiers)

┌─────────────────────────────────────────────────────────────────┐

│                   TIER 2 : API Gateway                          │Cloudify est une plateforme SaaS (Silly-as-a-Service) permettant de louer, acheter et analyser des nuages en temps réel. L'application repose sur une architecture robuste de 4 tiers, entièrement conteneurisée.

│             Express + JWT + Bcrypt Authentication               │

│                        (:3000)                                  │```

└─────────────────────────┬───────────────────────────────────────┘

                          │┌─────────────────────────────────────────────────────────────────┐> "Une complexité inutile pour un problème absurde."

                          ▼

┌─────────────────────────────────────────────────────────────────┐│                        TIER 1 : Frontend                        │

│                   TIER 3 : Business API                         │

│            Express + Cloud Logic + Geolocation                  ││                    React + Vite + TailwindCSS                   │---

│                    (Interne :5000)                              │

└─────────────────────────┬───────────────────────────────────────┘│                         (Nginx :80)                             │

                          │

                          ▼└─────────────────────────┬───────────────────────────────────────┘# CLOUD² - Plateforme de Location de Nuages

┌─────────────────────────────────────────────────────────────────┐

│                   TIER 4 : Database                             │                          │

│                   MySQL 8.0 + Volumes                           │

│                    (Interne :3306)                              │                          ▼## 🚀 Architecture Technique (4-Tiers)

└─────────────────────────────────────────────────────────────────┘

```┌─────────────────────────────────────────────────────────────────┐



---│                    TIER 2 : API Gateway                         │Cloudify est une plateforme SaaS (Silly-as-a-Service) permettant de louer, acheter et analyser des nuages en temps réel. L'application repose sur une architecture robuste de 4 tiers, entièrement conteneurisée.



## 🛠 Installation│                  Express + JWT Authentication                   │



```bash│                         (:3000)                                 │L'application respecte une séparation stricte des responsabilités :

# Lancer toute la stack

docker-compose up --build└─────────────────────────┬───────────────────────────────────────┘



# Arrêter                          │Application web SaaS innovante pour la gestion et la location de nuages atmosphériques.

docker-compose down

```                          ▼



**URL** : http://localhost┌─────────────────────────────────────────────────────────────────┐### 1. TIER 1 : Frontend (UI/UX)



---│                    TIER 3 : Business API                        │



## 📂 Structure│              Express + Cloud Logic + Geolocation                │- **Techno** : React 19 + Vite + TailwindCSS---



```│                      (Interne :5000)                            │

.

├── docker-compose.yml└─────────────────────────┬───────────────────────────────────────┘- **Serveur** : Nginx (Alpine Linux)

├── frontend/                   # TIER 1 - React

├── backend/                          │

│   ├── api-gateway/            # TIER 2 - Express + JWT

│   ├── business-api/           # TIER 3 - Cloud Logic                          ▼- **Port** : `80`## 🚀 Quick Start (100% Docker)

│   └── database/               # TIER 4 - MySQL Init

└── README.md┌─────────────────────────────────────────────────────────────────┐

```

│                    TIER 4 : Database                            │- **Rôle** : Interface utilisateur pour la visualisation des nuages et la gestion de compte.

---

│                    MySQL 8.0 + Volumes                          │

## 📡 API Documentation

│                      (Interne :3306)                            │## 🚀 Architecture Technique (4-Tiers)

### Base URL : `http://localhost:3000`

└─────────────────────────────────────────────────────────────────┘

---

```### 2. TIER 2 : API Gateway (Sécurité & Orchestration)

### 🔐 Authentification



| Méthode | Endpoint | Auth | Description |

|---------|----------|------|-------------|---- **Techno** : Node.js (Express)```bash

| `POST` | `/auth/register` | ❌ | Créer un compte |

| `POST` | `/auth/login` | ❌ | Se connecter |

| `POST` | `/auth/logout` | ✅ | Se déconnecter |

| `GET` | `/auth/me` | ✅ | Mon profil |## 🛠 Installation & Lancement- **Port** : `3000`

| `GET` | `/auth/my-clouds` | ✅ | Mes nuages loués |



#### Créer un compte

```bash```bash- **Rôle** : Point d'entrée unique. Gère l'authentification (JWT/Sessions) et redirige les requêtes vers les services métier.L'application respecte une séparation stricte des responsabilités :# Lancer TOUT (6 conteneurs Docker)

curl -X POST http://localhost:3000/auth/register \

  -H "Content-Type: application/json" \# Lancer toute la stack

  -d '{"username": "hamza", "password": "test123"}'

```docker-compose up --build



**Réponse :**

```json

{# Arrêter### 3. TIER 3 : Business API (Logique Métier)./start-all.sh

  "status": "success",

  "message": "Compte créé avec succès",docker-compose down

  "user": { "id": 1, "username": "hamza", "clouds_owned": 0 },

  "token": "eyJhbGciOiJIUzI1NiIs..."```- **Techno** : Node.js (Express)

}

```



#### Se connecter**URL** : http://localhost- **Port** : `5000` (Interne)### 1. TIER 1 : Frontend (UI/UX)

```bash

curl -X POST http://localhost:3000/auth/login \

  -H "Content-Type: application/json" \

  -d '{"username": "hamza", "password": "test123"}'---- **Rôle** : Calculateur de densité nuageuse, récupération des données météo en temps réel (Open-Meteo), génération d'objets "Nuage".

```



#### Se déconnecter

```bash## 📂 Structure du Projet- **Techno** : React 19 + Vite + TailwindCSS# Ou manuellement

curl -X POST http://localhost:3000/auth/logout \

  -H "Authorization: Bearer <token>"

```

```### 4. TIER 4 : Persistance (Database)

#### Mes nuages loués

```bash.

curl http://localhost:3000/auth/my-clouds \

  -H "Authorization: Bearer <token>"├── docker-compose.yml- **Techno** : MySQL 8.0- **Serveur** : Nginx (Alpine Linux)docker-compose up --build

```

├── frontend/                   # TIER 1 - React

**Réponse :**

```json├── backend/- **Volume** : Persistant (`db_data`)

{

  "status": "success",│   ├── api-gateway/            # TIER 2 - Express + JWT

  "count": 1,

  "clouds": [│   ├── business-api/           # TIER 3 - Cloud Logic- **Rôle** : Stockage des utilisateurs et des transactions.- **Port** : `80````

    {

      "id": "cloud_0001",│   └── database/               # TIER 4 - MySQL Init

      "name": "Cumulonimbus Alpha",

      "type": "storm",└── README.md

      "rental": {

        "rental_id": 1,```

        "start_time": "2026-01-20T10:22:34.000Z",

        "end_time": "2026-01-20T15:22:34.000Z",---- **Rôle** : Interface utilisateur pour la visualisation des nuages et la gestion de compte.

        "total_price": 299.95

      }---

    }

  ]

}

```## 📡 Documentation API



---## 🛠 Installation & Lancement**✅ Aucune commande npm/python/go locale nécessaire !**



### ☁️ Cloud Discovery API### Base URL



| Méthode | Endpoint | Auth | Description |```

|---------|----------|------|-------------|

| `GET` | `/api/clouds/nearby` | ❌ | Nuages à proximité |http://localhost:3000

| `GET` | `/api/clouds` | ❌ | Liste tous les nuages |

| `GET` | `/api/clouds/:id` | ❌ | Détail d'un nuage |```Tout le projet est piloté par Docker.### 2. TIER 2 : API Gateway (Sécurité & Orchestration)

| `POST` | `/api/clouds/:id/rent` | ✅ | Louer un nuage |

| `POST` | `/api/clouds/:id/release` | ✅ | Libérer un nuage |



#### Recherche géolocalisée---

```bash

curl "http://localhost:3000/api/clouds/nearby?lat=48.8566&lng=2.3522&radius=100"

```

### 🔐 Authentification### Démarrage- **Techno** : Node.js (Express)**URLs** :

| Paramètre | Type | Requis | Description |

|-----------|------|--------|-------------|

| `lat` | number | ✅ | Latitude |

| `lng` | number | ✅ | Longitude || Méthode | Endpoint | Description |

| `radius` | number | ❌ | Rayon en km (défaut: 50) |

| `minSize` | number | ❌ | Taille min km² ||---------|----------|-------------|

| `minDensity` | number | ❌ | Densité min % |

| `POST` | `/register` | Créer un compte |```bash- **Port** : `3000`- 🌐 Cloudify Frontend : http://localhost:8080

#### Louer un nuage

```bash| `POST` | `/login` | Se connecter (retourne un JWT) |

curl -X POST http://localhost:3000/api/clouds/cloud_0001/rent \

  -H "Authorization: Bearer <token>" \# 1. Construire et lancer la stack complète

  -H "Content-Type: application/json" \

  -d '{"duration_hours": 5}'**Exemple :**

```

```bashdocker-compose up --build- **Rôle** : Point d'entrée unique. Gère l'authentification (JWT/Sessions) et redirige les requêtes vers les services métier.- 🎭 Silly Frontend : http://localhost

**Réponse :**

```jsoncurl -X POST http://localhost:3000/login \

{

  "status": "success",  -H "Content-Type: application/json" \```

  "message": "Nuage loué avec succès",

  "rental": {  -d '{"username": "demo", "password": "demo123"}'

    "rental_id": 1,

    "cloud_id": "cloud_0001",```- 🔌 Silly API : http://localhost:3000

    "cloud_name": "Cumulonimbus Alpha",

    "total_price": 299.95,

    "start_time": "2026-01-20T10:22:34Z",

    "end_time": "2026-01-20T15:22:34Z"**Réponse :**L'application sera accessible sur : **http://localhost**

  }

}```json

```

{### 3. TIER 3 : Business API (Logique Métier)

> ⚠️ **Important** : Un nuage loué n'est plus disponible pour les autres utilisateurs !

  "message": "Connexion réussie",

---

  "user": { "id": 1, "username": "demo" },Pour arrêter l'application :

## ✅ Fonctionnalités

  "token": "eyJhbGciOiJIUzI1NiIs..."

- 🔐 **Authentification complète** : Register, Login, Logout avec JWT + Bcrypt

- 👤 **Gestion de profil** : Voir ses infos et ses nuages loués}```bash- **Techno** : Node.js (Express)📚 **Guide complet** : Voir [`DOCKER_COMPLET.md`](DOCKER_COMPLET.md)

- 🌍 **Cloud Discovery** : Recherche géolocalisée (formule Haversine)

- 💰 **Location exclusive** : Un nuage loué disparaît de la liste des disponibles```

- 🗺️ **26 nuages** répartis dans le monde

- 💾 **Persistance MySQL** avec Docker Volumesdocker-compose down


---

```- **Port** : `5000` (Interne)

### ☁️ Cloud Discovery API



#### `GET /api/clouds/nearby` — Nuages à proximité

---- **Rôle** : Calculateur de densité nuageuse, récupération des données météo en temps réel (Open-Meteo), génération d'objets "Nuage".---

| Paramètre | Type | Requis | Description |

|-----------|------|--------|-------------|

| `lat` | number | ✅ | Latitude |

| `lng` | number | ✅ | Longitude |## 📂 Structure du Projet

| `radius` | number | ❌ | Rayon en km (défaut: 50) |

| `minSize` | number | ❌ | Taille min km² (défaut: 80) |

| `minDensity` | number | ❌ | Densité min % (défaut: 70) |

| `limit` | number | ❌ | Max résultats (défaut: 10) |```### 4. TIER 4 : Persistance (Database)## � Architecture (6 Conteneurs)



**Exemple :**.

```bash

curl "http://localhost:3000/api/clouds/nearby?lat=48.8566&lng=2.3522&radius=100"├── docker-compose.yml          # Orchestration de toute la stack- **Techno** : MySQL 8.0

```

├── frontend/                   # Frontend (React + Vite)

**Réponse :**

```json│   ├── src/                    # Code source React- **Volume** : Persistant (`db_data`)```

{

  "status": "success",│   └── Dockerfile              # Config Build Frontend

  "meta": {

    "center": { "lat": 48.8566, "lng": 2.3522 },├── backend/                    # Services Backend- **Rôle** : Stockage des utilisateurs et des transactions.CLOUDIFY PRINCIPAL

    "radius_km": 100,

    "count": 3│   ├── api-gateway/            # Tier 2 : Gateway & Auth (Express)

  },

  "clouds": [│   ├── business-api/           # Tier 3 : Logique Métier (Express)├── cloudify-frontend (React + Nginx)     → Port 8080

    {

      "id": "cloud_0001",│   └── database/               # Tier 4 : Config & Init SQL

      "name": "Cumulonimbus Alpha",

      "type": "storm",└── README.md---

      "size_km2": 220,

      "density": 95,```

      "altitude_m": 3200,

      "location": { "lat": 48.8566, "lng": 2.3522 },SILLY-AS-A-SERVICE (4-Tier)

      "distance_km": 0,

      "price_per_hour": 59.99,## 🛠 Installation & Lancement├── TIER 1: silly-frontend (React + Nginx)     → Port 80

      "availability": "available"

    }├── TIER 2: silly-api-gateway (Express.js)     → Port 3000

  ]

}Tout le projet est piloté par Docker. Aucune installation locale de Node ou autre n'est requise.├── TIER 3: silly-user-service (Go + Auth)     → Interne

```

├── TIER 3: silly-generator (Python + Flask)   → Interne

---

### Pré-requis└── TIER 4: silly-database (MySQL + Volume)    → Interne

#### `GET /api/clouds` — Liste tous les nuages

- Docker Desktop installé et lancé.```

#### `GET /api/clouds/:id` — Détail d'un nuage



---

### Démarrage---

#### `POST /api/clouds/:id/rent` — Louer un nuage 🔒



**Auth requise** : `Authorization: Bearer <token>`

```bash## � Conformité aux Consignes

```bash

curl -X POST http://localhost:3000/api/clouds/cloud_0001/rent \# 1. Construire et lancer la stack complète

  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \

  -H "Content-Type: application/json" \docker-compose up --build✅ **Lancé uniquement via docker-compose**  

  -d '{"duration_hours": 2}'

``````✅ **Aucune commande locale (npm/python/go)**  



**Réponse :**✅ **4+ Tiers distincts** (on en a 5 !)  

```json

{L'application sera accessible sur : **http://localhost**✅ **Frontend servi via Nginx**  

  "status": "success",

  "message": "Nuage loué avec succès",✅ **API Gateway avec Express.js**  

  "rental": {

    "rental_id": 1,Pour arrêter l'application :✅ **Services métier** (Go + Python)  

    "cloud_id": "cloud_0001",

    "cloud_name": "Cumulonimbus Alpha",```bash✅ **Base de données MySQL**  

    "total_price": 119.98,

    "start_time": "2026-01-20T10:00:00Z",docker-compose down✅ **Réseau Docker interne**  

    "end_time": "2026-01-20T12:00:00Z"

  }```✅ **Volume persistant**

}

```



---------



#### `POST /api/clouds/:id/release` — Libérer un nuage 🔒



---## 📂 Structure du Projet## 🛑 Arrêter les Services



## ✅ Fonctionnalités



- 🔐 **Authentification JWT** : Inscription et Connexion sécurisées``````bash

- 🌍 **Cloud Discovery** : Recherche géolocalisée (Haversine)

- 💰 **Location de nuages** : Système de réservation avec tarification.# Automatique

- 🗺️ **26 nuages pré-générés** : Europe, Amérique, Asie, Afrique, Océanie

- 💾 **Persistance SQL** : Données sauvegardées avec Docker Volumes├── docker-compose.yml          # Orchestration de toute la stack./stop-all.sh


├── silly-as-a-service/

│   ├── api-gateway/            # Tier 2 : Code source Gateway# Ou manuel

│   ├── business-api/           # Tier 3 : Code source Business Logicdocker-compose down

│   └── database-service/       # Tier 4 : Scripts d'initialisation SQL```

├── App.tsx                     # Tier 1 : Code source Frontend

├── components/                 # Composants React---

└── ...                         # Configs Frontend (vite, tailwind, etc.)

```## 📦 Dépendances Installées



---### Dependencies

- ✅ **react** (v19.2.3) - Framework UI

## ✅ Fonctionnalités- ✅ **react-dom** (v19.2.3) - Rendu React

- ✅ **leaflet** (v1.9.4) - Bibliothèque de cartographie

- **Authentification** : Inscription et Connexion sécurisées (SQL).- ✅ **react-leaflet** (v5.0.0) - Intégration React pour Leaflet

- **Cloud Map** : Visualisation mondiale des nuages disponibles.- ✅ **lucide-react** (v0.562.0) - Icônes

- **WaaS (Weather-as-a-Service)** : Données réelles basées sur la météo de 50+ villes.- ✅ **gsap** (v3.12.5) - Animations

- **Responsive** : Interface moderne adaptée à tous les écrans.

### Dev Dependencies

---- ✅ **typescript** (~5.8.2) - Langage TypeScript

*Projet réalisé dans le cadre du module "De la virtualisation à la conteneurisation".*- ✅ **vite** (v6.2.0) - Build tool

- ✅ **@vitejs/plugin-react** (v5.0.0) - Plugin React pour Vite
- ✅ **@types/react** (v19.2.8) - Types TypeScript pour React
- ✅ **@types/react-dom** (v19.2.3) - Types TypeScript pour React DOM
- ✅ **@types/leaflet** (v1.9.21) - Types TypeScript pour Leaflet
- ✅ **@types/node** (v22.14.0) - Types TypeScript pour Node.js

## 🧹 Nettoyage Effectué

### Dépendances Supprimées
- ❌ **recharts** - Non utilisé dans le projet

### Fichiers Supprimés
- ❌ **metadata.json** - Non utilisé

### Imports Nettoyés
- 🔧 **CloudMap.tsx** - Suppression des imports inutilisés (`useEffect`, `useRef`, `useMap`)

## 🎨 Fonctionnalités

- 🌥️ **Carte Interactive** - Visualisation des nuages sur une carte mondiale
- 📊 **Dashboard** - Vue d'ensemble de vos locations
- 🛒 **Marketplace** - Catalogue de nuages disponibles
- 📜 **Historique** - Suivi des évaporations
- 💰 **Gestion des Crédits** - Système de facturation
- 🏥 **Health Monitor** - Surveillance Docker

## 🛠️ Technologies

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS (via CDN)
- **Animations:** GSAP
- **Cartographie:** Leaflet + React-Leaflet
- **Build:** Vite 6
- **Icons:** Lucide React

## ✅ Status

- ✅ Toutes les dépendances installées
- ✅ Types TypeScript configurés
- ✅ Aucune erreur de compilation
- ✅ Serveur de développement opérationnel
- ✅ Code nettoyé et optimisé

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready
