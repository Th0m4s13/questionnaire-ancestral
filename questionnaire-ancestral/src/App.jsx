import { useMemo, useState } from "react";

/**
 * Scores:
 * 🟢 = 4 (meilleur)
 * 🟡 = 3
 * 🟠 = 2
 * 🔴 = 1 (pire)
 */

const baseQuestions = [
  {
    question: "Le matin au réveil, tu te sens comment ?",
    options: [
      { text: "🟢 En pleine forme, prêt à attaquer la journée", score: 4 },
      { text: "🟡 Il me faut un moment pour me réveiller vraiment", score: 3 },
      { text: "🟠 Je suis déjà fatigué au lever", score: 2 },
      { text: "🔴 Je me lève vidé(e), comme si je n’avais pas dormi", score: 1 },
    ],
  },
  {
    question: "Tes mains et pieds sont :",
    options: [
      { text: "🟢 Toujours bien chauds", score: 4 },
      { text: "🟡 Froids parfois, selon la saison", score: 3 },
      { text: "🟠 Souvent froids même à l’intérieur", score: 2 },
      { text: "🔴 Gelés en permanence, même sous la couette", score: 1 },
    ],
  },
  {
    question: "Ta température corporelle au réveil est :",
    options: [
      { text: "🟢 Toujours autour de 36,6–37°C", score: 4 },
      { text: "🟡 Parfois un peu basse", score: 3 },
      { text: "🟠 Souvent autour de 36°C", score: 2 },
      { text: "🔴 Toujours en dessous de 36°C", score: 1 },
    ],
  },
  {
    question: "Ton niveau d’énergie en journée est :",
    options: [
      { text: "🟢 Stable du matin au soir", score: 4 },
      { text: "🟡 Variable mais gérable", score: 3 },
      { text: "🟠 En dents de scie, avec des coups de mou", score: 2 },
      { text: "🔴 Épuisement constant, même sans effort", score: 1 },
    ],
  },
  {
    question: "Tu as souvent besoin de café, sucre ou stimulant pour fonctionner ?",
    options: [
      { text: "🟢 Jamais", score: 4 },
      { text: "🟡 De temps en temps", score: 3 },
      { text: "🟠 Tous les jours", score: 2 },
      { text: "🔴 Plusieurs fois par jour sinon je “tombe”", score: 1 },
    ],
  },
  {
    question: "Tu dors :",
    options: [
      { text: "🟢 Profondément et sans réveils", score: 4 },
      { text: "🟡 Légèrement, je me réveille parfois", score: 3 },
      { text: "🟠 Je me réveille plusieurs fois", score: 2 },
      { text: "🔴 Je dors très mal ou j’ai de l’insomnie", score: 1 },
    ],
  },
  {
    question: "Tu as besoin de combien de sommeil pour récupérer ?",
    options: [
      { text: "🟢 5–6h me suffisent", score: 4 },
      { text: "🟡 Il me faut 8h minimum", score: 3 },
      { text: "🟠 Même 9h ne suffisent pas", score: 2 },
      { text: "🔴 Je suis toujours épuisé(e), même avec 10h", score: 1 },
    ],
  },
  {
    question: "Tu ressens des ballonnements ou gaz :",
    options: [
      { text: "🟢 Jamais", score: 4 },
      { text: "🟡 Parfois, après certains plats", score: 3 },
      { text: "🟠 Quasiment tous les jours", score: 2 },
      { text: "🔴 Constamment, avec douleurs", score: 1 },
    ],
  },
  {
    question: "Ta langue le matin est :",
    options: [
      { text: "🟢 Rose et propre", score: 4 },
      { text: "🟡 Un peu blanche parfois", score: 3 },
      { text: "🟠 Blanche quasi tout le temps", score: 2 },
      { text: "🔴 Épaisse, pâteuse, chargée tous les jours", score: 1 },
    ],
  },
  {
    question: "Tu es tombé malade combien de fois cette année (rhume, fièvre…) ?",
    options: [
      { text: "🟢 Jamais", score: 4 },
      { text: "🟡 1 ou 2 fois", score: 3 },
      { text: "🟠 Plus de 3 fois", score: 2 },
      { text: "🔴 Constamment, ou infections longues", score: 1 },
    ],
  },
  {
    question: "Quand tu es malade, tu guéris en :",
    options: [
      { text: "🟢 2–3 jours", score: 4 },
      { text: "🟡 5–6 jours", score: 3 },
      { text: "🟠 1 à 2 semaines", score: 2 },
      { text: "🔴 Ça traîne toujours, je rechute souvent", score: 1 },
    ],
  },
  {
    question: "Tu as des douleurs articulaires ou musculaires :",
    options: [
      { text: "🟢 Jamais", score: 4 },
      { text: "🟡 Rarement", score: 3 },
      { text: "🟠 Régulièrement", score: 2 },
      { text: "🔴 Tous les jours ou invalidantes", score: 1 },
    ],
  },
  {
    question: "Tu as des allergies, eczéma, urticaire ou réactions cutanées ?",
    options: [
      { text: "🟢 Non", score: 4 },
      { text: "🟡 Un peu, saisonnièrement", score: 3 },
      { text: "🟠 Régulièrement dans l’année", score: 2 },
      { text: "🔴 Quasi en permanence", score: 1 },
    ],
  },
  {
    question: "Tes blessures (coupures, bleus) cicatrisent :",
    options: [
      { text: "🟢 Rapidement", score: 4 },
      { text: "🟡 Un peu lentement", score: 3 },
      { text: "🟠 Lentement et mal", score: 2 },
      { text: "🔴 Très lentement, infections fréquentes", score: 1 },
    ],
  },
  {
    question: "Tes dents et gencives vont comment ?",
    options: [
      { text: "🟢 Solides, jamais de caries ou saignement", score: 4 },
      { text: "🟡 Quelques saignements ou caries récentes", score: 3 },
      { text: "🟠 Caries fréquentes, gencives sensibles", score: 2 },
      { text: "🔴 Douleurs dentaires ou dents qui se déchaussent", score: 1 },
    ],
  },
  {
    question: "Tes ongles sont :",
    options: [
      { text: "🟢 Durs, lisses", score: 4 },
      { text: "🟡 Cassants ou striés", score: 3 },
      { text: "🟠 Qui se dédoublent souvent", score: 2 },
      { text: "🔴 Très mous, avec tâches ou anomalies", score: 1 },
    ],
  },
  {
    question: "Ta peau est :",
    options: [
      { text: "🟢 Souple, hydratée", score: 4 },
      { text: "🟡 Sèche parfois", score: 3 },
      { text: "🟠 Très sèche, qui pèle", score: 2 },
      { text: "🔴 Acné, eczéma ou inflammation chronique", score: 1 },
    ],
  },
  {
    question: "Tu remarques une perte de cheveux, poils, cils ?",
    options: [
      { text: "🟢 Non", score: 4 },
      { text: "🟡 Légère, périodique", score: 3 },
      { text: "🟠 Oui, depuis plusieurs mois", score: 2 },
      { text: "🔴 Chute constante, zones dégarnies", score: 1 },
    ],
  },
  {
    question: "Tu as des fringales sucrées ou salées hors repas ?",
    options: [
      { text: "🟢 Jamais", score: 4 },
      { text: "🟡 De temps en temps", score: 3 },
      { text: "🟠 Tous les jours", score: 2 },
      { text: "🔴 Plusieurs fois par jour, besoin urgent", score: 1 },
    ],
  },
  {
    question: "Tu tiens combien de temps sans manger sans te sentir mal ?",
    options: [
      { text: "🟢 Plus de 5h sans souci", score: 4 },
      { text: "🟡 3–4h mais j’ai faim", score: 3 },
      { text: "🟠 Moins de 3h, vertiges ou irritabilité", score: 2 },
      { text: "🔴 Moins de 2h, sinon je tremble ou tombe", score: 1 },
    ],
  },
  {
    question: "Tu as des boutons, acné ou kystes sous-cutanés ?",
    options: [
      { text: "🟢 Jamais, peau toujours nette", score: 4 },
      { text: "🟡 Quelques-uns occasionnellement", score: 3 },
      { text: "🟠 Fréquemment, selon stress ou alimentation", score: 2 },
      { text: "🔴 Constamment, peau inflammée ou douloureuse", score: 1 },
    ],
  },
  {
    question:
      "Tu as des réactions digestives ou physiques après certains aliments (lait, gluten, fruits, légumes…) ?",
    options: [
      { text: "🟢 Jamais", score: 4 },
      { text: "🟡 Parfois, mais c’est léger", score: 3 },
      { text: "🟠 Oui, j’évite certains aliments pour ça", score: 2 },
      { text: "🔴 Oui, plusieurs groupes d’aliments me rendent mal", score: 1 },
    ],
  },
];

