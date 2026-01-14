# 📊 Configuration Google Sheets pour enregistrer les réponses

## Étape 1 : Créer une Google Sheet

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez une nouvelle feuille de calcul
3. Nommez-la **"Questionnaire Ancestral - Réponses"**
4. Dans la première ligne, ajoutez ces en-têtes de colonnes :

```
Date/Heure | Nom | Téléphone | Sexe | Score | Score Max | Pourcentage | Profil | Titre Profil | Sous-titre | Nb Questions | Détails Réponses
```

## Étape 2 : Créer le script Google Apps Script

1. Dans votre Google Sheet, cliquez sur **Extensions** > **Apps Script**
2. Supprimez tout le code existant
3. Collez le code suivant :

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Créer un résumé des réponses
    const reponsesDetail = data.reponses.map(r => 
      `Q: ${r.question}\nCatégorie: ${r.categorie}\nScore: ${r.score}`
    ).join('\n\n---\n\n');
    
    // Ajouter une nouvelle ligne avec les données
    sheet.appendRow([
      new Date(data.timestamp),
      data.nom,
      data.telephone,
      data.sexe,
      data.score,
      data.scoreMax,
      data.pourcentage + '%',
      data.profil,
      data.profilTitle,
      data.profilSubtitle,
      data.nombreQuestions,
      reponsesDetail
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Webhook actif' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Cliquez sur **Enregistrer** (icône disquette)
5. Nommez le projet **"Questionnaire Webhook"**

## Étape 3 : Déployer le webhook

1. Cliquez sur **Déployer** > **Nouveau déploiement**
2. Cliquez sur l'icône ⚙️ à côté de "Sélectionner le type"
3. Choisissez **Application Web**
4. Configurez comme suit :
   - **Description** : Webhook Questionnaire v1
   - **Exécuter en tant que** : Moi
   - **Qui a accès** : Tout le monde
5. Cliquez sur **Déployer**
6. **Copiez l'URL du webhook** qui apparaît (elle ressemble à `https://script.google.com/macros/s/...`)
7. Cliquez sur **OK**

## Étape 4 : Configurer l'URL dans le code

1. Ouvrez le fichier `src/App.jsx`
2. Trouvez la ligne :
```javascript
const WEBHOOK_URL = 'VOTRE_URL_WEBHOOK_ICI';
```
3. Remplacez `'VOTRE_URL_WEBHOOK_ICI'` par l'URL que vous avez copiée
4. Exemple :
```javascript
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxxx.../exec';
```
5. Enregistrez le fichier

## ✅ C'est terminé !

Maintenant, chaque fois qu'un utilisateur termine le questionnaire et clique sur "Prêt·e à voir ton évaluation personnelle ?", toutes ses informations seront automatiquement enregistrées dans votre Google Sheet.

## 📋 Données enregistrées

Pour chaque utilisateur, vous aurez :
- **Date et heure** de complétion
- **Nom et téléphone**
- **Sexe**
- **Score** (points obtenus / points maximum)
- **Pourcentage** final
- **Profil obtenu** (Sédimenté, Transitionnel, Équilibré, Ancien)
- **Toutes les réponses** avec les questions, catégories et scores

## 🔒 Sécurité

Les données sont stockées dans votre Google Sheet privé. Seules les personnes ayant accès à votre Google Sheet peuvent voir les données.

## 🐛 Dépannage

Si les données ne s'enregistrent pas :
1. Vérifiez que l'URL du webhook est correctement configurée dans `App.jsx`
2. Ouvrez la console du navigateur (F12) pour voir s'il y a des erreurs
3. Vérifiez que le script Google Apps Script est bien déployé
4. Assurez-vous que "Qui a accès" est bien configuré sur "Tout le monde"
