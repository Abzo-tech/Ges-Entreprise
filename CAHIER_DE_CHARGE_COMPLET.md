# Cahier des Charges Complet – Application de Gestion des Salaires

## 1. Contexte et objectifs
De nombreuses petites et moyennes entreprises gèrent encore leurs salaires de manière manuelle (Excel, papier), ce qui entraîne des erreurs, un manque de suivi et des difficultés à générer des justificatifs fiables.

L'objectif de ce projet est de développer une **application web de gestion des salaires multi-entreprises** permettant :
- de gérer les **employés** avec différents types de contrats (journalier, salaire fixe, honoraire),
- de générer des **cycles de paie (pay runs)** et des **bulletins de salaire** (payslips),
- de suivre les **paiements partiels ou totaux** avec génération de **reçus PDF**,
- d'offrir un **dashboard de suivi** (cartes, courbes),
- de permettre la **gestion multi-entreprises** avec rôles utilisateurs (super-admin, admin, caissier),
- de gérer le **système de pointage** (time tracking) pour le suivi des heures travaillées,
- de personnaliser l'interface par entreprise (logo, thème, couleurs).

---

## 2. Périmètre du projet
### Inclus
- Gestion multi-entreprises avec personnalisation (logo, couleurs, devise)
- Gestion des employés avec contrats variés
- Système de pointage (time tracking) avec validation
- Gestion des cycles de paie (Pay Run)
- Gestion des bulletins de paie (Payslip)
- Gestion des paiements (versements partiels et totaux)
- Génération de documents PDF (reçus, bulletins, listes, factures)
- Dashboard avec indicateurs clés et graphiques
- Filtrage avancé et pagination
- Rôles utilisateurs et permissions granulares
- Upload de fichiers (logos d'entreprise)
- Activation/désactivation d'employés
- Gestion des utilisateurs système
- Mises à jour en temps réel (WebSockets)
- Validation automatique des données
- Service de fichiers sécurisé

### Hors périmètre (future évolution)
- Intégration bancaire automatisée
- Déclarations sociales et fiscales
- Gestion des congés et absences
- Intégration mobile (application native)
- Notifications par email/SMS
- API externe (banques, impôts)

---

## 3. Acteurs et rôles
- **Super-Administrateur** : gère toutes les entreprises, crée et supprime des comptes entreprise, gère les utilisateurs globaux.
- **Administrateur (Entreprise)** : gère ses entreprises, employés, cycles de paie, approuve les bulletins, valide les pointages.
- **Caissier** : enregistre les paiements, génère les reçus, consulte les bulletins et pointages.
- **Employé (optionnel)** : peut consulter ses bulletins (phase future).

---

## 4. Fonctionnalités Détaillées
### 4.1 Tableau de bord
- Affichage des KPI : masse salariale, montant payé, montant restant, nombre d'employés actifs, heures travaillées.
- Graphiques de l'évolution de la masse salariale (6 derniers mois).
- Graphiques des paiements et pointages.
- Liste des prochains paiements à effectuer.
- Vue filtrée par entreprise pour les admins.

### 4.2 Gestion des entreprises
- Créer, modifier, supprimer une entreprise.
- Paramètres : logo, adresse, secteur, devise, type de période (mensuelle/hebdomadaire/journalière), couleur principale, numéro service client.
- Gestion des utilisateurs par entreprise (admin, caissier).
- Isolation complète des données par entreprise.

### 4.3 Gestion des employés
- Créer, modifier, supprimer un employé.
- Champs détaillés : nom, prénom, email, poste, type de contrat (journalier, mensuel, honoraire), taux/salaire, coordonnées bancaires, adresse, téléphone, date d'embauche.
- Activer/désactiver un employé (vacataire en congé).
- Filtrer par : statut, poste, contrat, actif/inactif, entreprise.
- Pagination et recherche avancée.

### 4.4 Système de Pointage (Time Tracking)
- Enregistrement des heures d'arrivée et de départ.
- Gestion des pauses (début/fin).
- Calcul automatique des heures travaillées et heures supplémentaires.
- Statuts : Présent, Absent, Retard, Congé, Maladie, Formation, Mission.
- Validation par les administrateurs.
- Filtrage par date, employé, statut.
- Export PDF des émargements.

### 4.5 Cycles de paie (Pay Run)
- Créer un cycle (mensuel, hebdomadaire, journalier).
- Générer automatiquement les bulletins (payslips).
- Pour les journaliers : saisir le nombre de jours travaillés.
- Statuts : Brouillon, Approuvé, Clôturé.
- Gestion des périodes de début/fin.

### 4.6 Bulletins de paie (Payslip)
- Contenu : informations employé + entreprise, brut, déductions, net à payer, jours travaillés, heures sup.
- Modifiable tant que le cycle est en brouillon.
- Verrouillé après approbation du cycle.
- Statuts : Brouillon, Approuvé.
- Export PDF individuel ou en lot.

### 4.7 Paiements
- Enregistrer un paiement total ou partiel.
- Modes : Espèces, Virement bancaire, Chèque, Orange Money, Wave.
- Génération automatique de **reçus PDF**.
- Statut du bulletin : Payé, Partiel, En attente.
- Suivi des montants payés/restant.

### 4.8 Gestion des Utilisateurs
- Création, modification, suppression d'utilisateurs.
- Attribution de rôles (SUPER_ADMIN, ADMIN, CAISSIER).
- Gestion des accès par entreprise.
- Authentification JWT sécurisée.

### 4.9 Génération de documents
- **Reçu PDF** (après chaque paiement).
- **Bulletin de paie PDF** (individuel ou lot).
- **Liste des paiements PDF** (par période).
- **Liste des émargements PDF** (pointages par période).
- **Facture pro PDF** (optionnelle).

### 4.10 Upload et Gestion de Fichiers
- Upload sécurisé de logos d'entreprise.
- Stockage organisé des fichiers.
- Génération et téléchargement de PDFs.

### 4.11 Sécurité & Permissions
- Authentification JWT (email/mot de passe).
- Rôles et autorisations strictes (RBAC - Role-Based Access Control).
- Hashage des mots de passe (bcrypt).
- Validation des entrées (Zod schemas).
- Logs des requêtes pour audit.
- Middleware d'authentification et autorisation.
- Sanitisation des données.
- Protection contre les attaques courantes (XSS, CSRF).

---

## 5. Contraintes Techniques
### Backend
- **Framework** : Node.js + Express.js
- **Langage** : TypeScript
- **ORM** : Prisma
- **Base de données** : MySQL 8.0+
- **Authentification** : JWT
- **Validation** : Zod
- **Upload de fichiers** : Multer
- **Génération PDF** : PDFKit
- **WebSockets** : Socket.io (mises à jour temps réel)
- **Documentation API** : Swagger/OpenAPI

### Frontend
- **Framework** : React 18
- **Build Tool** : Vite
- **Styling** : Tailwind CSS
- **Routing** : React Router DOM v7
- **Charts** : Recharts
- **State Management** : React Context
- **HTTP Client** : Axios
- **Validation** : Zod

### Base de Données
- **SGBD** : MySQL
- **Migration** : Prisma Migrate
- **Seeding** : Données de test automatiques

### Sécurité
- **Chiffrement** : JWT pour l'authentification
- **Hashage** : bcrypt pour les mots de passe
- **Validation** : Middleware de validation des entrées
- **Logs** : Middleware de logging des requêtes

### Performance
- **Lazy Loading** : Composants React
- **Optimisation** : Requêtes Prisma avec select/include
- **Pagination** : Côté serveur
- **Cache** : Assets statiques

---

## 6. Architecture Technique
### Structure du Projet
```
ges-entreprises/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Logique métier des endpoints
│   │   ├── services/        # Services métier
│   │   ├── repositories/    # Accès aux données
│   │   ├── routes/          # Définition des routes API
│   │   ├── middleware/      # Middlewares Express
│   │   ├── utils/           # Utilitaires
│   │   └── index.ts         # Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma    # Schéma DB
│   │   ├── seed.js          # Données de test
│   │   └── migrations/      # Migrations
│   ├── assets/              # Fichiers statiques
│   ├── uploads/             # Fichiers uploadés
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages
│   │   ├── context/         # Context React
│   │   ├── services/        # Services API
│   │   ├── utils/           # Utilitaires
│   │   └── main.jsx         # Point d'entrée
│   ├── public/              # Assets statiques
│   └── package.json
├── start.sh                 # Script de démarrage
└── README.md
```

### Modèles de Données
#### Entreprise
- id, nom, adresse, secteur, logo, couleurPrincipale, devise, typePeriode, numeroServiceClient

#### Employe
- id, nom, prenom, email, poste, salaire, typeContrat, tauxJournalier, coordonneesBancaires, adresse, telephone, dateEmbauche, actif, entrepriseId

#### Pointage
- id, employeId, datePointage, heureArrivee, heureDepart, pauseDebut, pauseFin, heuresTravaillees, heuresSupplementaires, statut, validePar

#### PayRun
- id, periodeDebut, periodeFin, type, statut, entrepriseId

#### Payslip
- id, montantBrut, joursTravailles, deductions, montantNet, statut, employeId, payRunId

#### Paiement
- id, montant, datePaiement, modePaiement, statut, recu, employeId, payslipId

#### Utilisateur
- id, nom, email, motDePasse (hashé), role, actif

---

## 7. Livrables
- Cahier des charges complet et validé.
- Diagrammes UML (use case, classes, séquence).
- Base de données (MCD, MLD, scripts migrations).
- Application web fonctionnelle avec toutes les fonctionnalités.
- API REST documentée (Swagger).
- Tests unitaires et d'intégration.
- Documentation technique complète.
- Documentation utilisateur (guide d'utilisation).
- Scripts de déploiement.

---

## 8. Planning Détaillé (Sprints Agiles)
- **Sprint 0** : Setup projet, architecture, base de données, authentification.
- **Sprint 1** : Gestion des entreprises et utilisateurs.
- **Sprint 2** : Gestion des employés (+ filtres, activation/désactivation).
- **Sprint 3** : Système de pointage avec validation.
- **Sprint 4** : Gestion des cycles de paie + bulletins.
- **Sprint 5** : Gestion des paiements + génération PDF.
- **Sprint 6** : Dashboard avec KPI et graphiques.
- **Sprint 7** : Upload de fichiers, thème personnalisé.
- **Sprint 8** : Optimisations, tests, documentation.
- **Sprint 9** : Déploiement MVP, corrections bugs.

---

## 9. Critères d'Acceptation
### Fonctionnels
- L'application permet de gérer 100+ employés sans erreur.
- Génération des PDF instantanée (<2s par document).
- Recherche et filtres employés <1s.
- Dashboard en temps réel avec données cohérentes.
- Système de pointage précis et validable.
- Permissions respectées pour tous les rôles.

### Techniques
- Code TypeScript strict sans erreurs.
- Tests couvrant 80%+ du code.
- Performance : temps de réponse API <500ms.
- Sécurité : pas de vulnérabilités connues.
- Responsive design sur tous les appareils.

### Qualité
- Documentation complète et à jour.
- Code review systématique.
- Déploiement automatisé.
- Monitoring et logs opérationnels.

---

## 10. Risques et Mitigation
- **Risque** : Complexité de la gestion multi-tenant.
  **Mitigation** : Architecture claire avec isolation des données.

- **Risque** : Performance avec gros volumes.
  **Mitigation** : Optimisation des requêtes, pagination, cache.

- **Risque** : Sécurité des données sensibles.
  **Mitigation** : Chiffrement, validation, audits réguliers.

- **Risque** : Adoption par les utilisateurs.
  **Mitigation** : Interface intuitive, formation, support.

---

## 11. Indicateurs de Succès
- L'entreprise peut gérer **100+ employés sans erreur**.
- Génération des PDF **instantanée** (<2s par reçu).
- Recherche et filtres employés **<1s**.
- Dashboard en temps réel.
- Satisfaction utilisateur (admins/caissiers) ≥ 90%.
- Temps de déploiement < 30 minutes.
- Disponibilité > 99%.
- Zéro faille de sécurité critique.

---

## 12. Évolutions Futures
- Intégration bancaire automatisée.
- Notifications par email/SMS.
- Application mobile native.
- Déclarations sociales automatisées.
- API pour intégrations tierces.
- Intelligence artificielle pour la détection d'anomalies.
- Multi-devise avancée.
- Gestion des congés et absences.
- Espace employé personnel.
