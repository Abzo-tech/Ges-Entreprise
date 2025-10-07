# 🧪 Guide de Test - Correction Bug Logo NULL

## ⚠️ Problème Identifié

Le logo est toujours à `NULL` en base de données malgré l'upload du fichier.

## 📋 État Actuel du Code

### ✅ Corrections Déjà Appliquées

1. **Backend (FileController.ts)** - Ligne 44

   ```typescript
   await entrepriseRepository.update(entrepriseId, { logo: logoPath });
   ```

   ✅ La mise à jour de la BDD est présente

2. **Frontend (Entreprises.jsx)** - Lignes 178-193

   ```javascript
   // Upload du logo après création de l'entreprise
   if (formData.logo instanceof File && entrepriseId) {
     const logoFormData = new FormData();
     logoFormData.append("logo", formData.logo);
     await api.post(`/files/upload/logo/${entrepriseId}`, logoFormData);
   }
   ```

   ✅ L'upload séquentiel est implémenté

3. **Frontend (LogoUploader.jsx)** - Ligne 11

   ```javascript
   autoUpload = true; // Prop pour contrôler l'upload automatique
   ```

   ✅ Le composant supporte l'upload différé

4. **Frontend (Entreprises.jsx)** - Ligne 535
   ```javascript
   <LogoUploader autoUpload={false} ... />
   ```
   ✅ L'upload automatique est désactivé dans le formulaire

### 🔍 Variables Supprimées

- ❌ `pendingLogoFile` - Supprimée (n'existe plus)
- ❌ `pendingEntrepriseId` - Supprimée (n'existe plus)

Le code utilise maintenant un flux séquentiel simple sans variables "pending".

## 🧪 Procédure de Test Manuel

### Étape 1 : Vérifier l'État Initial

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
node check-logos.js
```

**Résultat attendu :** Liste des entreprises avec leur statut de logo

### Étape 2 : Ouvrir l'Application

1. Ouvrir le navigateur : http://localhost:5173
2. Se connecter avec un compte SUPER_ADMIN
3. Aller sur la page "Gestion des Entreprises"

### Étape 3 : Créer une Nouvelle Entreprise avec Logo

1. Cliquer sur **"Ajouter une entreprise"**
2. Remplir le formulaire :
   - **Nom** : Test Logo [Date/Heure actuelle]
   - **Adresse** : 123 Test Street
   - **Secteur** : Test
3. **IMPORTANT** : Cliquer sur la zone de logo et sélectionner une image (JPEG ou PNG)
4. Vérifier que l'aperçu du logo s'affiche
5. Cliquer sur **"Enregistrer"**

### Étape 4 : Vérifier en Base de Données

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
node check-logos.js
```

**Résultat attendu :** La nouvelle entreprise doit avoir un logo (pas NULL)

### Étape 5 : Vérifier dans l'Interface

1. Retourner sur la liste des entreprises
2. Trouver l'entreprise créée
3. Vérifier que le logo s'affiche dans la carte

## 🐛 Si le Bug Persiste

### Diagnostic Approfondi

#### 1. Vérifier les Logs du Backend

Ouvrir la console où le backend tourne et chercher :

```
=== UPLOAD LOGO REQUEST ===
File: { ... }
Params: { entrepriseId: 'XX' }
Saving logo for entreprise: XX
Logo saved successfully: /uploads/logos/...
Entreprise updated with logo path: /uploads/logos/...
```

**Si ces logs n'apparaissent pas** → Le frontend n'appelle pas l'API d'upload

#### 2. Vérifier les Logs du Frontend

Ouvrir la console du navigateur (F12) et chercher :

```
Uploading logo for entreprise: XX
Logo uploaded successfully
```

**Si ces logs n'apparaissent pas** → La condition `if (formData.logo instanceof File && entrepriseId)` n'est pas satisfaite

#### 3. Vérifier le Fichier Logo

```bash
ls -la /home/abzo/Downloads/ges-entreprises/backend/uploads/logos/
```

**Si le fichier existe mais la BDD est NULL** → Problème dans `entrepriseRepository.update()`

#### 4. Vérifier la Méthode update() du Repository

```bash
cd /home/abzo/Downloads/ges-entreprises/backend/src/repositories
cat EntrepriseRepository.ts | grep -A 20 "update"
```

Vérifier que la méthode `update()` fait bien un `UPDATE` SQL et un `COMMIT`.

## 🔧 Solutions Possibles

### Solution 1 : Problème de Transaction

Si le repository utilise des transactions, vérifier qu'elles sont bien committées :

```typescript
// Dans EntrepriseRepository.ts
async update(id: number, data: Partial<Entreprise>) {
  const result = await this.db.query(
    'UPDATE entreprise SET ... WHERE id = ?',
    [...]
  );
  // S'assurer qu'il n'y a pas de transaction en attente
  return result;
}
```

### Solution 2 : Problème de Type de Données

Vérifier que le champ `logo` en BDD accepte bien les chaînes de caractères :

```sql
DESCRIBE entreprise;
```

Le champ `logo` doit être de type `VARCHAR` ou `TEXT`, pas `BLOB`.

### Solution 3 : Problème de Timing

Ajouter un délai avant de fermer le formulaire :

```javascript
// Dans Entreprises.jsx, après l'upload du logo
await api.post(`/files/upload/logo/${entrepriseId}`, logoFormData);
await new Promise((resolve) => setTimeout(resolve, 500)); // Attendre 500ms
```

### Solution 4 : Vérifier la Réponse de l'API

Modifier le code pour logger la réponse :

```javascript
// Dans Entreprises.jsx
const uploadResponse = await api.post(
  `/files/upload/logo/${entrepriseId}`,
  logoFormData
);
console.log("Upload response:", uploadResponse.data);
```

## 📊 Checklist de Vérification

- [ ] Le backend compile sans erreur
- [ ] Le frontend compile sans erreur
- [ ] Les serveurs sont en cours d'exécution (ports 3000 et 5173)
- [ ] L'utilisateur est connecté avec le rôle SUPER_ADMIN
- [ ] Le fichier logo est bien sélectionné (aperçu visible)
- [ ] Les logs backend montrent l'upload du logo
- [ ] Les logs frontend montrent l'appel à l'API
- [ ] Le fichier logo existe dans `/backend/uploads/logos/`
- [ ] Le champ `logo` en BDD n'est pas NULL
- [ ] Le logo s'affiche dans l'interface

## 🎯 Résultat Attendu

Après avoir créé une entreprise avec un logo :

1. ✅ Le fichier logo existe dans `/backend/uploads/logos/`
2. ✅ Le champ `logo` en BDD contient le chemin (ex: `/uploads/logos/11_uuid.jpeg`)
3. ✅ Le logo s'affiche dans la liste des entreprises
4. ✅ Les logs backend confirment la mise à jour de la BDD

## 📞 Support

Si le bug persiste après ces vérifications, fournir :

1. Les logs du backend (console où `npm run dev` tourne)
2. Les logs du frontend (console du navigateur F12)
3. Le résultat de `node check-logos.js`
4. Le contenu du dossier `/backend/uploads/logos/`
5. La structure de la table `entreprise` (`DESCRIBE entreprise;`)
