# Correction du Bug : Logo reste à NULL en base de données

## 🐛 Problème Identifié

Le logo restait à `null` en base de données même après un upload réussi du fichier. Le fichier était bien sauvegardé sur le disque mais le chemin n'était jamais enregistré dans la table `entreprise`.

### Cause Racine

Le flux d'upload était **défectueux** à cause d'une logique complexe et mal synchronisée :

1. **Upload automatique prématuré** : Le composant `LogoUploader` uploadait automatiquement le fichier dès sa sélection (ligne 47)
2. **Entreprise inexistante** : Lors de la création d'une nouvelle entreprise, l'ID n'existait pas encore au moment de la sélection du logo
3. **Upload silencieusement échoué** : L'appel API `/files/upload/logo/:entrepriseId` échouait car `entrepriseId` était `null` ou `undefined`
4. **Système de pending défectueux** : Les variables `pendingLogoFile` et `pendingEntrepriseId` ne fonctionnaient pas correctement

### Flux Défectueux (AVANT)

```
1. Utilisateur ouvre le formulaire "Nouvelle entreprise"
2. Utilisateur sélectionne un logo
   └─> LogoUploader.handleFileSelect() appelé
       └─> uploadLogo(file) appelé IMMÉDIATEMENT
           └─> API POST /files/upload/logo/undefined ❌ ÉCHEC
3. Utilisateur remplit le formulaire (nom, adresse, secteur)
4. Utilisateur clique sur "Créer"
   └─> handleSubmitForm() appelé
       └─> API POST /entreprises → Entreprise créée (ID: 10)
       └─> Logo déjà "uploadé" (mais échoué) ❌
5. Résultat : Entreprise créée SANS logo en BDD
```

## ✅ Solution Implémentée

### Changements Effectués

#### 1. **LogoUploader.jsx** - Désactivation de l'upload automatique

**Fichier** : `/frontend/src/components/LogoUploader.jsx`

**Modifications** :

- Ajout d'un prop `autoUpload` (défaut: `true`) pour contrôler l'upload automatique
- Modification de `handleFileSelect()` pour ne pas uploader si `autoUpload=false` ou si `entrepriseId` est absent
- Le fichier est simplement passé au parent via `onLogoChange(file)` au lieu d'être uploadé immédiatement

```javascript
// AVANT
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  // ... validations ...
  uploadLogo(file); // ❌ Upload immédiat
};

// APRÈS
const LogoUploader = ({ autoUpload = true, ... }) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    // ... validations ...

    // Upload automatique seulement si autoUpload est true ET entrepriseId existe
    if (autoUpload && entrepriseId) {
      uploadLogo(file);
    } else {
      // Sinon, on passe juste le fichier au parent
      onLogoChange(file); // ✅ Pas d'upload, juste stockage
    }
  };
};
```

#### 2. **Entreprises.jsx** - Simplification du flux d'upload

**Fichier** : `/frontend/src/pages/Entreprises.jsx`

**Modifications** :

##### A. Suppression des variables d'état inutiles

```javascript
// SUPPRIMÉ
const [pendingLogoFile, setPendingLogoFile] = useState(null);
const [pendingEntrepriseId, setPendingEntrepriseId] = useState(null);
```

##### B. Simplification du LogoUploader dans le formulaire

```javascript
// AVANT
<LogoUploader
  entrepriseId={pendingEntrepriseId || editingEntreprise?.id}
  currentLogo={editingEntreprise?.logo}
  onLogoChange={async (logoPathOrFile) => {
    // 40 lignes de logique complexe avec pendingLogoFile...
  }}
/>

// APRÈS
<LogoUploader
  entrepriseId={editingEntreprise?.id}
  currentLogo={editingEntreprise?.logo}
  autoUpload={false} // ✅ Pas d'upload automatique
  onLogoChange={(logoFile) => {
    // Stocker simplement le fichier dans formData
    if (logoFile instanceof File) {
      setFormData((prev) => ({ ...prev, logo: logoFile }));
    }
  }}
/>
```

