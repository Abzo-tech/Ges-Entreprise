# 🧪 Test Manuel - Correction Logo NULL

## 📋 État Actuel de la Base de Données

**Résultat de la vérification** (exécuté le dernier) :

```
✅ 9 entreprise(s) trouvée(s):

ID: 10 - SENICO          → ❌ Logo NULL
ID: 9  - Sivop           → ❌ Logo NULL
ID: 7  - Sivop           → ❌ Logo NULL
ID: 6  - SENICO          → ❌ Logo NULL
ID: 5  - Xarala          → ✅ Logo présent (/uploads/logos/5_xxx.jpeg)
ID: 4  - ODC             → ❌ Logo NULL
ID: 3  - Auto Ecole 221  → ❌ Logo NULL
ID: 2  - FinancePlus     → ✅ Logo présent (/uploads/logos/2_xxx.jpeg)
ID: 1  - TechCorp        → ✅ Logo présent (/uploads/logos/1_xxx.jpeg)

📊 Statistiques:
   Avec logo: 3
   Sans logo: 6
```

---

## 🎯 Objectif du Test

Vérifier que la correction fonctionne en créant une **nouvelle entreprise avec un logo** et confirmer que :

1. ✅ Le fichier est sauvegardé sur le disque
2. ✅ Le champ `logo` est mis à jour en BDD (pas NULL)
3. ✅ Le logo s'affiche dans l'interface

---

## 🚀 Procédure de Test (5 minutes)

### Étape 1 : Démarrer le Backend

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
npm start
```

**Attendu** : `Server running on port 3000`

---

### Étape 2 : Ouvrir l'Application

1. Ouvrir le navigateur : **http://localhost:5173** (ou 3000)
2. Se connecter si nécessaire

---

### Étape 3 : Créer une Entreprise avec Logo

1. Cliquer sur **"Ajouter une entreprise"**
2. Remplir le formulaire :
   - **Nom** : Test Logo Fix
   - **Adresse** : 123 Rue de Test
   - **Secteur** : Technologie
3. **Sélectionner un logo** (JPEG ou PNG, < 5MB)
4. Cliquer sur **"Créer"**

**⚠️ IMPORTANT** : Regarder la console du navigateur (F12) pour voir les logs :

```
Uploading logo for entreprise: 11
Logo uploaded successfully
```

---

### Étape 4 : Vérifier en Base de Données

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
node check-logos.js
```

**Résultat attendu** :

```
ID: 11
Nom: Test Logo Fix
Logo: uploads/logos/11-1234567890.jpg  ← ✅ PAS NULL !
Statut: ✅ Logo présent
```

---

### Étape 5 : Vérifier le Fichier sur le Disque

```bash
ls -lh /home/abzo/Downloads/ges-entreprises/backend/uploads/logos/
```

**Attendu** : Un fichier `11-*.jpg` ou `11-*.png` doit être présent

---

### Étape 6 : Vérifier l'Affichage

1. Retourner sur la page des entreprises
2. Appuyer sur **F5** pour rafraîchir
3. **Vérifier** : Le logo de "Test Logo Fix" doit s'afficher ✅

---

## ✅ Checklist de Validation

- [ ] Backend démarre sans erreur
- [ ] Formulaire de création s'ouvre
- [ ] Sélection du logo fonctionne (aperçu visible)
- [ ] Création de l'entreprise réussit
- [ ] Console affiche "Logo uploaded successfully"
- [ ] Champ `logo` en BDD contient le chemin (pas NULL)
- [ ] Fichier existe sur le disque
- [ ] Logo s'affiche dans l'interface
- [ ] Logo persiste après F5

**Si tout est coché → Bug corrigé ! 🎉**

---

## 🐛 Dépannage

### Le logo reste NULL en BDD

**Vérifier les logs backend** :

```bash
# Dans le terminal où tourne le backend, chercher :
=== UPLOAD LOGO REQUEST ===
File: { ... }
Params: { entrepriseId: '11' }
```

Si vous ne voyez pas ces logs → L'upload n'est pas déclenché côté frontend.

**Solution** : Vérifier que `Entreprises.jsx` ligne 180-193 contient bien :

```javascript
if (formData.logo instanceof File && entrepriseId) {
  console.log("Uploading logo for entreprise:", entrepriseId);
  const logoFormData = new FormData();
  logoFormData.append("logo", formData.logo);

  await api.post(`/files/upload/logo/${entrepriseId}`, logoFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
```

---

### Erreur "ID entreprise manquant"

**Cause** : L'entreprise n'a pas été créée correctement.

**Solution** : Vérifier la réponse de l'API lors de la création :

```javascript
const res = await api.post("/entreprises", submitData);
console.log("Entreprise créée avec ID:", res.data.id);
```

---

### Le fichier n'est pas sauvegardé

**Vérifier les permissions** :

```bash
ls -ld /home/abzo/Downloads/ges-entreprises/backend/uploads/logos/
# Doit être accessible en écriture
```

**Créer le dossier si nécessaire** :

```bash
mkdir -p /home/abzo/Downloads/ges-entreprises/backend/uploads/logos
chmod 755 /home/abzo/Downloads/ges-entreprises/backend/uploads/logos
```

---

## 📊 Comparaison Avant/Après

| Aspect             | Avant             | Après             |
| ------------------ | ----------------- | ----------------- |
| Logo en BDD        | ❌ NULL           | ✅ Chemin valide  |
| Fichier sur disque | ✅ Présent        | ✅ Présent        |
| Affichage          | ❌ Invisible      | ✅ Visible        |
| Upload             | ⚠️ Avant création | ✅ Après création |

---

## 🔍 Commandes Utiles

### Vérifier les logos en BDD

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
node check-logos.js
```

### Lister les fichiers uploadés

```bash
ls -lh /home/abzo/Downloads/ges-entreprises/backend/uploads/logos/
```

### Voir les logs backend en temps réel

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
npm start
# Puis créer une entreprise et observer les logs
```

### Nettoyer les entreprises de test

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
node -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.entreprise.deleteMany({ where: { nom: { contains: 'Test' } } });
console.log('Entreprises de test supprimées');
await prisma.\$disconnect();
"
```

---

## 📝 Notes

- Les entreprises ID 6, 7, 9, 10 ont été créées **avant** la correction → Normal qu'elles aient logo NULL
- Les entreprises ID 1, 2, 5 ont un logo → Créées avec l'ancien système qui fonctionnait parfois
- La nouvelle entreprise (ID 11+) doit avoir un logo si la correction fonctionne

---

## 🎯 Prochaines Étapes

Si le test réussit :

1. ✅ Marquer le bug comme résolu
2. 📝 Documenter la solution dans le CHANGELOG
3. 🧹 Nettoyer les logs de débogage (optionnel)
4. 🚀 Déployer en production

Si le test échoue :

1. 📋 Noter l'erreur exacte
2. 🔍 Vérifier les logs backend et frontend
3. 🐛 Déboguer avec les outils de développement
4. 💬 Demander de l'aide si nécessaire

---

**Bonne chance ! 🍀**
