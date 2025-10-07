#!/bin/bash

# Script de test pour vérifier l'upload de logo

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🧪 TEST UPLOAD LOGO - Vérification Bug Logo NULL         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:3000/api"
BACKEND_DIR="/home/abzo/Downloads/ges-entreprises/backend"

echo "═══════════════════════════════════════════════════════════"
echo "📋 PHASE 1 : Vérification de l'état initial"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Vérifier l'état initial de la BDD
echo "État initial de la base de données :"
node "$BACKEND_DIR/check-logos.js"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "📋 PHASE 2 : Création d'une image de test"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Créer une image de test simple (PNG 100x100 rouge)
TEST_IMAGE="/tmp/test-logo.png"
convert -size 100x100 xc:red "$TEST_IMAGE" 2>/dev/null

if [ ! -f "$TEST_IMAGE" ]; then
    echo -e "${YELLOW}⚠️  ImageMagick non disponible, création d'un fichier PNG minimal${NC}"
    # Créer un PNG minimal valide (1x1 pixel rouge)
    echo -n -e '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90\x77\x53\xde\x00\x00\x00\x0c\x49\x44\x41\x54\x08\xd7\x63\xf8\xcf\xc0\x00\x00\x03\x01\x01\x00\x18\xdd\x8d\xb4\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > "$TEST_IMAGE"
fi

if [ -f "$TEST_IMAGE" ]; then
    echo -e "${GREEN}✅ Image de test créée : $TEST_IMAGE${NC}"
    ls -lh "$TEST_IMAGE"
else
    echo -e "${RED}❌ Impossible de créer l'image de test${NC}"
    exit 1
fi
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "📋 PHASE 3 : Test de l'API - Création d'entreprise"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Créer une entreprise de test
echo "Création d'une entreprise de test..."
ENTREPRISE_NAME="Test Logo $(date +%s)"
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/entreprises" \
  -H "Content-Type: application/json" \
  -d "{
    \"nom\": \"$ENTREPRISE_NAME\",
    \"adresse\": \"123 Test Street\",
    \"secteur\": \"Test\",
    \"couleurPrincipale\": \"#FF0000\",
    \"devise\": \"XOF\",
    \"typePeriode\": \"MENSUELLE\"
  }")

echo "Réponse de création : $CREATE_RESPONSE"
ENTREPRISE_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

if [ -z "$ENTREPRISE_ID" ]; then
    echo -e "${RED}❌ Échec de la création de l'entreprise${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Entreprise créée avec l'ID : $ENTREPRISE_ID${NC}"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "📋 PHASE 4 : Test de l'API - Upload du logo"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Uploader le logo
echo "Upload du logo pour l'entreprise $ENTREPRISE_ID..."
UPLOAD_RESPONSE=$(curl -s -X POST "$API_URL/files/upload/logo/$ENTREPRISE_ID" \
  -F "logo=@$TEST_IMAGE")

echo "Réponse d'upload : $UPLOAD_RESPONSE"

# Vérifier si l'upload a réussi
if echo "$UPLOAD_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Logo uploadé avec succès${NC}"
    LOGO_PATH=$(echo "$UPLOAD_RESPONSE" | grep -o '"logoPath":"[^"]*"' | cut -d'"' -f4)
    echo "Chemin du logo : $LOGO_PATH"
else
    echo -e "${RED}❌ Échec de l'upload du logo${NC}"
fi
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "📋 PHASE 5 : Vérification en base de données"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Attendre un peu pour que la BDD soit mise à jour
sleep 1

# Vérifier l'état de la BDD après l'upload
echo "État de la base de données après l'upload :"
node "$BACKEND_DIR/check-logos.js"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "📋 PHASE 6 : Vérification spécifique de l'entreprise créée"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Vérifier spécifiquement l'entreprise créée
ENTREPRISE_DATA=$(curl -s "$API_URL/entreprises/$ENTREPRISE_ID")
echo "Données de l'entreprise $ENTREPRISE_ID :"
echo "$ENTREPRISE_DATA" | grep -o '"logo":"[^"]*"' || echo "Logo: NULL"
echo ""

# Vérifier si le logo est NULL ou non
if echo "$ENTREPRISE_DATA" | grep -q '"logo":null'; then
    echo -e "${RED}❌ ÉCHEC : Le champ logo est toujours NULL en base de données !${NC}"
    echo ""
    echo "🔍 Diagnostic :"
    echo "   - L'entreprise a été créée avec l'ID $ENTREPRISE_ID"
    echo "   - Le logo a été uploadé via l'API"
    echo "   - MAIS le champ logo en BDD est resté à NULL"
    echo ""
    echo "💡 Causes possibles :"
    echo "   1. Le FileController ne met pas à jour la BDD"
    echo "   2. L'EntrepriseRepository.update() ne fonctionne pas"
    echo "   3. Problème de transaction ou de commit"
    exit 1
elif echo "$ENTREPRISE_DATA" | grep -q '"logo":"'; then
    LOGO_VALUE=$(echo "$ENTREPRISE_DATA" | grep -o '"logo":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ SUCCÈS : Le champ logo a été mis à jour !${NC}"
    echo "   Valeur du logo : $LOGO_VALUE"
    echo ""
    echo "🎉 Le bug est résolu !"
else
    echo -e "${YELLOW}⚠️  Impossible de déterminer l'état du logo${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📋 Nettoyage"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Nettoyer l'image de test
rm -f "$TEST_IMAGE"
echo "Image de test supprimée"

echo ""
echo "Test terminé !"