# 🚀 Solution la plus simple : Webhook avec Make.com (ou Zapier)

Cette solution est la **PLUS SIMPLE** et ne nécessite **AUCUN CODE** supplémentaire. Elle utilise Make.com (gratuit) pour recevoir les données et les envoyer où vous voulez.

## ✨ Avantages

- ✅ Aucun code à écrire
- ✅ Configuration en 5 minutes
- ✅ Peut envoyer vers : Google Sheets, Email, Airtable, Notion, CRM, etc.
- ✅ Gratuit jusqu'à 1000 opérations/mois
- ✅ Interface visuelle simple

---

## 📋 Méthode 1 : Make.com (Recommandé - Gratuit)

### Étape 1 : Créer un compte Make

1. Allez sur [Make.com](https://www.make.com)
2. Créez un compte gratuit
3. Connectez-vous

### Étape 2 : Créer un nouveau scénario

1. Cliquez sur **Create a new scenario**
2. Dans la barre de recherche, tapez **"Webhooks"**
3. Sélectionnez le module **"Webhooks" > "Custom webhook"**
4. Cliquez sur **"Add"**
5. Donnez-lui un nom : **"Questionnaire Ancestral"**
6. Cliquez sur **"Save"**
7. **Copiez l'URL du webhook** qui s'affiche

### Étape 3 : Ajouter Google Sheets (ou autre destination)

1. Cliquez sur le **+** après le module Webhook
2. Cherchez **"Google Sheets"**
3. Sélectionnez **"Add a row"**
4. Connectez votre compte Google
5. Sélectionnez votre feuille de calcul
6. Mappez les champs comme suit :

```
Colonne A → timestamp
Colonne B → nom
Colonne C → telephone
Colonne D → sexe
Colonne E → score
Colonne F → scoreMax
Colonne G → pourcentage
Colonne H → profil
Colonne I → profilTitle
Colonne J → profilSubtitle
Colonne K → nombreQuestions
Colonne L → reponses (JSON.stringify)
```

7. Cliquez sur **OK**
8. Cliquez sur **Save** en bas à gauche
9. Activez le scénario en cliquant sur le bouton **ON/OFF**

### Étape 4 : Configurer l'URL dans le code

1. Ouvrez `src/App.jsx`
2. Trouvez cette ligne :
```javascript
const WEBHOOK_URL = 'VOTRE_URL_WEBHOOK_ICI';
```
3. Remplacez par l'URL de Make.com :
```javascript
const WEBHOOK_URL = 'https://hook.eu1.make.com/xxxxx';
```
4. Enregistrez

### ✅ Terminé !

Les données seront automatiquement envoyées dans votre Google Sheet.

---

## 📧 Bonus : Ajouter une notification par Email

Dans Make.com, vous pouvez aussi ajouter un module "Email" après le webhook :

1. Cliquez sur le **+** après le module Webhook
2. Cherchez **"Email"**
3. Sélectionnez **"Send an email"**
4. Configurez :
   - **To** : votre.email@exemple.com
   - **Subject** : Nouveau questionnaire - {{nom}}
   - **Content** : Utilisez les données du webhook

---

## 🎯 Méthode 2 : Zapier (Alternative)

Si vous préférez Zapier :

1. Créez un compte sur [Zapier.com](https://zapier.com)
2. Créez un nouveau Zap
3. Trigger : **Webhooks by Zapier** > **Catch Hook**
4. Copiez l'URL du webhook
5. Action : **Google Sheets** > **Create Spreadsheet Row**
6. Configurez les champs
7. Activez le Zap
8. Utilisez l'URL dans votre code

---

## 🔧 Configuration dans le code (déjà fait !)

Le code est déjà prêt dans `App.jsx`. Il suffit de remplacer l'URL :

```javascript
async function saveDataToSheet() {
  const prof = personality();
  if (!prof) return;

  const data = {
    timestamp: new Date().toISOString(),
    nom: name,
    telephone: phone,
    sexe: sex,
    score: score,
    scoreMax: maxScore,
    pourcentage: Math.round((score / maxScore) * 100),
    profil: prof.label,
    profilTitle: prof.title,
    profilSubtitle: prof.subtitle,
    nombreQuestions: questions.length,
    reponses: answers.map((ans, idx) => ({
      question: ans.question,
      categorie: ans.category,
      score: ans.score,
    })),
  };

  try {
    const WEBHOOK_URL = 'VOTRE_URL_MAKE_OU_ZAPIER';
    
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    console.log('✅ Données enregistrées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement:', error);
  }
}
```

---

## 📊 Structure des données envoyées

Voici ce qui est envoyé à chaque questionnaire :

```json
{
  "timestamp": "2026-01-14T10:30:00.000Z",
  "nom": "Jean Dupont",
  "telephone": "0612345678",
  "sexe": "homme",
  "score": 45,
  "scoreMax": 84,
  "pourcentage": 54,
  "profil": "LE TRANSITIONNEL",
  "profilTitle": "L'Optimiseur",
  "profilSubtitle": "Le corps s'adapte, mais manque de constance",
  "nombreQuestions": 21,
  "reponses": [
    {
      "question": "Le matin au réveil, tu te sens comment ?",
      "categorie": "energie",
      "score": 3
    },
    ...
  ]
}
```

---

## 💡 Pourquoi cette solution est la meilleure ?

1. **Aucun code supplémentaire** : tout est déjà dans `App.jsx`
2. **Flexible** : changez facilement de destination (Sheets, Email, CRM, etc.)
3. **Visual** : vous voyez le flux de données en temps réel
4. **Gratuit** : Make.com offre 1000 opérations/mois gratuitement
5. **Fiable** : services professionnels avec 99.9% uptime

---

## 🐛 Test

Pour tester si tout fonctionne :

1. Complétez un questionnaire
2. Allez dans Make.com > votre scénario
3. Cliquez sur "History" en bas
4. Vous devriez voir l'exécution avec les données reçues

---

## 🎓 Ressources

- [Documentation Make.com](https://www.make.com/en/help)
- [Tutoriel vidéo Make + Google Sheets](https://www.youtube.com/results?search_query=make.com+webhook+google+sheets)
- [Documentation Zapier](https://zapier.com/help)