const femaleOnlyQuestion = {
  question: "Ton cycle menstruel est-il :",
  options: [
    { text: "🟢 Régulier, sans douleur ni symptômes", score: 4 },
    { text: "🟡 Régulier mais avec quelques douleurs ou irritabilité", score: 3 },
    { text: "🟠 Irrégulier, avec douleurs ou fatigue marquée", score: 2 },
    { text: "🔴 Très irrégulier, avec acné, gonflements, saignements abondants", score: 1 },
  ],
};

export default function App() {
  const [sex, setSex] = useState(""); // "H" | "F"
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => {
    if (sex === "F") return [...baseQuestions, femaleOnlyQuestion];
    return baseQuestions;
  }, [sex]);

  const maxScore = useMemo(() => (sex ? questions.length * 4 : 0), [questions.length, sex]);
  const minScore = useMemo(() => (sex ? questions.length * 1 : 0), [questions.length, sex]);

  function answer(option) {
    setScore((s) => s + option.score);
    if (step + 1 < questions.length) setStep((x) => x + 1);
    else setFinished(true);
  }

  function reset() {
    setSex("");
    setStep(0);
    setScore(0);
    setFinished(false);
  }

  function personality() {
    if (!sex) {
      return null;
    }

    const ratio = (score - minScore) / (maxScore - minScore || 1);

    if (ratio < 0.34) {
      return {
        badge: "🧠 TA PERSONNALITÉ ALIMENTAIRE",
        title: "🧱 LE SURVIVANT",
        text:
          "Ton corps encaisse, mais il envoie des signaux : fatigue, froid, langue chargée, digestion sensible, réactions.\n\n" +
          "👉 Priorité : enlever le bruit (ultra-transformés, sucre, alcool) et reconstruire une base simple, stable et ancestrale.",
        hint:
          "L’alimentation ancestrale est pour toi un RESET : simplicité, régularité, et retour au terrain.",
      };
    }

    if (ratio < 0.72) {
      return {
        badge: "🧠 TA PERSONNALITÉ ALIMENTAIRE",
        title: "🔄 LE BÂTISSEUR",
        text:
          "Tu es en transition : tu ressens les effets de ce que tu manges et tu peux progresser vite.\n\n" +
          "👉 Stabilise énergie/digestion, réduis les écarts, renforce la récupération et la densité nutritionnelle.",
        hint:
          "L’alimentation ancestrale peut te faire passer un cap : clarté, énergie, peau/cheveux plus stables.",
      };
    }

    return {
      badge: "🧠 TA PERSONNALITÉ ALIMENTAIRE",
      title: "🔥 L’OPTIMISTEUR",
      text:
        "Tu cherches à comprendre ton corps et à l’améliorer.\n" +
        "Tu ressens rapidement les effets de ce que tu manges\n" +
        "et tu sais que ton potentiel est plus élevé que ce que\n" +
        "tu exploites aujourd’hui.\n",
      hint:
        "👉 L’alimentation ancestrale est pour toi un levier de clarté, d’énergie et de performance.",
    };
  }

  const p = personality();

  return (
    <div style={styles.page}>
      {/* Vidéo de fond */}
      <video autoPlay loop muted playsInline style={styles.videoBg}>
        <source src="/forest.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div style={styles.overlay} />

      <div style={styles.card}>
        {!sex ? (
          <>
            <div style={styles.kicker}>🧠 QUESTIONNAIRE</div>
            <h2 style={styles.question}>Tu es :</h2>

            <div style={styles.options}>
              <button
                style={styles.button}
                onClick={() => {
                  setSex("H");
                  setStep(0);
                  setScore(0);
                  setFinished(false);
                }}
              >
                ♂️ Homme
              </button>

              <button
                style={styles.button}
                onClick={() => {
                  setSex("F");
                  setStep(0);
                  setScore(0);
                  setFinished(false);
                }}
              >
                ♀️ Femme
              </button>
            </div>

            <p style={styles.progressText}>
              (Le questionnaire adapte certaines questions selon le sexe.)
            </p>
          </>
        ) : !finished ? (
          <>
            <div style={styles.kicker}>📝 QUESTIONNAIRE</div>

            <h2 style={styles.question}>{questions[step].question}</h2>

            <div style={styles.options}>
              {questions[step].options.map((opt, i) => (
                <button key={i} style={styles.button} onClick={() => answer(opt)}>
                  {opt.text}
                </button>
              ))}
            </div>

            <div style={styles.progressWrap}>
              <div style={styles.progressLine}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${Math.round(((step + 1) / questions.length) * 100)}%`,
                  }}
                />
              </div>
              <p style={styles.progressText}>
                Question {step + 1} / {questions.length}
              </p>
            </div>
          </>
        ) : (
          <>
            <div style={styles.kicker}>{p.badge}</div>
            <h2 style={styles.resultTitle}>{p.title}</h2>

            <p style={styles.resultText}>
              {p.text.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>

            <p style={styles.hint}>{p.hint}</p>

            <p style={styles.score}>
              Score : <b>{score}</b> / {maxScore}
            </p>

            <button style={styles.secondaryBtn} onClick={reset}>
              Refaire le questionnaire
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    color: "white",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
  },

  videoBg: {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    zIndex: -2,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.70)",
    zIndex: -1,
  },

  card: {
    width: 560,
    maxWidth: "92vw",
    background: "rgba(2, 6, 23, 0.80)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 26,
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    backdropFilter: "blur(8px)",
  },

  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    opacity: 0.9,
    marginBottom: 10,
    textTransform: "uppercase",
  },

  question: {
    margin: "0 0 14px 0",
    fontSize: 22,
    lineHeight: 1.25,
  },

  options: {
    display: "grid",
    gap: 10,
    marginTop: 10,
  },

  button: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(37,99,235,0.95)",
    color: "white",
    cursor: "pointer",
    fontSize: 15,
    textAlign: "left",
  },

  progressWrap: {
    marginTop: 16,
  },

  progressLine: {
    height: 8,
    background: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "rgba(56,189,248,0.95)",
  },

  progressText: {
    marginTop: 10,
    opacity: 0.75,
    fontSize: 13,
  },

  resultTitle: {
    margin: "4px 0 12px 0",
    fontSize: 26,
  },

  resultText: {
    margin: 0,
    opacity: 0.92,
    lineHeight: 1.55,
    fontSize: 15.5,
    whiteSpace: "pre-wrap",
  },

  hint: {
    marginTop: 14,
    opacity: 0.95,
    fontSize: 15,
  },

  score: {
    marginTop: 14,
    opacity: 0.8,
    fontSize: 13,
  },

  secondaryBtn: {
    marginTop: 14,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(51,65,85,0.95)",
    color: "white",
    cursor: "pointer",
    fontSize: 15,
    width: "100%",
  },
};
