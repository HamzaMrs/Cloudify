#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                                                        ║${NC}"
echo -e "${RED}║         🛑 Cloudify - Arrêt Complet 🛑                ║${NC}"
echo -e "${RED}║                                                        ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Arrêter le serveur Vite (si il tourne)
echo -e "${YELLOW}1️⃣  Arrêt de tous les services Docker...${NC}"

if docker-compose ps -q > /dev/null 2>&1; then
    docker-compose down
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✅ Tous les conteneurs Docker arrêtés${NC}"
    else
        echo -e "${RED}   ❌ Erreur lors de l'arrêt de Docker Compose${NC}"
        exit 1
    fi
else
    echo -e "${BLUE}   ℹ️  Aucun service Docker en cours${NC}"
fi

echo ""

# Vérifier que tout est bien arrêté
echo -e "${YELLOW}2️⃣  Vérification des ports...${NC}"

check_port() {
    local port=$1
    local name=$2
    if lsof -ti:$port > /dev/null 2>&1; then
        echo -e "${YELLOW}   ⚠️  Port $port ($name) encore utilisé${NC}"
        return 1
    else
        echo -e "${GREEN}   ✅ Port $port ($name) libéré${NC}"
        return 0
    fi
}

check_port 8080 "Cloudify"
check_port 80 "Silly Frontend"
check_port 3000 "Silly API"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ Tout est arrêté proprement !           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}💡 Pour relancer :${NC}"
echo -e "   ./start-all.sh"
echo ""
