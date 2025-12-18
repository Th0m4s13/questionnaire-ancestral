import { useMemo, useState } from "react";

const BG_IMAGE = "/BG_IMAGE.jpg"; // dans /public

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState(""); // "homme" | "femme"
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // ✅ TOUTES TES QUESTIONS (base)
  const baseQuestions = useMemo(
    () => [
      {
        question: "Le matin au réveil, tu te sens comment ?",
        options: [
          { text: "🟢 En pleine forme, prêt(e) à attaquer la journée", score: 4 },
          { text: "🟡 Il me faut un moment pour me réveiller vraiment", score: 3 },
          { text: "🟠 Je suis déjà fatigué(e) au lever", score: 2 },
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
        question: "Tu es tombé(e) malade combien de fois cette année (rhume, fièvre…) ?",
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
          { text: "🟠 Moins de 3h : vertiges/irritabilité", score: 2 },
          { text: "🔴 Moins de 2h : tremblements / je “tombe”", score: 1 },
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
          "Tu as des réactions digestives ou physiques après certains aliments (laitiers, gluten, fruits, légumes…) ?",
        options: [
          { text: "🟢 Jamais", score: 4 },
          { text: "🟡 Parfois, mais c’est léger", score: 3 },
          { text: "🟠 Oui, j’évite certains aliments pour ça", score: 2 },
          { text: "🔴 Oui, plusieurs groupes d’aliments me rendent mal", score: 1 },
        ],
      },
    ],
    []
  );

  // ✅ Question Femme seulement
  const femaleOnly = useMemo(
    () => [
      {
        question: "Ton cycle menstruel est-il :",
        options: [
          { text: "🟢 Régulier, sans douleur ni symptômes", score: 4 },
          { text: "🟡 Régulier mais avec quelques douleurs/irritabilité", score: 3 },
          { text: "🟠 Irrégulier, douleurs ou fatigue marquée", score: 2 },
          {
            text: "🔴 Très irrégulier, avec acné, gonflements, saignements abondants",
            score: 1,
          },
        ],
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
    email.trim().includes("@") &&
    (sex === "homme" || sex === "femme");

  function answer(option) {
    setScore((s) => s + option.score);
    if (step + 1 < questions.length) setStep((x) => x + 1);
    else setFinished(true);
  }

  // 🎨 Thèmes pastels style 16personalities
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

  // ✅ Personnalité “WOW”
  function personality() {
    if (!questions.length) return null;

    const pct = score / maxScore;
    const prenom = name.trim() || "toi";
    const isFemme = sex === "femme";
    const g = (masc, fem) => (isFemme ? fem : masc); // helper pour accords

    const common = {
      intro: `Ok ${prenom} — voilà ce que ton terrain raconte.`,
      footer:
        "⚡ Objectif : énergie stable + digestion calme + peau/cheveux qui suivent.",
    };

    if (pct <= 0.45) {
      return {
        themeKey: "brume",
        label: g("🧱 LE SÉDIMENTÉ", "🧱 LA SÉDIMENTÉE"),
        title: g("Le Survivant Moderne", "La Survivante Moderne"),
        subtitle: g(
          "Terrain chargé / récupération difficile",
          "Terrain chargée / récupération difficile"
        ),
        story:
          `${common.intro} Tu avances, mais tu sens que le corps “tire le frein”. ` +
          `Fatigue au réveil, digestion lente, réactions… ` +
          `C’est typiquement un terrain saturé (foie / intestins / glycémie instable).`,
        highlights: [
          "Énergie instable (coups de mou, besoin de café/sucre)",
          "Ballonnements / transit capricieux / lourdeurs",
          "Peau/cheveux plus sensibles, tolérance alimentaire fragile",
        ],
        plan: [
          "Assiette simple : vrais aliments, peu d’irritants",
          "Stabiliser sucre/café (éviter les montagnes russes)",
          "Rythme + digestion : sommeil, repas posés, régularité",
        ],
        mantra: "👉 “Je reviens aux bases. Je simplifie. Je reconstruis.”",
        trap:
          "Piège : vouloir tout optimiser d’un coup. Ici, c’est RESET + constance.",
        tip:
          "🔥 L’alimentation ancestrale est ton bouton “calme interne” : moins d’inflammation, plus de nutriments, plus de stabilité.",
        ...common,
      };
    }

    if (pct <= 0.70) {
      return {
        themeKey: "aube",
        label: g("🔄 LE TRANSITIONNEL", "🔄 LA TRANSITIONNELLE"),
        title: g("L’Optimiseur", "L’Optimisatrice"),
        subtitle: g(
          "Le corps s’adapte, mais manque de constance",
          "Le corps s’adapte, mais manque de constance"
        ),
        story:
          `${common.intro} Tu as du potentiel : des jours où tu te sens vraiment bien… et d’autres où ça retombe. ` +
          `Ton terrain peut monter vite si tu verrouilles 2–3 leviers clés.`,
        highlights: [
          "Bon potentiel mais irrégulier (stress, sommeil, écarts)",
          "Réactions selon les aliments (sensibilité modulable)",
          "Digestion “OK” mais parfois fragile",
        ],
        plan: [
          "Identifier tes déclencheurs (laitiers/gluten/sucre…)",
          "Construire un socle ancestral simple et répétable",
          "Sommeil + récupération : ton multiplicateur n°1",
        ],
        mantra: "👉 “Je rends mon énergie prévisible.”",
        trap:
          "Piège : être strict 3 jours puis craquer 4 jours. Mieux vaut stable que parfait.",
        tip:
          "🔥 L’alimentation ancestrale te fait passer un cap : énergie plus stable, moins de réactions, meilleure peau/cheveux.",
        ...common,
      };
    }

    return {
      themeKey: "solaire",
      label: g("⚡ L’ANCIEN", "⚡ L’ANCIENNE"),
      title: g("Le Stratège Ancestral", "La Stratège Ancestrale"),
      subtitle: g(
        "Terrain stable / bonne tolérance",
        "Terrain stable / bonne tolérance"
      ),
      story:
        `${common.intro} Tu as déjà une base solide : meilleure résilience, digestion plus stable, énergie plus régulière. ` +
        `Tu n’es pas dans la réparation — tu es dans l’optimisation.`,
      highlights: [
        "Énergie plus stable + bonne résistance",
        "Digestion plus solide / moins de réactions",
        "Meilleure récupération globale",
      ],
      plan: [
        "Qualité des aliments (origine, cuisson, variété)",
        "Timing intelligent (repas / jeûne léger si ça te réussit)",
        "Garder ton socle même en vie sociale",
      ],
      mantra: "👉 “Je joue la constance et la précision.”",
      trap:
        "Piège : se disperser en “hacks”. Tu gagnes plus avec simplicité + régularité.",
      tip:
        "🔥 L’alimentation ancestrale est ton levier performance : clarté mentale, stabilité, peau/cheveux, énergie.",
      ...common,
    };
  }

  const prof = personality();
  const theme = prof ? THEME_PRESETS[prof.themeKey] : THEME_PRESETS.aube;

  function resetAll() {
    setStep(0);
    setScore(0);
    setFinished(false);
  }

  function restartFromStart() {
    setName("");
    setEmail("");
    setSex("");
    setStep(0);
    setScore(0);
    setFinished(false);
  }

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={{ ...styles.bgPhoto, backgroundImage: `url(${BG_IMAGE})` }} />
      <div
        style={{
          ...styles.bgGlow,
          background: `radial-gradient(900px 600px at 20% 20%, ${theme.halo1} 0%, transparent 60%),
                       radial-gradient(900px 600px at 80% 30%, ${theme.halo2} 0%, transparent 60%),
                       linear-gradient(180deg, rgba(2,6,23,0.55), rgba(2,6,23,0.78))`,
        }}
      />
      <div style={styles.overlay} />

      <div style={styles.card}>
        {/* Écran start */}
        {!canStart ? (
          <>
            <div style={styles.kicker}>🧠 TON PROFIL ALIMENTAIRE</div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ton email"
                type="email"
                autoComplete="email"
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
                Tu dois remplir <b>prénom + email</b> et choisir <b>Homme/Femme</b>.
              </p>
            </div>
          </>
        ) : !finished ? (
          <>
            {/* Questionnaire */}
            <div style={styles.kicker}>🧠 TA PERSONNALITÉ ALIMENTAIRE</div>

            <div style={styles.headerRow}>
              <div style={styles.miniPill}>
                {name.trim()} • {sex}
              </div>
              <button
                type="button"
                onClick={restartFromStart}
                style={styles.linkBtn}
                title="Modifier prénom/email/sex"
              >
                Modifier
              </button>
            </div>

            <h2 style={{ margin: "10px 0 0" }}>{questions[step]?.question}</h2>

            <div style={styles.options}>
              {questions[step]?.options?.map((opt, i) => (
                <button key={i} style={styles.button} onClick={() => answer(opt)}>
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
            {/* Résultat */}
            <div style={styles.kicker}>🧠 TA PERSONNALITÉ ALIMENTAIRE</div>

            {/* Avatar compact au-dessus du titre */}
            <div style={styles.resultHeader}>
              <div style={styles.inlineAvatar}>
                <Avatar sex={sex} variant={prof?.themeKey} />
              </div>

              <div style={{ textAlign: "left" }}>
                <div style={styles.smallIntro}>{prof?.intro}</div>
                <h2 style={{ margin: "6px 0 0" }}>{prof?.label}</h2>
                <p style={styles.subtitle}>
                  <b>{prof?.title}</b> — {prof?.subtitle}
                </p>
              </div>
            </div>

            <p style={styles.resultText}>{prof?.story}</p>

            <div style={{ ...styles.block, borderColor: theme.blockBorder }}>
              <div style={styles.blockTitle}>✅ Signes typiques</div>
              <ul style={styles.ul}>
                {prof?.highlights?.map((x, idx) => (
                  <li key={idx} style={styles.li}>
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ ...styles.block, borderColor: theme.blockBorder }}>
              <div style={styles.blockTitle}>🎯 3 priorités</div>
              <ul style={styles.ul}>
                {prof?.plan?.map((x, idx) => (
                  <li key={idx} style={styles.li}>
                    {x}
                  </li>
                ))}
              </ul>
              <div style={styles.mantra}>{prof?.mantra}</div>
              <div style={styles.trap}>⚠️ {prof?.trap}</div>
            </div>

            <p style={styles.tip}>{prof?.tip}</p>
            <p style={styles.footer}>{prof?.footer}</p>

            <p style={{ opacity: 0.82, marginTop: 10 }}>
              Score : <b>{score}</b> / {maxScore}
            </p>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <button style={{ ...styles.button, background: "#334155" }} onClick={resetAll}>
                Refaire le questionnaire
              </button>
              <button style={{ ...styles.button, background: "#0f172a" }} onClick={restartFromStart}>
                Changer prénom / email / sexe
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Avatar illustré plein pied via image PNG (avec pieds visibles) */
function Avatar({ sex, variant = "solaire" }) {
  const base = sex === "femme" ? "femme" : "homme";

  // map les variantes de terrain vers tes fichiers
  let suffix = "ancien";
  if (variant === "aube") suffix = "transitionnel";
  if (variant === "brume") suffix = "sedimente";

  const src = `/avatars/${base}-${suffix}.png`;

  return (
    <img
      src={src}
      alt="Avatar"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        objectPosition: "bottom center", // ancré en bas pour bien voir les pieds
        display: "block",
      }}
    />
  );
}

const styles = {
  page: {
    minHeight: "100dvh",
    width: "100vw",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    overflow: "hidden",
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
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
    width: "min(460px, 92vw)",
    maxHeight: "calc(100dvh - 32px)",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    background: "rgba(2, 6, 23, 0.78)",
    padding: 22,
    borderRadius: 18,
    textAlign: "center",
    boxShadow: "0 22px 60px rgba(0,0,0,0.65)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    color: "white",
  },

  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    opacity: 0.9,
    textTransform: "uppercase",
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

  button: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: 15,
    lineHeight: 1.2,
  },

  progress: {
    marginTop: 16,
    opacity: 0.75,
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(15,23,42,0.55)",
    color: "white",
    outline: "none",
    fontSize: 14,
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
    background: "rgba(37,99,235,0.85)",
    border: "1px solid rgba(255,255,255,0.18)",
  },

  note: {
    margin: 0,
    opacity: 0.75,
    fontSize: 12,
    lineHeight: 1.35,
  },

  profileChip: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    textAlign: "left",
  },

  // Résultat
  resultHeader: {
    marginTop: 16,
    textAlign: "left",
    display: "grid",
    gridTemplateColumns: "90px 1fr",
    gap: 14,
    alignItems: "center",
  },

  // Petit avatar dans la carte, au-dessus du titre
  inlineAvatar: {
    width: 140,
    aspectRatio: "469 / 532",
  },

  smallIntro: {
    fontSize: 12,
    opacity: 0.85,
    lineHeight: 1.35,
  },

  resultText: {
    marginTop: 14,
    lineHeight: 1.5,
    opacity: 0.96,
    textAlign: "left",
  },

  block: {
    marginTop: 14,
    padding: 14,
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
};