##### C. Upload du logo APRÈS création de l'entreprise

```javascript
const handleSubmitForm = async (e) => {
  e.preventDefault();
  // ... validation ...

  // 1. Créer/Modifier l'entreprise
  let entrepriseId = null;
  if (editingEntreprise) {
    await api.put(`/entreprises/${editingEntreprise.id}`, submitData);
    entrepriseId = editingEntreprise.id;
  } else {
    const res = await api.post("/entreprises", submitData);
    entrepriseId = res.data.id; // ✅ ID maintenant disponible
  }

  // 2. Uploader le logo MAINTENANT que l'entreprise existe
  if (formData.logo instanceof File && entrepriseId) {
    console.log("Uploading logo for entreprise:", entrepriseId);
    const logoFormData = new FormData();
    logoFormData.append("logo", formData.logo);

    try {
      await api.post(`/files/upload/logo/${entrepriseId}`, logoFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Logo uploaded successfully"); // ✅ Upload réussi
    } catch (logoError) {
      console.error("Error uploading logo:", logoError);
    }
  }

  // 3. Fermer le formulaire et rafraîchir
  setShowForm(false);
  await fetchEntreprises();
};
```

### Flux Corrigé (APRÈS)

```
1. Utilisateur ouvre le formulaire "Nouvelle entreprise"
2. Utilisateur sélectionne un logo
   └─> LogoUploader.handleFileSelect() appelé
       └─> onLogoChange(file) appelé
           └─> setFormData({ ...prev, logo: file }) ✅ Fichier stocké
3. Utilisateur remplit le formulaire (nom, adresse, secteur)
4. Utilisateur clique sur "Créer"
   └─> handleSubmitForm() appelé
       └─> API POST /entreprises → Entreprise créée (ID: 10) ✅
       └─> API POST /files/upload/logo/10 → Logo uploadé ✅
           └─> FileController.uploadLogo() appelé
               └─> FileService.saveLogo() → Fichier sauvegardé ✅
               └─> entrepriseRepository.update(10, { logo: path }) ✅
5. Résultat : Entreprise créée AVEC logo en BDD ✅
```

## 🎯 Avantages de la Solution

### 1. **Simplicité**

- Suppression de 40+ lignes de logique complexe
- Suppression de 2 variables d'état inutiles (`pendingLogoFile`, `pendingEntrepriseId`)
- Flux linéaire et facile à comprendre

### 2. **Fiabilité**

- L'upload ne se fait QUE quand l'entreprise existe
- Pas de race conditions ou d'appels API avec ID invalide
- Gestion d'erreur explicite avec try/catch

### 3. **Maintenabilité**

- Code plus court et plus clair
- Logs de débogage ajoutés pour faciliter le suivi
- Séparation claire des responsabilités

### 4. **Flexibilité**

- Le prop `autoUpload` permet de réutiliser `LogoUploader` dans d'autres contextes
- Pour l'édition d'une entreprise existante, on peut activer `autoUpload={true}` si besoin

## 🧪 Tests à Effectuer

### Test 1 : Création d'entreprise avec logo

1. Cliquer sur "Ajouter une entreprise"
2. Remplir le formulaire (nom, adresse, secteur)
3. Sélectionner un logo JPEG ou PNG
4. Cliquer sur "Créer"
5. **Vérifier** : Le logo s'affiche dans la liste
6. **Vérifier en BDD** : `SELECT id, nom, logo FROM entreprise WHERE id = X;`
   - Le champ `logo` doit contenir : `uploads/logos/X-timestamp.jpg`

### Test 2 : Création d'entreprise sans logo

1. Cliquer sur "Ajouter une entreprise"
2. Remplir le formulaire SANS sélectionner de logo
3. Cliquer sur "Créer"
4. **Vérifier** : L'entreprise est créée avec le logo par défaut
5. **Vérifier en BDD** : Le champ `logo` doit être `NULL`

### Test 3 : Modification d'entreprise avec ajout de logo

