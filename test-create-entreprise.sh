#!/bin/bash

# Test de création d'entreprise sans admin
echo "=== Test 1: Création d'entreprise SANS admin ==="
curl -X POST http://localhost:3000/api/entreprises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nom": "Test Entreprise Sans Admin",
    "adresse": "123 Test Street",
    "secteur": "Test",
    "couleurPrincipale": "#6366f1",
    "devise": "XOF",
    "typePeriode": "MENSUELLE"
  }' | jq .

echo ""
echo "=== Test 2: Création d'entreprise AVEC admin complet ==="
curl -X POST http://localhost:3000/api/entreprises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nom": "Test Entreprise Avec Admin",
    "adresse": "456 Test Avenue",
    "secteur": "Test",
    "couleurPrincipale": "#6366f1",
    "devise": "XOF",
    "typePeriode": "MENSUELLE",
    "adminNom": "Admin Test",
    "adminEmail": "admin.test@example.com",
    "adminMotDePasse": "password123"
  }' | jq .