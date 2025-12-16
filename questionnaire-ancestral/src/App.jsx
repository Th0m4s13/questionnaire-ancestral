import { useMemo, useState } from "react";

/**
 * ✅ QUESTIONS (communes)
 * Scores : 🟢=4 (top) 🟡=3 🟠=2 🔴=1 (terrain plus fragile)
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
      { text: "🟢 5-6h me suffisent", score: 4 },
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
    options colour?:
    options: [
      { text: "🟢 Plus de 5h sans souci", score: 4 },
      { text: "🟡 3–4h mais j’ai faim", score: 3 },
      { text: "🟠 Moins de 3h, j’ai vertiges ou irritabilité", score: 2 },
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
      "Tu as des réactions digestives ou physiques après certains aliments (produits laitiers, gluten, fruits, légumes…) ?",
    options: [
      { text: "🟢 Jamais", score: 4 },
      { text: "🟡 Parfois, mais c’est léger", score: 3 },
      { text: "🟠 Oui, j’évite certains aliments pour ça", score: 2 },
      { text: "🔴 Oui, plusieurs groupes d’aliments me rendent mal", score: 1 },
    ],
  },
];

/** ✅ Question spécifique FEMME */
const femaleOnlyQuestions = [
  {
    question: "Ton cycle menstruel est-il :",
    options: [
      { text: "🟢 Régulier, sans douleur ni symptômes", score: 4 },
      { text: "🟡 Régulier mais avec quelques douleurs ou irritabilité", score: 3 },
      { text: "🟠 Irrégulier, avec douleurs ou fatigue marquée", score: 2 },
      { text: "🔴 Très irrégulier, avec acné, gonflements, saignements abondants", score: 1 },
    ],
  },
];

/** ✅ Résultat PERSONNALITÉ (style 16Personalities) basé sur % */
function personalityResult(score, totalQuestions) {
  const min = totalQuestions * 1;
  const max = totalQuestions * 4;
  const pct = Math.round(((score - min) / (max - min)) * 100); // 0 -> 100

  if (pct <= 25) {
    return {
      badge: "🧠 TA PERSONNALITÉ ALIMENTAIRE",
      title: "🧱 LE SURVIVANT MODERNE",
      subtitle: "Terrain surchargé",
      description:
        "Tu avances au mental et ton corps compense comme il peut. Les signaux (fatigue, digestion, peau, langue, froid, immunité) sont souvent présents.",
      ancestral:
        "👉 L’alimentation ancestrale est pour toi une reconstruction. Tu as besoin de revenir au simple pour relancer ton terrain.",
      pct,
    };
  }

  if (pct <= 55) {
    return {
      badge: "🧠 TA PERSONNALITÉ ALIMENTAIRE",
      title: "⚖️ L’ÉQUILIBRISTE",
      subtitle: "Terrain instable",
      description:
        "Tu sens clairement l’impact de ce que tu manges. Tu alternes entre phases OK et phases plus fragiles (coup de mou, inconfort, réactions).",
      ancestral:
        "👉 L’alimentation ancestrale est pour toi un outil d’équilibre. Bien cadrée, elle stabilise ton énergie et ton système digestif.",
      pct,
    };
  }

  if (pct <= 80) {
    return {
      badge: "🧠 TA PERSONNALITÉ ALIMENTAIRE",
      title: "🔥 L’OPTIMISEUR",
      subtitle: "Terrain fonctionnel",
      description:
        "Tu comprends ton corps et tu repères vite ce qui te fait du bien ou te perturbe. Ton potentiel est élevé et tu peux encore améliorer la constance.",
      ancestral:
        "👉 L’alimentation ancestrale est pour toi un levier de clarté, d’énergie et de performance au quotidien.",
      pct,
    };
  }

  return {
    badge: "🧠 TA PERSONNALITÉ ALIMENTAIRE",
    title: "⚡ L’ANCESTRAL",
    subtitle: "Terrain solide",
    description:
      "Tu es stable, résilient et tu récupères bien. Tu as peu d’inflammation chronique et ton énergie est plus constante que la moyenne.",
    ancestral:
      "👉 L’alimentation ancestrale est ton mode naturel : simple, cohérent, et aligné avec ta physiologie.",
    pct,
  };
}

