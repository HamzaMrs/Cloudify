#!/bin/bash

# Script de lancement automatique - Silly as a Service
# Ce script vérifie et corrige les problèmes courants avant de lancer Docker

echo "🚀 Silly as a Service - Setup & Launch"
echo "======================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Étape 1 : Vérification de Docker
echo "📦 Étape 1/4 : Vérification de Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé !${NC}"
    echo "Installez Docker Desktop depuis : https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas démarré !${NC}"
    echo "Lancez Docker Desktop et réessayez."
    exit 1
fi

echo -e "${GREEN}✅ Docker est prêt${NC}"
echo ""

# Étape 2 : Nettoyage des anciens conteneurs (optionnel)
echo "🧹 Étape 2/4 : Nettoyage des anciens conteneurs..."
echo -e "${YELLOW}Voulez-vous nettoyer les anciens conteneurs ? (y/N)${NC}"
read -t 10 -r cleanup || cleanup="n"
if [[ $cleanup =~ ^[Yy]$ ]]; then
    echo "Arrêt et suppression des conteneurs..."
    docker-compose down -v 2>/dev/null
    echo -e "${GREEN}✅ Nettoyage effectué${NC}"
else
    echo "⏭️  Nettoyage ignoré"
fi
echo ""

# Étape 3 : Vérification des fichiers requis
echo "📋 Étape 3/4 : Vérification des fichiers..."

# Vérifier package.json pour web-frontend
if [ ! -f "web-frontend/package.json" ]; then
    echo -e "${RED}❌ web-frontend/package.json manquant${NC}"
    exit 1
fi

# Vérifier go.mod pour user-service
if [ ! -f "user-service/go.mod" ]; then
    echo -e "${RED}❌ user-service/go.mod manquant${NC}"
    exit 1
fi

# Vérifier requirements.txt pour silly-generator
if [ ! -f "silly-generator/requirements.txt" ]; then
    echo -e "${RED}❌ silly-generator/requirements.txt manquant${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Tous les fichiers requis sont présents${NC}"
echo ""

# Étape 4 : Build et lancement
echo "🏗️  Étape 4/4 : Build et lancement de la stack..."
echo "Cela peut prendre 2-3 minutes la première fois..."
echo ""

docker-compose up --build

# Si l'utilisateur arrête avec Ctrl+C
echo ""
echo "👋 Arrêt de l'application..."
docker-compose down
