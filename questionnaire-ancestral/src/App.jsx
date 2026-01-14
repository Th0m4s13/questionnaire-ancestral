import { useMemo, useState, useEffect } from "react";
import "./App.css";

const BG_IMAGE = "/BG_IMAGE.png"; // dans /public

// Fonction pour mélanger un tableau (Fisher-Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sex, setSex] = useState(""); // "homme" | "femme"
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentAnimating, setConsentAnimating] = useState(false);
  const [consentChoice, setConsentChoice] = useState(null); // 'yes' ou 'no'
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questionTransitioning, setQuestionTransitioning] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Questions (base)
  const baseQuestions = useMemo(
    () => [
      {
        question: "Le matin au réveil, tu te sens comment ?",
        category: "energie",
        options: [
          { text: " En pleine forme, prêt à attaquer la journée", score: 4 },
          { text: " Il me faut un moment pour me réveiller vraiment", score: 3 },
          { text: " Je suis déjà fatigué au lever", score: 2 },
          { text: " Je me lève vidé, comme si je n'avais pas dormi", score: 1 },
        ],
      },
      {
        question: "Tes mains et pieds sont :",
        category: "circulation",
        options: [
          { text: " Toujours bien chauds", score: 4 },
          { text: " Froids parfois, selon la saison", score: 3 },
          { text: " Souvent froids même à l'intérieur", score: 2 },
          { text: " Gelés en permanence, même sous la couette", score: 1 },
        ],
      },
      {
        question: "Ton niveau d'énergie en journée est :",
        category: "energie",
        options: [
          { text: " Stable du matin au soir", score: 4 },
          { text: " Variable mais gérable", score: 3 },
          { text: " En dents de scie, avec des coups de mou", score: 2 },
          { text: " Épuisement constant, même sans effort", score: 1 },
        ],
      },
      {
        question: "Tu as souvent besoin de café ou thé pour fonctionner ?",
        category: "energie",
        options: [
          { text: " Jamais", score: 4 },
          { text: " De temps en temps", score: 3 },
          { text: " Tous les jours", score: 2 },
          { text: ' Plusieurs fois par jour sinon je "tombe"', score: 1 },
        ],
      },
      {
        question: "Tu dors :",
        category: "sommeil",
        options: [
          { text: " Profondément et sans réveils", score: 4 },
          { text: " Légèrement, je me réveille parfois", score: 3 },
          { text: " Je me réveille plusieurs fois", score: 2 },
          { text: " Je dors très mal ou j'ai de l'insomnie", score: 1 },
        ],
      },
      {
        question: "Tu as besoin de combien de sommeil pour récupérer ?",
        category: "sommeil",
        options: [
          { text: " 5–6h me suffisent", score: 4 },
          { text: " Il me faut 8h minimum", score: 3 },
          { text: " Même 9h ne suffisent pas", score: 2 },
          { text: " Je suis toujours épuisé, même avec 10h", score: 1 },
        ],
      },
      {
        question: "Tu ressens des ballonnements ou gaz :",
        category: "digestion",
        options: [
          { text: " Jamais", score: 4 },
          { text: " Parfois, après certains plats", score: 3 },
          { text: " Quasiment tous les jours", score: 2 },
          { text: " Constamment, avec douleurs", score: 1 },
        ],
      },
      {
        question: "Ta langue le matin est :",
        category: "digestion",
        options: [
          { text: " Rose et propre", score: 4 },
          { text: " Un peu blanche parfois", score: 3 },
          { text: " Blanche quasi tout le temps", score: 2 },
          { text: " Épaisse, pâteuse, chargée tous les jours", score: 1 },
        ],
      },
      {
        question: "Tu es tombé malade combien de fois cette année (rhume, fièvre…) ?",
        category: "immunite",
        options: [
          { text: " Jamais", score: 4 },
          { text: " 1 ou 2 fois", score: 3 },
          { text: " Plus de 3 fois", score: 2 },
          { text: " Constamment, ou infections longues", score: 1 },
        ],
      },
      {
        question: "Quand tu es malade, tu guéris en :",
        category: "immunite",
        options: [
          { text: " 2–3 jours", score: 4 },
          { text: " 5–6 jours", score: 3 },
          { text: " 1 à 2 semaines", score: 2 },
          { text: " Ça traîne toujours, je rechute souvent", score: 1 },
        ],
      },
      {
        question: "Tu as des douleurs articulaires ou musculaires :",
        category: "inflammation",
        options: [
          { text: " Jamais", score: 4 },
          { text: " Rarement", score: 3 },
          { text: " Régulièrement", score: 2 },
          { text: " Tous les jours ou invalidantes", score: 1 },
        ],
      },
      {
        question: "Tu as des allergies, eczéma, urticaire ou réactions cutanées ?",
        category: "inflammation",
        options: [
          { text: " Non", score: 4 },
          { text: " Un peu, saisonnièrement", score: 3 },
          { text: " Régulièrement dans l'année", score: 2 },
          { text: " Quasi en permanence", score: 1 },
        ],
      },
      {
        question: "Tes blessures (coupures, bleus) cicatrisent :",
        category: "immunite",
        options: [
          { text: " Rapidement", score: 4 },
          { text: " Un peu lentement", score: 3 },
          { text: " Lentement et mal", score: 2 },
          { text: " Très lentement, infections fréquentes", score: 1 },
        ],
      },
      {
        question: "Tes dents et gencives vont comment ?",
        category: "mineralisation",
        options: [
          { text: " Solides, jamais de caries ou saignement", score: 4 },
          { text: " Quelques saignements ou caries récentes", score: 3 },
          { text: " Caries fréquentes, gencives sensibles", score: 2 },
          { text: " Douleurs dentaires ou dents qui se déchaussent", score: 1 },
        ],
      },
      {
        question: "Tes ongles sont :",
        category: "mineralisation",
        options: [
          { text: " Durs, lisses", score: 4 },
          { text: " Cassants ou striés", score: 3 },
          { text: " Qui se dédoublent souvent", score: 2 },
          { text: " Très mous, avec tâches ou anomalies", score: 1 },
        ],
      },
      {
        question: "Ta peau est :",
        category: "peau",
        options: [
          { text: " Souple, hydratée", score: 4 },
          { text: " Sèche parfois", score: 3 },
          { text: " Très sèche, qui pèle", score: 2 },
          { text: " Acné, eczéma ou inflammation chronique", score: 1 },
        ],
      },
      {
        question: "Tu remarques une perte de cheveux ?",
        category: "cheveux",
        options: [
          { text: " Non", score: 4 },
          { text: " Légère, périodique", score: 3 },
          { text: " Oui, depuis plusieurs mois", score: 2 },
          { text: " Chute constante, zones dégarnies", score: 1 },
        ],
      },
      {
        question: "Es-tu attiré par le sucre ?",
        category: "metabolisme",
        options: [
          { text: " Jamais", score: 4 },
          { text: " De temps en temps", score: 3 },
          { text: " Tous les jours", score: 2 },
          { text: " Plusieurs fois par jour, besoin urgent", score: 1 },
        ],
      },
      {
        question: "Tu as des boutons, acné ou kystes sous-cutanés ?",
        category: "peau",
        options: [
          { text: " Jamais, peau toujours nette", score: 4 },
          { text: " Quelques-uns occasionnellement", score: 3 },
          { text: " Fréquemment, selon stress ou alimentation", score: 2 },
          { text: " Constamment, peau inflammée ou douloureuse", score: 1 },
        ],
      },
      {
        question:
          "Tu as des réactions digestives ou physiques après certains aliments (laitiers, gluten, fruits, légumes…) ?",
        category: "digestion",
        options: [
          { text: " Jamais", score: 4 },
          { text: " Parfois, mais c'est léger", score: 3 },
          { text: " Oui, j'évite certains aliments pour ça", score: 2 },
          { text: " Oui, plusieurs groupes d'aliments me rendent mal", score: 1 },
        ],
      },
    ].map(q => ({
      ...q,
      options: shuffleArray(q.options)
    })),
    []
  );

  // Question Femme seulement
  const femaleOnly = useMemo(
    () => [
      {
        question: "Ton cycle menstruel est-il :",
        category: "hormones",
        options: shuffleArray([
          { text: " Régulier, sans douleur ni symptômes", score: 4 },
          { text: " Régulier mais avec quelques douleurs/irritabilité", score: 3 },
          { text: " Irrégulier, douleurs ou fatigue marquée", score: 2 },
          {
            text: " Très irrégulier, avec acné, gonflements, saignements abondants",
            score: 1,
          },
          { text: " Pas de règles du tout", score: 1 },
        ]),
      },
    ],
    []
  );

  const questions = useMemo(() => {
    if (sex === "femme") return [...baseQuestions, ...femaleOnly];
    if (sex === "homme") return baseQuestions;
    return [];
  }, [sex, baseQuestions, femaleOnly]);

  const maxScore = useMemo(() => questions.length * 4, [questions.length]);

  const canStart =
    name.trim().length >= 2 &&
    phone.trim().length >= 10 &&
    (sex === "homme" || sex === "femme");

  // Auto-progression de la barre de chargement
  useEffect(() => {
    if (showCompleted) {
      setLoadingProgress(0);
      
      // Animation de la barre de progression
      const duration = 3000; // 3 secondes
      const steps = 60; // 60 frames
      const increment = 100 / steps;
      const interval = duration / steps;
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          setLoadingProgress(100);
          clearInterval(progressInterval);
          // Révéler les résultats après une courte pause
          setTimeout(() => {
            setShowCompleted(false);
            setFinished(true);
            saveDataToSheet();
          }, 200);
        } else {
          setLoadingProgress(currentProgress);
        }
      }, interval);
      
      return () => clearInterval(progressInterval);
    }
  }, [showCompleted]);

  function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  }

  function createExplosion(event) {
    const x = event.clientX;
    const y = event.clientY;

    // Créer 12 traits rayonnants
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("span");
      particle.classList.add("explosion-particle");
      
      const angle = (i / 12) * Math.PI * 2;
      const maxLength = 60 + Math.random() * 30; // longueur maximale du trait
      const thickness = 1; // épaisseur ultra fine
      
      particle.style.position = 'fixed';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${maxLength}px`;
      particle.style.height = `${thickness}px`;
      particle.style.transformOrigin = '0 50%'; // Origine à gauche du trait (point de clic)
      particle.style.setProperty('--rotation', `${angle}rad`);
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 1200);
    }
  }

  function answer(option, event) {
    const currentQuestion = questions[step];
    setScore((s) => s + option.score);
    setAnswers((prev) => [...prev, {
      category: currentQuestion.category,
      score: option.score,
      question: currentQuestion.question,
    }]);
    
    // Animation de transition
    setQuestionTransitioning(true);
    
    setTimeout(() => {
      if (step + 1 < questions.length) {
        // Passe à la question suivante
        setStep((x) => x + 1);
        setQuestionTransitioning(false);
      } else {
        // Dernière question : afficher le message "Questionnaire terminé"
        setShowCompleted(true);
        setQuestionTransitioning(false);
      }
    }, 400); // Transition rapide
  }

  function goBack() {
    if (step > 0) {
      // Retirer la dernière réponse
      const lastAnswer = answers[answers.length - 1];
      if (lastAnswer) {
        setScore((s) => s - lastAnswer.score);
        setAnswers((prev) => prev.slice(0, -1));
      }
      // Revenir à la question précédente
      setStep((x) => x - 1);
    }
  }

  function revealResults() {
    setShowCompleted(false);
    setFinished(true);
    
    // Enregistrer les données
    saveDataToSheet();
  }

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
      // URL du webhook Make.com
      const WEBHOOK_URL = 'https://hook.eu1.make.com/yf61fckihxirt84w6r5rhd5813e16s5v';
      
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        console.log('✅ Données envoyées sur WhatsApp avec succès');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);
    }
  }

  // Thèmes
  const THEME_PRESETS = {
    brume: {
      name: "Brume Terre",
      halo1: "#D7F2E3",
      halo2: "#FDE6D8",
      accent: "#F4A261",
      chipBg: "rgba(244,162,97,0.14)",
      blockBorder: "rgba(244,162,97,0.35)",
    },
    aube: {
      name: "Aube Fluide",
      halo1: "#E6F0FF",
      halo2: "#FDE2F3",
      accent: "#7C9DFF",
      chipBg: "rgba(124,157,255,0.14)",
      blockBorder: "rgba(124,157,255,0.35)",
    },
    solaire: {
      name: "Solaire Clair",
      halo1: "#FFF1C7",
      halo2: "#D7F7F2",
      accent: "#2A9D8F",
      chipBg: "rgba(42,157,143,0.14)",
      blockBorder: "rgba(42,157,143,0.35)",
    },
  };

  // Analyse des réponses par catégorie
  function analyzeAnswers() {
    const categories = {};
    answers.forEach((ans) => {
      if (!categories[ans.category]) {
        categories[ans.category] = { total: 0, count: 0, scores: [] };
      }
      categories[ans.category].total += ans.score;
      categories[ans.category].count += 1;
      categories[ans.category].scores.push(ans.score);
    });

    // Calculer la moyenne par catégorie
    const categoryAverages = {};
    Object.keys(categories).forEach((cat) => {
      categoryAverages[cat] = categories[cat].total / categories[cat].count;
    });

    // Identifier les catégories problématiques (moyenne < 2.5)
    const weakCategories = Object.keys(categoryAverages)
      .filter((cat) => categoryAverages[cat] < 2.5)
      .sort((a, b) => categoryAverages[a] - categoryAverages[b]);

    // Identifier les catégories moyennes (2.5 <= moyenne < 3.5)
    const moderateCategories = Object.keys(categoryAverages)
      .filter((cat) => categoryAverages[cat] >= 2.5 && categoryAverages[cat] < 3.5)
      .sort((a, b) => categoryAverages[a] - categoryAverages[b]);

    return { weakCategories, moderateCategories, categoryAverages };
  }

  // Traduction des catégories en descriptions
  const categoryDescriptions = {
    energie: { name: "énergie", issues: "fatigue chronique, manque de vitalité", advice: "soutenir tes glandes surrénales et ton métabolisme énergétique" },
    circulation: { name: "circulation sanguine", issues: "extrémités froides, mauvaise circulation", advice: "améliorer ta circulation avec des aliments réchauffants et du mouvement" },
    sommeil: { name: "qualité du sommeil", issues: "réveils nocturnes, insomnie", advice: "réguler ton rythme circadien et apaiser ton système nerveux" },
    digestion: { name: "digestion", issues: "ballonnements, gaz, langue chargée", advice: "restaurer ta flore intestinale et alléger tes repas" },
    immunite: { name: "immunité", issues: "infections fréquentes, cicatrisation lente", advice: "renforcer ton système immunitaire avec les bons nutriments" },
    inflammation: { name: "inflammation", issues: "douleurs articulaires, allergies", advice: "réduire l'inflammation avec une alimentation anti-inflammatoire" },
    mineralisation: { name: "minéralisation", issues: "ongles cassants, problèmes dentaires", advice: "améliorer ton apport en minéraux biodisponibles" },
    peau: { name: "santé de la peau", issues: "sécheresse, acné, inflammations cutanées", advice: "nourrir ta peau de l'intérieur avec les bons lipides et vitamines" },
    cheveux: { name: "santé capillaire", issues: "chute de cheveux", advice: "nourrir tes follicules pileux avec protéines et minéraux" },
    metabolisme: { name: "métabolisme", issues: "envies de sucre, déséquilibre glycémique", advice: "stabiliser ta glycémie avec une alimentation adaptée" },
    hormones: { name: "équilibre hormonal", issues: "cycles irréguliers, symptômes prémenstruels", advice: "soutenir ton équilibre hormonal naturellement" },
  };

  // Générer un texte personnalisé basé sur les problèmes identifiés
  function generatePersonalizedInsights(weakCats, modCats, isFemme) {
    if (weakCats.length === 0) return "";

    const tu = isFemme ? "tu" : "tu";
    const ton = isFemme ? "ta" : "ton";
    const tes = "tes";
    
    let text = `\n\nD'après tes réponses, voici les domaines qui nécessitent une attention particulière :\n\n`;
    
    // Problèmes majeurs
    if (weakCats.length > 0) {
      text += `**Points critiques identifiés :**\n`;
      weakCats.slice(0, 3).forEach((cat) => {
        const desc = categoryDescriptions[cat];
        if (desc) {
          text += `• **${desc.name.charAt(0).toUpperCase() + desc.name.slice(1)}** : ${tu} présentes des signes de ${desc.issues}. Il est essentiel de ${desc.advice}.\n`;
        }
      });
    }

    // Problèmes modérés
    if (modCats.length > 0 && modCats.length <= 3) {
      text += `\n**Points à surveiller :**\n`;
      modCats.forEach((cat) => {
        const desc = categoryDescriptions[cat];
        if (desc) {
          text += `• ${desc.name.charAt(0).toUpperCase() + desc.name.slice(1)} : quelques signes à ne pas négliger.\n`;
        }
      });
    }

    return text;
  }

  function personality() {
    if (!questions.length) return null;

    const pct = score / maxScore;
    const prenom = name.trim() || "toi";
    const isFemme = sex === "femme";
    const g = (masc, fem) => (isFemme ? fem : masc);
    const analysis = analyzeAnswers();

    const common = {
      intro: `Ok ${prenom}, voici ce que Mao a analysé de toi.`,
      footer:
        "Objectif : énergie stable, digestion calme, peau/cheveux qui suivent.",
    };

    if (pct <= 0.5) {
      return {
        themeKey: "brume",
        label: "TERRAIN CRITIQUE",
        title: "",
        subtitle: "",
        story: `Ton terrain est fragilisé. Le corps parle, mais ses signaux restent ignorés depuis trop longtemps. Les déséquilibres s'installent quand on s'éloigne de ce que nos ancêtres mangeaient depuis des millénaires.

À moyen terme, sans retour aux fondamentaux, la dégradation suit son cours. Les organes compensent encore, mais ils s'épuisent. Le foie surchargé, l'intestin irrité, les glandes vidées. Les symptômes deviennent plus fréquents, plus lourds, plus difficiles à inverser.

Sur le long terme, c'est la dette qui s'accumule. Fatigue installée, douleurs chroniques, métabolisme effondré. Des années de souffrance évitables si on agit maintenant. Plus on attend, plus le chemin du retour s'allonge.

Tes ancêtres ne connaissaient pas ces maux. Ils mangeaient dense, gras, complet. Abats, bouillons, graisses animales. Leur terrain restait solide.

Agir maintenant est non négociable. La solution la plus directe est de prendre un appel avec notre équipe pour analyser ta situation et poser un plan clair avant que la trajectoire ne devienne irréversible.`,
        highlights: [],
        plan: [],
        mantra: "",
        trap: "",
        tip: "",
        hasIclosedLink: true,
        iclosedUrl: "https://app.iclosed.io/e/maobrut/cheveux",
        ...common,
      };
    }

    if (pct <= 0.75) {
      return {
        themeKey: "aube",
        label: "TERRAIN DÉSÉQUILIBRÉ",
        title: "",
        subtitle: "",
        story: `Ton alimentation actuelle t'éloigne de ce que ton corps attend. Il compense encore, mais les premiers signaux apparaissent. Le terrain se fragilise quand on le nourrit avec des aliments que nos ancêtres n'ont jamais connus.

Le retour à une alimentation ancestrale n'est pas une option. C'est une nécessité. Simple, dense, préparée avec soin. Le foie est au centre de tout. Surchargé par les huiles industrielles, les sucres, les produits transformés, il entraîne le reste du corps dans sa chute. Le soutenir avec les bons aliments, le nettoyer avec les bonnes graisses, c'est la première étape.

Sans correction réelle, les troubles digestifs, métaboliques, inflammatoires ne sont qu'une question de temps. Pas de "si", seulement de "quand".

Nos ancêtres savaient. Ils mangeaient l'animal entier, cuisaient les os pendant des heures, respectaient les graisses saturées. Leur corps fonctionnait.

Pour éviter la dégradation, suis la formation proposée pour comprendre quoi manger, comment préparer, comment soutenir tes organes. Un appel avec l'équipe te permettra d'identifier rapidement les erreurs et de poser un plan adapté à ta situation.

Agir maintenant t'évite des complications futures. Attendre, c'est laisser la dette se creuser. Le plus efficace reste de prendre directement un appel avec l'équipe via ce lien afin d'agir immédiatement.`,
        highlights: [],
        plan: [],
        mantra: "",
        trap: "",
        tip: "",
        hasIclosedLink: true,
        iclosedUrl: "https://app.iclosed.io/e/maobrut/cheveux",
        ...common,
      };
    }

    if (pct <= 0.875) {
      return {
        themeKey: "aube",
        label: "TERRAIN STABLE",
        title: "",
        subtitle: "",
        story: `Ton terrain est correct. Les bases sont là, mais quelques ajustements peuvent faire la différence entre une santé moyenne et une vitalité réelle. Nos ancêtres ne se contentaient pas de "correct". Ils visaient la densité maximale.

Sur le long terme, continuer à densifier ton alimentation reste la voie. Pense à intégrer les plantes traditionnelles de ton territoire. En France, l'ortie, le persil, le pissenlit. Chaque région a ses trésors oubliés. L'objectif reste le même depuis des millénaires : des aliments à haute densité nutritionnelle, préparés avec soin.

Si certains points restent flous, la formation te donnera les clés pour comprendre et choisir. Si tu ressens de la fatigue après les repas ou des signes de déséquilibre, c'est le moment d'ajuster. Les plantes médicinales de nos ancêtres, associées aux abats et aux bouillons, peuvent tout changer.

Se former ou se faire accompagner, c'est accélérer le processus. Avec les bons outils, tout se met en place naturellement. Ne pas maintenir cet équilibre, c'est risquer de perdre ce que tu as déjà construit.`,
        highlights: [],
        plan: [],
        mantra: "",
        trap: "",
        tip: "",
        hasIclosedLink: true,
        iclosedUrl: "https://app.iclosed.io/e/maobrut/cheveux",
        ...common,
      };
    }

    return {
      themeKey: "solaire",
      label: "TERRAIN ANCESTRAL",
      title: "",
      subtitle: "",
      story: `Ton terrain est solide. Tu manges comme nos ancêtres mangeaient. Dense, gras, complet. Une vraie attention à la qualité, à la préparation, aux nutriments nobles. C'est rare. C'est précieux.

Continue sur cette voie. C'est celle de la santé durable, du corps qui fonctionne, de l'énergie stable année après année. Pas de prise de poids inexpliquée, pas de fatigue chronique, pas de dégradation lente. Tu te projettes sur le long terme avec une qualité de vie que la plupart ont oubliée.

À court et moyen terme, tout est au vert. Ton évaluation est excellente. Il reste toujours possible d'affiner quelques détails. Une liste de courses mieux organisée, une rotation des abats plus régulière, un bouillon plus fréquent. Mais l'essentiel est là.

Tes ancêtres seraient fiers. Tu as retrouvé ce qu'ils savaient. Ne relâche pas. Les acquis se perdent vite quand on oublie d'où l'on vient. Maintiens le cap et ton corps te le rendra pendant des décennies.`,
      highlights: [],
      plan: [],
      mantra: "",
      trap: "",
      tip: "",
      ...common,
    };
  }

  const prof = personality();
  const theme = prof ? THEME_PRESETS[prof.themeKey] : THEME_PRESETS.aube;

  function resetAll() {
    setStep(0);
    setScore(0);
    setAnswers([]);
    setFinished(false);
    setQuestionTransitioning(false);
    setShowCompleted(false);
  }

  function restartFromStart() {
    setName("");
    setPhone("");
    setSex("");
    setConsentGiven(false);
    setConsentAnimating(false);
    setStep(0);
    setScore(0);
    setAnswers([]);
    setFinished(false);
    setQuestionTransitioning(false);
    setShowCompleted(false);
  }

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={{ ...styles.bgPhoto, backgroundImage: `url(${BG_IMAGE})` }} />
      <div style={{ ...styles.overlay, background: "rgba(0,0,0,0.3)" }} />

      <div style={styles.card}>
        {!canStart ? (
          <>
            <div style={styles.kicker}>TON PROFIL ALIMENTAIRE</div>
            <h2 style={{ margin: "8px 0 0" }}>Avant de commencer</h2>

            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
              <input
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton prénom (ou pseudo)"
                type="text"
                autoComplete="name"
              />

              <input
                style={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ton numéro de téléphone"
                type="tel"
                autoComplete="tel"
              />

              <div style={styles.sexRow}>
                <button
                  type="button"
                  onClick={() => setSex("homme")}
                  style={{
                    ...styles.sexBtn,
                    ...(sex === "homme" ? styles.sexBtnActive : null),
                  }}
                >
                  Homme
                </button>
                <button
                  type="button"
                  onClick={() => setSex("femme")}
                  style={{
                    ...styles.sexBtn,
                    ...(sex === "femme" ? styles.sexBtnActive : null),
                  }}
                >
                  Femme
                </button>
              </div>

              <p style={styles.note}>
                Tu dois remplir <b>prénom + téléphone</b> et choisir <b>Homme/Femme</b>.
              </p>
            </div>
          </>
        ) : !consentGiven ? (
          <div className={consentAnimating ? "consent-fade-out" : ""}>
            <div style={styles.kicker}>AVANT DE CONTINUER...</div>
            <h2 style={{ margin: "12px 0 0", fontSize: 20 }}>Avant de continuer...</h2>

            <p style={styles.consentText}>
              Les prochaines questions abordent des aspects plus personnels de ta vie. Nous comprenons que certains sujets peuvent être sensibles.
              <br /><br />
              Tes réponses resteront strictement confidentielles et anonymes. Tu es libre de passer toute question qui ne te convient pas, ou d'arrêter à tout moment.
              <br /><br />
              <strong>Souhaites-tu poursuivre ?</strong>
            </p>

            <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
              <button
                style={styles.consentButton}
                onClick={() => {
                  setConsentChoice('yes');
                  setTimeout(() => {
                    setConsentAnimating(true);
                    setTimeout(() => {
                      setConsentGiven(true);
                      setConsentAnimating(false);
                      setConsentChoice(null);
                    }, 300);
                  }, 800);
                }}
                disabled={consentChoice !== null}
              >
                <span className={consentChoice === 'yes' ? 'consent-check-box' : ''} 
                      style={{ 
                        display: 'inline-block',
                        color: consentChoice === 'yes' ? '#22c55e' : 'inherit',
                        fontWeight: consentChoice === 'yes' ? 'bold' : 'normal'
                      }}>
                  {consentChoice === 'yes' ? '✓' : '☐'}
                </span> Oui, je me sens à l'aise pour continuer
              </button>
              <button
                style={{ ...styles.consentButton, background: "rgba(239, 68, 68, 0.25)", border: "1px solid rgba(239, 68, 68, 0.35)" }}
                onClick={() => {
                  setConsentChoice('no');
                  setTimeout(() => {
                    alert("Merci pour ta visite. Prends soin de toi !");
                    restartFromStart();
                  }, 800);
                }}
                disabled={consentChoice !== null}
              >
                <span className={consentChoice === 'no' ? 'consent-cross-box' : ''} 
                      style={{ 
                        display: 'inline-block',
                        color: consentChoice === 'no' ? '#ef4444' : 'inherit',
                        fontWeight: consentChoice === 'no' ? 'bold' : 'normal'
                      }}>
                  {consentChoice === 'no' ? '✗' : '☐'}
                </span> Non, je préfère m'arrêter ici
              </button>
            </div>
          </div>
        ) : showCompleted ? (
          <div className="completed-message">
            <div style={styles.completedContainer}>
              <div className="completed-icon-pulse" style={styles.completedIcon}>✓</div>
              <h2 style={{ margin: "16px 0 0", fontSize: 28 }}>Questionnaire terminé !</h2>
              <p style={{ margin: "20px 0 24px", opacity: 0.9, fontSize: 16 }}>
                Ton profil a été analysé avec soin.
              </p>
              
              <p style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 600, opacity: 0.95 }}>
                Prêt·e à voir ton évaluation personnelle ? 🎯
              </p>
              
              {/* Barre de progression */}
              <div style={styles.progressBarContainer}>
                <div 
                  style={{
                    ...styles.progressBarFill,
                    width: `${loadingProgress}%`
                  }}
                />
              </div>
              
              <p style={{ margin: "12px 0 0", opacity: 0.75, fontSize: 14 }}>
                Chargement de ton analyse personnalisée...
              </p>
            </div>
          </div>
        ) : !finished ? (
          <div className={questionTransitioning ? "question-fade-out" : "questionnaire-fade-in"}>
            <div style={styles.kicker}>TA CARTE ANCESTRALE</div>

            <h2 style={{ margin: "10px 0 0" }}>{questions[step]?.question}</h2>

            <div style={styles.options}>
              {questions[step]?.options?.map((opt, i) => (
                <button key={i} style={styles.button} onClick={(e) => answer(opt, e)}>
                  {opt.text}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', marginTop: 16 }}>
              <p style={styles.progress}>
                Question {step + 1} / {questions.length}
              </p>
              
              {step > 0 && (
                <button
                  onClick={goBack}
                  style={styles.backButton}
                  title="Retour à la question précédente"
                >
                  ← Retour
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div style={styles.kicker}>TA CARTE ANCESTRALE</div>

            <div style={{ ...styles.smallIntro, textAlign: "center", marginTop: 12, marginBottom: 16 }}>
              {prof?.intro}
            </div>

            <div className="result-header">
              <div className="inline-avatar">
                <Avatar sex={sex} variant={prof?.themeKey} label={prof?.label} />
              </div>

              <div className="result-header-content">
                <h2 style={{ margin: "6px 0 0", textAlign: "center" }}>{prof?.label}</h2>
                <p style={{ opacity: 0.9, marginTop: 10, fontSize: 17, fontWeight: 600, textAlign: "center" }}>
                  Ton score global : <b>{score}</b> / {maxScore}
                </p>
              </div>
            </div>

            <TextWithLinks text={prof?.story} style={styles.resultText} />

            {prof?.highlights && prof.highlights.length > 0 && (
              <div style={{ ...styles.block, borderColor: theme.blockBorder }}>
                <div style={styles.blockTitle}>Signes typiques</div>
                <ul style={styles.ul}>
                  {prof.highlights.map((x, idx) => (
                    <li key={idx} style={styles.li}>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prof?.plan && prof.plan.length > 0 && (
              <div style={{ ...styles.block, borderColor: theme.blockBorder }}>
                <div style={styles.blockTitle}>3 priorités</div>
                <ul style={styles.ul}>
                  {prof.plan.map((x, idx) => (
                    <li key={idx} style={styles.li}>
                      {x}
                    </li>
                  ))}
                </ul>
                {prof?.mantra && <div style={styles.mantra}>{prof.mantra}</div>}
                {prof?.trap && <div style={styles.trap}>Attention : {prof.trap}</div>}
              </div>
            )}

            {prof?.tip && <p style={styles.tip}>{prof.tip}</p>}
            <p style={styles.footer}>{prof?.footer}</p>

            {prof?.hasIclosedLink ? (
              <a
                href={prof.iclosedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  marginTop: 16,
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(96, 165, 250, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)",
                  border: "1px solid rgba(96, 165, 250, 0.4)",
                  textAlign: "center",
                  textDecoration: "none",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(96, 165, 250, 0.35) 0%, rgba(59, 130, 246, 0.35) 100%)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(96, 165, 250, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(96, 165, 250, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div>📞 Prendre un rendez-vous avec Mao</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 6, opacity: 0.9 }}>
                  (cliquer ici)
                </div>
              </a>
            ) : null}

            {prof?.hasIclosedLink && (
              <a
                href="https://www.skool.com/ancestral/about?ref=480fbb005e714961b5e08f536c4ff579"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  marginTop: 12,
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.25) 100%)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  textAlign: "center",
                  textDecoration: "none",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.35) 0%, rgba(220, 38, 38, 0.35) 100%)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(239, 68, 68, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.25) 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Non merci
              </a>
            )}

            {!prof?.hasIclosedLink && (
              <div style={{
                marginTop: 16,
                padding: "14px 16px",
                borderRadius: 12,
                background: "rgba(96, 165, 250, 0.15)",
                border: "1px solid rgba(96, 165, 250, 0.3)",
                textAlign: "center",
              }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                  <strong>Numéro mobile pour contacter Mao :</strong>
                  <br />
                  <a 
                    href="tel:+33756984875"
                    style={{
                      color: "#60a5fa",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: 16,
                      letterSpacing: "0.5px",
                    }}
                  >
                    07 56 98 48 75
                  </a>
                </p>
              </div>
            )}

            {/* Numéro WhatsApp pour les profils avec lien iClosed */}
            {prof?.hasIclosedLink && (
              <>
                <p style={{ 
                  marginTop: 16, 
                  opacity: 0.85, 
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 500,
                  marginBottom: 6
                }}>
                  Tu as une question ?
                </p>
                <p style={{ 
                  marginTop: 0, 
                  opacity: 0.85, 
                  textAlign: "center",
                  fontSize: 13,
                  lineHeight: 1.5
                }}>
                  Numéro WhatsApp de Mao :{" "}
                <a 
                  href="https://wa.me/33756984875"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#25d366",
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}
                >
                  07 56 98 48 75
                </a>
              </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Composant pour rendre les URLs cliquables dans le texte */
function TextWithLinks({ text, style }) {
  if (!text) return null;

  // Regex pour détecter les URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <p style={style}>
      {parts.map((part, index) => {
        // Si c'est une URL, créer un lien
        if (part.match(urlRegex)) {
          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#60a5fa",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              Réserver un appel →
            </a>
          );
        }
        // Sinon, afficher le texte normalement (en préservant les sauts de ligne)
        return part.split('\n').map((line, i, arr) => (
          <span key={`${index}-${i}`}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ));
      })}
    </p>
  );
}

/** Avatar via image PNG */
function Avatar({ sex, variant = "solaire", label }) {
  const base = sex === "femme" ? "femme" : "homme";

  let suffix = "ancien";
  if (variant === "brume") suffix = "sedimente";
  // Distinguer entre Déséquilibré et Stable (tous deux ont themeKey "aube")
  if (variant === "aube") {
    if (label && label.includes("STABLE")) {
      suffix = "equilibre"; // Avatar equilibre pour stable
    } else {
      suffix = "transitionnel"; // Avatar transitionnel pour déséquilibré
    }
  }

  const src = `/avatars/${base}-${suffix}.png`;

  return (
    <img
      src={src}
      alt="Avatar"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        objectPosition: "bottom center",
        display: "block",
      }}
    />
  );
}

const styles = {
  page: {
    minHeight: "100dvh",
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px 0",
    margin: 0,
    overflow: "hidden",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    boxSizing: "border-box",
  },

  bgPhoto: {
    position: "fixed",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: -3,
    transform: "scale(1.03)",
    filter: "saturate(1.05) contrast(1.02)",
  },

  bgGlow: {
    position: "fixed",
    inset: 0,
    zIndex: -2,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.45)",
    zIndex: -1,
  },

  card: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
    width: "min(460px, 96vw)",
    maxHeight: "calc(100dvh - 16px)",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    background: "rgba(2, 6, 23, 0.78)",
    padding: "clamp(14px, 4vw, 20px)",
    borderRadius: 18,
    textAlign: "center",
    boxShadow: "0 22px 60px rgba(0,0,0,0.65)",
    border: "none",
    backdropFilter: "blur(12px)",
    color: "white",
  },

  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    opacity: 0.9,
    textTransform: "uppercase",
    fontWeight: 700,
  },

  headerRow: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  miniPill: {
    fontSize: 12,
    opacity: 0.9,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(15,23,42,0.35)",
  },

  linkBtn: {
    border: "none",
    background: "transparent",
    color: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    fontSize: 12,
    textDecoration: "underline",
  },

  subtitle: {
    marginTop: 8,
    opacity: 0.88,
    lineHeight: 1.3,
  },

  options: {
    display: "grid",
    gap: 10,
    marginTop: 16,
  },

  // Couleur plus sobre/pro (remplace le bleu clair)
  button: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#334155", // slate
    color: "white",
    cursor: "pointer",
    fontSize: 15,
    lineHeight: 1.2,
    position: "relative",
    overflow: "hidden",
  },

  progress: {
    marginTop: 0,
    opacity: 0.75,
    textAlign: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: '8px 16px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(51, 65, 85, 0.7)',
    color: 'white',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(15,23,42,0.55)",
    color: "white",
    outline: "none",
    fontSize: 16,
  },

  sexRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  sexBtn: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(15,23,42,0.35)",
    color: "white",
    cursor: "pointer",
    fontSize: 14,
  },

  sexBtnActive: {
    background: "#475569", // slate plus sobre
    border: "1px solid rgba(255,255,255,0.18)",
  },

  note: {
    margin: 0,
    opacity: 0.75,
    fontSize: 12,
    lineHeight: 1.35,
  },

  resultHeader: {
    marginTop: 16,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    alignItems: "center",
  },

  inlineAvatar: {
    width: "min(120px, 35vw)",
    maxWidth: 120,
    aspectRatio: "469 / 532",
  },

  smallIntro: {
    fontSize: 12,
    opacity: 0.85,
    lineHeight: 1.35,
  },

  resultText: {
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 1.45,
    opacity: 0.96,
    textAlign: "left",
    whiteSpace: "pre-line",
    fontSize: 14,
  },

  block: {
    marginTop: 10,
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(15,23,42,0.25)",
    textAlign: "left",
  },

  blockTitle: {
    fontWeight: 800,
    marginBottom: 8,
  },

  ul: {
    margin: 0,
    paddingLeft: 18,
    opacity: 0.95,
  },

  li: {
    marginBottom: 6,
    lineHeight: 1.35,
  },

  mantra: {
    marginTop: 10,
    opacity: 0.98,
    fontWeight: 700,
  },

  trap: {
    marginTop: 10,
    opacity: 0.9,
  },

  tip: {
    marginTop: 14,
    lineHeight: 1.5,
    opacity: 0.98,
    textAlign: "left",
    fontWeight: 700,
  },

  footer: {
    marginTop: 10,
    opacity: 0.85,
    textAlign: "left",
    lineHeight: 1.4,
  },

  consentText: {
    marginTop: 16,
    lineHeight: 1.6,
    opacity: 0.95,
    textAlign: "left",
    fontSize: 14,
  },

  consentButton: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(15,23,42,0.55)",
    color: "white",
    cursor: "pointer",
    fontSize: 14,
    lineHeight: 1.4,
    textAlign: "left",
    transition: "all 0.2s ease",
  },

  completedContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },

  completedIcon: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%)",
    border: "2px solid rgba(34, 197, 94, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
    color: "#22c55e",
    fontWeight: "bold",
  },

  revealButton: {
    width: "100%",
    padding: "18px 24px",
    borderRadius: 16,
    border: "2px solid rgba(96, 165, 250, 0.5)",
    background: "linear-gradient(135deg, rgba(96, 165, 250, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)",
    color: "white",
    cursor: "pointer",
    fontSize: 17,
    fontWeight: 700,
    lineHeight: 1.4,
    textAlign: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(96, 165, 250, 0.3)",
  },

  progressBarContainer: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    position: "relative",
  },

  progressBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
    borderRadius: 999,
    transition: "width 0.1s ease-out",
    boxShadow: "0 0 10px rgba(96, 165, 250, 0.5)",
  },
};

