import { useState } from "react";
const questions = [
  {
    question: "Ton alimentation est majoritairement composée de :",
    options: [
      { text: "Produits transformés / industriels", score: 1 },
      { text: "Un mélange moderne et maison", score: 2 },
      { text: "Aliments bruts, simples, ancestraux", score: 3 },
    ],
  },
  {
    question: "As-tu une langue blanche ou pâteuse au réveil ?",
    options: [
      { text: "Souvent", score: 1 },
      { text: "Par moments", score: 2 },
      { text: "Rarement / jamais", score: 3 },
    ],
  },
  {
    question: "Après les repas, tu ressens plutôt :",
    options: [
      { text: "Lourdeur, fatigue, ballonnements", score: 1 },
      { text: "Ça dépend des aliments", score: 2 },
      { text: "Clarté et énergie stable", score: 3 },
    ],
  },
  {
    question: "Ta digestion est :",
    options: [
      { text: "Irrégulière et imprévisible", score: 1 },
      { text: "Correcte avec des écarts", score: 2 },
      { text: "Fluide et régulière", score: 3 },
    ],
  },
  {
    question: "Concernant tes cheveux et ta peau :",
    options: [
      { text: "Chute, cheveux fins, peau terne", score: 1 },
      { text: "Quelques signes faibles", score: 2 },
      { text: "Cheveux denses, peau nette", score: 3 },
    ],
  },
  {
    question: "Ton niveau de fatigue au quotidien est :",
    options: [
      { text: "Quasi constant", score: 1 },
      { text: "Présent à certains moments", score: 2 },
      { text: "Faible ou inexistant", score: 3 },
    ],
  },
  {
    question: "Ta consommation de sucre, alcool ou café est :",
    options: [
      { text: "Fréquente", score: 1 },
      { text: "Occasionnelle", score: 2 },
      { text: "Rare ou maîtrisée", score: 3 },
    ],
  },
  {
    question: "Certains aliments te provoquent des réactions ?",
    options: [
      { text: "Oui, clairement", score: 1 },
      { text: "Légèrement", score: 2 },
      { text: "Non", score: 3 },
    ],
  },

    {
      question: "Ton mode de vie est plutôt :",
      options: [
        { text: "Stressé et sédentaire", score: 1 },
        { text: "Actif mais irrégulier", score: 2 },
        { text: "Mouvement + récupération", score: 3 },
      ],
    },
    {
      question: "Ton ressenti global est :",
      options: [
        { text: "Quelque chose est bloqué", score: 1 },
        { text: "Terrain fragile mais améliorable", score: 2 },
        { text: "Corps clair et stable", score: 3 },
      ],
    },
    ];
    
        export default function App() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function answer(option) {
    setScore((s) => s + option.score);
    if (step + 1 < questions.length) setStep((x) => x + 1);
    else setFinished(true);
  }

  function resultText() {
    if (score <= 12) {
      return "Terrain engorgé 🧱 — digestion lente, surcharge interne probable (foie / intestins). Un retour aux bases est nécessaire.";
    }
  
    if (score <= 20) {
      return "Terrain en transition 🔄 — le corps s’adapte, mais reste fragile. L’alimentation ancestrale peut faire la différence.";
    }
  
    return "Terrain clair & ancestral ⚡ — digestion solide, énergie stable, terrain favorable.";
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
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
            <h2 style={{ margin: 0 }}>Résultat</h2>
            <p style={styles.result}>{resultText()}</p>
            <p style={{ opacity: 0.8 }}>Score total : {score}</p>

            <button
              style={{ ...styles.button, background: "#334155" }}
              onClick={() => {
                setStep(0);
                setScore(0);
                setFinished(false);
              }}
            >
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
margin: 0,
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
    padding: 20,
    overflowX: "hidden",

  },
  card: {
    background: "#020617",
    padding: 28,
    borderRadius: 16,
    width: 380,
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  options: {
    display: "grid",
    gap: 12,
    marginTop: 18,
  },
  button: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: 16,
  },
  progress: {
    marginTop: 18,
    opacity: 0.7,
  },
  result: {
    fontSize: 20,
    marginTop: 18,
  },
};
