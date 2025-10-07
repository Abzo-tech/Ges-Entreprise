#!/bin/bash

# Script de test complet pour la correction du bug logo NULL
# Usage: ./test-complet.sh

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🧪 TEST COMPLET - Correction Logo NULL en BDD            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TESTS_PASSED=0
TESTS_FAILED=0

# Fonction pour afficher un test réussi
pass() {
    echo -e "${GREEN}✅ PASS${NC} - $1"
    ((TESTS_PASSED++))
}

# Fonction pour afficher un test échoué
fail() {
    echo -e "${RED}❌ FAIL${NC} - $1"
    ((TESTS_FAILED++))
}

# Fonction pour afficher une info
info() {
    echo -e "${BLUE}ℹ️  INFO${NC} - $1"
}

# Fonction pour afficher un warning
warn() {
    echo -e "${YELLOW}⚠️  WARN${NC} - $1"
}

echo "═══════════════════════════════════════════════════════════"
echo "📋 PHASE 1 : Vérification de la structure"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test 1 : Vérifier que les dossiers existent
if [ -d "backend" ] && [ -d "frontend" ]; then
    pass "Structure des dossiers backend/frontend"
else
    fail "Structure des dossiers backend/frontend"
fi

# Test 2 : Vérifier que les fichiers modifiés existent
if [ -f "backend/src/controllers/FileController.ts" ]; then
    pass "FileController.ts existe"
else
    fail "FileController.ts existe"
fi

if [ -f "frontend/src/components/LogoUploader.jsx" ]; then
    pass "LogoUploader.jsx existe"
else
    fail "LogoUploader.jsx existe"
fi

if [ -f "frontend/src/pages/Entreprises.jsx" ]; then
    pass "Entreprises.jsx existe"
else
    fail "Entreprises.jsx existe"
fi

# Test 3 : Vérifier que le dossier uploads existe
if [ -d "backend/uploads/logos" ]; then
    pass "Dossier uploads/logos existe"
else
    warn "Dossier uploads/logos n'existe pas (sera créé au premier upload)"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🔍 PHASE 2 : Vérification du code"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test 4 : Vérifier que le prop autoUpload existe dans LogoUploader
if grep -q "autoUpload" frontend/src/components/LogoUploader.jsx; then
    pass "Prop 'autoUpload' présent dans LogoUploader"
else
    fail "Prop 'autoUpload' absent dans LogoUploader"
fi

# Test 5 : Vérifier que autoUpload={false} est utilisé dans Entreprises
if grep -q "autoUpload={false}" frontend/src/pages/Entreprises.jsx; then
    pass "autoUpload={false} utilisé dans Entreprises"
else
    fail "autoUpload={false} absent dans Entreprises"
fi

# Test 6 : Vérifier que les variables pending* ont été supprimées
if grep -q "pendingLogoFile" frontend/src/pages/Entreprises.jsx; then
    fail "Variable 'pendingLogoFile' encore présente (devrait être supprimée)"
else
    pass "Variable 'pendingLogoFile' supprimée"
fi

if grep -q "pendingEntrepriseId" frontend/src/pages/Entreprises.jsx; then
    fail "Variable 'pendingEntrepriseId' encore présente (devrait être supprimée)"
else
    pass "Variable 'pendingEntrepriseId' supprimée"
fi

# Test 7 : Vérifier que la mise à jour BDD est présente dans FileController
if grep -q "entrepriseRepository.update" backend/src/controllers/FileController.ts; then
    pass "Mise à jour BDD présente dans FileController"
else
    fail "Mise à jour BDD absente dans FileController"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "🔨 PHASE 3 : Compilation"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test 8 : Compiler le backend
info "Compilation du backend..."
cd backend
if npm run build > /dev/null 2>&1; then
    pass "Backend compile sans erreur"
else
    fail "Backend ne compile pas"
fi
cd ..

# Test 9 : Compiler le frontend
info "Compilation du frontend..."
cd frontend
if npm run build > /dev/null 2>&1; then
    pass "Frontend compile sans erreur"
else
    fail "Frontend ne compile pas"
fi
cd ..

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "💾 PHASE 4 : Vérification de la base de données"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test 10 : Vérifier l'état de la BDD
info "Vérification de la base de données..."
cd backend
if [ -f "check-logos.js" ]; then
    node check-logos.js
    pass "Script de vérification BDD exécuté"
else
    warn "Script check-logos.js non trouvé"
fi
cd ..

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 RÉSULTATS"
echo "═══════════════════════════════════════════════════════════"
echo ""

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))

echo "Tests réussis : ${GREEN}${TESTS_PASSED}${NC} / ${TOTAL_TESTS}"
echo "Tests échoués : ${RED}${TESTS_FAILED}${NC} / ${TOTAL_TESTS}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ TOUS LES TESTS SONT PASSÉS !                          ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║  Le code est prêt pour le test manuel.                    ║${NC}"
    echo -e "${GREEN}║  Suivez les instructions dans TEST_MANUEL.md               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "📝 Prochaines étapes :"
    echo "   1. Démarrer le backend : cd backend && npm start"
    echo "   2. Créer une entreprise avec logo via l'interface"
    echo "   3. Vérifier : cd backend && node check-logos.js"
    echo ""
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ CERTAINS TESTS ONT ÉCHOUÉ                              ║${NC}"
    echo -e "${RED}║                                                            ║${NC}"
    echo -e "${RED}║  Veuillez corriger les erreurs avant de continuer.        ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "📝 Actions recommandées :"
    echo "   1. Vérifier les messages d'erreur ci-dessus"
    echo "   2. Consulter DIAGNOSTIC_RAPIDE.md"
    echo "   3. Corriger les problèmes identifiés"
    echo "   4. Relancer ce script"
    echo ""
    exit 1
fi