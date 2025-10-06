# Application de Gestion des Salaires

Une application web complète pour la gestion des salaires multi-entreprises avec génération de bulletins de paie, suivi des paiements, gestion des employés, cycles de paie, et système de pointage (time tracking).

## Fonctionnalités

### Gestion Multi-Entreprises
- Création et gestion de plusieurs entreprises
- Configuration personnalisée par entreprise (logo, couleur principale, devise, période de paie)
- Isolation des données par entreprise

### Gestion des Employés
- Ajout, modification et suppression d'employés
- Différents types de contrats : Mensuel, Journalier, Honoraires
- Informations détaillées : salaire, taux journalier, coordonnées bancaires, adresse, téléphone
- Gestion du statut actif/inactif

### Système de Pointage (Time Tracking)
- Enregistrement des heures d'arrivée et de départ
- Gestion des pauses
- Calcul automatique des heures travaillées et heures supplémentaires
- Statuts : Présent, Absent, Retard, Congé, Maladie, Formation, Mission
- Validation par les administrateurs

### Cycles de Paie (Pay Runs)
- Création de périodes de paie (Mensuelle, Hebdomadaire, Journalière)
- Gestion des statuts : Brouillon, Approuvé, Clôturé
- Génération automatique des bulletins de salaire

### Bulletins de Salaire (Payslips)
- Génération automatique basée sur les cycles de paie
- Calcul du montant brut, déductions, montant net
- Jours travaillés et heures supplémentaires
- Statuts : Brouillon, Approuvé

### Suivi des Paiements
- Enregistrement des paiements partiels ou totaux
- Modes de paiement : Espèces, Virement, Chèque, Orange Money, Wave
- Génération automatique de reçus PDF
- Statuts : Payé, Partiel, En attente

### Dashboard et Analytics
- Indicateurs clés de performance
- Graphiques et statistiques
- Vue d'ensemble par entreprise

### Gestion des Utilisateurs
- Système d'authentification JWT
- Rôles utilisateurs avec permissions granulares
- Gestion des accès par entreprise

### Upload et Gestion de Fichiers
- Upload de logos d'entreprise
- Stockage sécurisé des fichiers
- Génération et téléchargement de PDFs

## Architecture

### Backend
- **Framework**: Node.js + Express.js
- **Langage**: TypeScript
- **ORM**: Prisma
- **Base de données**: MySQL
- **Authentification**: JWT (JSON Web Tokens)
- **Validation**: Zod schemas
- **Upload de fichiers**: Multer
- **Génération PDF**: PDFKit
- **WebSockets**: Socket.io (pour les mises à jour en temps réel)
- **Documentation API**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **Charts**: Recharts
- **Icons**: Heroicons, Lucide React
- **State Management**: React Context
- **HTTP Client**: Axios
- **Validation**: Zod

### Base de Données
- **SGBD**: MySQL
- **Migration**: Prisma Migrate
- **Seeding**: Données de test automatiques

## Structure du Projet

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
│   │   └── index.ts         # Point d'entrée de l'application
│   ├── prisma/
│   │   ├── schema.prisma    # Schéma de la base de données
│   │   ├── seed.js          # Données de test
│   │   └── migrations/      # Migrations de base de données
│   ├── assets/              # Fichiers statiques
│   ├── uploads/             # Fichiers uploadés
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages de l'application
│   │   ├── context/         # Context React
│   │   ├── services/        # Services API
│   │   ├── utils/           # Utilitaires frontend
│   │   └── main.jsx         # Point d'entrée React
│   ├── public/              # Assets statiques
│   └── package.json
├── start.sh                 # Script de démarrage automatique
└── README.md
```

## Prérequis

- **Node.js** >= 18.0.0
- **MySQL** >= 8.0
- **npm** ou **yarn**
- **Git**

## Installation et Configuration

### 1. Clonage du projet
```bash
git clone <repository-url>
cd ges-entreprises
```

### 2. Configuration de la base de données
Assurez-vous que MySQL est installé et en cours d'exécution.

Le script `start.sh` configure automatiquement une base de données locale, mais vous pouvez aussi configurer manuellement :

```bash
# Créer la base de données
mysql -u root -p
CREATE DATABASE ges_entreprises;
```

### 3. Variables d'environnement
Créer un fichier `.env` dans le dossier `backend/` :

```env
# Base de données
DATABASE_URL="mysql://username:password@localhost:3306/ges_entreprises"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Serveur
PORT=3000
NODE_ENV=development

