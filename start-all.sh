#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║         🚀 Cloudify - Lancement Complet 🚀            ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé.${NC}"
    echo "   Installe Docker Desktop depuis : https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Vérifier si Docker est démarré
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker n'est pas démarré.${NC}"
    echo "   Ouvre Docker Desktop et attends qu'il soit prêt."
    exit 1
fi

echo -e "${GREEN}✅ Docker est prêt${NC}"
echo ""

# Étape 1 : Démarrer les services Docker
echo -e "${YELLOW}1️⃣  Démarrage de TOUS les services Docker...${NC}"
echo ""

echo "   Building and starting containers..."
docker-compose up -d --build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du démarrage de Docker Compose${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Tous les services Docker démarrés en arrière-plan${NC}"
echo ""

# Attendre que les services soient prêts
echo -e "${YELLOW}⏳ Attente du démarrage complet des services...${NC}"
sleep 10

# Vérifier la santé des services
echo "   Vérification des services..."
API_HEALTH=$(curl -s http://localhost:3000/health 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}   ✅ API Gateway OK${NC}"
else
    echo -e "${YELLOW}   ⚠️  API Gateway pas encore prêt${NC}"
fi

CLOUDIFY_HEALTH=$(curl -s -I http://localhost:8080 2>/dev/null | head -n 1)
if echo "$CLOUDIFY_HEALTH" | grep -q "200"; then
    echo -e "${GREEN}   ✅ Cloudify Frontend OK${NC}"
else
    echo -e "${YELLOW}   ⚠️  Cloudify Frontend en cours de démarrage${NC}"
fi

echo ""

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  ✅ Tout est lancé !                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📍 URLs d'accès :${NC}"
echo ""
echo -e "   🌐 ${BLUE}Cloudify Frontend${NC}    → http://localhost:8080"
echo -e "   🎭 ${BLUE}Silly Frontend${NC}       → http://localhost"
echo -e "   🔌 ${BLUE}Silly API Gateway${NC}    → http://localhost:3000"
echo ""
echo -e "${YELLOW}🛑 Pour arrêter :${NC}"
echo -e "   • Exécute : ${RED}./stop-all.sh${NC}"
echo -e "   • Ou exécute : ${RED}docker-compose down${NC}"
echo ""
echo -e "${GREEN}� Pour voir les logs :${NC}"
echo -e "   • docker-compose logs -f"
echo ""
echo -e "${GREEN}✅ Tous les services tournent dans Docker !${NC}"
echo -e "${GREEN}   Aucune commande npm/python/go locale nécessaire.${NC}"
echo ""
