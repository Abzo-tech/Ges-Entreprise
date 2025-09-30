#!/bin/bash

# Script pour créer un projet de gestion des salaires basé sur l'architecture Todo-fullstack

PROJECT_NAME="ges-entreprises"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

echo "Création du projet de gestion des salaires..."

# Supprimer les anciens dossiers s'ils existent
rm -rf "$BACKEND_DIR"
rm -rf "$FRONTEND_DIR"

# Créer les dossiers principaux
mkdir -p "$BACKEND_DIR"
mkdir -p "$FRONTEND_DIR"

# Créer la structure de dossiers backend
mkdir -p "$BACKEND_DIR/src/controllers"
mkdir -p "$BACKEND_DIR/src/services"
mkdir -p "$BACKEND_DIR/src/repositories"
mkdir -p "$BACKEND_DIR/src/routes"
mkdir -p "$BACKEND_DIR/src/middleware"
mkdir -p "$BACKEND_DIR/src/config"
mkdir -p "$BACKEND_DIR/src/utils"
mkdir -p "$BACKEND_DIR/src/validator"
mkdir -p "$BACKEND_DIR/prisma"
mkdir -p "$BACKEND_DIR/assets"

# Créer la structure de dossiers frontend
mkdir -p "$FRONTEND_DIR/src/components"
mkdir -p "$FRONTEND_DIR/src/context"
mkdir -p "$FRONTEND_DIR/src/hooks"
mkdir -p "$FRONTEND_DIR/src/pages"
mkdir -p "$FRONTEND_DIR/src/services"
mkdir -p "$FRONTEND_DIR/public"
mkdir -p "$FRONTEND_DIR/src/assets"

echo "Modification des fichiers de configuration..."

# Modifier package.json backend
cat > "$BACKEND_DIR/package.json" << EOF
{
  "name": "$PROJECT_NAME-backend",
  "types": "module",
  "version": "1.0.0",
  "description": "Backend pour l'application de gestion des salaires",
  "main": "index.js",
  "scripts": {
    "dev": "node --import 'data:text/javascript,import { register } from \"node:module\"; import { pathToFileURL } from \"node:url\"; register(\"ts-node/esm\", pathToFileURL(\"./\"));' src/index.ts",
    "dev:local": "PORT=3003 DATABASE_URL=\"mysql://app_user:app_pass@127.0.0.1:3306/${PROJECT_NAME//-/_}\" node --import 'data:text/javascript,import { register } from \"node:module\"; import { pathToFileURL } from \"node:url\"; register(\"ts-node/esm\", pathToFileURL(\"./\"));' src/index.ts",
    "dev:watch": "node --import 'data:text/javascript,import { register } from \"node:module\"; import { pathToFileURL } from \"node:url\"; register(\"ts-node/esm\", pathToFileURL(\"./\"));' --watch src/index.ts",
    "build": "npm run generate && tsc",
    "start": "node dist/index.js",
    "start:local": "PORT=3003 DATABASE_URL=\"mysql://app_user:app_pass@127.0.0.1:3306/${PROJECT_NAME//-/_}\" node dist/index.js",
    "start:prod": "npm run build && npm start",
    "postinstall": "npx prisma generate",
    "generate": "npx prisma generate",
    "migrate": "npx prisma migrate dev",
    "migrate:prod": "npx prisma migrate deploy",
    "db:seed": "npx prisma db seed",
    "seed": "ts-node prisma/seed.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@prisma/client": "^6.15.0",
    "bcrypt": "^6.0.0",
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^2.0.2",
    "socket.io": "^4.8.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "zod": "^4.1.5"
  },
  "devDependencies": {
    "@types/bcrypt": "^6.0.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/multer": "^2.0.0",
    "@types/node": "^24.3.0",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.8",
    "prisma": "^6.15.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.2"
  }
}
EOF