# Upload
MAX_FILE_SIZE=5242880
```

### 4. Installation des dépendances et démarrage
Utilisez le script automatique :
```bash
./start.sh
```

Ou installez manuellement :

```bash
# Backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

## Démarrage de l'application

### Développement
```bash
# Démarrage complet (backend + frontend)
./start.sh

# Ou séparément :
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run preview
```

## API Documentation

L'API est documentée avec Swagger. Une fois l'application démarrée :

- **Documentation API**: http://localhost:3000/api-docs

### Endpoints principaux

#### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription (réservé aux super admins)

#### Entreprises
- `GET /api/entreprises` - Liste des entreprises
- `POST /api/entreprises` - Créer une entreprise
- `PUT /api/entreprises/:id` - Modifier une entreprise
- `DELETE /api/entreprises/:id` - Supprimer une entreprise

#### Employés
- `GET /api/employes` - Liste des employés
- `POST /api/employes` - Créer un employé
- `PUT /api/employes/:id` - Modifier un employé
- `DELETE /api/employes/:id` - Supprimer un employé

#### Pointages
- `GET /api/pointages` - Liste des pointages
- `POST /api/pointages` - Créer un pointage
- `PUT /api/pointages/:id` - Modifier un pointage
- `POST /api/pointages/:id/valider` - Valider un pointage

#### Cycles de Paie (Pay Runs)
- `GET /api/payruns` - Liste des cycles de paie
- `POST /api/payruns` - Créer un cycle de paie
- `PUT /api/payruns/:id` - Modifier un cycle de paie
- `POST /api/payruns/:id/approve` - Approuver un cycle de paie

#### Bulletins de Salaire (Payslips)
- `GET /api/payslips` - Liste des bulletins
- `POST /api/payslips` - Générer des bulletins
- `GET /api/payslips/:id/pdf` - Télécharger le PDF

#### Paiements
- `GET /api/paiements` - Liste des paiements
- `POST /api/paiements` - Enregistrer un paiement
- `GET /api/paiements/:id/recu` - Télécharger le reçu

#### Dashboard
- `GET /api/dashboard/stats` - Statistiques générales
- `GET /api/dashboard/entreprise/:id` - Stats par entreprise

#### Fichiers
- `POST /api/files/upload` - Upload de fichier
- `GET /api/files/:filename` - Téléchargement de fichier

## Rôles et Permissions

### Super Admin
- Accès à toutes les fonctionnalités
- Gestion des entreprises
- Gestion des utilisateurs globaux
- Accès à toutes les données

### Admin
- Gestion des employés de leur(s) entreprise(s)
- Gestion des cycles de paie
- Gestion des paiements
- Accès aux pointages
- Dashboard limité à leur(s) entreprise(s)

### Caissier
- Enregistrement des paiements
- Consultation des bulletins et paiements
- Accès limité en lecture seule pour la plupart des données

## Schéma de Base de Données

### Modèles Principaux

