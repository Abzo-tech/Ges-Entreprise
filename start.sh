#!/bin/bash

echo "Démarrage de l'application de gestion des salaires..."

# Démarrer le backend
echo "Démarrage du backend..."
cd backend && npm install && npm run migrate && npm run seed && npm run dev &
BACKEND_PID=$!

# Attendre que le backend soit prêt
sleep 5

# Démarrer le frontend
echo "Démarrage du frontend..."
cd ../frontend && npm install && npm run dev &
FRONTEND_PID=$!

echo "Application démarrée !"
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:3000/api-docs"

# Fonction de nettoyage
cleanup() {
  echo "Arrêt des services..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Capturer SIGINT (Ctrl+C)
trap cleanup SIGINT

# Attendre
wait
