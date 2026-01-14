# 📧 Alternative : Recevoir les réponses par Email (EmailJS)

Si vous préférez recevoir les données par email plutôt que dans Google Sheets, voici une alternative simple avec **EmailJS**.

## Étape 1 : Créer un compte EmailJS

1. Allez sur [EmailJS.com](https://www.emailjs.com/)
2. Créez un compte gratuit (100 emails/mois gratuits)
3. Confirmez votre email

## Étape 2 : Configurer un service email

1. Dans le dashboard EmailJS, allez dans **Email Services**
2. Cliquez sur **Add New Service**
3. Choisissez votre fournisseur email (Gmail recommandé)
4. Suivez les instructions pour connecter votre compte
5. Notez le **Service ID** (ex: `service_abc123`)

## Étape 3 : Créer un template d'email

1. Allez dans **Email Templates**
2. Cliquez sur **Create New Template**
3. Configurez le template comme suit :

**Template Name :** Questionnaire Ancestral

**Subject :** 📋 Nouveau questionnaire complété - {{nom}}

**Content :**
```
Nouveau questionnaire complété !

📅 Date : {{date}}

👤 INFORMATIONS PERSONNELLES
- Nom : {{nom}}
- Téléphone : {{telephone}}
- Sexe : {{sexe}}

📊 RÉSULTATS
- Score : {{score}} / {{scoreMax}} ({{pourcentage}}%)
- Profil obtenu : {{profil}}
- Titre : {{profilTitle}}
- Sous-titre : {{profilSubtitle}}

📝 DÉTAILS DES RÉPONSES
{{reponses_detail}}

---
Envoyé automatiquement depuis le questionnaire ancestral
```

4. Cliquez sur **Save**
5. Notez le **Template ID** (ex: `template_xyz789`)

## Étape 4 : Obtenir votre clé publique

1. Allez dans **Account** > **General**
2. Notez votre **Public Key** (ex: `abcdefGHIJKLM123`)

## Étape 5 : Installer EmailJS dans le projet

Ouvrez un terminal et exécutez :

```bash
cd /Users/thomascascales/questionnaire-ancestral/questionnaire-ancestral
npm install @emailjs/browser
```

## Étape 6 : Modifier le code

### Dans `src/App.jsx`, trouvez la fonction `saveDataToSheet` et remplacez-la par :

```javascript
import emailjs from '@emailjs/browser';

// Ajouter en haut du fichier, après les autres imports

// Dans le composant, remplacer la fonction saveDataToSheet :

async function saveDataToSheet() {
  const prof = personality();
  if (!prof) return;

  // Créer un résumé des réponses
  const reponsesDetail = answers.map((ans, idx) => 
    `Question ${idx + 1}: ${ans.question}
    Catégorie: ${ans.category}
    Score: ${ans.score}/4`
  ).join('\n\n---\n\n');

  const templateParams = {
    date: new Date().toLocaleString('fr-FR'),
    nom: name,
    telephone: phone,
    sexe: sex,
    score: score,
    scoreMax: maxScore,
    pourcentage: Math.round((score / maxScore) * 100),
    profil: prof.label,
    profilTitle: prof.title,
    profilSubtitle: prof.subtitle,
    reponses_detail: reponsesDetail,
  };

  try {
    await emailjs.send(
      'VOTRE_SERVICE_ID',      // Remplacer par votre Service ID
      'VOTRE_TEMPLATE_ID',     // Remplacer par votre Template ID
      templateParams,
      'VOTRE_PUBLIC_KEY'       // Remplacer par votre Public Key
    );
    
    console.log('✅ Email envoyé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
  }
}
```

## Étape 7 : Configurer les identifiants

Dans la fonction ci-dessus, remplacez :
- `'VOTRE_SERVICE_ID'` par votre Service ID
- `'VOTRE_TEMPLATE_ID'` par votre Template ID
- `'VOTRE_PUBLIC_KEY'` par votre Public Key

Exemple :
```javascript
await emailjs.send(
  'service_abc123',
  'template_xyz789',
  templateParams,
  'abcdefGHIJKLM123'
);
```

## ✅ C'est terminé !

Maintenant, chaque fois qu'un utilisateur complète le questionnaire, vous recevrez un email avec toutes ses informations !

## 📧 Format de l'email reçu

Vous recevrez un email structuré contenant :
- Les informations personnelles (nom, téléphone, sexe)
- Le score et le profil obtenu
- Toutes les réponses détaillées avec les questions et scores

## 💡 Avantages de cette méthode

- ✅ Configuration simple
- ✅ Notifications en temps réel par email
- ✅ 100 emails gratuits par mois
- ✅ Pas besoin de gérer une base de données
- ✅ Les données arrivent directement dans votre boîte mail

## 🔒 Sécurité

- Vos clés sont publiques mais limitées à votre domaine
- Les emails sont envoyés de manière sécurisée
- Vous contrôlez qui reçoit les emails (dans le template EmailJS)
