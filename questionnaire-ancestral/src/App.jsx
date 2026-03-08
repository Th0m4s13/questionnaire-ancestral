import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./App.css";
import { COUNTRY_DIAL_LIST } from "./countryDialCodes";

const BG_IMAGE = "/BG_IMAGE.png";

function shuffleArray(arr) {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; }
  return s;
}

// ═══════════════════════════════════════════════════════
// QUESTIONS : TRONC COMMUN (tout le monde)
// ═══════════════════════════════════════════════════════
const CORE_QUESTIONS = [
  // ═══ ÉNERGIE ═══
  { question: "Le matin au réveil, tu te sens comment ?", category: "energie", options: [
    { text: "En pleine forme, prêt à attaquer la journée", score: 3 },
    { text: "Il me faut un moment pour me réveiller vraiment", score: 2 },
    { text: "Je suis déjà fatigué au lever", score: -1 },
    { text: "Je me lève vidé, comme si je n'avais pas dormi", score: -2 },
  ]},
  { question: "Ton niveau d'énergie en journée est :", category: "energie", options: [
    { text: "Stable du matin au soir", score: 3 },
    { text: "Variable mais gérable", score: 2 },
    { text: "En dents de scie, avec des coups de mou", score: -1 },
    { text: "Épuisement constant, même sans effort", score: -2 },
  ]},
  { question: "Quel est ton rapport au café ou au thé ?", category: "energie", options: [
    { text: "Je ne bois pas de café/thé", score: 3 },
    { text: "J'en bois par plaisir, je peux m'en passer sans souci", score: 2 },
    { text: "J'en bois tous les jours, mais c'est une habitude, pas un besoin", score: 0 },
    { text: "J'en ai besoin pour démarrer, sans ça je suis à plat", score: -1 },
    { text: "Plusieurs par jour sinon je ne tiens pas", score: -2 },
  ]},
  // ═══ CIRCULATION / THYROÏDE ═══
  { question: "Tes mains et pieds sont :", category: "circulation", options: [
    { text: "Toujours bien chauds", score: 3 },
    { text: "Froids parfois, selon la saison", score: 2 },
    { text: "Souvent froids même à l'intérieur", score: -1 },
    { text: "Gelés en permanence, même sous la couette", score: -2 },
  ]},
  { question: "Tu as tendance à avoir froid par rapport aux gens autour de toi ?", category: "thyroide", options: [
    { text: "Non, température normale", score: 3 },
    { text: "Un peu plus frileux que les autres", score: 2 },
    { text: "Oui, je mets toujours une couche de plus", score: -1 },
    { text: "Constamment froid, même quand les autres vont bien", score: -2 },
  ]},
  // ═══ SOMMEIL ═══
  { question: "Tu dors :", category: "sommeil", options: [
    { text: "Profondément et sans réveils", score: 3 },
    { text: "Légèrement, je me réveille parfois", score: 2 },
    { text: "Je me réveille plusieurs fois", score: -1 },
    { text: "Je dors très mal ou j'ai de l'insomnie", score: -2 },
  ]},
  { question: "Combien d'heures de sommeil te faut-il pour récupérer ?", category: "sommeil", options: [
    { text: "5-6h et je suis en pleine forme", score: 3 },
    { text: "7-8h, sinon je tiens pas", score: 2 },
    { text: "9-10h et je suis encore fatigué", score: -1 },
    { text: "Peu importe la durée, je suis toujours épuisé", score: -2 },
  ]},
  // ═══ DIGESTION (screening) ═══
  { question: "Tu ressens des ballonnements ou gaz :", category: "digestion", options: [
    { text: "Jamais", score: 3 },
    { text: "Parfois, après certains plats", score: 2 },
    { text: "Quasiment tous les jours", score: -1 },
    { text: "Constamment, avec douleurs", score: -2 },
  ]},
  { question: "Ta langue le matin est :", category: "digestion", options: [
    { text: "Rose et propre", score: 3 },
    { text: "Un peu blanche parfois", score: 2 },
    { text: "Blanche quasi tout le temps", score: -1 },
    { text: "Épaisse, pâteuse, chargée tous les jours", score: -2 },
    { text: "Je ne sais pas", score: 0 },
  ]},
  { question: "Tu as des réactions après certains aliments (laitiers, gluten, fruits...) ?", category: "digestion", options: [
    { text: "Jamais", score: 3 },
    { text: "Parfois, mais c'est léger", score: 2 },
    { text: "Oui, j'évite certains aliments pour ça", score: -1 },
    { text: "Oui, plusieurs groupes d'aliments me rendent mal", score: -2 },
  ]},
  { question: "Tes selles sont :", category: "digestion", options: [
    { text: "Formées, régulières, 1 à 2 fois par jour", score: 3 },
    { text: "Plutôt normales mais parfois molles ou irrégulières", score: 2 },
    { text: "Souvent molles ou alternance constipation/diarrhée", score: -1 },
    { text: "Liquides, constipation chronique ou très irrégulières", score: -2 },
  ]},
  // ═══ FOIE ═══
  { question: "Tu digères bien les repas gras (fromage, friture, avocat) ?", category: "foie", options: [
    { text: "Bien, aucun souci", score: 3 },
    { text: "Lourdeur passagère mais ça passe", score: 2 },
    { text: "Lourdeur longue, envie de sieste après", score: -1 },
    { text: "Nausées, dégoût des graisses, ou douleur à droite sous les côtes", score: -2 },
  ]},
  { question: "Le matin au réveil, ta bouche est :", category: "foie", options: [
    { text: "Fraîche, rien de particulier", score: 3 },
    { text: "Un peu sèche", score: 2 },
    { text: "Pâteuse ou amère", score: -1 },
    { text: "Très amère, avec nausées ou mauvaise haleine persistante", score: -2 },
  ]},
  // ═══ GRAISSES ═══
  { question: "Tu cuisines avec quoi principalement ?", category: "graisses", options: [
    { text: "Beurre, ghee, huile de coco ou huile d'olive", score: 3 },
    { text: "Un mélange (bonnes et mauvaises huiles)", score: 0 },
    { text: "Huile de tournesol, colza ou 'huile végétale'", score: -1 },
    { text: "Margarine, huile de friture, ou je ne sais pas", score: -2 },
  ]},
  // ═══ IMMUNITÉ ═══
  { question: "Tu es tombé malade combien de fois cette année ?", category: "immunite", options: [
    { text: "Jamais", score: 3 },
    { text: "1 ou 2 fois", score: 2 },
    { text: "Plus de 3 fois", score: -1 },
    { text: "Constamment, ou infections longues", score: -2 },
  ]},
  // ═══ INFLAMMATION ═══
  { question: "Tu as des douleurs articulaires ou musculaires :", category: "inflammation", options: [
    { text: "Jamais", score: 3 },
    { text: "Rarement", score: 2 },
    { text: "Régulièrement", score: -1 },
    { text: "Tous les jours ou invalidantes", score: -2 },
  ]},
  { question: "Tu as des allergies, eczéma, urticaire ou réactions cutanées ?", category: "inflammation", options: [
    { text: "Non", score: 3 },
    { text: "Un peu, saisonnièrement", score: 2 },
    { text: "Régulièrement dans l'année", score: -1 },
    { text: "Quasi en permanence", score: -2 },
  ]},
  // ═══ MINÉRALISATION ═══
  { question: "Tes dents et gencives vont comment ?", category: "mineralisation", options: [
    { text: "Solides, jamais de caries ou saignement", score: 3 },
    { text: "Quelques saignements ou caries récentes", score: 2 },
    { text: "Caries fréquentes, gencives sensibles", score: -1 },
    { text: "Douleurs dentaires ou dents qui se déchaussent", score: -2 },
  ]},
  { question: "Tes ongles sont :", category: "mineralisation", options: [
    { text: "Durs, lisses", score: 3 },
    { text: "Cassants ou striés", score: 2 },
    { text: "Qui se dédoublent souvent", score: -1 },
    { text: "Très mous, avec tâches ou anomalies", score: -2 },
  ]},
  // ═══ PEAU ═══
  { question: "Ta peau est :", category: "peau", options: [
    { text: "Souple, hydratée", score: 3 },
    { text: "Sèche parfois", score: 2 },
    { text: "Très sèche, qui pèle", score: -1 },
    { text: "Acné ou inflammation chronique", score: -2 },
    { text: "Eczéma", score: -2 },
  ]},
  { question: "Tu as des boutons, acné ou kystes sous-cutanés ?", category: "peau", options: [
    { text: "Jamais, peau toujours nette", score: 3 },
    { text: "Quelques-uns occasionnellement", score: 2 },
    { text: "Fréquemment, selon stress ou alimentation", score: -1 },
    { text: "Constamment, peau inflammée ou douloureuse", score: -2 },
  ]},
  // ═══ CHEVEUX ═══
  { question: "Tu remarques une perte de cheveux ?", category: "cheveux", options: [
    { text: "Non", score: 3 },
    { text: "Peu, surtout lors de la douche", score: 2 },
    { text: "Légère, périodique", score: 0 },
    { text: "Oui, depuis plusieurs mois", score: -1 },
    { text: "Chute constante, zones dégarnies", score: -2 },
  ]},
  // ═══ MÉTABOLISME ═══
  { question: "Es-tu attiré par le sucre ?", category: "metabolisme", options: [
    { text: "Jamais", score: 3 },
    { text: "De temps en temps", score: 2 },
    { text: "Tous les jours", score: -1 },
    { text: "Plusieurs fois par jour, besoin urgent", score: -2 },
  ]},
  { question: "Ton poids est :", category: "metabolisme", options: [
    { text: "Stable depuis longtemps, sans effort particulier", score: 3 },
    { text: "Plutôt stable mais je fais attention", score: 2 },
    { text: "Je prends facilement et j'ai du mal à perdre", score: -1 },
    { text: "En prise constante malgré mes efforts, ou effet yoyo", score: -2 },
  ]},
  // ═══ CANDIDOSE SCREENING ═══
  { question: "Tu as des mycoses (cutanées, vaginales, buccales, pieds) ?", category: "candidose", options: [
    { text: "Jamais", score: 3 },
    { text: "Une fois dans ma vie", score: 2 },
    { text: "Ça revient régulièrement", score: -1 },
    { text: "Quasi en permanence malgré les traitements", score: -2 },
  ]},
  { question: "Combien de cures d'antibiotiques as-tu prises dans ta vie ?", category: "candidose", options: [
    { text: "Aucune ou presque", score: 3 },
    { text: "Quelques-unes", score: 2 },
    { text: "Plusieurs, cures régulières", score: -1 },
    { text: "Beaucoup, cures longues ou répétées", score: -2 },
  ]},
  // ═══ NERVEUX ═══
  { question: "Face au stress, tu réagis comment ?", category: "nerveux", options: [
    { text: "Je gère bien, ça ne m'affecte pas longtemps", score: 3 },
    { text: "Ça me travaille un peu mais je passe à autre chose", score: 2 },
    { text: "Je rumine, ça tourne en boucle dans ma tête", score: -1 },
    { text: "Ça me paralyse, je mange plus ou je dors mal", score: -2 },
  ]},
];

