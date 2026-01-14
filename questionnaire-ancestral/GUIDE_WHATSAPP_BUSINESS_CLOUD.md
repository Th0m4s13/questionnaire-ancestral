# 📱 Guide Complet : Configuration WhatsApp Business Cloud avec Make.com

## ⚠️ Vous êtes ici : Création de la connexion dans Make.com

D'après votre capture d'écran, vous devez créer une connexion WhatsApp Business Cloud. Voici comment faire.

---

## 🚀 Étape 1 : Créer l'application sur Meta for Developers

### 1.1 Créer un compte Meta for Developers

1. Allez sur **https://developers.facebook.com/**
2. Connectez-vous avec votre compte Facebook (celui associé à votre numéro 07 56 98 48 75)
3. Acceptez les conditions d'utilisation

### 1.2 Créer une application

1. Cliquez sur **"Mes applications"** (ou "My Apps") en haut à droite
2. Cliquez sur **"Créer une application"** (ou "Create App")
3. Choisissez le type : **"Business"**
4. Cliquez sur **"Suivant"**
5. Remplissez les informations :
   - **Nom de l'application** : "Questionnaire Ancestral"
   - **Email de contact** : votre email
   - **Compte professionnel** : Créez-en un si vous n'en avez pas
6. Cliquez sur **"Créer une application"**

### 1.3 Ajouter WhatsApp à votre application

1. Dans le tableau de bord de votre application, trouvez **"WhatsApp"**
2. Cliquez sur **"Configurer"** (ou "Set up")
3. Suivez l'assistant de configuration

### 1.4 Obtenir vos identifiants

Une fois WhatsApp configuré, vous aurez besoin de ces informations :

1. **Phone Number ID** (ID du numéro de téléphone)
   - Allez dans : WhatsApp > API Setup
   - Copiez le **"Phone number ID"**

2. **WhatsApp Business Account ID** (ID du compte)
   - Visible dans : WhatsApp > Getting Started
   - Copiez le **"WhatsApp Business Account ID"**

