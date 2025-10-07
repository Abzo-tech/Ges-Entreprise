# TODO: Système de Pointage avec QR Code

## Phase 1: Tester les fonctionnalités existantes
- [ ] Vérifier la configuration MySQL et créer la base de données
- [ ] Démarrer le système (backend + frontend)
- [ ] Se connecter à l'application
- [ ] Tester la création manuelle de pointage
- [ ] Tester clock-in/clock-out
- [ ] Tester les filtres (employé, statut, dates)
- [ ] Tester modification/suppression de pointage
- [ ] Vérifier les statistiques et rapports

## Phase 2: Ajouter la fonctionnalité QR Code
- [ ] Installer les dépendances (qrcode, react-qr-reader)
- [ ] Créer composant QRCodeDisplay pour afficher le QR d'un employé
- [ ] Créer composant QRScanner pour scanner les QR codes
- [ ] Ajouter endpoint backend pour générer QR codes
- [ ] Modifier PointageService pour check-in/out via QR
- [ ] Mettre à jour l'interface Pointages.jsx pour inclure QR
- [ ] Tester les nouvelles fonctionnalités QR

## Fichiers à modifier
- backend/package.json
- frontend/package.json
- backend/src/services/PointageService.ts
- backend/src/controllers/PointageController.ts
- backend/src/routes/PointageRoute.ts
- frontend/src/pages/Pointages.jsx
- Nouveaux composants: QRCodeDisplay.jsx, QRScanner.jsx
