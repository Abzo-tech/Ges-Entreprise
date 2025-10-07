# 🧪 Test du Bug Logo - À FAIRE MAINTENANT

## ✅ Préparation

J'ai ajouté des **logs détaillés** dans le code frontend pour tracer exactement ce qui se passe lors de l'upload du logo.

## 📋 Procédure de Test (5 minutes)

### Étape 1 : Ouvrir la Console du Navigateur

1. Ouvrez http://localhost:5173
2. Appuyez sur **F12** pour ouvrir les outils de développement
3. Allez dans l'onglet **Console**
4. Gardez cette console ouverte pendant tout le test

### Étape 2 : Créer une Entreprise avec Logo

1. Connectez-vous avec un compte **SUPER_ADMIN**
2. Cliquez sur **"Ajouter une entreprise"**
3. Remplissez le formulaire :
   - **Nom** : Test Logo Bug
   - **Adresse** : 123 Rue Test
   - **Secteur** : Test
   - **Logo** : Sélectionnez une image (JPEG ou PNG)
4. Cliquez sur **"Enregistrer"**

### Étape 3 : Observer les Logs

Dans la console du navigateur, vous devriez voir ces logs **dans cet ordre** :

```
📝 [FORM SUBMIT] Starting form submission
📝 [FORM SUBMIT] FormData logo: File: nom-du-fichier.jpg
✨ [FORM SUBMIT] Entreprise created, ID: XX
🔵 [LOGO UPLOAD] Starting upload for entreprise: XX
🔵 [LOGO UPLOAD] File details: { name: "...", size: ..., type: "..." }
✅ [LOGO UPLOAD] Upload successful! Response: { ... }
```

### Étape 4 : Vérifier la Base de Données

Exécutez cette commande dans un terminal :

```bash
cd /home/abzo/Downloads/ges-entreprises
node backend/check-logos.js
```

Cherchez l'entreprise "Test Logo Bug" et vérifiez que le champ **Logo** n'est **PAS NULL**.

---

## 🔍 Diagnostic selon les Logs

### Cas 1 : Vous voyez "⚠️ [LOGO UPLOAD] Skipped"

**Problème** : Le logo n'est pas dans `formData` ou l'ID est manquant

**Causes possibles** :

- Le composant `LogoUploader` ne stocke pas le fichier correctement
- Le callback `onLogoChange` ne fonctionne pas

**Solution** : Vérifier le composant `LogoUploader.jsx`

### Cas 2 : Vous voyez "❌ [LOGO UPLOAD] Upload failed"

**Problème** : L'API d'upload retourne une erreur

**Causes possibles** :

- Problème de permissions sur le dossier `/backend/uploads/logos/`
- Erreur dans le `FileController`
- Problème d'authentification

**Solution** : Regarder les détails de l'erreur dans les logs

### Cas 3 : Vous voyez "✅ [LOGO UPLOAD] Upload successful" MAIS le logo est NULL en BDD

**Problème** : Le fichier est sauvegardé mais la BDD n'est pas mise à jour

**Causes possibles** :

- Problème dans `FileController.ts` ligne 44-50
- Transaction Prisma non commitée
- Connexion BDD perdue

**Solution** : Vérifier les logs du backend (terminal où `npm run dev` tourne)

### Cas 4 : Vous NE voyez AUCUN log

**Problème** : Le code n'est pas exécuté

**Causes possibles** :

- Le frontend n'a pas été recompilé
- Vous regardez la mauvaise console
- Le formulaire ne se soumet pas

**Solution** : Rafraîchir la page (Ctrl+F5) et réessayer

---

## 📊 Logs Backend à Vérifier

Dans le terminal où `npm run dev` (backend) tourne, vous devriez voir :

```
Updating entreprise in database...
Entreprise updated successfully: { id: XX, nom: 'Test Logo Bug', logo: '/uploads/logos/...' }
```

Si vous ne voyez **PAS** ces logs, le problème est dans le backend.

---

## 🎯 Résultat Attendu

### ✅ Test Réussi

- [ ] Logs frontend montrent "✅ [LOGO UPLOAD] Upload successful"
- [ ] Logs backend montrent "Entreprise updated successfully"
- [ ] `check-logos.js` montre que le logo n'est PAS NULL
- [ ] Le logo s'affiche dans l'interface

### ❌ Test Échoué

Si l'un des points ci-dessus échoue :

1. **Copiez TOUS les logs** (frontend + backend)
2. **Exécutez** `node backend/check-logos.js` et copiez le résultat
3. **Vérifiez** si le fichier existe dans `/backend/uploads/logos/`
4. **Partagez** ces informations pour diagnostic approfondi

---

## 🚀 Commandes Rapides

```bash
# Vérifier les logos en BDD
node backend/check-logos.js

# Vérifier les fichiers sur le disque
ls -lh backend/uploads/logos/

# Redémarrer le backend (si nécessaire)
cd backend && npm run dev

# Redémarrer le frontend (si nécessaire)
cd frontend && npm run dev
```

---

## 💡 Conseils

1. **Gardez la console ouverte** pendant tout le test
2. **Ne fermez pas le formulaire** avant de voir les logs
3. **Utilisez une petite image** (< 1 MB) pour le test
4. **Testez avec un fichier JPEG** d'abord (plus compatible)

---

**🎯 FAITES LE TEST MAINTENANT ET PARTAGEZ LES RÉSULTATS !**
