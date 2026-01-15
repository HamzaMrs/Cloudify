<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CLOUD² - Plateforme de Location de Nuages

Application web SaaS innovante pour la gestion et la location de nuages atmosphériques.

## 🚀 Quick Start (100% Docker)

```bash
# Lancer TOUT (6 conteneurs Docker)
./start-all.sh

# Ou manuellement
docker-compose up --build
```

**✅ Aucune commande npm/python/go locale nécessaire !**

**URLs** :
- 🌐 Cloudify Frontend : http://localhost:8080
- 🎭 Silly Frontend : http://localhost
- 🔌 Silly API : http://localhost:3000

📚 **Guide complet** : Voir [`DOCKER_COMPLET.md`](DOCKER_COMPLET.md)

---

## � Architecture (6 Conteneurs)

```
CLOUDIFY PRINCIPAL
├── cloudify-frontend (React + Nginx)     → Port 8080

SILLY-AS-A-SERVICE (4-Tier)
├── TIER 1: silly-frontend (React + Nginx)     → Port 80
├── TIER 2: silly-api-gateway (Express.js)     → Port 3000
├── TIER 3: silly-user-service (Go + Auth)     → Interne
├── TIER 3: silly-generator (Python + Flask)   → Interne
└── TIER 4: silly-database (MySQL + Volume)    → Interne
```

---

## � Conformité aux Consignes

✅ **Lancé uniquement via docker-compose**  
✅ **Aucune commande locale (npm/python/go)**  
✅ **4+ Tiers distincts** (on en a 5 !)  
✅ **Frontend servi via Nginx**  
✅ **API Gateway avec Express.js**  
✅ **Services métier** (Go + Python)  
✅ **Base de données MySQL**  
✅ **Réseau Docker interne**  
✅ **Volume persistant**

---

## 🛑 Arrêter les Services

```bash
# Automatique
./stop-all.sh

# Ou manuel
docker-compose down
```

---

## 📦 Dépendances Installées

### Dependencies
- ✅ **react** (v19.2.3) - Framework UI
- ✅ **react-dom** (v19.2.3) - Rendu React
- ✅ **leaflet** (v1.9.4) - Bibliothèque de cartographie
- ✅ **react-leaflet** (v5.0.0) - Intégration React pour Leaflet
- ✅ **lucide-react** (v0.562.0) - Icônes
- ✅ **gsap** (v3.12.5) - Animations

### Dev Dependencies
- ✅ **typescript** (~5.8.2) - Langage TypeScript
- ✅ **vite** (v6.2.0) - Build tool
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
