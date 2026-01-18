# CLOUD² - Le SaaS de Location de Nuages# CLOUD² - Le SaaS de Location de Nuages<div align="center">



> **Projet : Architecture Micro-services Conteneurisée**<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

> "Une complexité inutile pour un problème absurde."

> **Projet : Architecture Micro-services Conteneurisée**</div>

Cloudify est une plateforme SaaS (Silly-as-a-Service) permettant de louer, acheter et analyser des nuages en temps réel. L'application repose sur une architecture robuste de 4 tiers, entièrement conteneurisée.

> "Une complexité inutile pour un problème absurde."

---

# CLOUD² - Plateforme de Location de Nuages

## 🚀 Architecture Technique (4-Tiers)

Cloudify est une plateforme SaaS (Silly-as-a-Service) permettant de louer, acheter et analyser des nuages en temps réel. L'application repose sur une architecture robuste de 4 tiers, entièrement conteneurisée.

L'application respecte une séparation stricte des responsabilités :

Application web SaaS innovante pour la gestion et la location de nuages atmosphériques.

### 1. TIER 1 : Frontend (UI/UX)

- **Techno** : React 19 + Vite + TailwindCSS---

- **Serveur** : Nginx (Alpine Linux)

- **Port** : `80`## 🚀 Quick Start (100% Docker)

- **Rôle** : Interface utilisateur pour la visualisation des nuages et la gestion de compte.

## 🚀 Architecture Technique (4-Tiers)

### 2. TIER 2 : API Gateway (Sécurité & Orchestration)

- **Techno** : Node.js (Express)```bash

- **Port** : `3000`

- **Rôle** : Point d'entrée unique. Gère l'authentification (JWT/Sessions) et redirige les requêtes vers les services métier.L'application respecte une séparation stricte des responsabilités :# Lancer TOUT (6 conteneurs Docker)



### 3. TIER 3 : Business API (Logique Métier)./start-all.sh

- **Techno** : Node.js (Express)

- **Port** : `5000` (Interne)### 1. TIER 1 : Frontend (UI/UX)

- **Rôle** : Calculateur de densité nuageuse, récupération des données météo en temps réel (Open-Meteo), génération d'objets "Nuage".

- **Techno** : React 19 + Vite + TailwindCSS# Ou manuellement

### 4. TIER 4 : Persistance (Database)

- **Techno** : MySQL 8.0- **Serveur** : Nginx (Alpine Linux)docker-compose up --build

- **Volume** : Persistant (`db_data`)

- **Rôle** : Stockage des utilisateurs et des transactions.- **Port** : `80````



---- **Rôle** : Interface utilisateur pour la visualisation des nuages et la gestion de compte.



## 🛠 Installation & Lancement**✅ Aucune commande npm/python/go locale nécessaire !**



Tout le projet est piloté par Docker.### 2. TIER 2 : API Gateway (Sécurité & Orchestration)



### Démarrage- **Techno** : Node.js (Express)**URLs** :



```bash- **Port** : `3000`- 🌐 Cloudify Frontend : http://localhost:8080

# 1. Construire et lancer la stack complète

docker-compose up --build- **Rôle** : Point d'entrée unique. Gère l'authentification (JWT/Sessions) et redirige les requêtes vers les services métier.- 🎭 Silly Frontend : http://localhost

```

- 🔌 Silly API : http://localhost:3000

L'application sera accessible sur : **http://localhost**

### 3. TIER 3 : Business API (Logique Métier)

Pour arrêter l'application :

```bash- **Techno** : Node.js (Express)📚 **Guide complet** : Voir [`DOCKER_COMPLET.md`](DOCKER_COMPLET.md)

docker-compose down

```- **Port** : `5000` (Interne)



---- **Rôle** : Calculateur de densité nuageuse, récupération des données météo en temps réel (Open-Meteo), génération d'objets "Nuage".---



## 📂 Structure du Projet



```### 4. TIER 4 : Persistance (Database)## � Architecture (6 Conteneurs)

.

├── docker-compose.yml          # Orchestration de toute la stack- **Techno** : MySQL 8.0

├── frontend/                   # Frontend (React + Vite)

│   ├── src/                    # Code source React- **Volume** : Persistant (`db_data`)```

│   └── Dockerfile              # Config Build Frontend

├── backend/                    # Services Backend- **Rôle** : Stockage des utilisateurs et des transactions.CLOUDIFY PRINCIPAL

│   ├── api-gateway/            # Tier 2 : Gateway & Auth (Express)

│   ├── business-api/           # Tier 3 : Logique Métier (Express)├── cloudify-frontend (React + Nginx)     → Port 8080

│   └── database/               # Tier 4 : Config & Init SQL

└── README.md---

```

SILLY-AS-A-SERVICE (4-Tier)

## 🛠 Installation & Lancement├── TIER 1: silly-frontend (React + Nginx)     → Port 80

├── TIER 2: silly-api-gateway (Express.js)     → Port 3000

Tout le projet est piloté par Docker. Aucune installation locale de Node ou autre n'est requise.├── TIER 3: silly-user-service (Go + Auth)     → Interne

├── TIER 3: silly-generator (Python + Flask)   → Interne

### Pré-requis└── TIER 4: silly-database (MySQL + Volume)    → Interne

- Docker Desktop installé et lancé.```



### Démarrage---



```bash## � Conformité aux Consignes

# 1. Construire et lancer la stack complète

docker-compose up --build✅ **Lancé uniquement via docker-compose**  

```✅ **Aucune commande locale (npm/python/go)**  

✅ **4+ Tiers distincts** (on en a 5 !)  

L'application sera accessible sur : **http://localhost**✅ **Frontend servi via Nginx**  

✅ **API Gateway avec Express.js**  

Pour arrêter l'application :✅ **Services métier** (Go + Python)  

```bash✅ **Base de données MySQL**  

docker-compose down✅ **Réseau Docker interne**  

```✅ **Volume persistant**



------



## 📂 Structure du Projet## 🛑 Arrêter les Services



``````bash

.# Automatique

├── docker-compose.yml          # Orchestration de toute la stack./stop-all.sh

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
