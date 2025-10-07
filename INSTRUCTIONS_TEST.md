# 🎯 Instructions de Test - Bug Logo NULL

## ⚡ Action Immédiate Requise

Le code a été corrigé et vérifié. Il faut maintenant **tester manuellement** pour confirmer que le bug est résolu.

## 📋 Test Rapide (5 minutes)

### Étape 1 : Ouvrir l'Application

```
URL : http://localhost:5173
```

### Étape 2 : Se Connecter

- Utiliser un compte avec le rôle **SUPER_ADMIN**

### Étape 3 : Créer une Entreprise avec Logo

1. Cliquer sur **"Ajouter une entreprise"**
2. Remplir :
   - **Nom** : Test Logo 2024
   - **Adresse** : 123 Test Street
   - **Secteur** : Test
3. **IMPORTANT** : Cliquer sur la zone de logo et sélectionner une image (JPEG ou PNG)
4. Vérifier que l'aperçu du logo s'affiche
5. Cliquer sur **"Enregistrer"**

### Étape 4 : Vérifier le Résultat

#### Option A : Via l'Interface

- Le logo doit s'afficher dans la carte de l'entreprise créée

#### Option B : Via la Base de Données

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
node check-logos.js
```

**Résultat attendu** : La nouvelle entreprise doit avoir un logo (pas NULL)

## 🔍 Logs à Surveiller

### Console Backend (Terminal où `npm run dev` tourne)

Vous devriez voir :

```
=== UPLOAD LOGO REQUEST ===
Saving logo for entreprise: XX
Logo saved successfully: /uploads/logos/XX_uuid.jpeg
Updating entreprise in database...
Entreprise updated successfully: { id: XX, nom: 'Test Logo 2024', logo: '/uploads/logos/XX_uuid.jpeg' }
```

### Console Frontend (F12 dans le navigateur)

Vous devriez voir :

```
Uploading logo for entreprise: XX
Logo uploaded successfully
```

## ✅ Critères de Succès

- [ ] Le fichier logo existe dans `/backend/uploads/logos/`
- [ ] Le champ `logo` en BDD n'est **PAS NULL**
- [ ] Le logo s'affiche dans l'interface
- [ ] Les logs backend montrent "Entreprise updated successfully"

## ❌ Si le Test Échoue

### 1. Vérifier les Logs

- **Backend** : Chercher des erreurs dans la console
- **Frontend** : Ouvrir F12 et chercher des erreurs dans l'onglet Console

### 2. Vérifier le Fichier

```bash
ls -la /home/abzo/Downloads/ges-entreprises/backend/uploads/logos/
```

Si le fichier existe mais la BDD est NULL → Problème dans la mise à jour de la BDD

### 3. Consulter la Documentation

- **GUIDE_TEST_LOGO.md** - Guide détaillé avec diagnostic
- **RESUME_CORRECTION_LOGO.md** - Résumé des corrections appliquées

## 📞 Besoin d'Aide ?

Si le test échoue, fournir :

1. Les logs du backend (copier-coller la console)
2. Les logs du frontend (F12 → Console → copier-coller)
3. Le résultat de `node check-logos.js`
4. Le contenu de `/backend/uploads/logos/` (résultat de `ls -la`)

---

**🚀 Prêt à tester ? Suivez les étapes ci-dessus !**
