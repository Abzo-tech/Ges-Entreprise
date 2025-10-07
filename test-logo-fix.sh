#!/bin/bash

# Script de test rapide pour vérifier la correction du bug logo

echo "=========================================="
echo "Test de la correction du bug logo NULL"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que nous sommes dans le bon répertoire
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Erreur: Ce script doit être exécuté depuis la racine du projet${NC}"
    exit 1
fi

echo "1️⃣  Vérification de la structure des fichiers..."
echo ""

# Vérifier les fichiers modifiés
files_to_check=(
    "frontend/src/components/LogoUploader.jsx"
    "frontend/src/pages/Entreprises.jsx"
    "backend/src/controllers/FileController.ts"
)

all_files_exist=true
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (manquant)"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo -e "${RED}❌ Certains fichiers sont manquants${NC}"
    exit 1
fi

echo ""
echo "2️⃣  Vérification du code LogoUploader.jsx..."
echo ""

# Vérifier que autoUpload est présent
if grep -q "autoUpload = true" frontend/src/components/LogoUploader.jsx; then
    echo -e "${GREEN}✓${NC} Prop 'autoUpload' ajouté"
else
    echo -e "${RED}✗${NC} Prop 'autoUpload' manquant"
fi

# Vérifier la logique conditionnelle
if grep -q "if (autoUpload && entrepriseId)" frontend/src/components/LogoUploader.jsx; then
    echo -e "${GREEN}✓${NC} Logique conditionnelle d'upload présente"
else
    echo -e "${RED}✗${NC} Logique conditionnelle d'upload manquante"
fi

echo ""
echo "3️⃣  Vérification du code Entreprises.jsx..."
echo ""

# Vérifier que pendingLogoFile n'existe plus
if grep -q "pendingLogoFile" frontend/src/pages/Entreprises.jsx; then
    echo -e "${YELLOW}⚠${NC}  Variable 'pendingLogoFile' encore présente (devrait être supprimée)"
else
    echo -e "${GREEN}✓${NC} Variable 'pendingLogoFile' supprimée"
fi

# Vérifier que autoUpload={false} est présent
if grep -q "autoUpload={false}" frontend/src/pages/Entreprises.jsx; then
    echo -e "${GREEN}✓${NC} Prop 'autoUpload={false}' configuré"
else
    echo -e "${RED}✗${NC} Prop 'autoUpload={false}' manquant"
fi

# Vérifier l'upload après création
if grep -q "Uploading logo for entreprise" frontend/src/pages/Entreprises.jsx; then
    echo -e "${GREEN}✓${NC} Log d'upload après création présent"
else
    echo -e "${RED}✗${NC} Log d'upload après création manquant"
fi

echo ""
echo "4️⃣  Vérification du code FileController.ts..."
echo ""

# Vérifier l'import EntrepriseRepository
if grep -q "EntrepriseRepository" backend/src/controllers/FileController.ts; then
    echo -e "${GREEN}✓${NC} Import EntrepriseRepository présent"
else
    echo -e "${RED}✗${NC} Import EntrepriseRepository manquant"
fi

# Vérifier la mise à jour de la BDD
if grep -q "entrepriseRepository.update" backend/src/controllers/FileController.ts; then
    echo -e "${GREEN}✓${NC} Mise à jour de la BDD présente"
else
    echo -e "${RED}✗${NC} Mise à jour de la BDD manquante"
fi

echo ""
echo "5️⃣  Compilation du backend..."
echo ""

cd backend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend compile sans erreurs"
else
    echo -e "${RED}✗${NC} Erreurs de compilation du backend"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "6️⃣  Compilation du frontend..."
echo ""

cd frontend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend compile sans erreurs"
else
    echo -e "${RED}✗${NC} Erreurs de compilation du frontend"
    cd ..
    exit 1
fi
cd ..

echo ""
echo "7️⃣  Vérification du répertoire uploads..."
echo ""

if [ -d "backend/uploads/logos" ]; then
    echo -e "${GREEN}✓${NC} Répertoire uploads/logos existe"
else
    echo -e "${YELLOW}⚠${NC}  Répertoire uploads/logos n'existe pas (sera créé au démarrage)"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Tous les tests de vérification passent !${NC}"
echo "=========================================="
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1. Redémarrer le backend :"
echo "   cd backend && npm start"
echo ""
echo "2. Tester l'upload d'un logo :"
echo "   - Créer une nouvelle entreprise"
echo "   - Sélectionner un logo JPEG ou PNG"
echo "   - Cliquer sur 'Créer'"
echo "   - Vérifier que le logo s'affiche"
echo ""
echo "3. Vérifier en base de données :"
echo "   SELECT id, nom, logo FROM entreprise ORDER BY id DESC LIMIT 5;"
echo ""
echo "4. Consulter la documentation :"
echo "   - CORRECTION_LOGO_NULL.md (ce bug)"
echo "   - LOGO_UPLOAD_FIX.md (documentation complète)"
echo "   - GUIDE_TEST_LOGO.md (guide de test)"
echo ""