# Modifier package.json frontend
cat > "$FRONTEND_DIR/package.json" << EOF
{
  "name": "$PROJECT_NAME-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "server": "node server.js",
    "start": "concurrently \"npm run server\" \"npm run dev\"",
    "dev:full": "concurrently \"npm run server\" \"npm run dev\""
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "concurrently": "^8.2.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.544.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.9.1",
    "socket.io-client": "^4.8.1",
    "sqlite3": "^5.1.6",
    "zod": "^4.1.11"
  },
  "devDependencies": {
    "@eslint/js": "^9.35.0",
    "@types/react": "^19.1.13",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.2",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.35.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.4.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "vite": "^7.1.6"
  }
}
EOF

# Créer .env pour le backend
cat > "$BACKEND_DIR/.env" << EOF
DATABASE_URL="mysql://app_user:app_pass@127.0.0.1:3306/${PROJECT_NAME//-/_}"
JWT_SECRET="your-secret-key"
EOF

echo "Création du schéma Prisma pour la gestion des salaires..."

# Créer le schéma Prisma
cat > "$BACKEND_DIR/prisma/schema.prisma" << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Entreprise {
  id        Int         @id @default(autoincrement())
  nom       String
  adresse   String?
  secteur   String?
  employes  Employe[]
  utilisateurs Utilisateur[]
  payRuns   PayRun[]
}

model Employe {
  id                   Int         @id @default(autoincrement())
  nom                  String
  prenom               String
  email                String      @unique
  poste                String?
  salaire              Float?
  typeContrat          TypeContrat @default(FIXE)
  tauxJournalier       Float?
  coordonneesBancaires String?
  dateEmbauche         DateTime?
  entrepriseId         Int
  entreprise           Entreprise  @relation(fields: [entrepriseId], references: [id])
  paiements            Paiement[]
  payslips             Payslip[]
}

model Paiement {
  id           Int            @id @default(autoincrement())
  montant      Float
  datePaiement DateTime
  modePaiement ModePaiement   @default(VIREMENT)
  statut       StatutPaiement @default(EN_ATTENTE)
  employeId    Int
  employe      Employe        @relation(fields: [employeId], references: [id])
}

model PayRun {
  id            Int           @id @default(autoincrement())
  periodeDebut  DateTime
  periodeFin    DateTime
  type          TypePayRun    @default(MENSUEL)
  statut        StatutPayRun  @default(BROUILLON)
  entrepriseId  Int
  entreprise    Entreprise    @relation(fields: [entrepriseId], references: [id])
  payslips      Payslip[]
  createdAt     DateTime      @default(now())
}

model Payslip {
  id          Int            @id @default(autoincrement())
  montantBrut Float
  deductions  Float          @default(0)
  montantNet  Float
  statut      StatutPayslip  @default(BROUILLON)
  employeId   Int
  employe     Employe        @relation(fields: [employeId], references: [id])
  payRunId    Int
  payRun      PayRun         @relation(fields: [payRunId], references: [id])
  createdAt   DateTime       @default(now())
}

model Utilisateur {
  id          Int        @id @default(autoincrement())
  nom         String
  email       String     @unique
  motDePasse  String
  role        Role       @default(ADMIN)
  entreprises Entreprise[]
}

enum Role {
  SUPER_ADMIN
  ADMIN
  CAISSIER
}

enum TypeContrat {
  JOURNALIER
  FIXE
  HONORAIRE
}

enum ModePaiement {
  ESPECES
  VIREMENT
  ORANGE_MONEY
  WAVE
}

enum StatutPaiement {
  PAYE
  PARTIEL
  EN_ATTENTE
}

enum TypePayRun {
  MENSUEL
  HEBDOMADAIRE
  JOURNALIER
}

enum StatutPayRun {
  BROUILLON
  APPROUVE
  CLOTURE
}

enum StatutPayslip {
  BROUILLON
  APPROUVE
}
EOF

echo "Création des fichiers d'authentification..."

