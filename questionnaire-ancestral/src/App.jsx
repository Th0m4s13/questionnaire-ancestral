import { useMemo, useState, useEffect, useRef } from "react";
import "./App.css";
import { COUNTRY_DIAL_LIST } from "./countryDialCodes";

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
  const [phonePrefix, setPhonePrefix] = useState("+33");
  const [phone, setPhone] = useState("");
  const [indicatifDropdownOpen, setIndicatifDropdownOpen] = useState(false);
  const [indicatifSearch, setIndicatifSearch] = useState("");
  const indicatifDropdownRef = useRef(null);
  const [age, setAge] = useState("");
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
  const [clickedOptionIndex, setClickedOptionIndex] = useState(null);
  const [initialFormAnimating, setInitialFormAnimating] = useState(false);
  const [showConsentPage, setShowConsentPage] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneValidationAttempted, setPhoneValidationAttempted] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(""); // Pour les questions ouvertes
  const hasSentRef = useRef(false);

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
          { text: " Je ne bois jamais de café/thé", score: 4 },
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
        question: "Combien d'heures de sommeil te faut-il pour récupérer ?",
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
          { text: " Je ne tombe jamais malade", score: 4 },
          { text: " 2–3 jours", score: 3 },
          { text: " 5–6 jours", score: 2 },
          { text: " 1 à 2 semaines ou ça traîne", score: 1 },
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
      {
        question: "Quel est ton régime type actuellement ? (donne-moi un maximum de détails)",
        category: "alimentation",
        type: "open",
        score: 2,
      },
      {
        question: "As-tu des antécédents médicaux ? Si oui, lesquels ?",
        category: "medical",
        type: "open",
        score: 2,
      },
      {
        question: "Quel est ton métier et est-il stressant pour toi ?",
        category: "stress",
        type: "open",
        score: 2,
      },
    ].map(q => ({
      ...q,
      options: q.options ? shuffleArray(q.options) : undefined
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

  const dialCode = phonePrefix && phonePrefix !== "OTHER" ? phonePrefix : "";
  const phoneDigitsOnly = phone.replace(/\D/g, "");
  const phoneDigits = dialCode
    ? phoneDigitsOnly.replace(/^0+/, "")
    : phoneDigitsOnly;
  const isPhoneValid =
    phonePrefix !== "" &&
    (phonePrefix === "OTHER" ? phoneDigitsOnly.length >= 1 : phoneDigits.length >= 1);

  const selectedIndicatifLabel =
    !phonePrefix
      ? "Indicatif (à choisir)"
      : phonePrefix === "OTHER"
        ? "Autre"
        : (() => {
            const c = COUNTRY_DIAL_LIST.find((x) => x.dial === phonePrefix);
            return c ? `${c.name} ${c.dial}` : "Indicatif (à choisir)";
          })();

  const filteredCountries = useMemo(() => {
    const q = indicatifSearch.trim().toLowerCase();
    if (!q) return COUNTRY_DIAL_LIST;
    return COUNTRY_DIAL_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.replace("+", "").includes(q.replace(/\D/g, ""))
    );
  }, [indicatifSearch]);

  useEffect(() => {
    if (!indicatifDropdownOpen) return;
    function handleClickOutside(e) {
      if (indicatifDropdownRef.current && !indicatifDropdownRef.current.contains(e.target)) {
        setIndicatifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [indicatifDropdownOpen]);

  function formatDateFR(isoString) {
    try {
      return new Date(isoString).toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return isoString;
    }
  }

  function buildWhatsappText({ timestamp, nom, age, telephoneRaw, sexe, score, scoreMax, pourcentage, profil, reponses }) {
    const header = [
      "📋 NOUVEAU QUESTIONNAIRE ANCESTRAL",
      "",
      "👤 INFORMATIONS",
      `• Nom: ${nom || "-"}`,
      `• Âge: ${age || "-"}`,
      `• Téléphone: ${telephoneRaw || "-"}`,
      `• Sexe: ${sexe || "-"}`,
      "",
      "📊 RÉSULTATS",
      `• Score: ${typeof score === "number" ? score : "-"} / ${typeof scoreMax === "number" ? scoreMax : "-"}`,
      `• Pourcentage: ${typeof pourcentage === "number" ? pourcentage : "-"}%`,
      `• Profil: ${profil || "-"}`,
      "",
      `⏰ Date: ${timestamp ? formatDateFR(timestamp) : "-"}`,
      "",
      "🧾 RÉPONSES DÉTAILLÉES:",
    ].join("\n");

    const details = Array.isArray(reponses)
      ? reponses
          .map((r, i) => {
            const q = r?.question || `Question ${i + 1}`;
            const a = r?.reponseTexte || "";
            return `- ${q}${a ? `\n  → ${a}` : ""}`;
          })
          .join("\n")
      : "";

    let text = `${header}\n${details}`.trim();
    // WhatsApp a une limite de longueur : on garde une marge.
    const MAX = 3800;
    if (text.length > MAX) text = text.slice(0, MAX - 20) + "\n…(tronqué)";
    return text;
  }

  const canStart =
    name.trim().length >= 2 &&
    isPhoneValid &&
    (sex === "homme" || sex === "femme");

  // Validation du téléphone (seulement après tentative)
  useEffect(() => {
    if (phonePrefix === "") {
      setPhoneError("");
      return;
    }
    if (phoneValidationAttempted && phone.length > 0) {
      const digits = phonePrefix === "OTHER" ? phoneDigitsOnly : phoneDigits;
      if (digits.length === 0) {
        setPhoneError("Le numéro doit contenir au moins un chiffre");
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  }, [phonePrefix, phone, phoneDigits.length, phoneDigitsOnly.length, phoneValidationAttempted]);

  // Passage à la page consent uniquement au clic sur "Continuer" (plus d'auto-avance au clic Homme/Femme)
  function goToConsentPage() {
    if (!canStart) return;
    setInitialFormAnimating(true);
    setTimeout(() => {
      setShowConsentPage(true);
      setInitialFormAnimating(false);
    }, 400);
  }

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

  function answer(option, optionIndex, event) {
    const currentQuestion = questions[step];
    setScore((s) => s + option.score);
    setAnswers((prev) => [...prev, {
      category: currentQuestion.category,
      score: option.score,
      question: currentQuestion.question,
      reponseTexte: option.text,
    }]);
    
    // Marquer le bouton comme cliqué pour l'animation grisée
    setClickedOptionIndex(optionIndex);
    
    // Attendre que l'animation du bouton soit visible (400ms)
    setTimeout(() => {
      // Puis lancer le fade-out de la question
      setQuestionTransitioning(true);
    }, 400);
    
    setTimeout(() => {
      if (step + 1 < questions.length) {
        // Passe à la question suivante
        setStep((x) => x + 1);
        setQuestionTransitioning(false);
        setClickedOptionIndex(null); // Réinitialiser l'animation
      } else {
        // Dernière question : afficher le message "Questionnaire terminé"
        setShowCompleted(true);
        setQuestionTransitioning(false);
        setClickedOptionIndex(null); // Réinitialiser l'animation
      }
    }, 750); // Délai total pour la transition
  }

  function submitOpenAnswer() {
    const currentQuestion = questions[step];
    if (!currentQuestion || currentQuestion.type !== "open") return;
    
    const trimmedAnswer = openAnswer.trim();
    if (!trimmedAnswer) return; // Ne pas passer si vide
    
    setScore((s) => s + (currentQuestion.score || 2));
    setAnswers((prev) => [...prev, {
      category: currentQuestion.category,
      score: currentQuestion.score || 2,
      question: currentQuestion.question,
      reponseTexte: trimmedAnswer,
    }]);
    
    setOpenAnswer(""); // Réinitialiser
    setQuestionTransitioning(true);
    
    setTimeout(() => {
      if (step + 1 < questions.length) {
        setStep((x) => x + 1);
        setQuestionTransitioning(false);
      } else {
        setShowCompleted(true);
        setQuestionTransitioning(false);
      }
    }, 400);
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
      setClickedOptionIndex(null); // Réinitialiser l'animation
      setOpenAnswer(""); // Réinitialiser la réponse ouverte
    } else if (step === 0) {
      // Revenir à la page de consentement
      setConsentGiven(false);
      setShowConsentPage(false);
      setClickedOptionIndex(null);
      setOpenAnswer("");
    }
  }

  function revealResults() {
    if (hasSentRef.current) return;
    hasSentRef.current = true;
    setShowCompleted(false);
    setFinished(true);
    
    // Enregistrer les données
    saveDataToSheet();
  }

  async function saveDataToSheet() {
    const prof = personality();
    if (!prof) return;

    const timestamp = new Date().toISOString();
    const pourcentage = Math.round((score / maxScore) * 100);

    // Analyser les réponses pour extraire les symptômes les plus problématiques
    const analysis = analyzeAnswers();
    const topSymptoms = analysis.weakCategories.slice(0, 2); // Les 2 plus problématiques
    
    const symptome1 = topSymptoms[0] ? (categoryDescriptions[topSymptoms[0]]?.issues || topSymptoms[0]) : "";
    const symptome2 = topSymptoms[1] ? (categoryDescriptions[topSymptoms[1]]?.issues || topSymptoms[1]) : "";

    const fullPhoneWithPlus = dialCode ? `${dialCode}${phoneDigits}` : (phonePrefix === "OTHER" ? phone : phoneDigitsOnly);
    const fullPhoneDigitsOnly = fullPhoneWithPlus.replace(/\D/g, "");
    const data = {
      timestamp,
      nom: name,
      age: age,
      indicatif: phonePrefix === "OTHER" ? "" : dialCode,
      telephone: fullPhoneDigitsOnly,
      telephoneInternational: fullPhoneWithPlus || fullPhoneDigitsOnly,
      telephoneNational: dialCode ? phoneDigits : phoneDigitsOnly,
      telephoneRaw: fullPhoneDigitsOnly,
      sexe: sex,
      score: score,
      scoreMax: maxScore,
      scoreFormatted: `${score} sur ${maxScore}`,
      pourcentage,
      profil: prof.label,
      profilTitle: prof.title,
      profilSubtitle: prof.subtitle,
      nombreQuestions: questions.length,
      symptome1,
      symptome2,
      reponses: answers.map((ans, idx) => ({
        question: ans.question,
        categorie: ans.category,
        score: ans.score,
        reponseTexte: ans.reponseTexte,
      })),
    };
    data.whatsappText = buildWhatsappText({
      timestamp: data.timestamp,
      nom: data.nom,
      age: data.age,
      telephoneRaw: fullPhoneWithPlus || data.telephone,
      sexe: data.sexe,
      score: data.score,
      scoreMax: data.scoreMax,
      pourcentage: data.pourcentage,
      profil: data.profil,
      reponses: data.reponses,
    });

    try {
      // URL du webhook Make.com
      const WEBHOOK_URL =
        import.meta.env.VITE_MAKE_WEBHOOK_URL ||
        "https://hook.eu1.make.com/yf61fckihxirt84w6r5rhd5813e16s5v";
      
      if (WEBHOOK_URL) {
        // IMPORTANT:
        // En mode `no-cors`, le navigateur n'enverra pas `Content-Type: application/json`.
        // Make recevrait alors un simple champ "value" (texte JSON) au lieu de champs structurés.
        // On envoie donc en `application/x-www-form-urlencoded` (safelisted) pour que Make parse les champs.
        const reponses = data.reponses;
        const payload = {
          timestamp: data.timestamp,
          nom: data.nom,
          age: data.age || "",
          indicatif: data.indicatif || "",
          telephone: data.telephone,
          telephoneInternational: data.telephoneInternational || "",
          telephoneNational: data.telephoneNational || "",
          telephoneText: `'${data.telephone}`,
          telephoneRaw: data.telephoneRaw,
          sexe: data.sexe,
          score: String(data.score),
          scoreMax: String(data.scoreMax),
          scoreFormatted: data.scoreFormatted,
          pourcentage: String(data.pourcentage),
          profil: data.profil,
          profilTitle: data.profilTitle || "",
          profilSubtitle: data.profilSubtitle || "",
          nombreQuestions: String(data.nombreQuestions),
          symptome1: data.symptome1 || "",
          symptome2: data.symptome2 || "",
          whatsappText: data.whatsappText,
          // Pour Google Sheets / debug
          reponsesJson: JSON.stringify(reponses),
          rawJson: JSON.stringify(data),
        };

        await fetch(WEBHOOK_URL, {
          method: 'POST',
          // Make.com peut ne pas renvoyer d'entêtes CORS : on envoie quand même le webhook.
          mode: "no-cors",
          keepalive: true,
          body: new URLSearchParams(payload),
        });
        
        console.log("✅ Webhook Make.com envoyé");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du webhook:", error);
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
        story: `Comprendre les signaux du corps. Le corps communique constamment à travers des signaux subtils. Fatigue persistante, digestion difficile, sommeil perturbé, ce ne sont pas des détails. Ce sont des alertes qu'il ne faut pas ignorer. Ces déséquilibres s'installent progressivement, par accumulation de petits facteurs : alimentation inadaptée, stress chronique, manque de lumière ou de repos. Le problème : plus ils s'enracinent, plus ils deviennent difficiles à inverser. Ce qui se corrige en quelques semaines aujourd'hui peut prendre des mois demain.

Ce qui se passe concrètement
Quand l'énergie cellulaire diminue, plusieurs systèmes compensent. Le foie travaille davantage pour gérer les toxines intestinales et hormonales. Les glandes surrénales produisent plus de cortisol pour maintenir la glycémie. La thyroïde peut ralentir. Ces mécanismes d'adaptation ont une limite, et quand ils lâchent, la chute s'accélère.

L'intestin joue un rôle central : comme l'a montré Metchnikoff dès le début du XXe siècle, les toxines intestinales peuvent perturber l'ensemble du métabolisme. Un transit lent favorise la fermentation bactérienne et la production de substances inflammatoires. Chaque jour passé dans cet état creuse la dette. L'inflammation s'installe, les carences s'aggravent, le terrain se fragilise.

Le temps joue contre toi, mais les leviers existent. Ils sont simples mais puissants pour inverser la trajectoire : restaurer un apport nutritionnel adapté pour relancer l’énergie cellulaire, réduire la charge inflammatoire par une alimentation plus digeste, soutenir le foie et l’intestin afin de diminuer la production de toxines, et réintroduire des rythmes biologiques cohérents en passant par le sommeil, ou encore l'exposition à la lumière. La gestion du stress joue également un rôle clé : en abaissant le cortisol chronique, on soulage directement les surrénales et la thyroïde. Ces ajustements agissent en cascade. Pris tôt, ils permettent au corps de sortir du mode survie et de réactiver ses capacités naturelles de réparation. Mais chaque semaine d'inaction compte. La dette métabolique s'accumule silencieusement, et le corps n'oublie rien. Agir maintenant, c'est raccourcir le chemin. Attendre, c'est le rallonger.`,
        highlights: [],
        plan: [],
        mantra: "",
        trap: "",
        tip: "",
        hasIclosedLink: true,
        iclosedUrl: "https://app.iclosed.io/e/maobrut/ancestral",
        ...common,
      };
    }

    if (pct <= 0.75) {
      return {
        themeKey: "aube",
        label: "TERRAIN DÉSÉQUILIBRÉ",
        title: "",
        subtitle: "",
        story: `Un écart qui se creuse. Ton alimentation actuelle s'éloigne de ce que ton corps attend physiologiquement. Il compense encore, mais les premiers signes apparaissent : digestion perturbée, fatigue qui s’intalle, inconforts qui deviennent chroniques. Ces déséquilibres surviennent quand l'organisme reçoit des aliments qu'il n'a jamais appris à gérer au fil de l'évolution.Revenir à une alimentation cohérente avec ta physiologie n'est pas accessoire. C'est fondamental. Une alimentation simple, dense, bien préparée. Le foie est souvent le premier à souffrir. Organe central de filtration et de régulation hormonale, il encaisse les huiles industrielles, les sucres raffinés, les produits ultra-transformés. Le soutenir ne veut pas dire le "détoxifier" avec des cures passagères. Cela veut dire lui redonner ses cofacteurs au quotidien : choline, graisses saturées, antioxydants liposolubles.Sans correction, les troubles digestifs, métaboliques ou inflammatoires ne sont pas une hypothèse. Ils sont une suite logique. Le moment d'agir est toujours avant l'effondrement, pas après. Les populations traditionnelles maîtrisaient sans le théoriser l'art de se nourrir. Pas d'excès de végétaux crus ou mal préparés. Ce modèle a permis une résilience biologique que la modernité a largement effacée. 
Pour revenir à cette logique, il faut d'abord comprendre. Ce que tu manges. Comment tu le prépares. Ce que tes organes peuvent gérer aujourd'hui. C'est ce que propose la formation.Et si tu veux aller à l'essentiel, un appel avec l'équipe permet d'analyser ta situation et de poser un plan adapté à ton profil. Agir maintenant limite la dette métabolique. Repousser, c'est rendre la correction plus lente, plus difficile, parfois irréversible.`,
        highlights: [],
        plan: [],
        mantra: "",
        trap: "",
        tip: "",
        hasIclosedLink: true,
        iclosedUrl: "https://app.iclosed.io/e/maobrut/ancestral",
        ...common,
      };
    }

    if (pct <= 0.875) {
      return {
        themeKey: "aube",
        label: "TERRAIN STABLE",
        title: "",
        subtitle: "",
        story: `Tu as déjà bâti des fondations solides : tes habitudes, ta direction, ta compréhension de ton propre corps. C'est plus que ce que la plupart osent initier. Mais il te manque encore un étage, tu peux aller plus loin. Tu pourrais te sentir vraiment en forme. Ne plus t'écrouler après manger. Dormir profondément et te réveiller reposé. Garder la tête claire jusqu'au soir. Ce qui fait souvent la différence, ce n'est pas de manger "équilibré", c'est de manger plus dense et digeste.  Des aliments qui nourissent vraiment : des aliments oubliés que consommaient nos arrères grand parents. Bouillon d’os, abats, légumineuses fermentés chez les végétariens, plantes comme l'ortie ou le pissenlit. Peut-être que tu en consommes déjà. La question, c'est : est-ce suffisant, assez régulier, bien préparé ? C'est dans ces détails que tout se joue.Si aujourd'hui tu sens des baisses d'énergie après tes repas, un brouillard, des inconforts diffus… ce n'est pas normal. Ce sont des signaux. Des appels précis de ton métabolisme à toi. Il ne te demande pas plus d'effort. Il te demande plus de justesse.Imagine : te lever avec une clarté mentale nette, traverser tes journées sans ce creux de 15h, digérer sans y penser, sentir ton énergie tenir jusqu'au soir. C'est ça, un métabolisme qui tourne pour toi et non contre toi.La formation t'apprend exactement ça : décoder ce que ton corps te dit, identifier les aliments qui te rechargent vraiment, structurer tes repas pour que chaque bouchée serve ta vitalité. Pas de dogme. Juste une lecture fine de tes propres signaux.Ce que tu as mis en place est précieux. Ce que tu vas intégrer maintenant peut tout amplifier. Dès aujourd’hui, les gens intélligents investissent sur eux-même.
`,
        highlights: [],
        plan: [],
        mantra: "",
        trap: "",
        tip: "",
        hasIclosedLink: true,
        iclosedUrl: "https://app.iclosed.io/e/maobrut/ancestral",
        ...common,
      };
    }
    
    return {
      themeKey: "solaire",
      label: "TERRAIN AVANCÉ",
      title: "",
      subtitle: "",
      story: `Ce que tu fais fonctionne. tu as une bonne digestion, tu assimiles bien, tu convertis bien ce que tu manges en énergie. Résultat : ton corps est en forme. Pas de fatigue qui traîne, pas de digestion compliquée, pas de prise de poids qui sort de nulle part. Tu ne subis pas ta vie. Il reste peut-être des détails à affiner. Pas forcément manger plus ou différemment, mais mieux comprendre pourquoi ça marche. Savoir quoi ajuster si un jour ton corps réagit autrement. Une  formation peut t'aider à avoir cette clarté.Continue comme ça. Ce genre d'habitudes, ça se perd vite si on relâche. Mais ce  que tu as mis en place, ça vaut la peine de le garder.
`,
      highlights: [],
      plan: [],
      mantra: "",
      trap: "",
      tip: "",
      hasIclosedLink: true,
      iclosedUrl: "https://app.iclosed.io/e/maobrut/ancestral",
      ...common,
    };
  }

  const prof = personality();
  const theme = prof ? THEME_PRESETS[prof.themeKey] : THEME_PRESETS.aube;

  function resetAll() {
    hasSentRef.current = false;
    setStep(0);
    setScore(0);
    setAnswers([]);
    setFinished(false);
    setQuestionTransitioning(false);
    setShowCompleted(false);
    setOpenAnswer("");
  }

  function restartFromStart() {
    hasSentRef.current = false;
    setName("");
    setPhonePrefix("");
    setAge("");
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
    setOpenAnswer("");
  }

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={{ ...styles.bgPhoto, backgroundImage: `url(${BG_IMAGE})` }} />
      <div style={{ ...styles.overlay, background: "rgba(0,0,0,0.3)" }} />

      <div style={styles.card}>
        {!showConsentPage ? (
          <div className={initialFormAnimating ? "question-fade-out" : ""}>
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
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ton âge"
                type="number"
                min="1"
                max="120"
                autoComplete="age"
              />

              <div>
                <label style={{ display: "block", textAlign: "left", fontSize: 13, opacity: 0.9, marginBottom: 6 }}>
                  Ton numéro de téléphone
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(15,23,42,0.55)",
                    overflow: "visible",
                    position: "relative",
                  }}
                  ref={indicatifDropdownRef}
                >
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIndicatifDropdownOpen((o) => !o);
                        if (!indicatifDropdownOpen) setIndicatifSearch("");
                      }}
                      style={{
                        ...styles.input,
                        width: "auto",
                        minWidth: 200,
                        border: "none",
                        borderRadius: 0,
                        borderRight: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.06)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        textAlign: "left",
                      }}
                      aria-label="Choisir l'indicatif"
                    >
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {selectedIndicatifLabel}
                      </span>
                      <span style={{ opacity: 0.8 }}>{indicatifDropdownOpen ? "▲" : "▼"}</span>
                    </button>
                    {indicatifDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          marginTop: 4,
                          background: "rgba(15,23,42,0.98)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          borderRadius: 12,
                          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                          zIndex: 1000,
                          maxHeight: 320,
                          display: "flex",
                          flexDirection: "column",
                          overflow: "hidden",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Rechercher un pays ou indicatif..."
                          value={indicatifSearch}
                          onChange={(e) => setIndicatifSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          style={{
                            ...styles.input,
                            margin: 10,
                            marginBottom: 6,
                            flexShrink: 0,
                          }}
                          autoFocus
                        />
                        <div
                          className="indicatif-list-scroll"
                          style={{
                            overflowY: "scroll",
                            flex: 1,
                            minHeight: 0,
                            padding: "0 10px 10px",
                            WebkitOverflowScrolling: "touch",
                          }}
                        >
                          {filteredCountries.map((c) => (
                            <button
                              key={c.dial}
                              type="button"
                              onClick={() => {
                                setPhonePrefix(c.dial);
                                setPhone("");
                                setPhoneError("");
                                setPhoneValidationAttempted(false);
                                setIndicatifDropdownOpen(false);
                              }}
                              style={{
                                display: "block",
                                width: "100%",
                                padding: "10px 12px",
                                border: "none",
                                borderRadius: 8,
                                background: "transparent",
                                color: "white",
                                textAlign: "left",
                                cursor: "pointer",
                                fontSize: 14,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                              }}
                            >
                              {c.name} {c.dial}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setPhonePrefix("OTHER");
                              setPhone("");
                              setPhoneError("");
                              setPhoneValidationAttempted(false);
                              setIndicatifDropdownOpen(false);
                            }}
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "10px 12px",
                              border: "none",
                              borderRadius: 8,
                              background: "transparent",
                              color: "white",
                              textAlign: "left",
                              cursor: "pointer",
                              fontSize: 14,
                              borderTop: "1px solid rgba(255,255,255,0.1)",
                              marginTop: 4,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            Autre
                          </button>
                        </div>
                        <p style={{ margin: 0, padding: "8px 12px 10px", fontSize: 12, color: "rgba(255,255,255,0.6)", textAlign: "center", flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                          ↓ Faites défiler pour plus de pays
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    style={{
                      ...styles.input,
                      flex: 1,
                      border: "none",
                      borderRadius: 0,
                      ...(phoneError ? { borderLeft: "1px solid #ef4444" } : {}),
                    }}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneValidationAttempted && e.target.value.replace(/\D/g, "").length >= 9) {
                        setPhoneValidationAttempted(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setPhoneValidationAttempted(true);
                      }
                    }}
                    onBlur={() => {
                      if (phone.length > 0) setPhoneValidationAttempted(true);
                    }}
                    placeholder={phonePrefix === "OTHER" ? "Numéro avec indicatif" : (dialCode ? "6 12 34 56 78" : "Numéro")}
                    type="tel"
                    autoComplete="tel-national"
                  />
                </div>
                {phoneError && (
                  <p style={{ color: "#ef4444", fontSize: 13, margin: "6px 0 0 0", textAlign: "left" }}>
                    ⚠️ {phoneError}
                  </p>
                )}
              </div>

              <div style={styles.sexRow}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.activeElement?.blur();
                    setSex("homme");
                    if (phone.length > 0) {
                      setTimeout(() => setPhoneValidationAttempted(true), 100);
                    }
                  }}
                  style={{
                    ...styles.sexBtn,
                    ...(sex === "homme" ? styles.sexBtnActive : null),
                  }}
                >
                  Homme
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.activeElement?.blur();
                    setSex("femme");
                    if (phone.length > 0) {
                      setTimeout(() => setPhoneValidationAttempted(true), 100);
                    }
                  }}
                  style={{
                    ...styles.sexBtn,
                    ...(sex === "femme" ? styles.sexBtnActive : null),
                  }}
                >
                  Femme
                </button>
              </div>

              <p style={styles.note}>
                Tu dois remplir <b>prénom + téléphone</b> (avec indicatif) et choisir <b>Homme/Femme</b>.
              </p>
              {canStart && (
                <button
                  type="button"
                  onClick={goToConsentPage}
                  style={{
                    marginTop: 16,
                    width: "100%",
                    padding: "14px 20px",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "white",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    border: "none",
                    borderRadius: 12,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                  }}
                >
                  Continuer
                </button>
              )}
            </div>
          </div>
        ) : !consentGiven ? (
          <div className={consentAnimating ? "consent-fade-out" : "questionnaire-fade-in"}>
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

            {questions[step]?.type === "open" ? (
              <div style={{ marginTop: 16 }}>
                <textarea
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  placeholder="Tape ta réponse ici..."
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "15px",
                    fontFamily: "inherit",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    resize: "vertical",
                  }}
                />
                <button
                  onClick={submitOpenAnswer}
                  disabled={!openAnswer.trim()}
                  style={{
                    ...styles.button,
                    marginTop: 12,
                    opacity: openAnswer.trim() ? 1 : 0.5,
                    cursor: openAnswer.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Suivant →
                </button>
              </div>
            ) : (
              <div style={styles.options}>
                {questions[step]?.options?.map((opt, i) => (
                  <button 
                    key={i} 
                    style={{
                      ...styles.button,
                    }} 
                    onClick={(e) => answer(opt, i, e)}
                    disabled={clickedOptionIndex !== null}
                  >
                    {clickedOptionIndex === i && (
                      <div className="button-sweep-overlay" />
                    )}
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            <div style={{ position: 'relative', marginTop: 16 }}>
            <p style={styles.progress}>
              Question {step + 1} / {questions.length}
            </p>
              
              <button
                onClick={goBack}
                style={styles.backButton}
                title={step === 0 ? "Retour au consentement" : "Retour à la question précédente"}
              >
                ← Retour
              </button>
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
                href="https://calendly.com/d/cxhk-x8n-nzw/accompagnement-inuat"
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
                <div>📞 Prendre un rdv pour mettre en place ton plan d'action ancestral</div>
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
                    href="tel:+33749834339"
                    style={{
                      color: "#60a5fa",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: 16,
                      letterSpacing: "0.5px",
                    }}
                  >
                    07 49 83 43 39
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
                  href="https://wa.me/33749834339"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#25d366",
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}
                >
                  07 49 83 43 39
                </a>
              </p>
              </>
            )}

            {/* Carrousel de témoignages */}
            <TestimonialsCarousel />
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

/** Carrousel de témoignages */
function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const testimonials = [
    {
      name: "Sarah",
      text: "Depuis que je suis tes conseils et ton alimentation j'ai enfin réussi à dormir 6h par nuit cela ne m'était pas arrivé depuis plus de 30 ans. Je dormais maximum 2h et j'étais fatiguée toute la journée. C'est vraiment incroyable ce changement donc merci merci merci 🙏"
    },
    {
      name: "Marc",
      text: "J'ai commencé d'appliquer ce que tu expliques il y a environ 3/4 mois. L'alimentation ancestrale/brute est juste incroyable."
    },
    {
      name: "Laura",
      text: "Il y a 3 ans, on m'a détecté des lésions au niveau de l'utérus, papillomavirus. En novembre j'ai fait un contrôle, que je fais tous les 6 mois pour contrôler que les lésions ne deviennent pas cancéreuses. Hier, j'ai eu le résultat et le test est revenu négatif!!! 3 ans que je me bats contre ces lésions et en l'espace de quelques mois certainement dû à cette alimentation, les lésions ont disparu!!! 🎉"
    },
    {
      name: "Thomas",
      text: "Depuis que je mange comme ça j'ai pleins pleins de cheveux qui repoussent j'avais un début de calvitie mais ça repousse c'est génial adieu la greffe de cheveux en turquie bonjour patate douce 🍠"
    },
    {
      name: "Julie",
      text: "Les patates c'est magiques vraiment je suis en train de tester d'en manger chaque jour c'est affolant l'énergie que j'ai, la vitalité, le dynamisme, merci pour ton contenu, je dis tjrs aux gens de te suivre parce qu'en étudiant depuis de nombreuses années la nutrition pour moi tu as toutes les clefs et les vérités, donc gros merci, continue 🙏"
    },
    {
      name: "Alexandre",
      text: "Comme expliqué en pantalon avant nutrition ancestrale : 40 voir carrément 42, après 1 mois : 40 proche 38 💪\n\nÇa fonctionne !!! 🤣 je remet mes costards"
    },
    {
      name: "Emma",
      text: "En 3 semaines à manger à ma faim etc j'ai perdu 1,5kg et j'ai des grosses lèvres 😂"
    },
    {
      name: "Sophie",
      text: "Depuis que je te suis je me réajuste et rééquilibre petit à petit ❤️ Mais plus de fringale, plus de privation, plus de dévorage de tablette de chocolat. Après des années de TCA ça fait du bien 🙏"
    },
    {
      name: "Marie",
      text: "J'avoue que je suis ton compte depuis qq mois aussi et je trouve des explications sur l'alimentation précises, claires et sans chichis. Tu es une personne simple, authentique et surtout intègre. Merci pour les partages car chacun prend ce qui lui fait sens à travers tes conseils. A bon entendeur...😉"
    },
    {
      name: "Pierre",
      text: "Je ne sais pas si c'est l'alimentation vivante que j'ai repris depuis quelques semaines ou les patates vapeurs remplies de bon beurre de lait crû mais mes douleurs musculaires et articulaires s'atténuent drastiquement 👌"
    },
    {
      name: "Chloé",
      text: "Mao tu t'en rend peut être pas compte mais ma vie est réellement entrain de changer tu expliques si bien les choses que depuis 2-3 mois où je suis arrivée je ne vois plus les choses de la même manière j'avais commencer un travail de recherche compréhension de la nourriture mais j'étais encore très loin du compte je te trouves ultra pédagogue c'est super important pour moi et ça a créer une confiance vis à vis de toi tu expliques tu ne vend pas tu ne prend pas de raccourcie c'est excellent 💙"
    },
    {
      name: "Léa",
      text: "Idem pour moi, merci Maoris, j'ai fait un pêcher de m'en priver toutes ces années !! Après avoir essayé pleins de diets pour mes pauvres intestins : Montignac, Delabos, keto, Paléo, auto-immun protocol, sans lectines,... J'en oublie certains, les patates y a pas mieux 😮"
    },
    {
      name: "Lucas",
      text: "Salut mec, je voulais te signaler que je te suis depuis peu de temps et que j'essaye d'appliquer les principes que tu évoques ! Et en l'espace de qqls jours, je peux noter des changements ben terme d'énergie. Sans prise de tête, juste en mangeant frugal et le plus ancestral. C'est cool ce que tu fais sur cette page, bonne continuation 🤌"
    },
    {
      name: "Camille",
      text: "Le plus significatif fut une déchirure qui s'est guéri extrêmement vite par rapport à ce que le médecin m'avait dit (mon kiné fut étonné aussi). J'ai un sommeil de meilleure qualité, je récupère beaucoup plus rapidement, ma peau s'est embellie et surtout je sens un regain d'énergie global. De même, il y a eu un effet sur le moral qui est beaucoup plus stable ✨"
    }
  ];

  // Distance minimale de swipe (en pixels)
  const minSwipeDistance = 50;

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Gestion du swipe avec le trackpad (wheel event)
  const handleWheel = (e) => {
    // Détection du swipe horizontal sur trackpad
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      if (e.deltaX > 30) {
        goToNext();
      } else if (e.deltaX < -30) {
        goToPrevious();
      }
    }
  };

  return (
    <div style={{
      marginTop: 32,
      padding: "20px 0",
      textAlign: "center",
    }}>
      <p style={{
        fontSize: 16,
        fontWeight: 600,
        marginBottom: 12,
        color: "rgba(255, 255, 255, 0.9)",
        padding: "0 16px",
      }}>
        Je les ai accompagnés voici leurs résultats
      </p>
      <h3 style={{
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 24,
        color: "rgba(255, 255, 255, 0.95)",
        textTransform: "uppercase",
        letterSpacing: "1px",
        padding: "0 16px",
      }}>
        Ils ont testé l'approche ancestrale
      </h3>
      
      <div 
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
          padding: "0 16px",
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={handleWheel}
      >
        {/* Bouton précédent (gauche) */}
        <button
          onClick={goToPrevious}
          style={{
            position: "absolute",
            left: "-15px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0, 0, 0, 0.3)",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            zIndex: 10,
            padding: "12px 10px",
            lineHeight: "1",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
          }}
          aria-label="Témoignage précédent"
        >
          ‹
        </button>

        {/* Carte de témoignage style WhatsApp ultra réaliste */}
        <div
          key={currentIndex}
          style={{
            background: "#ffffff",
            borderRadius: "8px",
            padding: "6px 10px 8px 10px",
            display: "inline-block",
            animation: "fadeIn 0.4s ease-in",
            alignSelf: "flex-start",
            maxWidth: "85%",
            boxShadow: "0 1px 0.5px rgba(0, 0, 0, 0.13)",
            position: "relative",
          }}
        >
          <p style={{
            fontSize: "14.2px",
            lineHeight: "19px",
            color: "#111b21",
            margin: 0,
            textAlign: "left",
            whiteSpace: "pre-line",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            wordWrap: "break-word",
          }}>
            {testimonials[currentIndex].text}
          </p>
        </div>

        {/* Bouton suivant (droite) */}
        <button
          onClick={goToNext}
          style={{
            position: "absolute",
            right: "-15px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0, 0, 0, 0.3)",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            zIndex: 10,
            padding: "12px 10px",
            lineHeight: "1",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.3)";
          }}
          aria-label="Témoignage suivant"
        >
          ›
        </button>
      </div>

      <div style={{
        marginTop: 16,
        display: "flex",
        gap: 6,
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "none",
              background: index === currentIndex 
                ? "rgba(96, 165, 250, 0.8)" 
                : "rgba(255, 255, 255, 0.2)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
            aria-label={`Témoignage ${index + 1}`}
          />
        ))}
      </div>
    </div>
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
    height: "100dvh",
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
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
    position: "relative",
    zIndex: 1,
    width: "clamp(320px, 96vw, 460px)",
    maxHeight: "96dvh",
    margin: "auto",
    overflowY: "auto",
    overflowX: "hidden",
    WebkitOverflowScrolling: "touch",
    touchAction: "pan-y",
    scrollBehavior: "smooth",
    background: "rgba(2, 6, 23, 0.45)",
    padding: "clamp(16px, 4vw, 22px)",
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
    transition: "all 0.2s ease",
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

