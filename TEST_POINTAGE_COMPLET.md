# 🧪 Guide de Test Complet - Système de Pointage et Scanner QR

**Date**: $(date)  
**Objectif**: Tester et valider toutes les fonctionnalités du système de pointage

---

## 🚀 Préparation

### 1. Redémarrer le Backend

```bash
cd /home/abzo/Downloads/ges-entreprises/backend
npm run dev
```

**Attendez le message** : `Server running on port 3000`

### 2. Rafraîchir le Frontend

Dans votre navigateur :

- Appuyez sur **Ctrl + Shift + R** (ou **Cmd + Shift + R** sur Mac)
- Ou ouvrez la console (F12) → Clic droit sur rafraîchir → "Vider le cache et actualiser"

### 3. Ouvrir la Console du Navigateur

- Appuyez sur **F12**
- Allez dans l'onglet **Console**
- Gardez-la ouverte pendant tous les tests

---

## 📋 Tests à Effectuer

### ✅ Test 1: Scanner QR - Caméra Unique

**Objectif**: Vérifier qu'une seule caméra s'affiche

**Étapes**:

1. Connectez-vous à l'application
2. Sélectionnez une entreprise
3. Allez dans **"Pointages"**
4. Cliquez sur **"Scanner QR"**

**Vérifications**:

- [ ] Une seule caméra s'affiche
- [ ] Le cadre de scan est visible
- [ ] Pas d'erreur dans la console

**Logs attendus dans la console**:

```
📷 [QR SCANNER] Initialisation...
```

**Test supplémentaire**: 5. Cliquez sur **"Fermer"** 6. Cliquez à nouveau sur **"Scanner QR"**

**Vérifications**:

- [ ] Toujours une seule caméra
- [ ] Pas de caméra fantôme
- [ ] Pas d'erreur de cleanup

---

### ✅ Test 2: Formulaire de Pointage - Filtrage par Entreprise

**Objectif**: Vérifier que seuls les employés de l'entreprise sélectionnée sont affichés

**Étapes**:

1. Sélectionnez **Entreprise A** dans le header
2. Allez dans **"Pointages"**
3. Cliquez sur **"Nouveau Pointage"**
4. Ouvrez le dropdown **"Employé"**

**Vérifications**:

- [ ] Seuls les employés de l'Entreprise A sont listés
- [ ] Le nombre d'employés correspond à l'entreprise

**Logs attendus dans la console**:

```
GET /api/employes?entrepriseId=1 200
```

**Test supplémentaire**: 5. Fermez le formulaire 6. Sélectionnez **Entreprise B** dans le header 7. Cliquez sur **"Nouveau Pointage"** 8. Ouvrez le dropdown **"Employé"**

**Vérifications**:

- [ ] Seuls les employés de l'Entreprise B sont listés
- [ ] La liste a changé par rapport à l'Entreprise A

---

### ✅ Test 3: Scan QR - Check-in (Arrivée)

**Objectif**: Vérifier que le scan QR enregistre correctement l'arrivée

**Prérequis**: Avoir un QR code d'employé (généré depuis la page Employés)

**Étapes**:

1. Allez dans **"Pointages"**
2. Cliquez sur **"Scanner QR"**
3. Scannez le QR code d'un employé (ou utilisez un QR code de test)

**Vérifications**:

- [ ] Le scanner se ferme automatiquement
- [ ] Un nouveau pointage apparaît dans la liste
- [ ] L'heure d'arrivée est enregistrée
- [ ] Le statut est "PRESENT"
- [ ] Pas d'erreur affichée

**Logs attendus dans la console**:

```
📷 [QR SCANNER] QR code détecté: {"type":"pointage","employeId":123,"timestamp":...}
✅ [QR SCANNER] QR parsé comme JSON: {...}
🚀 [QR SCANNER] Envoi des données au parent: {...}
📱 [QR SCAN] QR Data reçu: {...}
🔵 [QR SCAN] Tentative de check-in...
✅ [QR SCAN] Check-in réussi: {...}
POST /api/pointages/qr/check-in 200
```

---

### ✅ Test 4: Scan QR - Check-out (Départ)

**Objectif**: Vérifier que le scan QR enregistre correctement le départ

**Prérequis**: Avoir un employé déjà pointé en arrivée (Test 3)