# Créer AuthController
cat > "$BACKEND_DIR/src/controllers/AuthController.ts" << 'EOF'
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/AuthService.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export class AuthController {
  private authService: AuthService = new AuthService();

  login = async (req: Request, res: Response) => {
    try {
      const { email, motDePasse } = req.body;
      const token = await this.authService.login(email, motDePasse);
      return res.json({ token });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.authService.register(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}
EOF

# Créer AuthService
cat > "$BACKEND_DIR/src/services/AuthService.ts" << 'EOF'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/AuthRepository.js";

export class AuthService {
  private authRepository: AuthRepository = new AuthRepository();

  async login(email: string, motDePasse: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new Error("Utilisateur non trouvé");
    const isValid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isValid) throw new Error("Mot de passe incorrect");
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "secret");
    return token;
  }

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.motDePasse, 10);
    return this.authRepository.create({ ...data, motDePasse: hashedPassword });
  }
}
EOF

# Créer AuthRepository
cat > "$BACKEND_DIR/src/repositories/AuthRepository.ts" << 'EOF'
import { PrismaClient, Utilisateur } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthRepository {
  async findByEmail(email: string): Promise<Utilisateur | null> {
    return prisma.utilisateur.findUnique({
      where: { email }
    });
  }

  async create(data: any): Promise<Utilisateur> {
    return prisma.utilisateur.create({
      data
    });
  }
}
EOF

# Créer AuthRoute
cat > "$BACKEND_DIR/src/routes/AuthRoute.ts" << 'EOF'
import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

const router = Router();
const authController = new AuthController();

router.post("/login", authController.login);
router.post("/register", authController.register);

export default router;
EOF

# Créer authMiddleware
cat > "$BACKEND_DIR/src/middleware/authMiddleware.ts" << 'EOF'
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Accès refusé" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { id: number; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide" });
  }
};
EOF

# Créer multer config
cat > "$BACKEND_DIR/src/config/multer.ts" << 'EOF'
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });
EOF

# Créer errorsMessage
cat > "$BACKEND_DIR/src/utils/errorsMessage.ts" << 'EOF'
export const errorMessages = {
  USER_NOT_FOUND: "Utilisateur non trouvé",
  INVALID_CREDENTIALS: "Identifiants invalides",
  UNAUTHORIZED: "Non autorisé",
  FORBIDDEN: "Accès interdit",
  INTERNAL_ERROR: "Erreur interne du serveur"
};
EOF

# Créer tsconfig.json
cat > "$BACKEND_DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Créer tsconfig.dev.json
cat > "$BACKEND_DIR/tsconfig.dev.json" << 'EOF'
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
EOF

echo "Création des fichiers frontend de base..."

# Créer main.jsx
cat > "$FRONTEND_DIR/src/main.jsx" << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Créer App.jsx
cat > "$FRONTEND_DIR/src/App.jsx" << 'EOF'
import './App.css'

function App() {
  return (
    <>
      <h1>Application de Gestion des Salaires</h1>
    </>
  )
}

export default App
EOF

# Créer index.css
cat > "$FRONTEND_DIR/src/index.css" << 'EOF'
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
EOF

# Créer App.css
cat > "$FRONTEND_DIR/src/App.css" << 'EOF'
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
EOF

# Créer vite.config.js
cat > "$FRONTEND_DIR/vite.config.js" << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
EOF

# Créer eslint.config.js
cat > "$FRONTEND_DIR/eslint.config.js" << 'EOF'
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
EOF