3. **Access Token** (Token d'accès)
   - Allez dans : WhatsApp > API Setup
   - Copiez le **"Temporary access token"** (valide 24h)
   - OU créez un **"Permanent token"** (recommandé) :
     - Allez dans : Paramètres > Basique
     - Créez un **"System User"**
     - Générez un **"Access Token"** avec les permissions WhatsApp
     - ⚠️ **SAUVEGARDEZ CE TOKEN** (vous ne pourrez plus le voir après)

---

## 🔧 Étape 2 : Créer la connexion dans Make.com

Maintenant que vous avez vos identifiants Meta, retournez dans Make.com :

### 2.1 Cliquer sur "Create a connection"

1. Dans votre module WhatsApp Business Cloud, cliquez sur **"Create a connection"**
2. Une fenêtre s'ouvre avec plusieurs champs

### 2.2 Remplir les champs

Remplissez avec les identifiants obtenus à l'Étape 1 :

- **Connection name** : "WhatsApp Mao Ancestral"
- **Phone Number ID** : Collez l'ID du numéro de téléphone
- **WhatsApp Business Account ID** : Collez l'ID du compte
- **Access Token** : Collez votre token d'accès

### 2.3 Sauvegarder

1. Cliquez sur **"Save"**
2. Make.com va tester la connexion
3. Si tout est OK, vous verrez : ✅ "Connection established"

---

## 📝 Étape 3 : Configurer le message WhatsApp

### 3.1 Sélectionner la connexion

Une fois la connexion créée, elle apparaîtra dans le menu déroulant.

### 3.2 Configurer les champs du module

Dans le module "WhatsApp Business Cloud - Send a Message" :

**Recipient Phone Number (Numéro du destinataire) :**
```
33756984875
```
(Votre numéro sans le 0, avec l'indicatif 33)

**Message Type :** Choisissez **"text"**

**Message (Text Body) :**
```
📋 NOUVEAU QUESTIONNAIRE ANCESTRAL

👤 NOM : {{1.nom}}
📞 TÉLÉPHONE : {{1.telephone}}
👫 SEXE : {{1.sexe}}

📊 RÉSULTATS
• Score : {{1.score}}/{{1.scoreMax}}
• Pourcentage : {{1.pourcentage}}%
• Profil : {{1.profil}}

📋 TITRE : {{1.profilTitle}}
📝 SOUS-TITRE : {{1.profilSubtitle}}

🔢 Nombre de questions : {{1.nombreQuestions}}

⏰ Date : {{formatDate(1.timestamp; "DD/MM/YYYY HH:mm")}}
```

**Note :** Les numéros `{{1.xxx}}` font référence aux données reçues par le webhook (module 1).

### 3.3 Tester le module

1. Cliquez sur **"Run once"** en bas à gauche
2. Complétez un questionnaire sur votre site
3. Vérifiez que le message arrive sur votre WhatsApp

---

## ⚠️ Problème fréquent : "Value must not be empty"

Si vous voyez cette erreur, cela signifie que vous devez **d'abord recevoir des données** via le webhook.

### Solution :

1. **Désactivez temporairement** le module WhatsApp (clic droit > Disable)
2. **Activez le scénario** (bouton ON en bas à gauche)
3. **Allez sur votre site** et complétez un questionnaire
4. Les données arriveront dans le webhook
5. **Réactivez le module WhatsApp**
6. Make.com aura maintenant les données pour mapper les champs
7. **Testez à nouveau** en complétant un autre questionnaire

---

## 🎯 Étape 4 : Activer le scénario

1. Cliquez sur **"Save"** en bas à gauche
2. Activez le scénario avec le bouton **ON/OFF**
3. Le scénario est maintenant actif et fonctionnera automatiquement

---

## 📱 Étape 5 : Vérifier votre numéro WhatsApp

### Important : Numéro de test vs Production

Par défaut, Meta vous donne un **numéro de test**. Vous devez **vérifier votre propre numéro** pour recevoir les messages.

1. Allez dans **Meta for Developers > Votre App > WhatsApp > API Setup**
2. Section **"To"** (Destinataire)
3. Cliquez sur **"Manage phone number list"**
4. Ajoutez votre numéro : **+33756984875**
5. Vous recevrez un code de vérification par SMS
6. Entrez le code pour vérifier

⚠️ **Tant que votre numéro n'est pas vérifié, les messages n'arriveront pas !**

---

## 🚀 Solution Alternative : Utiliser WhatsApp directement (PLUS SIMPLE)

Si la configuration Meta est trop complexe, il existe une solution **BEAUCOUP PLUS SIMPLE** qui ne nécessite **AUCUNE configuration Meta** :

### Utiliser un lien WhatsApp direct

Au lieu d'envoyer automatiquement, vous pouvez créer un **lien WhatsApp** qui pré-remplit le message :

**Dans Make.com :**

1. Remplacez le module "WhatsApp Business Cloud" par un module **"Tools > Set variable"**
2. Créez une variable avec le message formaté
3. Utilisez ce message pour créer un lien WhatsApp

**OU** (encore plus simple) : Modifiez directement le code de votre application pour créer un bouton WhatsApp qui envoie les données.

Voulez-vous que je vous montre cette alternative plus simple ?

---

## 📧 Solution Alternative 2 : Recevoir par Email (LE PLUS SIMPLE)

Si WhatsApp est trop compliqué, vous pouvez recevoir les données par **Email** :

### Dans Make.com :

1. Supprimez le module "WhatsApp Business Cloud"
2. Cliquez sur le **+** après le webhook
3. Cherchez **"Email"**
4. Sélectionnez **"Send an Email"**
5. Configurez :
   - **To** : votre@email.com
   - **Subject** : Nouveau questionnaire - {{1.nom}}
   - **Content** : Utilisez le même format que pour WhatsApp
6. Sauvegardez et activez

**Aucune configuration complexe, ça marche immédiatement !**

---

## 🔍 Dépannage

### Erreur : "Invalid access token"
- Votre token a expiré (tokens temporaires = 24h)
- Créez un **System User** et générez un **Permanent Token**

### Erreur : "Recipient phone number not a WhatsApp number"
- Vérifiez que votre numéro est bien ajouté dans la liste des numéros de test
- Vérifiez le format : `33756984875` (pas d'espaces, pas de +)

### Pas de message reçu
- Vérifiez que le scénario Make est bien **activé** (ON)
- Vérifiez dans Make > History si le webhook a bien reçu les données
- Vérifiez que votre numéro est bien **vérifié** dans Meta for Developers

### "Value must not be empty"
- Le webhook n'a pas encore reçu de données
- Complétez un questionnaire d'abord
- Ou utilisez "Run once" pour tester avec des données fictives

---

## 💡 Ma Recommandation

**Pour démarrer rapidement :**

1. **Option 1 (LA PLUS SIMPLE)** : Utilisez l'**Email** au lieu de WhatsApp
   - Configuration : 2 minutes
   - Fiabilité : 100%
   - Vous recevrez toutes les données par email

2. **Option 2** : Créez un **bouton WhatsApp** dans votre application
   - L'utilisateur clique et envoie lui-même le message
   - Pas de configuration Meta nécessaire
   - Je peux vous montrer le code

3. **Option 3 (LA PLUS COMPLEXE)** : WhatsApp Business Cloud automatique
   - Configuration : 30-60 minutes
   - Nécessite configuration Meta
   - Messages automatiques

---

## ❓ Que voulez-vous faire ?

1. **Continuer avec WhatsApp Business Cloud** : Suivez le guide ci-dessus
2. **Passer à l'Email** : Beaucoup plus simple, je peux vous aider
3. **Ajouter un bouton WhatsApp** : L'utilisateur envoie lui-même, très simple

Dites-moi ce que vous préférez et je vous aide ! 🚀
