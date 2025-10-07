#!/bin/bash

# Script pour nettoyer les logs de débogage après validation

echo "🧹 Nettoyage des logs de débogage..."

# Fichier à modifier
FILE="backend/src/controllers/FileController.ts"

# Vérifier que le fichier existe
if [ ! -f "$FILE" ]; then
    echo "❌ Fichier $FILE non trouvé"
    exit 1
fi

echo "📝 Suppression des console.log de débogage dans $FILE..."

# Créer une sauvegarde
cp "$FILE" "$FILE.backup"
echo "✅ Sauvegarde créée : $FILE.backup"

# Supprimer les lignes de débogage
sed -i '/console.log("=== UPLOAD LOGO REQUEST ===")/d' "$FILE"
sed -i '/console.log("File:", req.file)/d' "$FILE"
sed -i '/console.log("Params:", req.params)/d' "$FILE"
sed -i '/console.log("Body:", req.body)/d' "$FILE"
sed -i '/console.log("ERROR: Aucun fichier fourni")/d' "$FILE"
sed -i '/console.log("ERROR: ID entreprise manquant")/d' "$FILE"
sed -i '/console.log("ERROR: Entreprise non trouvée")/d' "$FILE"
sed -i '/console.log("Saving logo for entreprise:", entrepriseId)/d' "$FILE"
sed -i '/console.log("Logo saved successfully:", logoPath)/d' "$FILE"
sed -i '/console.log("Entreprise updated with logo path:", logoPath)/d' "$FILE"

# Supprimer les lignes vides en trop
sed -i '/^[[:space:]]*$/N;/^\n$/d' "$FILE"

echo "✅ Logs de débogage supprimés"
echo ""
echo "⚠️  IMPORTANT : Recompiler le backend après ce nettoyage :"
echo "   cd backend && npm run build"
echo ""
echo "💡 Pour restaurer la version avec logs :"
echo "   cp $FILE.backup $FILE"