# Créer postcss.config.js
cat > "$FRONTEND_DIR/postcss.config.js" << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Créer index.html
cat > "$FRONTEND_DIR/index.html" << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Application de Gestion des Salaires</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# Créer tailwind.config.js
cat > "$FRONTEND_DIR/tailwind.config.js" << 'EOF'
/** @type {import('tailwindcss').types.Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Créer .gitignore
cat > "$BACKEND_DIR/.gitignore" << 'EOF'
node_modules
dist
.env
*.log
EOF

cat > "$FRONTEND_DIR/.gitignore" << 'EOF'
node_modules
dist
.env
*.log
EOF

echo "Création des contrôleurs, services et repositories..."

# Fonction pour créer un contrôleur générique
create_controller() {
  local model=$1
  local plural=$2
  cat > "$BACKEND_DIR/src/controllers/${model}Controller.ts" << EOF
import { Request, Response } from "express";
import { ${model}Service } from "../services/${model}Service.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export class ${model}Controller {
  private ${model}Service: ${model}Service = new ${model}Service();

  getAll = async (req: Request, res: Response) => {
    try {
      const ${plural} = await this.${model}Service.getAll${plural}();
      return res.json(${plural});
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      const ${model} = await this.${model}Service.find${model}ById(id);
      if (!${model}) {
        return res.status(404).json({ error: "${model} non trouvé" });
      }
      return res.json(${model});
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const ${model} = await this.${model}Service.create${model}(req.body);
      return res.status(201).json(${model});
    } catch (error: any) {
      const errors = error.errors ?? [{ message: error.message }];
      return res.status(400).json({ errors });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      const ${model} = await this.${model}Service.update${model}(id, req.body);
      res.json(${model});
      return;
    } catch (error: any) {
      const errors = error.errors ?? [{ message: error.message }];
      return res.status(400).json({ errors });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      await this.${model}Service.delete${model}(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };
}
EOF
}

# Fonction pour créer un service générique
create_service() {
  local model=$1
  local plural=$2
  cat > "$BACKEND_DIR/src/services/${model}Service.ts" << EOF
import { PrismaClient } from "@prisma/client";
import { ${model}Repository } from "../repositories/${model}Repository.js";

const prisma = new PrismaClient();

export class ${model}Service {
  private ${model}Repository: ${model}Repository = new ${model}Repository();

  async getAll${plural}() {
    return this.${model}Repository.findAll();
  }

  async find${model}ById(id: number) {
    return this.${model}Repository.findById(id);
  }

  async create${model}(data: any) {
    return this.${model}Repository.create(data);
  }

  async update${model}(id: number, data: any) {
    return this.${model}Repository.update(id, data);
  }

  async delete${model}(id: number) {
    return this.${model}Repository.delete(id);
  }
}
EOF
}

# Fonction pour créer un repository générique
create_repository() {
  local model=$1
  local plural=$2
  cat > "$BACKEND_DIR/src/repositories/${model}Repository.ts" << EOF
import { PrismaClient, ${model} } from "@prisma/client";

const prisma = new PrismaClient();

export class ${model}Repository {
  async findAll(): Promise<${model}[]> {
    return prisma.${model}.findMany();
  }

  async findById(id: number): Promise<${model} | null> {
    return prisma.${model}.findUnique({
      where: { id }
    });
  }

  async create(data: any): Promise<${model}> {
    return prisma.${model}.create({
      data
    });
  }

  async update(id: number, data: any): Promise<${model}> {
    return prisma.${model}.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.${model}.delete({
      where: { id }
    });
  }
}
EOF
}

# Créer les contrôleurs, services et repositories pour chaque modèle
create_controller "Entreprise" "Entreprises"
create_service "Entreprise" "Entreprises"
create_repository "Entreprise" "Entreprises"

create_controller "Employe" "Employes"
create_service "Employe" "Employes"
create_repository "Employe" "Employes"

create_controller "Paiement" "Paiements"
create_service "Paiement" "Paiements"
create_repository "Paiement" "Paiements"

create_controller "PayRun" "PayRuns"
create_service "PayRun" "PayRuns"
create_repository "PayRun" "PayRuns"

create_controller "Payslip" "Payslips"
create_service "Payslip" "Payslips"
create_repository "Payslip" "Payslips"

create_controller "Utilisateur" "Utilisateurs"
create_service "Utilisateur" "Utilisateurs"
create_repository "Utilisateur" "Utilisateurs"

echo "Création des routes..."

# Créer les routes pour chaque modèle
create_routes() {
  local model=$1
  local plural=$2
  local route=$3
  cat > "$BACKEND_DIR/src/routes/${model}Route.ts" << EOF
import { Router } from "express";
import { ${model}Controller } from "../controllers/${model}Controller.js";

const router = Router();
const ${model}Controller = new ${model}Controller();

router.get("/${route}", ${model}Controller.getAll);
router.get("/${route}/:id", ${model}Controller.findById);
router.post("/${route}", ${model}Controller.create);
router.put("/${route}/:id", ${model}Controller.update);
router.delete("/${route}/:id", ${model}Controller.delete);

export default router;
EOF
}

create_routes "Entreprise" "Entreprises" "entreprises"
create_routes "Employe" "Employes" "employes"
create_routes "Paiement" "Paiements" "paiements"
create_routes "PayRun" "PayRuns" "payruns"
create_routes "Payslip" "Payslips" "payslips"
create_routes "Utilisateur" "Utilisateurs" "utilisateurs"

echo "Modification du fichier index.ts principal..."

# Modifier le fichier index.ts pour inclure les nouvelles routes
cat > "$BACKEND_DIR/src/index.ts" << 'EOF'
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import authRoute from "./routes/AuthRoute.js";
import entrepriseRoute from "./routes/EntrepriseRoute.js";
import employeRoute from "./routes/EmployeRoute.js";
import paiementRoute from "./routes/PaiementRoute.js";
import payRunRoute from "./routes/PayRunRoute.js";
import payslipRoute from "./routes/PayslipRoute.js";
import utilisateurRoute from "./routes/UtilisateurRoute.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestion des Salaires",
      version: "1.0.0",
      description: "API pour la gestion des salaires multi-entreprises",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api/auth", authRoute);
app.use("/api", entrepriseRoute);
app.use("/api", employeRoute);
app.use("/api", paiementRoute);
app.use("/api", payRunRoute);
app.use("/api", payslipRoute);
app.use("/api", utilisateurRoute);

// Socket.io
io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté");

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});

export { io };
export const emitNotification = (userId: number, event: string, data: any) => {
  io.emit(`notification-${userId}`, { event, data });
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Documentation API disponible sur http://localhost:${PORT}/api-docs`);
});
EOF

echo "Création du seed pour les données de test..."

# Créer un seed de base
cat > "$BACKEND_DIR/prisma/seed.js" << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Créer des entreprises
  const entreprise1 = await prisma.entreprise.create({
    data: {
      nom: "TechCorp",
      adresse: "123 Rue de la Technologie",
      secteur: "Technologie"
    }
  });

  const entreprise2 = await prisma.entreprise.create({
    data: {
      nom: "FinancePlus",
      adresse: "456 Avenue des Finances",
      secteur: "Finance"
    }
  });

  // Créer des utilisateurs
  const hashedPassword = await bcrypt.hash("password123", 10);

  const superAdmin = await prisma.utilisateur.create({
    data: {
      nom: "Super Admin",
      email: "superadmin@salary.com",
      motDePasse: hashedPassword,
      role: "SUPER_ADMIN",
      entreprises: {
        connect: [{ id: entreprise1.id }, { id: entreprise2.id }]
      }
    }
  });

  const admin = await prisma.utilisateur.create({
    data: {
      nom: "Admin Tech",
      email: "admin@techcorp.com",
      motDePasse: hashedPassword,
      role: "ADMIN",
      entreprises: {
        connect: [{ id: entreprise1.id }]
      }
    }
  });

  const caissier = await prisma.utilisateur.create({
    data: {
      nom: "Caissier Finance",
      email: "caissier@financeplus.com",
      motDePasse: hashedPassword,
      role: "CAISSIER",
      entreprises: {
        connect: [{ id: entreprise2.id }]
      }
    }
  });

  // Créer des employés
  const employe1 = await prisma.employe.create({
    data: {
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@techcorp.com",
      poste: "Développeur",
      salaire: 3000.00,
      typeContrat: "FIXE",
      coordonneesBancaires: "IBAN: FR123456789",
      dateEmbauche: new Date("2023-01-15"),
      entrepriseId: entreprise1.id
    }
  });

  const employe2 = await prisma.employe.create({
    data: {
      nom: "Martin",
      prenom: "Marie",
      email: "marie.martin@financeplus.com",
      poste: "Comptable",
      salaire: 2500.00,
      typeContrat: "FIXE",
      coordonneesBancaires: "IBAN: FR987654321",
      dateEmbauche: new Date("2023-03-01"),
      entrepriseId: entreprise2.id
    }
  });

  // Créer un PayRun
  const payRun1 = await prisma.payRun.create({
    data: {
      periodeDebut: new Date("2024-01-01"),
      periodeFin: new Date("2024-01-31"),
      type: "MENSUEL",
      statut: "APPROUVE",
      entrepriseId: entreprise1.id
    }
  });

  // Créer des Payslips
  const payslip1 = await prisma.payslip.create({
    data: {
      montantBrut: 3000.00,
      deductions: 300.00,
      montantNet: 2700.00,
      statut: "APPROUVE",
      employeId: employe1.id,
      payRunId: payRun1.id
    }
  });

  // Créer des Paiements
  await prisma.paiement.create({
    data: {
      montant: 2700.00,
      datePaiement: new Date("2024-01-31"),
      modePaiement: "VIREMENT",
      statut: "PAYE",
      employeId: employe1.id
    }
  });

  await prisma.paiement.create({
    data: {
      montant: 2500.00,
      datePaiement: new Date("2024-01-31"),
      modePaiement: "ESPECES",
      statut: "PAYE",
      employeId: employe2.id
    }
  });

  console.log("Données de seed créées avec succès");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

echo "Modification du frontend..."

# Modifier le titre dans index.html
sed -i 's/Todo List/Application de Gestion des Salaires/g' "$FRONTEND_DIR/index.html"

# Modifier le titre dans App.jsx
sed -i 's/Todo List/Application de Gestion des Salaires/g' "$FRONTEND_DIR/src/App.jsx"

echo "Création des scripts de démarrage..."

# Créer un script de démarrage pour le projet complet
cat > "start.sh" << 'EOF'
#!/bin/bash

echo "Démarrage de l'application de gestion des salaires..."

# Démarrer le backend
echo "Configuration de la base de données..."
cd backend && ./setup-mysql.sh && npm install && npm run migrate && npm run seed && npm run dev &
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
EOF

chmod +x "start.sh"

echo "Création du script de configuration MySQL..."

# Créer setup-mysql.sh
cat > "$BACKEND_DIR/setup-mysql.sh" << EOF
#!/bin/bash

# Script de configuration MySQL pour l'application de gestion des salaires

DB_NAME="${PROJECT_NAME//-/_}"
DB_USER="app_user"
DB_PASS="app_pass"

echo "Configuration de la base de données MySQL..."

# Créer la base de données
mysql -u root -p << EOF_MYSQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF_MYSQL

if [ \$? -eq 0 ]; then
    echo "Base de données '$DB_NAME' créée avec succès !"
    echo "Utilisateur: $DB_USER"
    echo "Mot de passe: $DB_PASS"
else
    echo "Erreur lors de la création de la base de données."
    echo "Assurez-vous que MySQL est installé et que vous avez les droits d'administrateur."
    exit 1
fi
EOF

chmod +x "$BACKEND_DIR/setup-mysql.sh"

echo "Création du README..."

cat > "README.md" << 'EOF'
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
EOF

echo "Projet de gestion des salaires créé avec succès !"
echo "Pour démarrer: cd $PROJECT_NAME && ./start.sh"

chmod +x create-salary-management-project.sh
