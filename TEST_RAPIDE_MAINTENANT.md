# ⚡ Test Rapide - À Faire Maintenant

**Temps estimé** : 10 minutes

---

## 🚀 Étape 1 : Redémarrer le Backend (2 min)

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
npm run dev
```

**Attendez** :

```
✔ Generated Prisma Client
Server running on port 3000
```

---

## 📷 Étape 2 : Tester Scanner QR (3 min)

### Test A : Une Seule Caméra

1. Ouvrir http://localhost:5173
2. Se connecter
3. Aller dans **"Pointages"**
4. Cliquer sur **"Scanner QR"**

**✅ Vérifier** :

- Une seule caméra s'affiche (pas deux)
- Le cadre de scan est visible
- Pas d'erreur dans la console

### Test B : Fermer et Rouvrir

1. Cliquer sur **"Fermer"**
2. Cliquer à nouveau sur **"Scanner QR"**

**✅ Vérifier** :

- Toujours une seule caméra
- Pas de caméra fantôme

---

## 👥 Étape 3 : Tester Formulaire Pointage (2 min)

1. Sélectionner **Entreprise A** dans le header
2. Aller dans **"Pointages"**
3. Cliquer sur **"Nouveau Pointage"**
4. Ouvrir le dropdown **"Employé"**

**✅ Vérifier** :

- Seuls les employés de l'Entreprise A sont affichés

5. Fermer le formulaire
6. Sélectionner **Entreprise B** dans le header
7. Cliquer sur **"Nouveau Pointage"**
8. Ouvrir le dropdown **"Employé"**

**✅ Vérifier** :

- Seuls les employés de l'Entreprise B sont affichés

---

## 💰 Étape 4 : Tester PayRuns (3 min)

1. Aller dans **"PayRuns"**
2. Cliquer sur **"Créer une pay run"**
3. Sélectionner une entreprise

**✅ Vérifier** :

- Pas d'erreur 500 dans la console
- La liste des employés journaliers s'affiche

4. Remplir le formulaire :

   - Nom : "Test PayRun"
   - Période début : Date de début
   - Période fin : Date de fin
   - Entreprise : Sélectionner

5. Cliquer sur **"Créer"**

**✅ Vérifier** :

- Pas d'erreur 403 dans la console
- La PayRun est créée
- Le formulaire se ferme

---

## 🔍 Vérification Console (1 min)

Ouvrir la console du navigateur (F12) :

**Pas d'erreur** comme :

- ❌ `GET /api/employes 500 (Internal Server Error)`
- ❌ `POST /api/payruns 403 (Forbidden)`
- ❌ "QR code invalide"

**Messages OK** :

- ✅ `GET /api/employes?entrepriseId=1 200`
- ✅ `POST /api/payruns 201`
- ✅ Logs de succès

---

## ✅ Checklist Rapide

- [ ] Backend redémarré
- [ ] Scanner QR : Une seule caméra
- [ ] Scanner QR : Fermer/Rouvrir OK
- [ ] Formulaire pointage : Employés filtrés
- [ ] PayRuns : Pas d'erreur 500
- [ ] PayRuns : Pas d'erreur 403
- [ ] Console : Pas d'erreur

---

## 🎉 Si Tout Fonctionne

**Félicitations !** Toutes les corrections sont appliquées avec succès.

Vous pouvez maintenant :

- ✅ Créer des PayRuns
- ✅ Scanner des QR codes
- ✅ Créer des pointages
- ✅ Gérer les employés

---

## 🐛 Si Problème

### Erreur 500 sur `/api/employes`

**Solution** :

1. Vérifier que le backend est bien redémarré
2. Vérifier que vous êtes connecté
3. Consulter [CORRECTIONS_PAYRUNS.md](CORRECTIONS_PAYRUNS.md)

### Erreur 403 sur `/api/payruns`

**Solution** :

1. Vérifier votre rôle utilisateur (doit être ADMIN ou SUPER_ADMIN)
2. Redémarrer le backend
3. Consulter [CORRECTIONS_PAYRUNS.md](CORRECTIONS_PAYRUNS.md)

### Double Caméra

**Solution** :

1. Rafraîchir la page (Ctrl+Shift+R)
2. Vider le cache du navigateur
3. Consulter [CORRECTIONS_SCAN_POINTAGE.md](CORRECTIONS_SCAN_POINTAGE.md)

### Employés Non Filtrés

**Solution** :

1. Vérifier qu'une entreprise est sélectionnée
2. Rafraîchir la page
3. Consulter [CORRECTIONS_SCAN_POINTAGE.md](CORRECTIONS_SCAN_POINTAGE.md)

---

## 📚 Documentation Complète

- [TOUTES_LES_CORRECTIONS.md](TOUTES_LES_CORRECTIONS.md) - Vue d'ensemble
- [CORRECTIONS_PAYRUNS.md](CORRECTIONS_PAYRUNS.md) - Détails PayRuns
- [CORRECTIONS_SCAN_POINTAGE.md](CORRECTIONS_SCAN_POINTAGE.md) - Détails Scanner QR
- [LIRE_MOI_DABORD.md](LIRE_MOI_DABORD.md) - Point d'entrée

---

**🚀 Commencez les tests maintenant !**