export default function App() {
  const [email, setEmail] = useState("");
  const [emailOk, setEmailOk] = useState(false);

  const [gender, setGender] = useState(""); // "homme" | "femme"
  const [started, setStarted] = useState(false);

  const questions = useMemo(() => {
    if (gender === "femme") return [...baseQuestions, ...femaleOnlyQuestions];
    return baseQuestions;
  }, [gender]);

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function resetAll() {
    setStep(0);
    setScore(0);
    setFinished(false);
    setStarted(false);
    setGender("");
    setEmail("");
    setEmailOk(false);
  }

  function answer(option) {
    setScore((s) => s + option.score);
    if (step + 1 < questions.length) setStep((x) => x + 1);
    else setFinished(true);
  }

  const p = finished ? personalityResult(score, questions.length) : null;

  return (
    <div style={styles.page}>
      {/* 🎥 Vidéo de fond */}
      <video autoPlay loop muted playsInline style={styles.videoBg}>
        <source src="/forest.mp4" type="video/mp4" />
      </video>

      {/* 🌫️ Overlay sombre */}
      <div style={styles.overlay} />

      {/* 📦 Carte */}
      <div style={styles.card}>
        {/* 1) Email obligatoire */}
        {!emailOk ? (
          <>
            <div style={styles.kicker}>📩 Avant de commencer</div>
            <h2 style={{ margin: "6px 0 10px" }}>Entre ton email</h2>
            <p style={styles.small}>
              (On l’utilise pour te renvoyer ton résultat et tes recommandations.)
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
                if (ok) setEmailOk(true);
              }}
              style={{ marginTop: 14, display: "grid", gap: 10 }}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tonemail@gmail.com"
                style={styles.input}
              />
              <button style={styles.button} type="submit">
                Continuer
              </button>
            </form>

            <button style={styles.linkBtn} onClick={resetAll}>
              Réinitialiser
            </button>
          </>
        ) : (
          <>
            {/* 2) Choix sexe */}
            {!gender ? (
              <>
                <div style={styles.kicker}>🧬 Personnalisation</div>
                <h2 style={{ margin: "6px 0 10px" }}>Tu es :</h2>
                <div style={styles.options}>
                  <button
                    style={styles.button}
                    onClick={() => setGender("homme")}
                  >
                    Homme
                  </button>
                  <button
                    style={styles.button}
                    onClick={() => setGender("femme")}
                  >
                    Femme
                  </button>
                </div>

                <p style={styles.small}>
                  (Le questionnaire s’adapte : question “cycle” uniquement si femme.)
                </p>

                <button style={styles.linkBtn} onClick={resetAll}>
                  Changer d’email
                </button>
              </>
            ) : (
              <>
                {/* 3) Démarrer */}
                {!started ? (
                  <>
                    <div style={styles.kicker}>✅ Prêt</div>
                    <h2 style={{ margin: "6px 0 10px" }}>
                      Questionnaire ({gender})
                    </h2>
                    <p style={styles.small}>
                      Tu vas répondre à {questions.length} questions. Réponds
                      instinctivement.
                    </p>

                    <button
                      style={{ ...styles.button, marginTop: 12 }}
                      onClick={() => setStarted(true)}
                    >
                      Commencer
                    </button>

                    <button style={styles.linkBtn} onClick={resetAll}>
                      Revenir en arrière
                    </button>
                  </>
                ) : (
                  <>
                    {/* 4) QCM / Résultat */}
                    {!finished ? (
                      <>
                        <h2 style={{ margin: 0 }}>{questions[step].question}</h2>

                        <div style={styles.options}>
                          {questions[step].options.map((opt, i) => (
                            <button
                              key={i}
                              style={styles.button}
                              onClick={() => answer(opt)}
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>

                        <p style={styles.progress}>
                          Question {step + 1} / {questions.length}
                        </p>
                      </>
                    ) : (
                      <>
                        <div style={styles.kicker}>{p.badge}</div>

                        <div style={{ marginTop: 10 }}>
                          <div style={styles.personalityTitle}>{p.title}</div>
                          <div style={styles.personalitySub}>{p.subtitle}</div>
                        </div>

                        <div style={styles.personalityBody}>
                          <p style={{ margin: 0 }}>{p.description}</p>
                          <p style={{ margin: "14px 0 0", opacity: 0.95 }}>
                            {p.ancestral}
                          </p>
                        </div>

                        <p style={styles.small}>
                          Score : {score} • Profil : {p.pct}%
                        </p>

                        <button
                          style={{ ...styles.button, background: "#334155" }}
                          onClick={() => {
                            setStep(0);
                            setScore(0);
                            setFinished(false);
                            setStarted(false);
                          }}
                        >
                          Refaire le questionnaire
                        </button>

                        <button style={styles.linkBtn} onClick={resetAll}>
                          Tout recommencer (email + sexe)
                        </button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
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
    color: "white",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
    padding: 20,
  },

  videoBg: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    zIndex: -2,
    filter: "saturate(1.1) contrast(1.05)",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(800px 500px at 50% 40%, rgba(15,23,42,0.35), rgba(2,6,23,0.78))",
    zIndex: -1,
  },

  card: {
    background: "rgba(2, 6, 23, 0.85)",
    padding: 26,
    borderRadius: 18,
    width: 420,
    maxWidth: "92vw",
    textAlign: "left",
    boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(7px)",
  },

  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    opacity: 0.85,
  },

  small: {
    marginTop: 10,
    opacity: 0.8,
    fontSize: 13,
    lineHeight: 1.35,
  },

  options: {
    display: "grid",
    gap: 10,
    marginTop: 16,
  },

  button: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: 15,
    textAlign: "left",
    lineHeight: 1.2,
  },

  linkBtn: {
    marginTop: 14,
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.70)",
    cursor: "pointer",
    padding: 0,
    textDecoration: "underline",
    fontSize: 12,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    outline: "none",
    background: "rgba(15,23,42,0.65)",
    color: "white",
    fontSize: 14,
  },

  progress: {
    marginTop: 14,
    opacity: 0.75,
    fontSize: 13,
  },

  personalityTitle: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: 0.2,
  },

  personalitySub: {
    marginTop: 4,
    opacity: 0.75,
    fontSize: 13,
  },

  personalityBody: {
    marginTop: 14,
    background: "rgba(15,23,42,0.45)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
    lineHeight: 1.5,
    fontSize: 14,
  },
};
