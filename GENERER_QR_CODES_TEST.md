# 📱 Guide - Générer des QR Codes pour Tester le Système de Pointage

Ce guide vous explique comment générer des QR codes pour tester le système de pointage.

---

## 🎯 Formats de QR Code Supportés

Le système supporte **deux formats** de QR code :

### Format 1: JSON Complet (Recommandé)

```json
{
  "type": "pointage",
  "employeId": 123,
  "timestamp": 1234567890
}
```

### Format 2: ID Simple (Rétrocompatibilité)

```
123
```

---

## 🛠️ Méthode 1 : Générateur en Ligne (Rapide)

### Étape 1 : Aller sur un générateur de QR code

Ouvrez l'un de ces sites :

- https://www.qr-code-generator.com/
- https://www.qrcode-monkey.com/
- https://www.the-qrcode-generator.com/

### Étape 2 : Choisir le type "Texte"

Sélectionnez l'option "Text" ou "Texte libre"

### Étape 3 : Copier le contenu

**Pour un QR code JSON complet** :

```json
{ "type": "pointage", "employeId": 1, "timestamp": 1705320000000 }
```

**Pour un QR code ID simple** :

```
1
```

> ⚠️ **Important** : Remplacez `1` par l'ID réel de votre employé

### Étape 4 : Générer et télécharger

1. Cliquez sur "Générer QR Code"
2. Téléchargez l'image (PNG ou JPG)
3. Imprimez ou affichez sur un écran

---

## 🖥️ Méthode 2 : Script HTML Local (Avancé)

