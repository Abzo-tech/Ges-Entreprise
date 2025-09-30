# Application de Gestion des Salaires

Une application web complète pour la gestion des salaires multi-entreprises avec génération de bulletins de paie et suivi des paiements.

## Fonctionnalités

- Gestion multi-entreprises
- Gestion des employés avec différents types de contrats
- Génération de cycles de paie (Pay Run)
- Création de bulletins de salaire (Payslip)
- Suivi des paiements partiels ou totaux
- Génération de reçus PDF
- Dashboard avec indicateurs clés
- Rôles utilisateurs (Super-admin, Admin, Caissier)

## Architecture

- **Backend**: Node.js + Express + TypeScript + Prisma + MySQL
- **Frontend**: React + Tailwind CSS + Vite
- **Base de données**: MySQL

## Installation et démarrage

1. Cloner le projet
2. Assurez-vous que MySQL est installé et en cours d'exécution
3. Installer les dépendances et démarrer:
   ```bash
   ./start.sh
   ```

   Le script `start.sh` configurera automatiquement la base de données MySQL, installera les dépendances et démarrera les services.

## Accès

- **Application**: http://localhost:5173
- **API**: http://localhost:3000
- **Documentation API**: http://localhost:3000/api-docs

## Comptes de test

- **Super Admin**: superadmin@salary.com / password123
- **Admin**: admin@techcorp.com / password123
- **Caissier**: caissier@financeplus.com / password123
