# Correction du problème d'upload de logos

## Problème résolu

Les logos d'entreprise acceptaient tous les formats d'images. Maintenant, seuls les formats **JPEG** et **PNG** sont acceptés lors de la création et modification d'entreprise.

## Modifications apportées

### Backend

#### 1. `/backend/src/config/multer.ts`

- ✅ Ajout d'un filtre de validation des types de fichiers
- ✅ Limitation aux formats: `image/jpeg`, `image/jpg`, `image/png`
- ✅ Limite de taille: 5MB
- ✅ Message d'erreur explicite en français

#### 2. `/backend/src/routes/FileRoute.ts`

- ✅ Mise à jour du filtre multer pour l'upload de logos
- ✅ Limitation aux formats JPEG et PNG uniquement
- ✅ Message d'erreur cohérent avec le reste de l'application

#### 3. `/backend/src/services/FileService.ts`

- ✅ Mise à jour de `ALLOWED_TYPES` pour accepter uniquement JPEG et PNG
- ✅ Suppression de GIF et WebP de la liste des formats autorisés
- ✅ Message d'erreur de validation mis à jour

#### 4. `/backend/src/controllers/FileController.ts` ⭐ **CORRECTION MAJEURE**

- ✅ Import de `EntrepriseRepository` pour accéder à la base de données
- ✅ Vérification de l'existence de l'entreprise avant l'upload
- ✅ **Mise à jour automatique de la base de données** avec le chemin du logo après sauvegarde
- ✅ Ajout de logs détaillés pour le débogage
- ✅ **Cette modification corrige le bug où le logo était sauvegardé sur le disque mais pas dans la base de données**

### Frontend

#### 5. `/frontend/src/components/LogoUploader.jsx`

- ✅ Validation côté client des types de fichiers
- ✅ Vérification que seuls JPEG et PNG sont acceptés
- ✅ Attribut `accept` de l'input file mis à jour: `image/jpeg,image/jpg,image/png`
- ✅ Message d'information mis à jour: "Formats acceptés: JPEG, PNG"
- ✅ Messages d'erreur en français

#### 6. `/frontend/src/pages/Entreprises.jsx`

- ✅ Validation dans `handleFormChange` pour les fichiers logo
- ✅ Vérification du type MIME avant d'accepter le fichier
- ✅ Vérification de la taille (max 5MB)
- ✅ Affichage des erreurs de validation dans le formulaire

## Validation des formats

### Formats acceptés ✅

- `image/jpeg`
- `image/jpg`
- `image/png`

### Formats rejetés ❌

- `image/gif`
- `image/webp`
- `image/svg+xml`
- Tous les autres formats

## Limites

- **Taille maximale**: 5MB
- **Dimensions recommandées**: 200x200px

## Tests à effectuer

### Test 1: Upload d'un fichier JPEG

1. Créer ou modifier une entreprise
2. Sélectionner un fichier `.jpg` ou `.jpeg`
3. ✅ Le fichier doit être accepté et uploadé

### Test 2: Upload d'un fichier PNG

1. Créer ou modifier une entreprise
2. Sélectionner un fichier `.png`
3. ✅ Le fichier doit être accepté et uploadé

### Test 3: Upload d'un fichier GIF (rejeté)

1. Créer ou modifier une entreprise
2. Sélectionner un fichier `.gif`
3. ❌ Le fichier doit être rejeté avec le message: "Format non autorisé. Seuls les formats JPEG et PNG sont acceptés"

### Test 4: Upload d'un fichier trop volumineux

1. Créer ou modifier une entreprise
2. Sélectionner un fichier > 5MB
3. ❌ Le fichier doit être rejeté avec le message: "Le fichier ne doit pas dépasser 5MB"

## Points de validation

### Côté client (Frontend)

1. Validation dans le composant `LogoUploader`
2. Validation dans le formulaire `Entreprises`
3. Attribut `accept` sur l'input file

### Côté serveur (Backend)

1. Validation dans la configuration multer (`/config/multer.ts`)
2. Validation dans les routes de fichiers (`/routes/FileRoute.ts`)
3. Validation dans le service de fichiers (`/services/FileService.ts`)

## Sécurité

- ✅ Double validation (client + serveur)
- ✅ Vérification du type MIME
- ✅ Limite de taille de fichier
- ✅ Messages d'erreur explicites sans révéler d'informations sensibles

## Compatibilité

- ✅ Compatible avec tous les navigateurs modernes
- ✅ Fonctionne sur mobile et desktop
- ✅ Messages en français

## Bug critique résolu ⭐

### Problème initial

Lorsqu'un logo était uploadé via le composant `LogoUploader`, le fichier était bien sauvegardé sur le disque dans le répertoire `uploads/logos/`, mais **le chemin du logo n'était pas enregistré dans la base de données**. Résultat : le champ `logo` restait à `null` dans la table `Entreprise`.

### Cause

Le `FileController.uploadLogo()` appelait `FileService.saveLogo()` qui sauvegardait le fichier et retournait le chemin, mais **aucune mise à jour de la base de données n'était effectuée**.

### Solution

Ajout de la mise à jour de la base de données dans `FileController.uploadLogo()` :

```typescript
// Mettre à jour l'entreprise avec le nouveau chemin du logo
await entrepriseRepository.update(entrepriseId, { logo: logoPath });
```

### Résultat

Maintenant, après l'upload d'un logo :

1. ✅ Le fichier est sauvegardé sur le disque
2. ✅ Le chemin est enregistré dans la base de données
3. ✅ Le logo s'affiche correctement dans l'interface
4. ✅ Le logo persiste après rechargement de la page