**Étapes**:

1. Allez dans **"Pointages"**
2. Cliquez sur **"Scanner QR"**
3. Scannez le QR code du même employé

**Vérifications**:

- [ ] Le scanner se ferme automatiquement
- [ ] Le pointage est mis à jour
- [ ] L'heure de départ est enregistrée
- [ ] Les heures travaillées sont calculées
- [ ] Pas d'erreur affichée

**Logs attendus dans la console**:

```
📷 [QR SCANNER] QR code détecté: {...}
📱 [QR SCAN] QR Data reçu: {...}
🔵 [QR SCAN] Tentative de check-in...
⚠️ [QR SCAN] Check-in échoué: Pointage déjà commencé pour aujourd'hui
🔵 [QR SCAN] Tentative de check-out...
✅ [QR SCAN] Check-out réussi: {...}
POST /api/pointages/qr/check-out 200
```

---

### ✅ Test 5: Scan QR - QR Code Simple (ID uniquement)

**Objectif**: Vérifier la compatibilité avec les anciens QR codes (juste un ID)

**Étapes**:

1. Créez un QR code contenant juste un nombre (ex: "123")
2. Allez dans **"Pointages"**
3. Cliquez sur **"Scanner QR"**
4. Scannez ce QR code simple

**Vérifications**:

- [ ] Le QR code est accepté
- [ ] Il est converti au format JSON automatiquement
- [ ] Le pointage est créé correctement

**Logs attendus dans la console**:

```
📷 [QR SCANNER] QR code détecté: 123
⚠️ [QR SCANNER] Pas du JSON, tentative de parsing comme ID
✅ [QR SCANNER] QR converti en format standard: {"type":"pointage","employeId":123,"timestamp":...}
🚀 [QR SCANNER] Envoi des données au parent: {...}
```

---

### ✅ Test 6: Création Manuelle de Pointage

**Objectif**: Vérifier que la création manuelle fonctionne

**Étapes**:

1. Allez dans **"Pointages"**
2. Cliquez sur **"Nouveau Pointage"**
3. Remplissez le formulaire :
   - Employé: Sélectionner un employé
   - Date: Aujourd'hui
   - Heure d'arrivée: 08:00
   - Heure de départ: 17:00
   - Pause début: 12:00
   - Pause fin: 13:00
   - Statut: Présent
4. Cliquez sur **"Créer"**

**Vérifications**:

- [ ] Le formulaire se ferme
- [ ] Le pointage apparaît dans la liste
- [ ] Les heures travaillées = 8h (9h - 1h de pause)
- [ ] Les heures supplémentaires = 0h

**Logs attendus dans la console**:

```
POST /api/pointages 201
```

---

### ✅ Test 7: Calcul des Heures Supplémentaires

**Objectif**: Vérifier que les heures sup sont calculées correctement

**Étapes**:

1. Créez un pointage avec :
   - Arrivée: 08:00
   - Départ: 19:00 (11h de travail)
   - Pause: 12:00 - 13:00 (1h)
   - Total: 10h de travail

**Vérifications**:

- [ ] Heures travaillées = 8h
- [ ] Heures supplémentaires = 2h
- [ ] Le calcul est affiché correctement

---

### ✅ Test 8: Modification de Pointage

**Objectif**: Vérifier que la modification fonctionne

**Étapes**:

1. Cliquez sur l'icône **"Modifier"** d'un pointage existant
2. Changez l'heure d'arrivée de 08:00 à 09:00
3. Cliquez sur **"Modifier"**

**Vérifications**:

- [ ] Le formulaire se ferme
- [ ] Les modifications sont appliquées
- [ ] Les heures travaillées sont recalculées

**Logs attendus dans la console**:

```
PUT /api/pointages/{id} 200
```

---

### ✅ Test 9: Gestion des Erreurs - QR Code Invalide

**Objectif**: Vérifier que les erreurs sont bien gérées

**Étapes**:

1. Créez un QR code avec du texte invalide (ex: "abc123xyz")
2. Scannez ce QR code

**Vérifications**:

- [ ] Un message d'erreur s'affiche
- [ ] Le message est clair : "QR code invalide pour le pointage"
- [ ] Le scanner reste ouvert pour réessayer

**Logs attendus dans la console**:

```
📷 [QR SCANNER] QR code détecté: abc123xyz
⚠️ [QR SCANNER] Pas du JSON, tentative de parsing comme ID
❌ [QR SCANNER] Impossible de parser comme ID: abc123xyz
```

---

### ✅ Test 10: Gestion des Erreurs - Double Check-in

**Objectif**: Vérifier qu'on ne peut pas pointer deux fois l'arrivée

**Étapes**:

1. Scannez le QR code d'un employé déjà pointé en arrivée
2. Essayez de scanner à nouveau pour un check-in

**Vérifications**:

- [ ] Un message d'erreur s'affiche
- [ ] Le message indique : "Pointage déjà enregistré pour aujourd'hui"
- [ ] Le pointage n'est pas dupliqué

**Logs attendus dans la console**:

```
🔵 [QR SCAN] Tentative de check-in...
⚠️ [QR SCAN] Check-in échoué: Pointage déjà commencé pour aujourd'hui
🔵 [QR SCAN] Tentative de check-out...
✅ [QR SCAN] Check-out réussi
```

---

### ✅ Test 11: Filtres de Pointage

**Objectif**: Vérifier que les filtres fonctionnent

**Étapes**:

1. Allez dans **"Pointages"**
2. Utilisez les filtres :
   - Employé: Sélectionner un employé spécifique
   - Statut: Sélectionner "Présent"
   - Date début: Aujourd'hui
   - Date fin: Aujourd'hui

**Vérifications**:

- [ ] La liste est filtrée correctement
- [ ] Seuls les pointages correspondants sont affichés
- [ ] Les filtres sont réactifs

---

### ✅ Test 12: Permissions Vigile (Si applicable)

**Objectif**: Vérifier que les vigiles ne peuvent scanner que leurs employés

**Prérequis**: Avoir un compte vigile

**Étapes**:

1. Connectez-vous en tant que vigile
2. Essayez de scanner un employé de votre entreprise
3. Essayez de scanner un employé d'une autre entreprise

**Vérifications**:

- [ ] Le scan de l'employé de son entreprise fonctionne
- [ ] Le scan d'un employé d'une autre entreprise échoue
- [ ] Le message d'erreur est clair

---

## 📊 Résumé des Tests

### Checklist Globale

- [ ] Test 1: Scanner QR - Caméra unique ✅
- [ ] Test 2: Formulaire filtré par entreprise ✅
- [ ] Test 3: Scan QR Check-in ✅
- [ ] Test 4: Scan QR Check-out ✅
- [ ] Test 5: QR Code simple (ID) ✅
- [ ] Test 6: Création manuelle ✅
- [ ] Test 7: Heures supplémentaires ✅
- [ ] Test 8: Modification ✅
- [ ] Test 9: Erreur QR invalide ✅
- [ ] Test 10: Erreur double check-in ✅
- [ ] Test 11: Filtres ✅
- [ ] Test 12: Permissions vigile ✅

---

## 🐛 En Cas de Problème

### Problème: Double Caméra

**Solution**:

1. Rafraîchir la page (Ctrl+Shift+R)
2. Vider le cache du navigateur
3. Vérifier la console pour les erreurs

### Problème: Employés Non Filtrés

**Solution**:

1. Vérifier qu'une entreprise est sélectionnée
2. Vérifier la console : `GET /api/employes?entrepriseId=X`
3. Rafraîchir la page

### Problème: QR Code Non Reconnu

**Solution**:

1. Vérifier le format du QR code dans la console
2. Vérifier que l'employeId existe
3. Vérifier les logs du backend

### Problème: Erreur 500/403

**Solution**:

1. Redémarrer le backend
2. Vérifier que vous êtes connecté
3. Vérifier vos permissions

---

## 📝 Rapport de Test

Après avoir effectué tous les tests, remplissez ce rapport :

### Tests Réussis: \_\_\_/12

### Tests Échoués:

- [ ] Test X: Description du problème

### Observations:

-
-
-

### Recommandations:

-
-
-

---

## 🎉 Validation Finale

Si tous les tests passent :

- ✅ Le système de pointage est fonctionnel
- ✅ Le scanner QR fonctionne correctement
- ✅ Les filtres et permissions sont opérationnels
- ✅ La gestion des erreurs est robuste

**Le système est prêt pour la production !** 🚀