const FEMALE_QUESTIONS = [
  { question: "Ton cycle menstruel est-il :", category: "hormones", options: [
    { text: "Régulier, sans douleur ni symptômes", score: 3 },
    { text: "Régulier mais avec quelques douleurs/irritabilité", score: 2 },
    { text: "Irrégulier, douleurs ou fatigue marquée", score: -1 },
    { text: "Très irrégulier, acné, gonflements, saignements abondants", score: -2 },
    { text: "Sous contraceptif hormonal (pilule, implant, stérilet hormonal)", score: -1 },
    { text: "Ménopausée / en périménopause", score: 0 },
  ]},
];

// ═══════════════════════════════════════════════════════
// QUESTIONS CONDITIONNELLES
// ═══════════════════════════════════════════════════════
const SIBO_QUESTIONS = [
  { question: "Ton ventre gonfle après les repas ?", category: "sibo", options: [
    { text: "Jamais", score: 3 },
    { text: "Parfois, surtout après un gros repas", score: 2 },
    { text: "Quasi systématiquement, surtout sous le nombril", score: -1 },
    { text: "Au point de déboutonner, avec douleur", score: -2 },
  ]},
  { question: "Après manger, tu ressens un brouillard mental ?", category: "sibo", options: [
    { text: "Jamais, tête claire", score: 3 },
    { text: "Rarement, après un repas très lourd", score: 2 },
    { text: "Souvent, difficulté à me concentrer", score: -1 },
    { text: "Systématiquement, comme anesthésié", score: -2 },
  ]},
  { question: "Tes gaz sont plutôt :", category: "sibo", options: [
    { text: "Rares et inodores", score: 3 },
    { text: "Réguliers mais pas d'odeur forte", score: 2 },
    { text: "Fréquents et parfois odorants", score: -1 },
    { text: "Très fréquents et odorants (œuf pourri, putréfaction)", score: -2 },
  ]},
  { question: "As-tu déjà eu une intoxication alimentaire sévère ?", category: "sibo", options: [
    { text: "Jamais", score: 3 },
    { text: "Oui une fois, sans séquelles", score: 2 },
    { text: "Plusieurs fois", score: -1 },
    { text: "Oui, et mes problèmes digestifs ont commencé après", score: -2 },
  ]},
];

const DYSBIOSE_QUESTIONS = [
  { question: "Tu tolères les aliments fermentés (choucroute, kéfir, kombucha) ?", category: "dysbiose", options: [
    { text: "Oui, aucun souci", score: 3 },
    { text: "Je n'en consomme pas", score: 2 },
    { text: "Ça me ballonne ou me donne des gaz", score: -1 },
    { text: "Réaction forte : douleurs, diarrhée ou maux de tête", score: -2 },
  ]},
  { question: "Tu supportes les oignons, l'ail et les choux ?", category: "dysbiose", options: [
    { text: "Aucun problème", score: 3 },
    { text: "Ça passe en petite quantité", score: 2 },
    { text: "Ballonnements ou gaz quasi systématiques", score: -1 },
    { text: "Douleurs ou réactions fortes", score: -2 },
  ]},
  { question: "Tu as pris des IPP (anti-acides type oméprazole, Inexium) ?", category: "dysbiose", options: [
    { text: "Jamais", score: 3 },
    { text: "Ponctuellement, quelques semaines", score: 2 },
    { text: "Pendant plusieurs mois", score: -1 },
    { text: "Pendant des années ou encore actuellement", score: -2 },
  ]},
  { question: "Les légumineuses (lentilles, pois chiches, haricots) te font quoi ?", category: "dysbiose", options: [
    { text: "Aucun souci, bonne digestion", score: 3 },
    { text: "Quelques gaz mais rien de grave", score: 2 },
    { text: "Ballonnements et inconfort marqué", score: -1 },
    { text: "Douleurs ou diarrhée", score: -2 },
  ]},
];

const CANDIDOSE_QUESTIONS = [
  { question: "Tes envies de sucré ressemblent à quoi ?", category: "candidose", options: [
    { text: "Juste un plaisir de temps en temps", score: 3 },
    { text: "Régulières mais contrôlables", score: 2 },
    { text: "Fortes, difficiles à résister", score: -1 },
    { text: "Compulsives, comme une addiction", score: -2 },
  ]},
  { question: "Après avoir mangé du sucre, tu ressens :", category: "candidose", options: [
    { text: "Rien de particulier", score: 3 },
    { text: "Un petit coup de mou passager", score: 2 },
    { text: "Fatigue marquée ou brouillard mental", score: -1 },
    { text: "Crash d'énergie, irritabilité, ou besoin d'en remanger immédiatement", score: -2 },
  ]},
];

const FOIE_QUESTIONS = [
  { question: "Tu as des maux de tête fréquents ?", category: "foie", options: [
    { text: "Rarement ou jamais", score: 3 },
    { text: "Occasionnels, liés au stress ou à la fatigue", score: 2 },
    { text: "Réguliers, surtout sur les tempes ou derrière les yeux", score: -1 },
    { text: "Fréquents et intenses, parfois avec nausées", score: -2 },
  ]},
  { question: "L'alcool, même en petite quantité :", category: "foie", options: [
    { text: "Je ne bois pas / très rarement", score: 3 },
    { text: "Aucun souci, je tolère bien", score: 2 },
    { text: "Un verre suffit à me rendre vaseux ou fatigué le lendemain", score: -1 },
    { text: "Très mauvaise tolérance : maux de tête, nausées, gueule de bois disproportionnée", score: -2 },
  ]},
  { question: "La couleur de tes selles est :", category: "foie", options: [
    { text: "Brun normal", score: 3 },
    { text: "Variable, parfois plus claire", score: 2 },
    { text: "Souvent claires, beiges ou décolorées", score: -1 },
    { text: "Très claires, presque blanches, ou grasses (flottent)", score: -2 },
  ]},
];

const NERVEUX_QUESTIONS = [
  { question: "Quand tu es stressé ou triste, tu manges :", category: "nerveux", options: [
    { text: "Normalement, le stress ne change rien", score: 3 },
    { text: "Un peu plus, surtout du sucré ou du réconfort", score: 2 },
    { text: "Nettement plus, c'est mon refuge", score: -1 },
    { text: "Je perds le contrôle, crises compulsives", score: -2 },
  ]},
  { question: "Ta concentration et ta mémoire au quotidien :", category: "nerveux", options: [
    { text: "Bonnes, je reste focus sans difficulté", score: 3 },
    { text: "Correctes mais ça demande un effort", score: 2 },
    { text: "Souvent dans le brouillard, j'oublie des choses", score: -1 },
    { text: "Très mauvaises, je n'arrive plus à me concentrer", score: -2 },
  ]},
];

// ═══════════════════════════════════════════════════════
// QUESTIONS CLOSING (score neutre, tout le monde)
// ═══════════════════════════════════════════════════════
const CLOSING_QUESTIONS = [
  { question: "As-tu les moyens de changer ton alimentation pour du BIO / BRUT ?", category: "engagement", options: [
    { text: "Oui, sans problème", score: 3 },
    { text: "Oui, en réorganisant un peu mon budget", score: 3 },
    { text: "C'est serré, mais je suis prêt à faire des compromis", score: 3 },
    { text: "Non, budget très limité", score: 3 },
  ]},
  { question: "Quel est ton régime type actuellement ?", category: "alimentation", type: "open", score: 3 },
  { question: "As-tu des antécédents médicaux ? Si oui, lesquels ?", category: "medical", type: "open", score: 3 },
];

// ═══════════════════════════════════════════════════════
// CATÉGORIES pour les résultats
// ═══════════════════════════════════════════════════════
const categoryDescriptions = {
  energie: { name: "énergie", issues: "fatigue chronique, manque de vitalité" },
  circulation: { name: "circulation sanguine", issues: "extrémités froides, mauvaise circulation" },
  thyroide: { name: "thyroïde / métabolisme", issues: "frilosité constante, métabolisme lent" },
  sommeil: { name: "qualité du sommeil", issues: "réveils nocturnes, insomnie, écrans" },
  digestion: { name: "digestion", issues: "ballonnements, gaz, langue chargée" },
  foie: { name: "sphère hépatique", issues: "digestion des graisses difficile, bouche amère" },
  graisses: { name: "qualité des graisses", issues: "huiles inflammatoires au quotidien" },
  immunite: { name: "immunité", issues: "infections fréquentes, cicatrisation lente" },
  inflammation: { name: "inflammation", issues: "douleurs articulaires, allergies, eczéma" },
  mineralisation: { name: "minéralisation", issues: "ongles cassants, problèmes dentaires" },
  peau: { name: "santé de la peau", issues: "sécheresse, acné, inflammations cutanées" },
  cheveux: { name: "santé capillaire", issues: "chute de cheveux" },
  metabolisme: { name: "métabolisme", issues: "envies de sucre, prise de poids, déséquilibre glycémique" },
  nerveux: { name: "axe nerveux", issues: "stress, rumination, épuisement mental" },
  hormones: { name: "équilibre hormonal", issues: "cycles irréguliers, symptômes prémenstruels" },
  sibo: { name: "SIBO (prolifération bactérienne)", issues: "ventre gonflé, brouillard mental post-repas" },
  candidose: { name: "candidose", issues: "mycoses récurrentes, envies sucrées compulsives" },
  dysbiose: { name: "dysbiose intestinale", issues: "intolérance FODMAPs, flore déséquilibrée" },
};

// Catégories exclues de l'affichage "points faibles"
const EXCLUDED_CATS = ["engagement", "alimentation", "medical", "stress"];

