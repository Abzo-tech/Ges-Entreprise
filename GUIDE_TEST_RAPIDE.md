# 🚀 Guide de Test Rapide - Correction Logo NULL

## ⚡ Test en 5 Minutes

### Étape 1 : Démarrer le Backend (30 secondes)

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
npm start
```

**Attendez de voir** : `Server running on port 3000` ✅

---

### Étape 2 : Ouvrir l'Application (10 secondes)

Ouvrez votre navigateur : **http://localhost:5173** (dev) ou **http://localhost:3000** (prod)

---

### Étape 3 : Créer une Entreprise avec Logo (2 minutes)

1. **Cliquez** sur le bouton **"Ajouter une entreprise"**

2. **Remplissez** le formulaire :

   - **Nom** : Test Logo Fix
   - **Adresse** : 123 Rue Test
   - **Secteur** : Technologie

3. **Sélectionnez** un logo :

   - Cliquez sur la zone de logo
   - Choisissez un fichier **JPEG** ou **PNG** (< 5MB)
   - Vous devriez voir un aperçu du logo ✅

4. **Cliquez** sur **"Créer"**

5. **Vérifiez** :
   - Le formulaire se ferme ✅
   - La liste se rafraîchit ✅
   - Le logo s'affiche dans la carte de l'entreprise ✅

---

### Étape 4 : Vérifier les Logs (30 secondes)

#### Console du Navigateur (F12)

Vous devriez voir :

```
Uploading logo for entreprise: 11
Logo uploaded successfully
```

#### Console du Backend

Vous devriez voir :

```
=== UPLOAD LOGO REQUEST ===
File: { fieldname: 'logo', originalname: 'test.jpg', ... }
Params: { entrepriseId: '11' }
Saving logo for entreprise: 11
Logo saved successfully: uploads/logos/11-1234567890.jpg
Entreprise updated with logo path: uploads/logos/11-1234567890.jpg
```

---

### Étape 5 : Vérifier en Base de Données (1 minute)

#### Option A : Avec un client SQL (DBeaver, TablePlus, etc.)

```sql
SELECT id, nom, logo
FROM entreprise
ORDER BY id DESC
LIMIT 1;
```

**Résultat attendu** :

```
id | nom            | logo
11 | Test Logo Fix  | uploads/logos/11-1234567890.jpg
```

#### Option B : Avec SQLite CLI

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
sqlite3 prisma/dev.db "SELECT id, nom, logo FROM entreprise ORDER BY id DESC LIMIT 1;"
```

---

## ✅ Critères de Succès

| Vérification                           | Statut |
| -------------------------------------- | ------ |
| Logo s'affiche dans l'interface        | ⬜     |
| Logs "Logo uploaded successfully"      | ⬜     |
| Logs backend "Entreprise updated"      | ⬜     |
| Champ `logo` en BDD contient le chemin | ⬜     |
| Logo persiste après rechargement (F5)  | ⬜     |

**Si tous les critères sont cochés** : ✅ **Le bug est corrigé !**

---

## ❌ Que Faire en Cas de Problème ?

### Problème 1 : Le logo ne s'affiche pas

**Vérifiez** :

1. Console navigateur : Y a-t-il des erreurs ?
2. Console backend : Le fichier a-t-il été uploadé ?
3. Répertoire `backend/uploads/logos/` : Le fichier existe-t-il ?

**Solution** :

```bash
# Vérifier les permissions
ls -la /home/abzo/Downloads/ges-entreprises/backend/uploads/logos/

# Vérifier le dernier fichier uploadé
ls -lt /home/abzo/Downloads/ges-entreprises/backend/uploads/logos/ | head -5
```

---

### Problème 2 : Le champ `logo` est NULL en BDD

**Vérifiez** :

1. Les logs backend : Y a-t-il "Entreprise updated with logo path" ?
2. Le FileController : La mise à jour BDD est-elle présente ?

**Solution** :

```bash
# Vérifier le code du FileController
grep -A 5 "entrepriseRepository.update" /home/abzo/Downloads/ges-entreprises/backend/src/controllers/FileController.ts
```

---

### Problème 3 : Erreur "Format non autorisé"

**Vérifiez** :

- Le fichier est bien JPEG ou PNG
- Le fichier fait moins de 5MB

**Formats acceptés** :

- ✅ `.jpg`, `.jpeg`, `.png`
- ❌ `.gif`, `.webp`, `.svg`, `.bmp`

---

### Problème 4 : Le backend ne démarre pas

**Vérifiez** :

```bash
# Recompiler le backend
cd /home/abzo/Downloads/ges-entreprises/backend
npm run build

# Vérifier les erreurs
npm start
```

---

## 🔍 Tests Supplémentaires (Optionnel)

### Test 1 : Rejet de formats non autorisés

1. Essayez d'uploader un fichier **GIF**
2. **Attendu** : Message d'erreur "Format non autorisé"

### Test 2 : Rejet de fichiers trop gros

1. Essayez d'uploader un fichier > 5MB
2. **Attendu** : Message d'erreur "Le fichier ne doit pas dépasser 5MB"

### Test 3 : Modification d'entreprise

1. Cliquez sur "Modifier" sur une entreprise existante
2. Changez le logo
3. Cliquez sur "Modifier"
4. **Attendu** : Le nouveau logo s'affiche

### Test 4 : Persistance après rechargement

1. Créez une entreprise avec logo
2. Rechargez la page (F5)
3. **Attendu** : Le logo est toujours affiché

---

## 📊 Commandes SQL Utiles

```sql
-- Voir toutes les entreprises avec logo
SELECT id, nom, logo FROM entreprise WHERE logo IS NOT NULL;

-- Compter les entreprises avec/sans logo
SELECT
    COUNT(*) as total,
    COUNT(logo) as avec_logo,
    COUNT(*) - COUNT(logo) as sans_logo
FROM entreprise;

-- Dernière entreprise créée
SELECT id, nom, logo, created_at
FROM entreprise
ORDER BY created_at DESC
LIMIT 1;
```

---

## 🎯 Résultat Attendu

Après avoir suivi ce guide, vous devriez avoir :

1. ✅ Une entreprise créée avec un logo
2. ✅ Le logo visible dans l'interface
3. ✅ Le chemin du logo enregistré en BDD
4. ✅ Le fichier physique présent dans `uploads/logos/`
5. ✅ Les logs confirmant l'upload et la mise à jour BDD

---

## 📞 Besoin d'Aide ?

Si le test échoue, consultez :

1. **CORRECTION_LOGO_NULL.md** - Documentation technique complète
2. **test-logo-database.sql** - Requêtes SQL de diagnostic
3. **test-logo-fix.sh** - Script de vérification automatique

Ou exécutez le script de vérification :

```bash
/home/abzo/Downloads/ges-entreprises/test-logo-fix.sh
```

---

**Bonne chance ! 🍀**
