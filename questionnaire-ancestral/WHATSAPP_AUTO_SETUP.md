# 📱 Configuration : Envoi automatique sur WhatsApp

## ✅ Solution : Make.com + WhatsApp Business (GRATUIT)

Cette solution envoie **automatiquement** tous les résultats du questionnaire sur votre WhatsApp.

---

## 📋 Prérequis

1. **WhatsApp Business** installé sur votre téléphone (07 56 98 48 75)
2. Un compte **Make.com** (gratuit)

---

## 🚀 Configuration étape par étape

### Étape 1 : Créer le scénario Make.com

1. Allez sur [Make.com](https://www.make.com)
2. Créez un compte gratuit si ce n'est pas fait
3. Cliquez sur **"Create a new scenario"**

### Étape 2 : Ajouter le webhook (pour recevoir les données)

1. Cliquez sur le **+** au centre
2. Cherchez **"Webhooks"**
3. Sélectionnez **"Custom webhook"**
4. Cliquez sur **"Add"**
5. Donnez un nom : **"Questionnaire Ancestral"**
6. Cliquez sur **"Save"**
7. **Copiez l'URL du webhook** (ressemble à `https://hook.eu1.make.com/xxxxx`)

### Étape 3 : Ajouter WhatsApp Business

1. Cliquez sur le **+** après le module Webhook
2. Cherchez **"WhatsApp Business Cloud"**
3. Sélectionnez **"Send a Template Message"** ou **"Send a Message"**
4. Cliquez sur **"Create a connection"**
5. Suivez les instructions pour connecter votre WhatsApp Business :
   - Vous devrez créer une app Facebook
   - Connecter votre numéro WhatsApp Business
   - C'est gratuit mais nécessite quelques étapes

### Étape 4 : Configurer le message WhatsApp

Dans le module WhatsApp, configurez :

**To (Destinataire) :** `33756984875` (votre numéro en format international)

**Message :**
```
📋 NOUVEAU QUESTIONNAIRE

👤 {{nom}}
📞 {{telephone}}
👫 {{sexe}}

📊 Score: {{score}}/{{scoreMax}} ({{pourcentage}}%)
🎯 Profil: {{profil}}

{{profilTitle}}
{{profilSubtitle}}
```

Pour inclure toutes les réponses détaillées, ajoutez :
```
📝 RÉPONSES:
{{reponses}}
```

### Étape 5 : Activer le scénario

1. Cliquez sur **"Save"** en bas à gauche
2. Activez le scénario avec le bouton **ON/OFF**

### Étape 6 : Configurer l'URL dans le code

1. Ouvrez `src/App.jsx`
2. Trouvez la ligne :
```javascript
const WEBHOOK_URL = 'VOTRE_URL_WEBHOOK_ICI';
```
3. Remplacez par l'URL de Make.com :
```javascript
const WEBHOOK_URL = 'https://hook.eu1.make.com/xxxxx';
```
4. Enregistrez le fichier

---

## 🎯 C'est terminé !

Maintenant, chaque fois qu'un utilisateur complète le questionnaire, vous recevrez **automatiquement** un message WhatsApp avec :
- Toutes les informations personnelles
- Le score et le profil
- Toutes les réponses détaillées

---

## 🔄 Alternative plus simple : Twilio API (Payant)

Si WhatsApp Business Cloud est trop complexe, vous pouvez utiliser Twilio :

### Configuration Twilio (5 minutes)

1. Créez un compte sur [Twilio.com](https://www.twilio.com)
2. Activez WhatsApp Sandbox (gratuit pour les tests)
3. Obtenez vos credentials : Account SID et Auth Token
4. Dans Make.com, utilisez le module **"Twilio" > "Send WhatsApp Message"**
5. Connectez avec vos credentials Twilio
6. Configurez le message comme ci-dessus

**Coût :** ~0.005€ par message (très abordable)

---

## 📧 Alternative ultra-simple : Email

Si WhatsApp est trop compliqué, vous pouvez recevoir les données par **Email** :

1. Dans Make.com, au lieu de WhatsApp, choisissez **"Email" > "Send an Email"**
2. Configurez votre email
3. Vous recevrez toutes les infos par email instantanément

---

## 🐛 Dépannage

### Le webhook ne reçoit pas de données

1. Vérifiez que l'URL est bien configurée dans `App.jsx`
2. Testez le webhook en complétant un questionnaire
3. Allez dans Make.com > History pour voir les exécutions

### WhatsApp Business Cloud ne fonctionne pas

1. Vérifiez que votre numéro WhatsApp Business est bien vérifié
2. Vérifiez que vous avez bien créé l'app Facebook
3. Essayez Twilio comme alternative

---

## 💡 Recommandation

**Pour démarrer rapidement :**
1. Commencez avec **Email** (le plus simple)
2. Ensuite passez à **Twilio** si vous voulez WhatsApp (payant mais simple)
3. Ou WhatsApp Business Cloud si vous voulez du gratuit (plus complexe)

La fonction `saveDataToSheet()` est déjà dans le code, il suffit juste de configurer l'URL du webhook !