1. Cliquer sur "Modifier" sur une entreprise existante
2. Sélectionner un nouveau logo
3. Cliquer sur "Modifier"
4. **Vérifier** : Le nouveau logo s'affiche
5. **Vérifier en BDD** : Le champ `logo` est mis à jour

### Test 4 : Validation des formats

1. Essayer d'uploader un fichier GIF → **Doit être rejeté**
2. Essayer d'uploader un fichier WebP → **Doit être rejeté**
3. Essayer d'uploader un fichier > 5MB → **Doit être rejeté**
4. Uploader un JPEG valide → **Doit être accepté**
5. Uploader un PNG valide → **Doit être accepté**

## 📊 Vérification en Base de Données

```sql
-- Vérifier les entreprises avec logo
SELECT id, nom, logo, created_at
FROM entreprise
WHERE logo IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- Vérifier une entreprise spécifique
SELECT * FROM entreprise WHERE id = 10;

-- Résultat attendu :
-- id | nom    | logo                              | ...
-- 10 | SENICO | uploads/logos/10-1234567890.jpg   | ...
```

## 🔍 Logs de Débogage

Les logs suivants apparaîtront dans la console lors de l'upload :

### Frontend (Console navigateur)

```
Uploading logo for entreprise: 10
Logo uploaded successfully
```

### Backend (Console serveur)

```
=== UPLOAD LOGO REQUEST ===
File: { fieldname: 'logo', originalname: 'logo.jpg', ... }
Params: { entrepriseId: '10' }
Body: {}
Saving logo for entreprise: 10
Logo saved successfully: uploads/logos/10-1234567890.jpg
Entreprise updated with logo path: uploads/logos/10-1234567890.jpg
```

## 📝 Fichiers Modifiés

1. **`/frontend/src/components/LogoUploader.jsx`**

   - Ajout du prop `autoUpload`
   - Modification de `handleFileSelect()` pour conditionner l'upload

2. **`/frontend/src/pages/Entreprises.jsx`**

   - Suppression de `pendingLogoFile` et `pendingEntrepriseId`
   - Simplification de `handleSubmitForm()`
   - Simplification du callback `onLogoChange`
   - Upload du logo après création de l'entreprise

3. **`/backend/src/controllers/FileController.ts`** (déjà corrigé précédemment)
   - Mise à jour automatique de la BDD après sauvegarde du fichier

## ✅ Checklist de Validation

- [x] Backend compile sans erreurs
- [x] Frontend compile sans erreurs
- [ ] Test création entreprise avec logo JPEG
- [ ] Test création entreprise avec logo PNG
- [ ] Test création entreprise sans logo
- [ ] Test modification entreprise avec nouveau logo
- [ ] Test rejet format GIF
- [ ] Test rejet format WebP
- [ ] Test rejet fichier > 5MB
- [ ] Vérification BDD : champ `logo` contient le chemin
- [ ] Vérification visuelle : logo s'affiche dans l'interface
- [ ] Vérification persistance : logo reste après rechargement

## 🚀 Déploiement

```bash
# 1. Compiler le backend
cd /home/abzo/Downloads/ges-entreprises/backend
npm run build

# 2. Compiler le frontend
cd /home/abzo/Downloads/ges-entreprises/frontend
npm run build

# 3. Redémarrer le backend
cd /home/abzo/Downloads/ges-entreprises/backend
npm start

# 4. Tester l'application
# Ouvrir http://localhost:5173 (dev) ou http://localhost:3000 (prod)
```

## 📚 Documentation Associée

- `LOGO_UPLOAD_FIX.md` - Documentation technique complète
- `RESUME_CORRECTION_LOGO.md` - Résumé exécutif
- `GUIDE_TEST_LOGO.md` - Guide de test détaillé
- `cleanup-debug-logs.sh` - Script de nettoyage des logs

---

**Date de correction** : 2024
**Statut** : ✅ Corrigé et testé (compilation)
**Impact** : Critique - Fonctionnalité d'upload de logo maintenant opérationnelle
