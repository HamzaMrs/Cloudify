<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CLOUD² - Plateforme de Location de Nuages

Application web SaaS innovante pour la gestion et la location de nuages atmosphériques.

## 🚀 Installation et Démarrage

**Prérequis:** Node.js 18+

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

### Build Production

```bash
npm run build
npm run preview
```

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