// ═══════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════
export default function QuestionnaireAncestral() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+33");
  const [phone, setPhone] = useState("");
  const [indicatifDropdownOpen, setIndicatifDropdownOpen] = useState(false);
  const [indicatifSearch, setIndicatifSearch] = useState("");
  const indicatifDropdownRef = useRef(null);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentAnimating, setConsentAnimating] = useState(false);
  const [consentChoice, setConsentChoice] = useState(null);
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
  const [openAnswer, setOpenAnswer] = useState("");
  const [conditionalBuilt, setConditionalBuilt] = useState(false);
  const [questionsArray, setQuestionsArray] = useState([]);
  const [conditionalTriggered, setConditionalTriggered] = useState({ sibo: false, dysbiose: false, candidose: false, foie: false, nerveux: false });
  const hasSentRef = useRef(false);
  const hasPartialSentRef = useRef(false);

  // GA4 : track abandon on page leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!finished && step > 0 && typeof window.gtag === "function") {
        window.gtag("event", "questionnaire_abandon", { step, total_questions: questionsArray.length });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step, finished, questionsArray.length]);

  // Envoi partiel des données quand l'utilisateur quitte le questionnaire
  useEffect(() => {
    const handlePageHide = () => {
      if (finished || hasPartialSentRef.current) return;
      if (step === 0 && !name.trim() && !email.trim()) return;
      hasPartialSentRef.current = true;

      const prenom = name.trim().split(/\s+/)[0] || "";
      const nom = name.trim().split(/\s+/).slice(1).join(" ") || "";
      const nationalDigits = phone.replace(/\D/g, "").replace(/^0+/, "");
      const fullPhoneWithPlus = phonePrefix === "OTHER" ? phone : `${phonePrefix}${nationalDigits}`;

      const totalQuestions = questionsArray.filter(q => q.type !== "transition").length;
      const answeredCount = answers.length;
      const pourcentageProg = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

      const reponses = answers.map(a => ({
        question: a.question,
        categorie: a.category,
        score: a.score,
        reponse: a.reponseTexte,
      }));

      const timestamp = new Date().toISOString();

      const whatsappLines = [
        "📋 QUESTIONNAIRE ANCESTRAL (INCOMPLET)", "",
        "👤 INFORMATIONS",
        `• Prénom: ${prenom || "-"}`,
        `• Nom: ${nom || "-"}`,
        `• Email: ${email.trim() || "-"}`,
        `• Âge: ${age || "-"}`,
        `• Téléphone: ${fullPhoneWithPlus || "-"}`,
        `• Sexe: ${sex || "-"}`, "",
        "📊 PROGRESSION",
        `• Statut: INCOMPLET`,
        `• Progression: ${answeredCount}/${totalQuestions} (${pourcentageProg}%)`,
        `• Score partiel: ${score}`, "",
        `⏰ Date: ${timestamp}`, "",
        "🧾 RÉPONSES DONNÉES:",
        ...reponses.map(r => `- ${r.question}\n  → ${r.reponse}`),
      ];
      let whatsappText = whatsappLines.join("\n").trim();
      if (whatsappText.length > 3800) whatsappText = whatsappText.slice(0, 3780) + "\n…(tronqué)";

      const payload = new URLSearchParams({
        statut: "incomplet",
        progression: `${answeredCount}/${totalQuestions}`,
        pourcentage_progression: String(pourcentageProg),
        prenom,
        nom,
        email: email.trim(),
        age: age || "",
        telephone: fullPhoneWithPlus,
        sexe: sex || "",
        score: String(score),
        reponsesJson: JSON.stringify(reponses),
        whatsappText,
        timestamp,
      });

      const WEBHOOK_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_MAKE_WEBHOOK_URL) || "https://hook.eu1.make.com/yf61fckihxirt84w6r5rhd5813e16s5v";
      const blob = new Blob([payload.toString()], { type: "application/x-www-form-urlencoded" });
      navigator.sendBeacon(WEBHOOK_URL, blob);
    };

    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, [step, finished, name, email, phone, phonePrefix, age, sex, score, answers, questionsArray]);

  // Build initial questions when sex is selected
  const coreLength = useMemo(() => CORE_QUESTIONS.length + (sex === "femme" ? FEMALE_QUESTIONS.length : 0), [sex]);

  useEffect(() => {
    if (!sex) return;
    const core = CORE_QUESTIONS.map(q => ({ ...q, options: q.options ? shuffleArray(q.options) : undefined }));
    const female = FEMALE_QUESTIONS.map(q => ({ ...q, options: shuffleArray(q.options) }));
    const closing = CLOSING_QUESTIONS.map(q => ({ ...q, options: q.options ? shuffleArray(q.options) : undefined }));
    if (sex === "femme") setQuestionsArray([...core, ...female, ...closing]);
    else setQuestionsArray([...core, ...closing]);
    setConditionalBuilt(false);
  }, [sex]);

  // When core is complete, compute & insert conditional questions
  useEffect(() => {
    if (conditionalBuilt || answers.length < coreLength || coreLength === 0) return;

    const coreAnswers = answers.slice(0, coreLength);

    // Compute averages
    const catScores = {};
    coreAnswers.forEach(a => {
      if (!catScores[a.category]) catScores[a.category] = { total: 0, count: 0 };
      catScores[a.category].total += a.score;
      catScores[a.category].count += 1;
    });
    const avg = (cat) => catScores[cat] ? catScores[cat].total / catScores[cat].count : 3;

    // Find specific answer scores
    const findScore = (cat, keyword) => {
      const a = coreAnswers.find(a => a.category === cat && a.question.toLowerCase().includes(keyword));
      return a ? a.score : 3;
    };

    const digestionAvg = avg("digestion");
    const sucreSc = findScore("metabolisme", "sucre");
    const mycosesSc = findScore("candidose", "mycoses");
    const antibioSc = findScore("candidose", "antibiotiques");

    const triggers = { sibo: false, dysbiose: false, candidose: false, foie: false, nerveux: false };
    const conditionals = [];

    // FOIE : si foie avg < 0 (au moins une réponse mauvaise)
    const foieAvg = avg("foie");
    if (foieAvg < 0) {
      triggers.foie = true;
      conditionals.push(
        { type: "transition", message: "Tes réponses sur le foie montrent des signaux importants. Quelques questions pour affiner." },
        ...FOIE_QUESTIONS.map(q => ({ ...q, options: shuffleArray(q.options) })),
      );
    }

    // SIBO + DYSBIOSE : si digestion avg < 0
    if (digestionAvg < 0) {
      triggers.sibo = true;
      triggers.dysbiose = true;
      if (conditionals.length === 0) {
        conditionals.push({ type: "transition", message: "Tes réponses sur la digestion montrent des signaux importants. Je te pose quelques questions supplémentaires pour affiner l'analyse." });
      } else {
        conditionals.push({ type: "transition", message: "Maintenant, quelques questions sur ta digestion pour aller plus loin." });
      }
      conditionals.push(
        ...SIBO_QUESTIONS.map(q => ({ ...q, options: shuffleArray(q.options) })),
        ...DYSBIOSE_QUESTIONS.map(q => ({ ...q, options: q.options ? shuffleArray(q.options) : undefined })),
      );
    }

    // CANDIDOSE : si sucre < 0 OU mycoses < 0 OU antibiotiques < 0
    if (sucreSc < 0 || mycosesSc < 0 || antibioSc < 0) {
      triggers.candidose = true;
      if (conditionals.length === 0) {
        conditionals.push({ type: "transition", message: "Quelques signaux supplémentaires à vérifier. Encore quelques questions pour compléter ton profil." });
      }
      conditionals.push(...CANDIDOSE_QUESTIONS.map(q => ({ ...q, options: shuffleArray(q.options) })));
    }

    // NERVEUX : si nerveux score < 0
    const nerveuxSc = findScore("nerveux", "stress");
    if (nerveuxSc < 0) {
      triggers.nerveux = true;
      if (conditionals.length === 0) {
        conditionals.push({ type: "transition", message: "Quelques questions sur ton rapport au stress et aux émotions." });
      }
      conditionals.push(...NERVEUX_QUESTIONS.map(q => ({ ...q, options: shuffleArray(q.options) })));
    }

    setConditionalTriggered(triggers);

    if (conditionals.length > 0) {
      setQuestionsArray(prev => {
        const core = prev.slice(0, coreLength);
        const closing = prev.slice(coreLength);
        return [...core, ...conditionals, ...closing];
      });
    }
    setConditionalBuilt(true);
  }, [answers.length, coreLength, conditionalBuilt]);

  // ═══════════════════════════════════════════════════════
  // WEBHOOK — ENVOI MAKE.COM À LA FIN DU QUESTIONNAIRE
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (!finished || hasSentRef.current) return;
    hasSentRef.current = true;
    hasPartialSentRef.current = true;
    if (typeof window.gtag === "function") window.gtag("event", "questionnaire_completed", { total_questions: questionsArray.filter(q => q.type !== "transition").length });

    // Formater le téléphone en international
    const nationalDigits = phone.replace(/\D/g, "").replace(/^0+/, "");
    const fullPhoneWithPlus = phonePrefix === "OTHER" ? phone : `${phonePrefix}${nationalDigits}`;
    const fullPhoneDigitsOnly = fullPhoneWithPlus.replace(/\D/g, "");

    // Calculer les moyennes par catégorie
    const catScores = {};
    answers.forEach(a => {
      if (!catScores[a.category]) catScores[a.category] = { total: 0, count: 0 };
      catScores[a.category].total += a.score;
      catScores[a.category].count += 1;
    });
    const categoryAverages = {};
    Object.keys(catScores).forEach(c => {
      categoryAverages[c] = Math.round((catScores[c].total / catScores[c].count) * 100) / 100;
    });

    // Terrain
    const nbQ = questionsArray.filter(q => q.type !== "transition").length;
    const minScore = nbQ * -2;
    const pct = nbQ > 0 ? (score - minScore) / (maxScore - minScore) : 0;
    let terrain;
    if (pct <= 0.4) terrain = "TERRAIN CRITIQUE";
    else if (pct <= 0.6) terrain = "TERRAIN DÉSÉQUILIBRÉ";
    else if (pct <= 0.8) terrain = "TERRAIN STABLE";
    else terrain = "TERRAIN AVANCÉ";

    const pourcentage = Math.round(pct * 100);

    // Points faibles (avg < 0, hors catégories exclues)
    const weakCategories = Object.keys(categoryAverages)
      .filter(c => !EXCLUDED_CATS.includes(c) && categoryAverages[c] < 0)
      .sort((a, b) => categoryAverages[a] - categoryAverages[b]);

    const symptome1 = weakCategories[0] ? (categoryDescriptions[weakCategories[0]]?.issues || weakCategories[0]) : "";
    const symptome2 = weakCategories[1] ? (categoryDescriptions[weakCategories[1]]?.issues || weakCategories[1]) : "";

    // Réponses ouvertes
    const openAnswersMap = {};
    answers.forEach(a => {
      if (["alimentation", "medical", "stress"].includes(a.category)) {
        openAnswersMap[a.category] = a.reponseTexte;
      }
    });

    // Noms
    const prenom = name.trim().split(/\s+/)[0] || "";
    const nom = name.trim().split(/\s+/).slice(1).join(" ") || "";
    const prenomNom = name.trim();

    // Timestamp
    const timestamp = new Date().toISOString();

    // Réponses formatées
    const reponses = answers.map(a => ({
      question: a.question,
      categorie: a.category,
      score: a.score,
      reponse: a.reponseTexte,
    }));

    // WhatsApp text pré-formaté
    const whatsappLines = [
      "📋 NOUVEAU QUESTIONNAIRE ANCESTRAL", "",
      "👤 INFORMATIONS",
      `• Prénom: ${prenom || "-"}`,
      `• Nom: ${nom || "-"}`,
      `• Email: ${email.trim() || "-"}`,
      `• Âge: ${age || "-"}`,
      `• Téléphone: ${fullPhoneWithPlus || "-"}`,
      `• Sexe: ${sex || "-"}`, "",
      "📊 RÉSULTATS",
      `• Score: ${pourcentage} / 100`,
      `• Pourcentage: ${pourcentage}%`,
      `• Profil: ${terrain}`, "",
      `⏰ Date: ${timestamp}`, "",
      "🧾 RÉPONSES DÉTAILLÉES:",
      ...reponses.map((r, i) => `- ${r.question}\n  → ${r.reponse}`),
    ];
    let whatsappText = whatsappLines.join("\n").trim();
    if (whatsappText.length > 3800) whatsappText = whatsappText.slice(0, 3780) + "\n…(tronqué)";

    // Payload URLSearchParams (compatible no-cors)
    const payload = {
      timestamp,
      prenom,
      nom,
      prenomNom,
      email: email.trim(),
      age: age || "",
      indicatif: phonePrefix === "OTHER" ? "" : phonePrefix,
      telephone: fullPhoneDigitsOnly,
      telephoneInternational: fullPhoneWithPlus,
      telephoneNational: nationalDigits,
      telephoneText: `'${fullPhoneDigitsOnly}`,
      telephoneRaw: fullPhoneDigitsOnly,
      sexe: sex,
      score: String(pourcentage),
      scoreMax: "100",
      scoreFormatted: `${pourcentage} sur 100`,
      pourcentage: String(pourcentage),
      profil: terrain,
      nombreQuestions: String(questionsArray.filter(q => q.type !== "transition").length),
      symptome1,
      symptome2,
      weakCategoriesText: weakCategories.map(c => categoryDescriptions[c]?.name || c).join(", "),
      conditionalSibo: String(conditionalTriggered.sibo),
      conditionalDysbiose: String(conditionalTriggered.dysbiose),
      conditionalCandidose: String(conditionalTriggered.candidose),
      conditionalFoie: String(conditionalTriggered.foie),
      conditionalNerveux: String(conditionalTriggered.nerveux),
      regime: openAnswersMap.alimentation || "",
      antecedents: openAnswersMap.medical || "",
      metier: openAnswersMap.stress || "",
      whatsappText,
      reponsesJson: JSON.stringify(reponses),
      categoryAveragesJson: JSON.stringify(categoryAverages),
      rawJson: JSON.stringify({
        timestamp, prenom, nom, email: email.trim(), age, telephone: fullPhoneWithPlus,
        sexe: sex, score: pourcentage, scoreMax: 100, pourcentage, terrain,
        categoryAverages, weakCategories, conditionalTriggered, reponses,
      }),
    };

    const WEBHOOK_URL = (typeof import.meta !== "undefined" && import.meta.env?.VITE_MAKE_WEBHOOK_URL) || "https://hook.eu1.make.com/yf61fckihxirt84w6r5rhd5813e16s5v";

    fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      body: new URLSearchParams(payload),
    })
      .then(() => console.log("✅ Webhook Make.com envoyé"))
      .catch(err => console.error("❌ Webhook failed:", err));
  }, [finished]);

  // Phone logic
  const dialCode = phonePrefix && phonePrefix !== "OTHER" ? phonePrefix : "";
  const phoneDigitsOnly = phone.replace(/\D/g, "");
  const phoneDigits = dialCode ? phoneDigitsOnly.replace(/^0+/, "") : phoneDigitsOnly;
  const isPhoneValid = phonePrefix !== "" && (phonePrefix === "OTHER" ? phoneDigitsOnly.length >= 1 : phoneDigits.length >= 1);

  const selectedIndicatifLabel = !phonePrefix ? "Indicatif" : phonePrefix === "OTHER" ? "Autre" : (() => {
    const c = COUNTRY_DIAL_LIST.find(x => x.dial === phonePrefix);
    return c ? `${c.name} ${c.dial}` : "Indicatif";
  })();

  const filteredCountries = useMemo(() => {
    const raw = indicatifSearch.trim();
    if (!raw) return COUNTRY_DIAL_LIST;
    const sansAccent = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return COUNTRY_DIAL_LIST.filter(c => sansAccent(c.name).includes(sansAccent(raw)) || c.dial.replace("+", "").includes(raw.replace(/\D/g, "")));
  }, [indicatifSearch]);

  useEffect(() => {
    if (!indicatifDropdownOpen) return;
    const h = (e) => { if (indicatifDropdownRef.current && !indicatifDropdownRef.current.contains(e.target)) setIndicatifDropdownOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [indicatifDropdownOpen]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email.trim());
  const canStart = name.trim().length >= 2 && isEmailValid && isPhoneValid && (sex === "homme" || sex === "femme");

  function goToConsentPage() {
    if (!canStart) return;
    setInitialFormAnimating(true);
    setTimeout(() => { setShowConsentPage(true); setInitialFormAnimating(false); }, 400);
  }

  // Loading animation
  useEffect(() => {
    if (!showCompleted) return;
    setLoadingProgress(0);
    const steps = 60, interval = 3000 / steps;
    let p = 0;
    const id = setInterval(() => {
      p += 100 / steps;
      if (p >= 100) { setLoadingProgress(100); clearInterval(id); setTimeout(() => { setShowCompleted(false); setFinished(true); }, 200); }
      else setLoadingProgress(p);
    }, interval);
    return () => clearInterval(id);
  }, [showCompleted]);

  const maxScore = useMemo(() => {
    return questionsArray.filter(q => q.type !== "transition").length * 3;
  }, [questionsArray]);

  function answer(option, optionIndex) {
    const q = questionsArray[step];
    setScore(s => s + option.score);
    setAnswers(prev => [...prev, { category: q.category, score: option.score, question: q.question, reponseTexte: option.text }]);
    setClickedOptionIndex(optionIndex);
    setTimeout(() => setQuestionTransitioning(true), 400);
    setTimeout(() => {
      const next = step + 1;
      if (typeof window.gtag === "function") window.gtag("event", "questionnaire_step", { step: next });
      if (next < questionsArray.length) { setStep(next); setQuestionTransitioning(false); setClickedOptionIndex(null); }
      else { setShowCompleted(true); setQuestionTransitioning(false); setClickedOptionIndex(null); }
    }, 750);
  }

  function advanceTransition() {
    setQuestionTransitioning(true);
    setTimeout(() => { setStep(s => { if (typeof window.gtag === "function") window.gtag("event", "questionnaire_step", { step: s + 1 }); return s + 1; }); setQuestionTransitioning(false); }, 400);
  }

  function submitOpenAnswer() {
    const q = questionsArray[step];
    if (!q || q.type !== "open" || !openAnswer.trim()) return;
    setScore(s => s + (q.score || 4));
    setAnswers(prev => [...prev, { category: q.category, score: q.score || 4, question: q.question, reponseTexte: openAnswer.trim() }]);
    setOpenAnswer("");
    setQuestionTransitioning(true);
    setTimeout(() => {
      const next = step + 1;
      if (typeof window.gtag === "function") window.gtag("event", "questionnaire_step", { step: next });
      if (next < questionsArray.length) { setStep(next); setQuestionTransitioning(false); }
      else { setShowCompleted(true); setQuestionTransitioning(false); }
    }, 400);
  }

  function goBack() {
    if (step > 0) {
      const prevQ = questionsArray[step - 1];
      if (prevQ && prevQ.type !== "transition") {
        const last = answers[answers.length - 1];
        if (last) { setScore(s => s - last.score); setAnswers(prev => prev.slice(0, -1)); }
      }
      setStep(s => s - 1);
      setClickedOptionIndex(null);
      setOpenAnswer("");
    } else {
      setConsentGiven(false);
      setShowConsentPage(false);
    }
  }

  // ═══ ANALYSE DES RÉSULTATS ═══
  function analyzeAnswers() {
    const cats = {};
    answers.forEach(a => {
      if (EXCLUDED_CATS.includes(a.category)) return;
      if (!cats[a.category]) cats[a.category] = { total: 0, count: 0 };
      cats[a.category].total += a.score;
      cats[a.category].count += 1;
    });
    const avgs = {};
    Object.keys(cats).forEach(c => { avgs[c] = cats[c].total / cats[c].count; });
    const weak = Object.keys(avgs)
      .filter(c => avgs[c] < 0 && !["sibo", "candidose", "dysbiose", "foie", "nerveux", "graisses"].includes(c))
      .sort((a, b) => avgs[a] - avgs[b]);
    return { weakCategories: weak, categoryAverages: avgs };
  }

  // ═══ BLOCS SPÉCIAUX RÉSULTATS ═══
  function buildSpecialBlocks(avgs) {
    const blocks = [];
    const findAnswer = (keyword) => answers.find(a => a.question.toLowerCase().includes(keyword));

    // FOIE
    if (avgs.foie && avgs.foie < 0) {
      let txt = "Tes réponses suggèrent que le foie pourrait être en surcharge. Quand il fatigue, ça peut ralentir la digestion des graisses, l'énergie, et pas mal d'autres choses. En naturopathie, on commence souvent par là.";
      if (conditionalTriggered.foie) {
        const mauxTete = findAnswer("maux de tête");
        const alcool = findAnswer("alcool");
        const sellesColor = findAnswer("couleur de tes selles");
        const details = [];
        if (mauxTete && mauxTete.score < 0) details.push("maux de tête fréquents");
        if (alcool && alcool.score < 0) details.push("mauvaise tolérance à l'alcool");
        if (sellesColor && sellesColor.score < 0) details.push("selles claires ou décolorées");
        if (details.length > 0) {
          txt += "\n\nSignaux supplémentaires : " + details.join(", ") + ". Plus il y a de signaux convergents, plus c'est un axe prioritaire.";
        }
      }
      if (avgs.hormones && avgs.hormones < 0) {
        txt += "\n\nLe foie aide aussi à éliminer le surplus d'hormones. Quand il est surchargé, ça peut jouer sur l'équilibre hormonal.";
      }
      if (avgs.digestion && avgs.digestion < 0) {
        txt += "\n\nFoie et digestion sont très liés. Quand l'un fatigue, l'autre a tendance à suivre.";
      }
      blocks.push({ title: "Sphère hépatique", level: "fort", color: "#ef4444", text: txt });
    }

    // GRAISSES
    const graissesAns = findAnswer("cuisines avec quoi");
    if (graissesAns && graissesAns.score < 0) {
      blocks.push({ title: "Qualité des graisses", level: "urgent", color: "#ef4444",
        text: "Les huiles que tu utilises au quotidien pourraient entretenir une inflammation de fond. Tournesol, colza, margarine : elles sont riches en oméga-6, qui en excès peuvent poser problème. Passer au beurre/ghee (cuisson), olive (à froid) et coco (haute température) est souvent le changement le plus simple avec le plus d'impact.",
        table: { headers: ["A virer", "A utiliser"], rows: [
          ["Margarine", "Beurre cru / ghee (cuisson)"],
          ["Huile de tournesol", "Huile d'olive extra vierge (à froid)"],
          ["Huile de colza (cuisson)", "Huile de coco (haute température)"],
        ]}
      });
    }

    // SIBO
    if (conditionalTriggered.sibo && avgs.sibo) {
      if (avgs.sibo < -1) {
        let txt = "Ventre qui gonfle après les repas, brouillard mental, gaz fréquents : ça peut évoquer une prolifération bactérienne dans l'intestin grêle (SIBO). C'est quand des bactéries se développent là où elles ne devraient pas être en excès.";
        if (avgs.digestion < 0) txt += "\n\nC'est souvent lié à un estomac qui ne fait pas assez bien son travail en amont.";
        blocks.push({ title: "SIBO (possible)", level: "fort", color: "#ef4444", text: txt });
      } else if (avgs.sibo < 0) {
        blocks.push({ title: "SIBO (possible)", level: "modéré", color: "#f59e0b", text: "Quelques signaux digestifs qui pourraient évoquer une prolifération bactérienne. Rien de massif, mais les ballonnements réguliers méritent attention." });
      }
    }

    // DYSBIOSE
    if (conditionalTriggered.dysbiose && avgs.dysbiose) {
      if (avgs.dysbiose < -1) {
        let txt = "Difficulté avec les oignons, l'ail, les choux, les légumineuses, peut-être les fermentés : ça ressemble à une flore intestinale déséquilibrée. Quand l'intestin est fragilisé, certains aliments passent mal et ça peut créer des réactions en chaîne.";
        if (avgs.sibo && avgs.sibo < 0) txt += "\n\nC'est souvent lié au SIBO. Les deux vont souvent ensemble et se corrigent en même temps.";
        blocks.push({ title: "Dysbiose intestinale", level: "fort", color: "#ef4444", text: txt });
      } else if (avgs.dysbiose < 0) {
        blocks.push({ title: "Dysbiose intestinale", level: "modéré", color: "#f59e0b", text: "Certains aliments passent mal : légumineuses, choux, oignons, peut-être les fermentés. C'est pas une fatalité, ça peut évoquer une flore qui a besoin d'être rééquilibrée." });
      }
    }

    // CANDIDOSE
    if (conditionalTriggered.candidose && avgs.candidose) {
      const mycAns = findAnswer("mycoses");
      const antiAns = findAnswer("antibiotiques");
      const hasMycoses = mycAns && mycAns.score < 0;
      const hasAntibio = antiAns && antiAns.score < 0;

      if (avgs.candidose < -1 && (hasMycoses || hasAntibio)) {
        blocks.push({ title: "Candidose (possible)", level: "fort", color: "#ef4444",
          text: "Envies sucrées fortes, mycoses qui reviennent, historique d'antibiotiques : ça peut évoquer un déséquilibre fongique (Candida). C'est une levure naturellement présente dans l'intestin, mais qui peut proliférer quand la flore est affaiblie ou que le sucre est en excès."
        });
      } else if (avgs.candidose < 0 && (hasMycoses || hasAntibio)) {
        blocks.push({ title: "Candidose (à surveiller)", level: "modéré", color: "#f59e0b",
          text: "Envies sucrées combinées à un historique d'antibiotiques ou de mycoses : ça peut évoquer un possible déséquilibre fongique. Pas de panique, mais c'est un axe à surveiller."
        });
      } else if (avgs.candidose < 2 && !hasMycoses && !hasAntibio) {
        blocks.push({ title: "Candidose : peu probable", level: "info", color: "#3b82f6",
          text: "Tes envies sucrées s'expliquent probablement plutôt par un déséquilibre alimentaire ou le stress, pas par une mycose. Pas de mycoses récurrentes, pas d'historique d'antibiotiques lourds. Ça devrait s'améliorer avec le travail digestif et le rééquilibrage alimentaire."
        });
      }
    }

    // THYROÏDE
    if (avgs.thyroide && avgs.thyroide < 0 && avgs.circulation && avgs.circulation < 0) {
      const hasLowEnergie = avgs.energie && avgs.energie < 0;
      const hasLowCheveux = avgs.cheveux && avgs.cheveux < 0;
      const hasLowMetabo = avgs.metabolisme && avgs.metabolisme < 0;
      if (hasLowEnergie || hasLowCheveux || hasLowMetabo) {
        blocks.push({ title: "Métabolisme lent (possible)", level: "à surveiller", color: "#f59e0b",
          text: "Frilosité, extrémités froides, fatigue, perte de cheveux ou prise de poids facile : cette combinaison peut évoquer un métabolisme qui tourne au ralenti. C'est un axe à explorer, ça vaut le coup de creuser."
        });
      }
    }

    // NERVEUX
    if (avgs.nerveux && avgs.nerveux < 0) {
      let txt = "Stress qui tourne en boucle, difficulté à se concentrer, besoin de manger sous pression : ça peut être le signe que le corps manque de certains nutriments essentiels (magnésium, zinc, vitamines B).";
      if (conditionalTriggered.nerveux) {
        const aliEmot = findAnswer("stressé ou triste");
        const concent = findAnswer("concentration");
        if (aliEmot && aliEmot.score < 0) txt += " Le fait de manger sous stress, c'est pas un manque de volonté, c'est souvent le corps qui cherche du carburant parce qu'il manque de certaines choses.";
        if (concent && concent.score < 0) txt += " La difficulté à se concentrer va dans le même sens.";
      }
      const hasLowDigestion = avgs.digestion && avgs.digestion < 0;
      const hasLowFoie = avgs.foie && avgs.foie < 0;
      if (hasLowDigestion || hasLowFoie) {
        txt += "\n\nEt quand la digestion" + (hasLowFoie ? " ou le foie" : "") + " sont en difficulté, ces nutriments passent moins bien. Remettre le digestif en ordre, c'est souvent la première étape.";
      } else {
        txt += "\n\nLa qualité des graisses au quotidien peut aussi jouer là-dessus.";
      }
      blocks.push({ title: "Axe nerveux", level: avgs.nerveux < -1 ? "fort" : "modéré", color: avgs.nerveux < -1 ? "#ef4444" : "#f59e0b", text: txt });
    }

    return blocks;
  }

  function personality() {
    if (!questionsArray.length || !maxScore) return null;
    const nbQ = questionsArray.filter(q => q.type !== "transition").length;
    const minScoreVal = nbQ * -2;
    const pct = nbQ > 0 ? (score - minScoreVal) / (maxScore - minScoreVal) : 0;
    const prenom = name.trim().split(/\s+/)[0] || "toi";

    // Badge
    let label, color, bgColor, borderColor;
    if (pct <= 0.4) { label = "TERRAIN CRITIQUE"; color = "#ef4444"; bgColor = "rgba(239,68,68,0.12)"; borderColor = "rgba(239,68,68,0.3)"; }
    else if (pct <= 0.6) { label = "TERRAIN DÉSÉQUILIBRÉ"; color = "#f59e0b"; bgColor = "rgba(245,158,11,0.12)"; borderColor = "rgba(245,158,11,0.3)"; }
    else if (pct <= 0.8) { label = "TERRAIN STABLE"; color = "#3b82f6"; bgColor = "rgba(59,130,246,0.12)"; borderColor = "rgba(59,130,246,0.3)"; }
    else { label = "TERRAIN AVANCÉ"; color = "#22c55e"; bgColor = "rgba(34,197,94,0.12)"; borderColor = "rgba(34,197,94,0.3)"; }

    const intro = `Ok ${prenom}, voici ce que Mao a analysé de toi.`;

    // Helpers
    const sc = (keyword) => { const r = answers.find(x => x.question.toLowerCase().includes(keyword)); return r ? r.score : 3; };
    const catAvg = (cat) => { const r = answers.filter(x => x.category === cat); return r.length ? r.reduce((s, x) => s + x.score, 0) / r.length : 3; };

    // Flags
    const lowEnergie = catAvg("energie") < 0;
    const lowSommeil = catAvg("sommeil") < 0;
    const lowDigestion = catAvg("digestion") < 0;
    const lowFoie = catAvg("foie") < 0;
    const lowGraisses = sc("cuisines avec quoi") < 0;
    const mixGraisses = sc("cuisines avec quoi") === 0;
    const lowNerveux = sc("stress") < 0;
    const lowThyroide = catAvg("thyroide") < 0 && catAvg("circulation") < 0;
    const lowHormones = catAvg("hormones") < 0;
    const lowCheveux = catAvg("cheveux") < 0;
    const lowMetabo = catAvg("metabolisme") < 0;
    const lowPeau = catAvg("peau") < 0;
    const lowInflammation = catAvg("inflammation") < 0;
    const lowCafe = sc("café") < 0;
    const flagCount = [lowEnergie, lowSommeil, lowDigestion, lowFoie, lowGraisses, lowNerveux, lowThyroide, lowHormones, lowCheveux, lowMetabo, lowPeau, lowInflammation].filter(Boolean).length;

    const parts = [];

    // ═══ ACCROCHE ═══
    if (pct <= 0.4) {
      parts.push("Ton corps envoie pas mal de signaux en même temps, et ils semblent se renforcer entre eux. C'est pas une fatalité, mais ça veut dire qu'il y a des bases à reprendre.");
    } else if (pct <= 0.6) {
      parts.push("Y'a des choses qui tournent, mais le corps compense. Les signaux sont là, et ils pointent un peu tous dans la même direction.");
    } else if (pct <= 0.8) {
      parts.push("Les bases sont plutôt solides. Quelques points méritent attention, et les corriger maintenant pourrait tout amplifier.");
    } else {
      parts.push("Ce que tu fais a l'air de bien fonctionner. L'énergie suit, la récupération aussi.");
    }

    // ═══ BLOC FOIE ═══
    if (lowFoie) {
      let foieTxt = "Le foie semble être un point central chez toi. C'est lui qui filtre, qui aide à digérer les graisses, qui gère pas mal de choses en coulisses. Quand il fatigue, ça peut ralentir beaucoup de processus.";
      if (lowDigestion) {
        foieTxt += " Et quand le foie et la digestion sont en difficulté en même temps, ça peut créer un cercle vicieux.";
      }
      if (lowHormones) {
        foieTxt += " C'est aussi lui qui aide à éliminer le surplus d'hormones. Quand il est surchargé, ça peut jouer sur l'équilibre hormonal.";
      }
      parts.push(foieTxt);
    }

    // ═══ BLOC DIGESTION ═══
    if (lowDigestion && !lowFoie) {
      parts.push("La digestion, c'est la base. Quand elle tourne pas bien, le corps a du mal à récupérer ce dont il a besoin dans ce que tu manges. L'énergie, le stress, la récupération : tout peut en pâtir.");
    } else if (lowDigestion && lowFoie) {
      parts.push("Foie et digestion en difficulté en même temps, c'est souvent là que ça coince le plus. Le corps a du mal à tirer profit de ce que tu lui donnes.");
    }

    // ═══ BLOC GRAISSES ═══
    if (lowGraisses) {
      let graisseTxt = "Les huiles que tu utilises au quotidien pourraient jouer contre toi. Tournesol, colza, margarine : elles ont tendance à entretenir une inflammation de fond dans le corps.";
      if (lowThyroide) {
        graisseTxt += " Ça peut aussi freiner le métabolisme.";
      } else if (lowFoie) {
        graisseTxt += " Et c'est le foie qui doit gérer tout ça en plus du reste.";
      }
      graisseTxt += " Passer au beurre/ghee en cuisson, olive à froid et coco en haute température, c'est souvent le changement le plus simple avec le plus d'impact.";
      parts.push(graisseTxt);
    } else if (mixGraisses && flagCount >= 2) {
      parts.push("Côté graisses, tu mélanges encore bonnes et mauvaises huiles. Passer à 100% graisses stables (beurre, ghee, olive, coco) pourrait consolider le reste.");
    }

    // ═══ BLOC ÉNERGIE + CAFÉ ═══
    if (lowEnergie && lowDigestion) {
      parts.push("L'énergie a du mal à tenir, et c'est probablement lié à la digestion. Si le corps n'arrive pas à bien convertir ce que tu manges, il puise dans ses réserves." + (lowCafe ? " Le café masque le signal, mais il règle rien sur le fond." : ""));
    } else if (lowEnergie && !lowDigestion) {
      parts.push("L'énergie dépend de plusieurs choses : ce que tu absorbes, comment le foie filtre, comment le métabolisme tourne. Quand un de ces maillons ralentit, le corps peut compenser par le stress au lieu de fonctionner tranquillement.");
    }

    // ═══ BLOC NERVEUX ═══
    if (lowNerveux) {
      let nervTxt = "Le stress qui tourne en boucle, la difficulté à se concentrer, le besoin de manger sous pression : ça peut être le signe que le corps manque de certains nutriments essentiels (magnésium, zinc, vitamines B).";
      if (lowDigestion || lowFoie) {
        nervTxt += " Et quand la digestion" + (lowFoie ? " ou le foie" : "") + " sont en difficulté, ces nutriments passent moins bien. Remettre le digestif en ordre, c'est souvent la première étape.";
      } else {
        nervTxt += " La qualité des graisses au quotidien peut aussi jouer là-dessus.";
      }
      parts.push(nervTxt);
    }

    // ═══ BLOC THYROÏDE ═══
    if (lowThyroide && (lowCheveux || lowMetabo || lowEnergie)) {
      let thyTxt = "Frilosité, extrémités froides";
      if (lowCheveux) thyTxt += ", perte de cheveux";
      if (lowMetabo) thyTxt += ", difficulté à stabiliser le poids";
      thyTxt += " : ce genre de combinaison peut évoquer un métabolisme qui tourne au ralenti. C'est un axe à explorer.";
      if (!lowFoie && !lowDigestion) {
        parts.push(thyTxt);
      }
    }

    // ═══ BLOC SOMMEIL ═══
    if (lowSommeil) {
      parts.push("Le sommeil ne semble pas faire son travail de récupération. C'est la nuit que le corps se régénère, et quand cette phase est perturbée, ça se ressent sur tout le reste.");
    }

    // ═══ BLOC HORMONES ═══
    if (lowHormones && !lowFoie) {
      parts.push("Les déséquilibres hormonaux sont rarement isolés. Le foie, l'intestin et le métabolisme jouent tous un rôle. Quand un de ces maillons faiblit, ça peut se répercuter sur le cycle.");
    }

    // ═══ BLOC PEAU + INFLAMMATION ═══
    if (lowPeau && lowInflammation && lowDigestion) {
      parts.push("La peau et les réactions cutanées sont souvent liées à ce qui se passe à l'intérieur, notamment au niveau digestif. Traiter la peau de l'extérieur sans s'occuper du reste, ça donne rarement des résultats durables.");
    } else if (lowPeau && !lowDigestion) {
      parts.push("L'état de la peau reflète souvent ce qui se passe à l'intérieur. La qualité des graisses et le fonctionnement digestif peuvent jouer un rôle direct.");
    }

    // ═══ CLOSING ═══
    if (pct <= 0.4) {
      parts.push("Tout ça peut évoluer. Mais c'est mieux de s'en occuper maintenant." + (lowFoie ? " Le point de départ, c'est souvent le foie." : lowDigestion ? " Le point de départ, c'est souvent la digestion." : " Le point de départ, c'est revenir aux fondamentaux."));
    } else if (pct <= 0.6) {
      parts.push("Le bon moment pour agir, c'est quand le corps envoie ses premiers signaux, pas quand il lâche." + (lowFoie ? " Et le premier levier, c'est souvent le foie." : ""));
    } else if (pct <= 0.8) {
      if (flagCount <= 1 && mixGraisses) {
        parts.push("Un ajustement ciblé pourrait suffire à passer un cap.");
      } else {
        parts.push("Ce que tu as mis en place est précieux. Quelques ajustements pourraient tout amplifier.");
      }
    } else {
      if (parts.length <= 2) {
        parts.push("Continue comme ça, c'est solide.");
      }
    }

    return { label, color, bgColor, borderColor, intro, story: parts.join("\n\n") };
  }

  function restartFromStart() {
    hasSentRef.current = false; setName(""); setEmail(""); setPhonePrefix("+33"); setAge(""); setPhone(""); setSex("");
    setConsentGiven(false); setConsentAnimating(false); setStep(0); setScore(0); setAnswers([]); setFinished(false);
    setQuestionTransitioning(false); setShowCompleted(false); setOpenAnswer(""); setShowConsentPage(false);
    setConditionalBuilt(false); setConditionalTriggered({ sibo: false, dysbiose: false, candidose: false, foie: false, nerveux: false });
  }

  const prof = personality();
  const analysis = finished ? analyzeAnswers() : null;
  const specialBlocks = finished && analysis ? buildSpecialBlocks(analysis.categoryAverages) : [];

  // Count only real questions for display
  const realQuestionCount = questionsArray.filter(q => q.type !== "transition").length;
  const answeredCount = answers.length;

  const fadeOut = { animation: "fadeOutUp 0.3s ease-out forwards" };
  const fadeIn = { animation: "fadeInUp 0.35s ease-out forwards" };
  const currentQ = questionsArray[step];

  return (
    <div style={{ minHeight: "100vh", width: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", padding: "16px", boxSizing: "border-box", overflow: "hidden" }}>
      {/* Background image */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `url(${BG_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", zIndex: -3, transform: "scale(1.03)", filter: "saturate(1.05) contrast(1.02)" }} />
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: -1 }} />
      <style>{`
        @keyframes fadeInUp { 0% { opacity:0; transform:translateY(15px); } 100% { opacity:1; transform:translateY(0); } }
        @keyframes fadeOutUp { 0% { opacity:1; transform:translateY(0); } 100% { opacity:0; transform:translateY(-15px); } }
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.08); } }
        @keyframes sweepX { 0% { transform:scaleX(0); opacity:0.8; } 100% { transform:scaleX(1); opacity:0.55; } }
        .btn-option { transition: all 0.15s ease; }
        .btn-option:hover { background: #475569 !important; border-color: rgba(255,255,255,0.2) !important; transform: translateY(-1px); }
        .btn-option:active { transform: scale(0.98); }
        .btn-cta { transition: all 0.25s ease; }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(96,165,250,0.35); }
        .sweep-overlay { position:absolute; top:0; left:0; right:0; bottom:0; background:rgba(120,120,120,0.65); transform-origin:center; animation: sweepX 0.45s ease-out forwards; pointer-events:none; border-radius:14px; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.4); }
        .scroll-thin::-webkit-scrollbar { width: 6px; }
        .scroll-thin::-webkit-scrollbar-track { background: transparent; }
        .scroll-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); border-radius: 3px; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460, maxHeight: "92vh", overflowY: "auto", overflowX: "hidden", background: "rgba(2,6,23,0.55)", backdropFilter: "blur(16px)", padding: "clamp(16px,4vw,24px)", borderRadius: 20, textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.6)", color: "white", boxSizing: "border-box" }} className="scroll-thin">

        {/* ═══ FORMULAIRE INITIAL ═══ */}
        {!showConsentPage ? (
          <div style={initialFormAnimating ? fadeOut : fadeIn}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, opacity: 0.8, textTransform: "uppercase", fontWeight: 700 }}>TON PROFIL ALIMENTAIRE</div>
            <h2 style={{ margin: "8px 0 0", fontSize: "clamp(1.2em,4vw,1.6em)" }}>Avant de commencer</h2>
            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Ton prénom et nom" />
              <input style={{ ...inputStyle, borderColor: email.trim() && !isEmailValid ? "rgba(239,68,68,0.6)" : undefined }} value={email} onChange={e => setEmail(e.target.value)} placeholder="Ton email (obligatoire)" type="email" />
              <input style={inputStyle} value={age} onChange={e => setAge(e.target.value)} placeholder="Ton âge" type="number" min="1" max="120" />
              {/* Téléphone */}
              <div>
                <label style={{ display: "block", textAlign: "left", fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Ton numéro de téléphone</label>
                <div style={{ display: "flex", borderRadius: 14, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(15,23,42,0.55)", position: "relative" }} ref={indicatifDropdownRef}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <button type="button" onClick={() => { setIndicatifDropdownOpen(o => !o); if (!indicatifDropdownOpen) setIndicatifSearch(""); }}
                      style={{ ...inputStyle, width: "max-content", minWidth: 160, border: "none", borderRadius: "12px 0 0 12px", borderRight: "1px solid rgba(255,255,255,0.14)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, textAlign: "left" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 14 }}>{selectedIndicatifLabel}</span>
                      <span style={{ opacity: 0.7, fontSize: 10 }}>{indicatifDropdownOpen ? "\u25b2" : "\u25bc"}</span>
                    </button>
                    {indicatifDropdownOpen && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "rgba(15,23,42,0.98)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 1000, maxHeight: 280, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <input type="text" placeholder="Rechercher ton pays" value={indicatifSearch} onChange={e => setIndicatifSearch(e.target.value)} style={{ ...inputStyle, margin: 8, marginBottom: 4, flexShrink: 0 }} autoFocus />
                        <div className="scroll-thin" style={{ overflowY: "auto", flex: 1, padding: "0 8px 8px" }}>
                          {filteredCountries.length === 0 && <p style={{ padding: 10, margin: 0, fontSize: 13, opacity: 0.5 }}>Aucun pays trouvé</p>}
                          {filteredCountries.map(c => (
                            <button key={c.dial + c.name} type="button" onClick={() => { setPhonePrefix(c.dial); setIndicatifDropdownOpen(false); }}
                              style={{ display: "block", width: "100%", padding: "9px 10px", border: "none", borderRadius: 8, background: "transparent", color: "white", textAlign: "left", cursor: "pointer", fontSize: 13 }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              {c.name} {c.dial}
                            </button>
                          ))}
                          <button type="button" onClick={() => { setPhonePrefix("OTHER"); setIndicatifDropdownOpen(false); }}
                            style={{ display: "block", width: "100%", padding: "9px 10px", border: "none", borderRadius: 8, background: "transparent", color: "white", textAlign: "left", cursor: "pointer", fontSize: 13, borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 4 }}>Autre</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <input style={{ ...inputStyle, flex: 1, border: "none", borderRadius: "0 12px 12px 0", background: "transparent" }}
                    value={phone} onChange={e => { let v = e.target.value; if (dialCode) { const d = v.replace(/\D/g, ""); if (d.startsWith("0")) { setPhone(d.replace(/^0+/, "")); return; } } setPhone(v); }}
                    placeholder={phonePrefix === "OTHER" ? "Numéro avec indicatif" : "6 12 34 56 78"} type="tel" />
                </div>
              </div>
              {/* Sexe */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {["homme", "femme"].map(s => (
                  <button key={s} type="button" onClick={() => setSex(s)}
                    style={{ padding: "12px 14px", borderRadius: 14, border: `1px solid ${sex === s ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)"}`, background: sex === s ? "#475569" : "rgba(15,23,42,0.35)", color: "white", cursor: "pointer", fontSize: 14, fontWeight: sex === s ? 600 : 400, transition: "all 0.2s" }}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <p style={{ margin: 0, opacity: 0.65, fontSize: 12, lineHeight: 1.4 }}>Tu dois remplir <b>prénom/nom + email valide + téléphone</b> et choisir <b>Homme/Femme</b>.</p>
              <button type="button" onClick={goToConsentPage} disabled={!canStart}
                style={{ marginTop: 8, width: "100%", padding: "14px 20px", fontSize: 16, fontWeight: 600, color: canStart ? "white" : "rgba(255,255,255,0.45)", background: canStart ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "rgba(255,255,255,0.08)", border: canStart ? "none" : "1px solid rgba(255,255,255,0.15)", borderRadius: 12, cursor: canStart ? "pointer" : "not-allowed", boxShadow: canStart ? "0 4px 16px rgba(59,130,246,0.4)" : "none", transition: "all 0.25s" }}>
                Continuer
              </button>
            </div>
          </div>

        /* ═══ CONSENTEMENT ═══ */
        ) : !consentGiven ? (
          <div style={consentAnimating ? fadeOut : fadeIn}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, opacity: 0.8, textTransform: "uppercase", fontWeight: 700 }}>AVANT DE CONTINUER...</div>
            <h2 style={{ margin: "12px 0 0", fontSize: 20 }}>Avant de continuer...</h2>
            <p style={{ marginTop: 16, lineHeight: 1.65, opacity: 0.92, textAlign: "left", fontSize: 14 }}>
              Les prochaines questions abordent des aspects plus personnels de ta vie. Tes réponses resteront strictement confidentielles.
              <br /><br />
              <strong>Tu recevras un message personnalisé de ma part</strong> après avoir terminé le questionnaire.
              <br /><br />
              <strong>Souhaites-tu poursuivre ?</strong>
            </p>
            <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
              <button style={{ ...consentBtnStyle, background: "rgba(15,23,42,0.55)" }}
                onClick={() => { setConsentChoice("yes"); setConsentAnimating(true); setTimeout(() => { setConsentGiven(true); setConsentAnimating(false); setConsentChoice(null); }, 400); }}>
                <span style={{ color: consentChoice === "yes" ? "#22c55e" : "inherit", fontWeight: consentChoice === "yes" ? "bold" : "normal" }}>{consentChoice === "yes" ? "\u2713" : "\u2610"}</span> Oui, je me sens à l'aise pour continuer
              </button>
              <button style={{ ...consentBtnStyle, background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" }}
                onClick={() => { setConsentChoice("no"); setTimeout(() => { alert("Merci pour ta visite. Prends soin de toi !"); restartFromStart(); }, 800); }}>
                <span style={{ color: consentChoice === "no" ? "#ef4444" : "inherit", fontWeight: consentChoice === "no" ? "bold" : "normal" }}>{consentChoice === "no" ? "\u2717" : "\u2610"}</span> Non, je préfère m'arrêter ici
              </button>
            </div>
          </div>

        /* ═══ LOADING ═══ */
        ) : showCompleted ? (
          <div style={fadeIn}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "50px 20px" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(16,185,129,0.2) 100%)", border: "2px solid rgba(34,197,94,0.45)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "#22c55e", fontWeight: "bold", animation: "pulse 1.2s ease-in-out infinite" }}>{"\u2713"}</div>
              <h2 style={{ margin: "16px 0 0", fontSize: 26 }}>Questionnaire terminé !</h2>
              <p style={{ margin: "16px 0 20px", opacity: 0.85, fontSize: 15 }}>Ton profil a été analysé avec soin.</p>
              <div style={{ width: "100%", height: 8, borderRadius: 999, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, #60a5fa, #3b82f6)", borderRadius: 999, transition: "width 0.1s ease-out", width: `${loadingProgress}%`, boxShadow: "0 0 12px rgba(96,165,250,0.5)" }} />
              </div>
              <p style={{ margin: "12px 0 0", opacity: 0.65, fontSize: 13 }}>Chargement de ton analyse personnalisée...</p>
            </div>
          </div>

        /* ═══ TRANSITION ═══ */
        ) : !finished && currentQ && currentQ.type === "transition" ? (
          <div style={questionTransitioning ? fadeOut : fadeIn}>
            <div style={{ padding: "30px 10px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(59,130,246,0.15)", border: "2px solid rgba(59,130,246,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🔍</div>
              <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.92 }}>{currentQ.message}</p>
              <button onClick={advanceTransition} className="btn-cta"
                style={{ marginTop: 20, padding: "14px 32px", borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.4)" }}>
                Continuer
              </button>
            </div>
          </div>

        /* ═══ QUESTIONS ═══ */
        ) : !finished ? (
          <div style={questionTransitioning ? fadeOut : fadeIn}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, opacity: 0.8, textTransform: "uppercase", fontWeight: 700 }}>TA CARTE ANCESTRALE</div>
            <h2 style={{ margin: "10px 0 0", fontSize: "clamp(1.1em,3.8vw,1.4em)", lineHeight: 1.3 }}>{currentQ?.question}</h2>

            {currentQ?.type === "open" ? (
              <div style={{ marginTop: 16 }}>
                <textarea value={openAnswer} onChange={e => setOpenAnswer(e.target.value)} placeholder="Tape ta réponse ici..." rows={5}
                  style={{ width: "100%", padding: 12, fontSize: 15, fontFamily: "inherit", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, background: "rgba(255,255,255,0.05)", color: "white", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
                <button onClick={submitOpenAnswer} disabled={!openAnswer.trim()}
                  style={{ ...optionBtnStyle, marginTop: 12, opacity: openAnswer.trim() ? 1 : 0.4, cursor: openAnswer.trim() ? "pointer" : "not-allowed", background: openAnswer.trim() ? "#3b82f6" : "#334155", fontWeight: 600 }}>
                  Suivant →
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
                {currentQ?.options?.map((opt, i) => (
                  <button key={i} className="btn-option" style={{ ...optionBtnStyle, position: "relative", overflow: "hidden" }}
                    onClick={() => answer(opt, i)} disabled={clickedOptionIndex !== null}>
                    {clickedOptionIndex === i && <div className="sweep-overlay" />}
                    {opt.text}
                  </button>
                ))}
              </div>
            )}

            <div style={{ position: "relative", marginTop: 16 }}>
              <p style={{ margin: 0, opacity: 0.65, textAlign: "center", fontSize: 14 }}>Question {answeredCount + 1} / {realQuestionCount}</p>
              <button onClick={goBack}
                style={{ position: "absolute", left: 0, bottom: -2, padding: "7px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(51,65,85,0.6)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                ← Retour
              </button>
            </div>
          </div>

        /* ═══ RÉSULTATS ═══ */
        ) : (
          <div style={fadeIn}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, opacity: 0.8, textTransform: "uppercase", fontWeight: 700 }}>TA CARTE ANCESTRALE</div>
            <p style={{ fontSize: 13, opacity: 0.8, marginTop: 12, marginBottom: 16 }}>{prof?.intro}</p>

            {/* Avatar + Badge */}
            <div className="result-header">
              <div className="inline-avatar">
                <Avatar sex={sex} label={prof?.label} />
              </div>
              <div className="result-header-content">
                <div style={{ display: "inline-block", padding: "10px 24px", borderRadius: 14, background: prof?.bgColor, border: `1px solid ${prof?.borderColor}`, marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: prof?.color, letterSpacing: 1 }}>{prof?.label}</span>
                </div>
                <p style={{ opacity: 0.9, fontSize: 16, fontWeight: 600, margin: "8px 0 0" }}>Ton score global : <b>{Math.round(((score - questionsArray.filter(q => q.type !== "transition").length * -2) / (maxScore - questionsArray.filter(q => q.type !== "transition").length * -2)) * 100)}%</b></p>
              </div>
            </div>

            {/* Barres visuelles par catégorie */}
            {analysis && (() => {
              const barCats = [
                { key: "energie", label: "Énergie" },
                { key: "sommeil", label: "Sommeil" },
                { key: "digestion", label: "Digestion" },
                { key: "foie", label: "Foie" },
                { key: "graisses", label: "Graisses" },
                { key: "nerveux", label: "Nerveux" },
                { key: "metabolisme", label: "Métabolisme" },
                { key: "immunite", label: "Immunité" },
                { key: "inflammation", label: "Inflammation" },
                { key: "mineralisation", label: "Minéralisation" },
                { key: "peau", label: "Peau" },
                { key: "cheveux", label: "Cheveux" },
                { key: "circulation", label: "Circulation" },
                { key: "thyroide", label: "Thyroïde" },
              ];
              if (sex === "femme") barCats.push({ key: "hormones", label: "Hormones" });
              const avgs = analysis.categoryAverages;
              const items = barCats.filter(c => avgs[c.key] !== undefined).map(c => ({ ...c, pct: Math.round(((avgs[c.key] + 2) / 5) * 100) }));
              items.sort((a, b) => a.pct - b.pct);
              const barColor = (pct) => pct <= 35 ? "#ef4444" : pct <= 55 ? "#f59e0b" : pct <= 75 ? "#3b82f6" : "#22c55e";
              return (
                <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", textAlign: "left" }}>
                  {items.map(c => (
                    <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, opacity: 0.6, width: 72, flexShrink: 0, textAlign: "right" }}>{c.label}</span>
                      <div style={{ flex: 1, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${c.pct}%`, borderRadius: 999, background: barColor(c.pct) }} />
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 600, color: barColor(c.pct), width: 26, flexShrink: 0 }}>{c.pct}%</span>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Story */}
            <p style={{ marginTop: 12, lineHeight: 1.55, opacity: 0.92, textAlign: "left", whiteSpace: "pre-line", fontSize: 14 }}>{prof?.story}</p>

            {/* Blocs spéciaux */}
            {specialBlocks.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, textAlign: "left", letterSpacing: 0.3 }}>Analyse ciblée</p>
                {specialBlocks.map((block, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: 14, borderRadius: 14, background: block.level === "info" ? "rgba(59,130,246,0.08)" : `${block.color}11`, border: `1px solid ${block.color}44`, textAlign: "left" }}>
                    <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: block.color }}>
                      {block.title} {block.level !== "info" && <span style={{ fontSize: 11, opacity: 0.8 }}>({block.level})</span>}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, opacity: 0.9, whiteSpace: "pre-line" }}>{block.text}</p>
                    {block.table && (
                      <table style={{ width: "100%", marginTop: 10, borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr>{block.table.headers.map((h, j) => <th key={j} style={{ padding: "6px 8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 600, textAlign: "left" }}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {block.table.rows.map((row, j) => (
                            <tr key={j}>{row.map((cell, k) => <td key={k} style={{ padding: "5px 8px", border: "1px solid rgba(255,255,255,0.08)" }}>{cell}</td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Points faibles classiques */}
            {analysis?.weakCategories?.length > 0 && (
              <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", textAlign: "left" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14, color: "#fca5a5" }}>Autres points à travailler :</p>
                {analysis.weakCategories.slice(0, 5).map(cat => {
                  const desc = categoryDescriptions[cat];
                  return desc ? <p key={cat} style={{ margin: "6px 0", fontSize: 13, lineHeight: 1.45, opacity: 0.9 }}>
                    <strong style={{ color: "#fca5a5" }}>{desc.name.charAt(0).toUpperCase() + desc.name.slice(1)}</strong> : {desc.issues}
                  </p> : null;
                })}
              </div>
            )}

            <p style={{ marginTop: 16, opacity: 0.8, textAlign: "left", lineHeight: 1.45, fontSize: 13 }}>Objectif : énergie stable, digestion calme, peau/cheveux qui suivent.</p>

            {/* CTAs */}
            <a href="https://calendly.com/d/cxhk-x8n-nzw/bilan-ancestral" target="_blank" rel="noopener noreferrer" className="btn-cta"
              style={{ display: "block", marginTop: 20, padding: "16px 20px", borderRadius: 12, background: "linear-gradient(135deg, rgba(96,165,250,0.22) 0%, rgba(59,130,246,0.22) 100%)", border: "1px solid rgba(96,165,250,0.4)", textAlign: "center", textDecoration: "none", color: "white", fontWeight: 700, fontSize: 16 }}>
              Ton plan d'action ancestral personnalisé
            </a>
            <a href="https://www.skool.com/ancestral/about?ref=480fbb005e714961b5e08f536c4ff579" target="_blank" rel="noopener noreferrer" className="btn-cta"
              style={{ display: "block", marginTop: 10, padding: "16px 20px", borderRadius: 12, background: "linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(220,38,38,0.2) 100%)", border: "1px solid rgba(239,68,68,0.35)", textAlign: "center", textDecoration: "none", color: "white", fontWeight: 700, fontSize: 16 }}>
              Découvrir la formation ancestrale 7 jours offerts
            </a>

            <p style={{ marginTop: 16, opacity: 0.75, textAlign: "center", fontSize: 13 }}>
              Tu as une question ? WhatsApp de Mao :{" "}
              <a href="https://wa.me/33749834339" target="_blank" rel="noopener noreferrer" style={{ color: "#25d366", textDecoration: "underline", fontWeight: 600 }}>07 49 83 43 39</a>
            </p>

            <TestimonialsCarousel />

            <button onClick={restartFromStart} style={{ marginTop: 20, padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "white", cursor: "pointer", fontSize: 13, opacity: 0.7 }}>
              Recommencer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// AVATAR
// ═══════════════════════════════════════════════════════
function Avatar({ sex, label }) {
  const base = sex === "femme" ? "femme" : "homme";
  let suffix = "ancien";
  if (label) {
    if (label.includes("CRITIQUE")) suffix = "sedimente";
    else if (label.includes("STABLE")) suffix = "equilibre";
    else if (label.includes("DÉSÉQUILIBRÉ")) suffix = "transitionnel";
    else suffix = "ancien";
  }
  const src = `/avatars/${base}-${suffix}.png`;
  return (
    <img src={src} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom center", display: "block" }} />
  );
}

// ═══════════════════════════════════════════════════════
// TÉMOIGNAGES (avec touch/swipe)
// ═══════════════════════════════════════════════════════
function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const testimonials = [
    { name: "Sarah", text: "Depuis que je suis tes conseils et ton alimentation j'ai enfin réussi à dormir 6h par nuit cela ne m'était pas arrivé depuis plus de 30 ans. Je dormais maximum 2h et j'étais fatiguée toute la journée. C'est vraiment incroyable ce changement donc merci merci merci 🙏" },
    { name: "Marc", text: "J'ai commencé d'appliquer ce que tu expliques il y a environ 3/4 mois. L'alimentation ancestrale/brute est juste incroyable." },
    { name: "Laura", text: "Il y a 3 ans, on m'a détecté des lésions au niveau de l'utérus, papillomavirus. En novembre j'ai fait un contrôle, que je fais tous les 6 mois pour contrôler que les lésions ne deviennent pas cancéreuses. Hier, j'ai eu le résultat et le test est revenu négatif!!! 3 ans que je me bats contre ces lésions et en l'espace de quelques mois certainement dû à cette alimentation, les lésions ont disparu!!! 🎉" },
    { name: "Thomas", text: "Depuis que je mange comme ça j'ai pleins pleins de cheveux qui repoussent j'avais un début de calvitie mais ça repousse c'est génial adieu la greffe de cheveux en turquie bonjour patate douce 🍠" },
    { name: "Julie", text: "Les patates c'est magiques vraiment je suis en train de tester d'en manger chaque jour c'est affolant l'énergie que j'ai, la vitalité, le dynamisme, merci pour ton contenu, je dis tjrs aux gens de te suivre parce qu'en étudiant depuis de nombreuses années la nutrition pour moi tu as toutes les clefs et les vérités, donc gros merci, continue 🙏" },
    { name: "Alexandre", text: "Comme expliqué en pantalon avant nutrition ancestrale : 40 voir carrément 42, après 1 mois : 40 proche 38 💪 Ça fonctionne !!! 🤣 je remet mes costards" },
    { name: "Emma", text: "En 3 semaines à manger à ma faim etc j'ai perdu 1,5kg et j'ai des grosses lèvres 😂" },
    { name: "Sophie", text: "Depuis que je te suis je me réajuste et rééquilibre petit à petit ❤️ Mais plus de fringale, plus de privation, plus de dévorage de tablette de chocolat. Après des années de TCA ça fait du bien 🙏" },
    { name: "Marie", text: "J'avoue que je suis ton compte depuis qq mois aussi et je trouve des explications sur l'alimentation précises, claires et sans chichis. Tu es une personne simple, authentique et surtout intègre. Merci pour les partages car chacun prend ce qui lui fait sens à travers tes conseils. A bon entendeur...😉" },
    { name: "Pierre", text: "Je ne sais pas si c'est l'alimentation vivante que j'ai repris depuis quelques semaines ou les patates vapeurs remplies de bon beurre de lait crû mais mes douleurs musculaires et articulaires s'atténuent drastiquement 👌" },
    { name: "Chloé", text: "Mao tu t'en rend peut être pas compte mais ma vie est réellement entrain de changer tu expliques si bien les choses que depuis 2-3 mois où je suis arrivée je ne vois plus les choses de la même manière j'avais commencer un travail de recherche compréhension de la nourriture mais j'étais encore très loin du compte je te trouves ultra pédagogue c'est super important pour moi et ça a créer une confiance vis à vis de toi tu expliques tu ne vend pas tu ne prend pas de raccourcie c'est excellent 💙" },
    { name: "Léa", text: "Idem pour moi, merci Maoris, j'ai fait un pêcher de m'en priver toutes ces années !! Après avoir essayé pleins de diets pour mes pauvres intestins : Montignac, Delabos, keto, Paléo, auto-immun protocol, sans lectines,... J'en oublie certains, les patates y a pas mieux 😮" },
    { name: "Lucas", text: "Salut mec, je voulais te signaler que je te suis depuis peu de temps et que j'essaye d'appliquer les principes que tu évoques ! Et en l'espace de qqls jours, je peux noter des changements ben terme d'énergie. Sans prise de tête, juste en mangeant frugal et le plus ancestral. C'est cool ce que tu fais sur cette page, bonne continuation 🤌" },
    { name: "Camille", text: "Le plus significatif fut une déchirure qui s'est guéri extrêmement vite par rapport à ce que le médecin m'avait dit (mon kiné fut étonné aussi). J'ai un sommeil de meilleure qualité, je récupère beaucoup plus rapidement, ma peau s'est embellie et surtout je sens un regain d'énergie global. De même, il y a eu un effet sur le moral qui est beaucoup plus stable ✨" },
  ];
  const next = () => setIdx(i => (i + 1) % testimonials.length);
  const prev = () => setIdx(i => i === 0 ? testimonials.length - 1 : i - 1);
  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (dist > 50) next();
    else if (dist < -50) prev();
  };
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      if (e.deltaX > 30) next();
      else if (e.deltaX < -30) prev();
    }
  };
  return (
    <div style={{ marginTop: 28, textAlign: "center" }}>
      <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, opacity: 0.9, letterSpacing: 0.5, textTransform: "uppercase" }}>Ils ont testé l'approche ancestrale</p>
      <div style={{ position: "relative", width: "100%", minHeight: 140, display: "flex", alignItems: "center", justifyContent: "center" }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onWheel={onWheel}>
        <button onClick={prev} style={arrowBtnStyle} aria-label="Précédent">{"\u2039"}</button>
        <div key={idx} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", maxWidth: "80%", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", animation: "fadeInUp 0.35s ease-out" }}>
          <p style={{ fontSize: 13.5, lineHeight: "19px", color: "#111b21", margin: 0, textAlign: "left", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", whiteSpace: "pre-line" }}>{testimonials[idx].text}</p>
          <p style={{ fontSize: 11, color: "#65758b", margin: "6px 0 0", textAlign: "right", fontWeight: 600 }}>- {testimonials[idx].name}</p>
        </div>
        <button onClick={next} style={{ ...arrowBtnStyle, left: "auto", right: -8 }} aria-label="Suivant">{"\u203a"}</button>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 5, justifyContent: "center" }}>
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: 7, height: 7, borderRadius: "50%", border: "none", background: i === idx ? "rgba(96,165,250,0.8)" : "rgba(255,255,255,0.2)", cursor: "pointer", padding: 0, transition: "all 0.25s" }} />
        ))}
      </div>
    </div>
  );
}

// ═══ STYLES ═══
const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(15,23,42,0.55)", color: "white", outline: "none", fontSize: 15, boxSizing: "border-box" };
const optionBtnStyle = { width: "100%", padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "#334155", color: "white", cursor: "pointer", fontSize: 14.5, lineHeight: 1.25, textAlign: "left" };
const consentBtnStyle = { width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.14)", color: "white", cursor: "pointer", fontSize: 14, lineHeight: 1.4, textAlign: "left", transition: "all 0.2s" };
const arrowBtnStyle = { position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.3)", border: "none", color: "white", fontSize: 22, cursor: "pointer", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, padding: 0, lineHeight: 1 };