#### Entreprise
- `id`: Identifiant unique
- `nom`: Nom de l'entreprise
- `adresse`: Adresse
- `secteur`: Secteur d'activité
- `logo`: URL du logo
- `couleurPrincipale`: Couleur thème (#hex)
- `devise`: Devise (XOF par défaut)
- `typePeriode`: Période de paie (MENSUELLE, HEBDOMADAIRE, JOURNALIERE)
- `numeroServiceClient`: Contact support

#### Employe
- `id`: Identifiant unique
- `nom`, `prenom`: Nom complet
- `email`: Email unique
- `poste`: Poste occupé
- `salaire`: Salaire mensuel
- `typeContrat`: HONORAIRE, MENSUEL, JOURNALIERE
- `tauxJournalier`: Taux pour contrats journaliers
- `coordonneesBancaires`: IBAN/compte
- `adresse`, `telephone`: Coordonnées
- `dateEmbauche`: Date d'embauche
- `actif`: Statut actif/inactif
- `entrepriseId`: Référence entreprise

#### Pointage
- `id`: Identifiant unique
- `employeId`: Référence employé
- `datePointage`: Date du pointage
- `heureArrivee`, `heureDepart`: Horaires
- `pauseDebut`, `pauseFin`: Pauses
- `heuresTravaillees`: Total heures
- `heuresSupplementaires`: Heures sup
- `statut`: PRESENT, ABSENT, RETARD, CONGE, MALADIE, FORMATION, MISSION
- `validePar`: Utilisateur qui valide

#### PayRun
- `id`: Identifiant unique
- `periodeDebut`, `periodeFin`: Période couverte
- `type`: MENSUEL, HEBDOMADAIRE, JOURNALIER
- `statut`: BROUILLON, APPROUVE, CLOTURE
- `entrepriseId`: Référence entreprise

#### Payslip
- `id`: Identifiant unique
- `montantBrut`: Salaire brut
- `joursTravailles`: Jours travaillés
- `deductions`: Déductions
- `montantNet`: Salaire net
- `statut`: BROUILLON, APPROUVE
- `employeId`, `payRunId`: Références

#### Paiement
- `id`: Identifiant unique
- `montant`: Montant payé
- `datePaiement`: Date du paiement
- `modePaiement`: ESPECES, VIREMENT, CHEQUE, ORANGE_MONEY, WAVE
- `statut`: PAYE, PARTIEL, EN_ATTENTE
- `recu`: URL du reçu PDF
- `employeId`, `payslipId`: Références

#### Utilisateur
- `id`: Identifiant unique
- `nom`: Nom complet
- `email`: Email unique
- `motDePasse`: Hash du mot de passe
- `role`: SUPER_ADMIN, ADMIN, CAISSIER
- `actif`: Statut actif/inactif

## Scripts Disponibles

### Backend
```bash
npm run dev          # Démarrage en développement avec hot reload
npm run build        # Build pour la production
npm run start        # Démarrage en production
npm run migrate      # Exécuter les migrations Prisma
npm run generate     # Générer le client Prisma
npm run db:seed      # Seeder la base de données
npm run test         # Exécuter les tests
```

### Frontend
```bash
npm run dev          # Démarrage du serveur de développement
npm run build        # Build pour la production
npm run preview      # Prévisualisation du build
npm run lint         # Linting du code
```

## Développement

### Conventions de Code
- **Backend**: TypeScript strict, interfaces pour les types
- **Frontend**: Composants fonctionnels React, hooks
- **Nommage**: camelCase pour variables/fonctions, PascalCase pour composants
- **Commits**: Messages en anglais, format conventionnel

### Gestion d'État
- Context API pour l'authentification globale
- Props drilling évité avec des contextes spécialisés si nécessaire

### Sécurité
- Validation des entrées avec Zod
- Sanitisation des données
- Authentification JWT
- Autorisation basée sur les rôles
- Logs des requêtes pour audit

### Performance
- Lazy loading des composants React
- Optimisation des requêtes Prisma avec select/include
- Pagination côté serveur
- Cache des assets statiques

## Tests

### Comptes de test
- **Super Admin**: superadmin@salary.com / password123
- **Admin**: admin@techcorp.com / password123
- **Caissier**: caissier@financeplus.com / password123

### Données de test
Le seeder crée automatiquement :
- 3 utilisateurs de test
- Plusieurs entreprises d'exemple
- Employés, pointages, cycles de paie

## Déploiement

### Prérequis Production
- Serveur avec Node.js >= 18
- Base de données MySQL
- Reverse proxy (nginx recommandé)
- SSL certificate

### Variables d'environnement Production
```env
NODE_ENV=production
DATABASE_URL="mysql://user:pass@host:port/db"
JWT_SECRET="production-secret-key"
```

### Build et Déploiement
```bash
# Backend
cd backend
npm run build
npm run migrate:prod
npm start

# Frontend (build statique)
cd frontend
npm run build
# Servir le dossier dist/ avec nginx
```

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines
- Respecter les conventions de code
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation
- S'assurer que tous les tests passent

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Auteurs

- **Équipe de développement** - Développement initial

## Remerciements

- [Prisma](https://www.prisma.io/) - ORM moderne
- [React](https://reactjs.org/) - Framework frontend
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Express.js](https://expressjs.com/) - Framework backend


