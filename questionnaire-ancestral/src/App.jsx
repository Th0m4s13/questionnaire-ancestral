import { useMemo, useState } from "react";

const BG_IMAGE = "/BG_IMAGE.jpg"; // dans /public

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState(""); // "homme" | "femme"
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Questions (base)
  const baseQuestions = useMemo(
    () => [
      {
        question: "Le matin au réveil, tu te sens comment ?",
        options: [
          { text: " En pleine forme, prêt(e) à attaquer la journée", score: 4 },
          { text: " Il me faut un moment pour me réveiller vraiment", score: 3 },
          { text: " Je suis déjà fatigué(e) au lever", score: 2 },
          { text: " Je me lève vidé(e), comme si je n’avais pas dormi", score: 1 },
        ],
      },
      {
        question: "Tes mains et pieds sont :",
        options: [
          { text: " Toujours bien chauds", score: 4 },
          { text: " Froids parfois, selon la saison", score: 3 },
          { text: " Souvent froids même à l’intérieur", score: 2 },
          { text: " Gelés en permanence, même sous la couette", score: 1 },
        ],
      },
      {
        question: "Ton niveau d’énergie en journée est :",
        options: [
          { text: " Stable du matin au soir", score: 4 },
          { text: " Variable mais gérable", score: 3 },
          { text: " En dents de scie, avec des coups de mou", score: 2 },
          { text: " Épuisement constant, même sans effort", score: 1 },
        ],
      },
      {
        question: "Tu as souvent besoin de café ou thé pour fonctionner ?",
        options: [
          { text: " Jamais", score: 4 },
          { text: " De temps en temps", score: 3 },
          { text: " Tous les jours", score: 2 },
          { text: " Plusieurs fois par jour sinon je “tombe”", score: 1 },
        ],
      },
      {
        question: "Tu dors :",
        options: [
          { text: " Profondément et sans réveils", score: 4 },
          { text: " Légèrement, je me réveille parfois", score: 3 },
          { text: " Je me réveille plusieurs fois", score: 2 },
          { text: " Je dors très mal ou j’ai de l’insomnie", score: 1 },
        ],
      },
      {
        question: "Tu as besoin de combien de sommeil pour récupérer ?",
        options: [
          { text: " 5–6h me suffisent", score: 4 },
          { text: " Il me faut 8h minimum", score: 3 },
          { text: " Même 9h ne suffisent pas", score: 2 },
          { text: " Je suis toujours épuisé(e), même avec 10h", score: 1 },
        ],
      },
      {
        question: "Tu ressens des ballonnements ou gaz :",
        options: [
          { text: " Jamais", score: 4 },
          { text: " Parfois, après certains plats", score: 3 },
          { text: " Quasiment tous les jours", score: 2 },
          { text: " Constamment, avec douleurs", score: 1 },
        ],
      },
      {
        question: "Ta langue le matin est :",
        options: [
          { text: " Rose et propre", score: 4 },
          { text: " Un peu blanche parfois", score: 3 },
          { text: " Blanche quasi tout le temps", score: 2 },
          { text: " Épaisse, pâteuse, chargée tous les jours", score: 1 },
        ],
      },
      {
        question: "Tu es tombé(e) malade combien de fois cette année (rhume, fièvre…) ?",
        options: [
          { text: " Jamais", score: 4 },
          { text: " 1 ou 2 fois", score: 3 },
          { text: " Plus de 3 fois", score: 2 },
          { text: " Constamment, ou infections longues", score: 1 },
        ],
      },
      {
        question: "Quand tu es malade, tu guéris en :",
        options: [
          { text: " 2–3 jours", score: 4 },
          { text: " 5–6 jours", score: 3 },
          { text: " 1 à 2 semaines", score: 2 },
          { text: " Ça traîne toujours, je rechute souvent", score: 1 },
        ],
      },
      {
        question: "Tu as des douleurs articulaires ou musculaires :",
        options: [
          { text: " Jamais", score: 4 },
          { text: " Rarement", score: 3 },
          { text: " Régulièrement", score: 2 },
          { text: " Tous les jours ou invalidantes", score: 1 },
        ],
      },
      {
        question: "Tu as des allergies, eczéma, urticaire ou réactions cutanées ?",
        options: [
          { text: " Non", score: 4 },
          { text: " Un peu, saisonnièrement", score: 3 },
          { text: " Régulièrement dans l’année", score: 2 },
          { text: " Quasi en permanence", score: 1 },
        ],
      },
      {
        question: "Tes blessures (coupures, bleus) cicatrisent :",
        options: [
          { text: " Rapidement", score: 4 },
          { text: " Un peu lentement", score: 3 },
          { text: " Lentement et mal", score: 2 },
          { text: " Très lentement, infections fréquentes", score: 1 },
        ],
      },
      {
        question: "Tes dents et gencives vont comment ?",
        options: [
          { text: " Solides, jamais de caries ou saignement", score: 4 },
          { text: " Quelques saignements ou caries récentes", score: 3 },
          { text: " Caries fréquentes, gencives sensibles", score: 2 },
          { text: " Douleurs dentaires ou dents qui se déchaussent", score: 1 },
        ],
      },
      {
        question: "Tes ongles sont :",
        options: [
          { text: " Durs, lisses", score: 4 },
          { text: " Cassants ou striés", score: 3 },
          { text: " Qui se dédoublent souvent", score: 2 },
          { text: " Très mous, avec tâches ou anomalies", score: 1 },
        ],
      },
      {
        question: "Ta peau est :",
        options: [
          { text: " Souple, hydratée", score: 4 },
          { text: " Sèche parfois", score: 3 },
          { text: " Très sèche, qui pèle", score: 2 },
          { text: " Acné, eczéma ou inflammation chronique", score: 1 },
        ],
      },
      {
        question: "Tu remarques une perte de cheveux ?",
        options: [
          { text: " Non", score: 4 },
          { text: " Légère, périodique", score: 3 },
          { text: " Oui, depuis plusieurs mois", score: 2 },
          { text: " Chute constante, zones dégarnies", score: 1 },
        ],
      },
      {
        question: "Es-tu attiré(e) par le sucre ?",
        options: [
          { text: " Jamais", score: 4 },
          { text: " De temps en temps", score: 3 },
          { text: " Tous les jours", score: 2 },
          { text: " Plusieurs fois par jour, besoin urgent", score: 1 },
        ],
      },
      {
        question: "Tu as des boutons, acné ou kystes sous-cutanés ?",
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
        options: [
          { text: " Jamais", score: 4 },
          { text: " Parfois, mais c’est léger", score: 3 },
          { text: " Oui, j’évite certains aliments pour ça", score: 2 },
          { text: " Oui, plusieurs groupes d’aliments me rendent mal", score: 1 },
        ],
      },
    ],
    []
  );

  // Question Femme seulement
  const femaleOnly = useMemo(
    () => [
      {
        question: "Ton cycle menstruel est-il :",
        options: [
          { text: " Régulier, sans douleur ni symptômes", score: 4 },
          { text: " Régulier mais avec quelques douleurs/irritabilité", score: 3 },
          { text: " Irrégulier, douleurs ou fatigue marquée", score: 2 },
          {
            text: " Très irrégulier, avec acné, gonflements, saignements abondants",
            score: 1,
          },
          { text: " Pas de règles du tout", score: 1 },
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

  function personality() {
    if (!questions.length) return null;

    const pct = score / maxScore;
    const prenom = name.trim() || "toi";
    const isFemme = sex === "femme";
    const g = (masc, fem) => (isFemme ? fem : masc);

    const common = {
      intro: `Ok ${prenom} — voilà ce que ton terrain raconte.`,
      footer:
        "Objectif : énergie stable, digestion calme, peau/cheveux qui suivent.",
    };

    if (pct <= 0.4) {
      return {
        themeKey: "brume",
        label: g("LE SÉDIMENTÉ", "LA SÉDIMENTÉE"),
        title: g("Le Sédimenté", "La Sédimentée"),
        subtitle: "Terrain saturé / récupération difficile",
        story: isFemme
          ? `La situation est préoccupante. À court terme, des problèmes de santé peuvent déjà apparaître ou s'installer progressivement. Ton corps envoie souvent des signaux clairs, mais lorsqu'ils sont ignorés, les déséquilibres s'aggravent.\n\n` +
            `À moyen terme, sans changement réel, l'aggravation est quasi inévitable. Les troubles s'installent, les fonctions essentielles de ton organisme se dégradent et les symptômes deviennent plus fréquents et plus difficiles à corriger.\n\n` +
            `Sur le long terme, cela peut mener à des années de souffrance évitables : fatigue chronique, douleurs persistantes, troubles métaboliques et forte baisse de ta qualité de vie. Plus tu attends, plus le retour à l'équilibre devient complexe.\n\n` +
            `Agir maintenant est indispensable. La solution la plus efficace est de prendre directement un appel avec notre équipe afin d'analyser ta situation et mettre en place un plan clair pour stopper cette trajectoire avant qu'elle ne devienne irréversible :\nhttps://app.iclosed.io/e/maobrut/cheveux`
          : `La situation est préoccupante. À court terme, des problèmes de santé peuvent déjà apparaître ou s'installer progressivement. Le corps envoie souvent des signaux clairs, mais lorsqu'ils sont ignorés, les déséquilibres s'aggravent.\n\n` +
            `À moyen terme, sans changement réel, l'aggravation est quasi inévitable. Les troubles s'installent, les fonctions essentielles de l'organisme se dégradent et les symptômes deviennent plus fréquents et plus difficiles à corriger.\n\n` +
            `Sur le long terme, cela peut mener à des années de souffrance évitables : fatigue chronique, douleurs persistantes, troubles métaboliques et forte baisse de la qualité de vie. Plus on attend, plus le retour à l'équilibre devient complexe.\n\n` +
            `Agir maintenant est indispensable. La solution la plus efficace est de prendre directement un appel avec notre équipe afin d'analyser la situation et mettre en place un plan clair pour stopper cette trajectoire avant qu'elle ne devienne irréversible :\nhttps://app.iclosed.io/e/maobrut/cheveux`,
        highlights: [],
        plan: [],
        mantra: "",
        trap: "",
        tip: "",
        ...common,
      };
    }

    if (pct <= 0.68) {
      return {
        themeKey: "aube",
        label: g("LE TRANSITIONNEL", "LA TRANSITIONNELLE"),
        title: g("L'Optimiseur", "L'Optimisatrice"),
        subtitle: "Le corps s'adapte, mais manque de constance",
        story: isFemme
          ? `Ton alimentation actuelle doit être améliorée. Sans ajustement, tu t'exposes à des problèmes de santé à moyen terme. Ton corps compense encore, mais certains signaux commencent généralement à apparaître quand l'équilibre n'est plus respecté, notamment une digestion lourde, de la fatigue après les repas ou une baisse d'énergie générale.\n\n` +
            `Il est nécessaire de revenir à une alimentation plus traditionnelle, plus simple et plus adaptée au fonctionnement naturel de ton corps. Ton foie est particulièrement concerné : s'il est surchargé, tout le reste suit. Le soutenir et le nettoyer correctement n'est pas une option, c'est une étape clé pour éviter une dégradation progressive de ta santé.\n\n` +
            `Sans correction réelle de tes habitudes alimentaires, le risque de troubles métaboliques, digestifs ou inflammatoires augmente clairement à moyen terme. Ce n'est pas une question de « si », mais de « quand ».\n\n` +
            `Pour éviter cela, il est fortement recommandé de suivre la formation proposée afin de comprendre concrètement quoi manger, comment préparer les aliments et comment soutenir tes organes clés. Un appel avec l'équipe est également conseillé pour identifier rapidement tes erreurs et mettre en place un plan adapté à ta situation.\n\n` +
            `Agir maintenant te permet d'éviter des complications futures. Attendre, c'est prendre le risque de devoir gérer des problèmes plus lourds plus tard. Le plus efficace reste de prendre directement un appel avec l'équipe via ce lien afin d'agir immédiatement et éviter que ta situation ne se dégrade : https://app.iclosed.io/e/maobrut/cheveux`
          : `Ton alimentation actuelle doit être améliorée. Sans ajustement, tu t'exposes à des problèmes de santé à moyen terme. Le corps compense encore, mais certains signaux commencent généralement à apparaître quand l'équilibre n'est plus respecté, notamment une digestion lourde, de la fatigue après les repas ou une baisse d'énergie générale.\n\n` +
            `Il est nécessaire de revenir à une alimentation plus traditionnelle, plus simple et plus adaptée au fonctionnement naturel du corps. Le foie est particulièrement concerné : s'il est surchargé, tout le reste suit. Le soutenir et le nettoyer correctement n'est pas une option, c'est une étape clé pour éviter une dégradation progressive de la santé.\n\n` +
            `Sans correction réelle des habitudes alimentaires, le risque de troubles métaboliques, digestifs ou inflammatoires augmente clairement à moyen terme. Ce n'est pas une question de « si », mais de « quand ».\n\n` +
            `Pour éviter cela, il est fortement recommandé de suivre la formation proposée afin de comprendre concrètement quoi manger, comment préparer les aliments et comment soutenir les organes clés. Un appel avec l'équipe est également conseillé pour identifier rapidement les erreurs et mettre en place un plan adapté à ta situation.\n\n` +
            `Agir maintenant te permet d'éviter des complications futures. Attendre, c'est prendre le risque de devoir gérer des problèmes plus lourds plus tard. Le plus efficace reste de prendre directement un appel avec l'équipe via ce lien afin d'agir immédiatement et éviter que la situation ne se dégrade : https://app.iclosed.io/e/maobrut/cheveux`,
        highlights: [],
        plan: [],
        mantra: "",
        trap: "",
        tip: "",
        ...common,
      };
    }

    if (pct <= 0.78) {
      return {
        themeKey: "aube",
        label: g("L'ÉQUILIBRÉ", "L'ÉQUILIBRÉE"),
        title: "Bon terrain, mais encore sensible",
        subtitle: "Entre Transitionnel et Ancien·ne",
        story: isFemme
          ? `Sur le long terme, continuer à améliorer ton alimentation est toujours bénéfique, même si cela demande parfois un peu plus de temps ou d'investissement. Penser à intégrer, de temps en temps, des plantes traditionnelles de ton pays peut être un vrai plus (en France par exemple : ortie, persil, etc.). L'objectif reste de privilégier des aliments à haute qualité nutritionnelle.\n\n` +
            `Si certains points ne sont pas encore totalement clairs, il est possible de t'appuyer sur une formation dédiée (lien à ajouter) afin de mieux comprendre et faire les bons choix. En cas de fatigue après les repas ou d'apparition de premiers signes de déséquilibre, il peut être utile d'ajuster ton alimentation et d'ajouter des plantes médicinales adaptées.\n\n` +
            `Si besoin, te former ou te faire accompagner est une très bonne option : avec les bons outils, tout se mettra en place progressivement. Ne pas maintenir cet équilibre pourrait, à long terme, augmenter le risque de problèmes de santé. L'important est donc d'agir dès maintenant pour préserver ta santé sur la durée.\n\n` +
            `Globalement, ta situation est presque parfaite, avec seulement quelques petits points à améliorer, comme une meilleure organisation (liste de courses) et, si besoin, ne pas hésiter à suivre la formation proposée.`
          : `Sur le long terme, continuer à améliorer son alimentation est toujours bénéfique, même si cela demande parfois un peu plus de temps ou d'investissement. Penser à intégrer, de temps en temps, des plantes traditionnelles de ton pays peut être un vrai plus (en France par exemple : ortie, persil, etc.). L'objectif reste de privilégier des aliments à haute qualité nutritionnelle.\n\n` +
            `Si certains points ne sont pas encore totalement clairs, il est possible de s'appuyer sur une formation dédiée (lien à ajouter) afin de mieux comprendre et faire les bons choix. En cas de fatigue après les repas ou d'apparition de premiers signes de déséquilibre, il peut être utile d'ajuster l'alimentation et d'ajouter des plantes médicinales adaptées.\n\n` +
            `Si besoin, se former ou se faire accompagner est une très bonne option : avec les bons outils, tout se mettra en place progressivement. Ne pas maintenir cet équilibre pourrait, à long terme, augmenter le risque de problèmes de santé. L'important est donc d'agir dès maintenant pour préserver sa santé sur la durée.\n\n` +
            `Globalement, la situation est presque parfaite, avec seulement quelques petits points à améliorer, comme une meilleure organisation (liste de courses) et, si besoin, ne pas hésiter à suivre la formation proposée.`,
        highlights: [],
        plan: [],
        mantra: "",
        trap: "",
        tip: "",
        ...common,
      };
    }

    return {
      themeKey: "solaire",
      label: g("L'ANCIEN", "L'ANCIENNE"),
      title: g("Le Stratège Ancestral", "La Stratège Ancestrale"),
      subtitle: "Terrain stable / bonne tolérance",
      story: isFemme
        ? `Globalement, tout est très positif et il n'y a rien de particulier à changer. Tes habitudes alimentaires sont bonnes, basées sur une alimentation plutôt traditionnelle et régulière. Une vraie attention est portée à la préparation de tes repas ainsi qu'à la qualité des aliments, ce qui te permet d'avoir une alimentation riche en nutriments.\n\n` +
          `Continuer de cette manière est clairement la bonne option : cela te permet de rester en bonne santé, sans prise de poids, et de te projeter sur le long terme avec une bonne qualité de vie, sans handicap. L'essentiel est donc de conserver ces bonnes habitudes et de ne pas relâcher les acquis.\n\n` +
          `À court et moyen terme, tout est au vert, avec une très bonne évaluation. Il reste toujours possible d'améliorer quelques petits détails, par exemple en t'organisant mieux avec une liste de courses, mais dans l'ensemble, ta situation est très satisfaisante.`
        : `Globalement, tout est très positif et il n'y a rien de particulier à changer. Les habitudes alimentaires sont bonnes, basées sur une alimentation plutôt traditionnelle et régulière. Une vraie attention est portée à la préparation des repas ainsi qu'à la qualité des aliments, ce qui permet d'avoir une alimentation riche en nutriments.\n\n` +
          `Continuer de cette manière est clairement la bonne option : cela permet de rester en bonne santé, sans prise de poids, et de se projeter sur le long terme avec une bonne qualité de vie, sans handicap. L'essentiel est donc de conserver ces bonnes habitudes et de ne pas relâcher les acquis.\n\n` +
          `À court et moyen terme, tout est au vert, avec une très bonne évaluation. Il reste toujours possible d'améliorer quelques petits détails, par exemple en s'organisant mieux avec une liste de courses, mais dans l'ensemble, la situation est très satisfaisante.`,
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
            <div style={styles.kicker}>TA PERSONNALITÉ ALIMENTAIRE</div>

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
            <div style={styles.kicker}>TA PERSONNALITÉ ALIMENTAIRE</div>

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

            <p style={{ opacity: 0.82, marginTop: 10 }}>
              Score : <b>{score}</b> / {maxScore}
            </p>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <button
                style={{ ...styles.button, background: "#334155" }}
                onClick={resetAll}
              >
                Refaire le questionnaire
              </button>
              <button
                style={{ ...styles.button, background: "#0f172a" }}
                onClick={restartFromStart}
              >
                Changer prénom / email / sexe
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Avatar via image PNG */
function Avatar({ sex, variant = "solaire" }) {
  const base = sex === "femme" ? "femme" : "homme";

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
        objectPosition: "bottom center",
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
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
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
    textAlign: "left",
    display: "grid",
    gridTemplateColumns: "170px 1fr",
    gap: 18,
    alignItems: "center",
  },

  inlineAvatar: {
    width: 150,
    aspectRatio: "469 / 532",
    justifySelf: "center",
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
    whiteSpace: "pre-line",
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