Créez un fichier `qr-generator.html` avec ce contenu :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Générateur QR Code - Pointage</title>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 50px auto;
        padding: 20px;
      }
      .container {
        background: #f5f5f5;
        padding: 30px;
        border-radius: 10px;
      }
      input,
      select,
      button {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        font-size: 16px;
      }
      button {
        background: #4f46e5;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
      }
      button:hover {
        background: #4338ca;
      }
      #qrcode {
        text-align: center;
        margin-top: 20px;
      }
      .info {
        background: #e0e7ff;
        padding: 15px;
        border-radius: 5px;
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🔲 Générateur de QR Code - Pointage</h1>

      <div class="info">
        <strong>📋 Instructions :</strong>
        <ol>
          <li>Entrez l'ID de l'employé</li>
          <li>Choisissez le format du QR code</li>
          <li>Cliquez sur "Générer QR Code"</li>
          <li>Scannez avec l'application</li>
        </ol>
      </div>

      <label for="employeId"><strong>ID de l'employé :</strong></label>
      <input type="number" id="employeId" placeholder="Ex: 1" value="1" />

      <label for="format"><strong>Format du QR Code :</strong></label>
      <select id="format">
        <option value="json">JSON Complet (Recommandé)</option>
        <option value="simple">ID Simple</option>
      </select>

      <button onclick="generateQR()">🔲 Générer QR Code</button>

      <div id="qrcode"></div>
      <div
        id="qrData"
        style="margin-top: 20px; padding: 10px; background: #fff; border-radius: 5px;"
      ></div>
    </div>

    <script>
      function generateQR() {
        const employeId = document.getElementById("employeId").value;
        const format = document.getElementById("format").value;

        if (!employeId) {
          alert("Veuillez entrer un ID d'employé");
          return;
        }

        let qrData;
        if (format === "json") {
          qrData = JSON.stringify({
            type: "pointage",
            employeId: parseInt(employeId),
            timestamp: Date.now(),
          });
        } else {
          qrData = employeId;
        }

        // Effacer le QR code précédent
        document.getElementById("qrcode").innerHTML = "";

        // Générer le nouveau QR code
        QRCode.toCanvas(
          qrData,
          {
            width: 300,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          },
          function (error, canvas) {
            if (error) {
              console.error(error);
              alert("Erreur lors de la génération du QR code");
            } else {
              document.getElementById("qrcode").appendChild(canvas);

              // Afficher les données du QR code
              document.getElementById("qrData").innerHTML = `
                        <strong>📱 Données du QR Code :</strong><br>
                        <code style="background: #f0f0f0; padding: 5px; display: block; margin-top: 10px;">
                            ${qrData}
                        </code>
                        <br>
                        <strong>Format :</strong> ${
                          format === "json" ? "JSON Complet" : "ID Simple"
                        }<br>
                        <strong>Employé ID :</strong> ${employeId}
                    `;
            }
          }
        );
      }

      // Générer un QR code par défaut au chargement
      window.onload = function () {
        generateQR();
      };
    </script>
  </body>
</html>
```

### Utilisation :

1. Copiez le code ci-dessus dans un fichier `qr-generator.html`
2. Ouvrez le fichier dans votre navigateur
3. Entrez l'ID de l'employé
4. Choisissez le format
5. Cliquez sur "Générer QR Code"
6. Le QR code s'affiche instantanément

---

## 📱 Méthode 3 : Application Mobile

### Android / iOS

1. Téléchargez une application de génération de QR code :

   - **QR Code Generator** (gratuit)
   - **QR Code Maker** (gratuit)
   - **QR Droid** (Android)

2. Créez un QR code de type "Texte"

3. Collez le contenu :

   ```json
   { "type": "pointage", "employeId": 1, "timestamp": 1705320000000 }
   ```

4. Générez et sauvegardez

---

## 🧪 QR Codes de Test Prêts à l'Emploi

### Employé ID 1 - JSON Complet

```json
{ "type": "pointage", "employeId": 1, "timestamp": 1705320000000 }
```

### Employé ID 2 - JSON Complet

```json
{ "type": "pointage", "employeId": 2, "timestamp": 1705320000000 }
```

### Employé ID 3 - JSON Complet

```json
{ "type": "pointage", "employeId": 3, "timestamp": 1705320000000 }
```

### Employé ID 1 - ID Simple

```
1
```

### Employé ID 2 - ID Simple

```
2
```

---

## 🎨 Personnalisation des QR Codes

### Taille Recommandée

- **Minimum** : 200x200 pixels
- **Optimal** : 300x300 pixels
- **Maximum** : 500x500 pixels

### Couleurs

- **Fond** : Blanc (#FFFFFF)
- **Motif** : Noir (#000000)
- **Éviter** : Couleurs claires ou inversées (difficiles à scanner)

### Format de Fichier

- **PNG** : Recommandé (meilleure qualité)
- **JPG** : Acceptable
- **SVG** : Pour impression haute qualité

---

## 📋 Checklist de Test

Avant de tester, assurez-vous d'avoir :

- [ ] Généré au moins 3 QR codes différents
- [ ] Un QR code au format JSON complet
- [ ] Un QR code au format ID simple
- [ ] Les QR codes sont lisibles (bonne qualité)
- [ ] Vous connaissez les IDs des employés dans votre base de données

---

## 🔍 Vérification des QR Codes

### Tester la Lisibilité

1. **Avec un smartphone** :

   - Ouvrez l'appareil photo
   - Pointez vers le QR code
   - Vérifiez que le contenu s'affiche

2. **Avec un lecteur en ligne** :
   - Allez sur https://webqr.com/
   - Uploadez votre QR code
   - Vérifiez le contenu décodé

### Contenu Attendu

**Pour JSON** :

```json
{ "type": "pointage", "employeId": 1, "timestamp": 1705320000000 }
```

**Pour ID Simple** :

```
1
```

---

## 🚀 Scénarios de Test

### Scénario 1 : Check-in Normal

1. Générez un QR code pour l'employé ID 1 (JSON)
2. Scannez avec l'application
3. Vérifiez que le check-in est enregistré

### Scénario 2 : Check-out Normal

1. Utilisez le même QR code de l'employé ID 1
2. Scannez à nouveau
3. Vérifiez que le check-out est enregistré

### Scénario 3 : Format ID Simple

1. Générez un QR code avec juste "2"
2. Scannez avec l'application
3. Vérifiez que le système le convertit en JSON

### Scénario 4 : Erreur - Double Check-in

1. Faites un check-in pour l'employé ID 3
2. Essayez de refaire un check-in le même jour
3. Vérifiez le message d'erreur

---

## 💡 Conseils Pratiques

### Pour les Tests

- Imprimez plusieurs QR codes sur une feuille A4
- Numérotez-les pour savoir quel employé correspond à quel QR
- Gardez une copie numérique pour les tests répétés

### Pour la Production

- Créez un QR code unique par employé
- Imprimez sur des badges plastifiés
- Ajoutez le nom de l'employé sous le QR code
- Utilisez une imprimante de qualité

### Dépannage

- Si le QR code ne scanne pas : augmentez la taille
- Si le format est invalide : vérifiez les guillemets JSON
- Si l'employé n'existe pas : vérifiez l'ID dans la base de données

---

## 📞 Support

En cas de problème :

1. Vérifiez que l'ID de l'employé existe dans la base de données
2. Testez le QR code avec un lecteur en ligne
3. Consultez les logs de la console (F12)
4. Référez-vous à [TEST_POINTAGE_COMPLET.md](TEST_POINTAGE_COMPLET.md)

---

**Bon test ! 🎉**
