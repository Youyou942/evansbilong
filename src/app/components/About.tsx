import { useRef } from "react";
import { motion, useInView } from "motion/react";

/* ─── Polices ─────────────────────────────────────────────── */
const MONO  = "'JetBrains Mono', monospace";
const SANS  = "'Space Grotesk', sans-serif";
const DOTO  = "'Doto', monospace";
const EASE  = [0.22, 1, 0.36, 1] as const;

/* ─── Outils ──────────────────────────────────────────────── */
const TOOLS = [
  { name: "Figma",         tag: "UI · UX · Prototypage" },
  { name: "Shopify",       tag: "E-commerce · Liquid" },
  { name: "Adobe Suite",   tag: "Photoshop · Illustrator · Ae" },
  { name: "WordPress",     tag: "CMS · Elementor · ACF" },
];

/* ─── Éléments du marquee (doublés pour boucle infinie) ───── */
const MARQUEE_ITEMS = [...TOOLS, ...TOOLS, ...TOOLS];

/* ─── Séparateur décoratif ────────────────────────────────── */
function Sep() {
  return (
    <span
      aria-hidden="true"
      className="mx-5 shrink-0 text-[#FC1235]/30 select-none sm:mx-8"
      style={{ fontFamily: DOTO, fontSize: "clamp(0.9rem, 2.8vw, 1.1rem)", letterSpacing: "0.1em" }}
    >
      ✦
    </span>
  );
}

/* ─── Composant principal ─────────────────────────────────── */
export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="apropos"
      ref={ref}
      className="bg-black relative overflow-hidden"
      style={{ paddingTop: "clamp(4.75rem, 10vw, 7rem)", paddingBottom: "clamp(4.75rem, 10vw, 7rem)" }}
    >
      {/* ── Lueur rouge gauche ── */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-[-8%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(252,18,53,0.07) 0%, transparent 70%)" }}
      />
      {/* ── Lueur rouge droite ── */}
      <div
        className="absolute top-1/2 -translate-y-1/2 right-[-8%] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(252,18,53,0.04) 0%, transparent 70%)" }}
      />

      {/* ══════════════════════════════════════════════════════
          HEADER — ligne d'accroche + numéro de section
      ══════════════════════════════════════════════════════ */}
      <div className="mx-auto mb-14 max-w-[1400px] px-5 sm:px-6 md:px-10 lg:px-12 sm:mb-16 lg:mb-20">
        <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:flex-row lg:items-end">

          {/* Numéro + label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <span
              style={{
                fontFamily: DOTO,
                fontSize: "clamp(2.5rem, 11vw, 5rem)",
                color: "#FC1235",
                opacity: 0.18,
                lineHeight: 1,
                letterSpacing: "0.04em",
              }}
            >
              02
            </span>
            <div className="flex flex-col gap-1">
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.5rem",
                  color: "#FC1235",
                  letterSpacing: "0.4em",
                }}
              >
                MÉTHODE
              </span>
              <div className="w-8 h-[1px] bg-[#FC1235]/30" />
            </div>
          </motion.div>

          {/* Accroche principale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="max-w-2xl lg:max-w-xl"
          >
            <h2
              style={{
                fontFamily: SANS,
                fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.035em",
                color: "#fff",
                margin: 0,
              }}
            >
              Les bons outils.{" "}
              <span style={{ color: "#FC1235", textShadow: "0 0 30px rgba(252,18,53,0.2)" }}>
                Un résultat solide.
              </span>
            </h2>
            <p
              className="mt-4"
              style={{
                fontFamily: SANS,
                fontSize: "clamp(0.95rem, 2vw, 1rem)",
                lineHeight: 1.72,
                color: "#888",
                maxWidth: "38ch",
              }}
            >
              Je choisis les outils selon le projet. L'objectif est simple : aller à l'essentiel et obtenir un résultat clair, fiable et durable.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          LIGNE SÉPARATRICE ANIMÉE
      ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE }}
        className="h-[1px] bg-white/[0.05] origin-left mb-0"
      />

      {/* ══════════════════════════════════════════════════════
          MARQUEE — défilement infini
      ══════════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden py-8 sm:py-10 md:py-14"
        style={{
          /* Fondu gauche + droite */
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, transparent 100%)",
        }}
      >
        {/* Piste 1 — gauche → droite */}
        <motion.div
          className="mb-4 flex items-center whitespace-nowrap sm:mb-6"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {MARQUEE_ITEMS.map((tool, i) => (
            <span key={`a-${i}`} className="inline-flex items-center shrink-0">
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: "clamp(1.15rem, 5vw, 2.2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: i % 2 === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.18)",
                }}
              >
                {tool.name}
              </span>
              <Sep />
            </span>
          ))}
        </motion.div>

        {/* Piste 2 — droite → gauche (sens inverse) */}
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{ x: ["-33.333%", "0%"] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        >
          {MARQUEE_ITEMS.map((tool, i) => (
            <span key={`b-${i}`} className="inline-flex items-center shrink-0">
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "clamp(0.58rem, 1.8vw, 0.75rem)",
                  letterSpacing: "0.22em",
                  color: i % 3 === 0 ? "#FC1235" : "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                }}
              >
                {tool.tag}
              </span>
              <Sep />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════
          LIGNE SÉPARATRICE BAS
      ══════════════════════════════════════════════════════ */}
      <div className="h-[1px] bg-white/[0.05]" />

      {/* ══════════════════════════════════════════════════════
          GRILLE OUTILS — 4 colonnes, détail par outil
      ══════════════════════════════════════════════════════ */}
      <div className="mx-auto mt-14 max-w-[1400px] px-5 sm:px-6 md:px-10 lg:px-12 sm:mt-16 lg:mt-20">
        <div className="grid grid-cols-1 gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.1, ease: EASE }}
              className="group relative overflow-hidden bg-black px-5 py-7 cursor-default sm:px-6 sm:py-8 md:px-8 md:py-10"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 40%, rgba(252,18,53,0.06) 0%, transparent 65%)",
                  transition: "opacity 0.5s ease",
                }}
              />

              {/* Numéro */}
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.48rem",
                  color: "#FC1235",
                  opacity: 0.5,
                  letterSpacing: "0.2em",
                  display: "block",
                  marginBottom: "1.25rem",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Nom de l'outil */}
              <h3
                style={{
                  fontFamily: SANS,
                  fontSize: "clamp(1.05rem, 4.2vw, 1.3rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: "0.75rem",
                  transition: "color 0.35s ease",
                }}
                className="group-hover:text-[#FC1235]"
              >
                {tool.name}
              </h3>

              {/* Tag */}
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "clamp(0.5rem, 1.5vw, 0.56rem)",
                  color: "#666",
                  letterSpacing: "0.15em",
                  lineHeight: 1.6,
                  transition: "color 0.35s ease",
                }}
                className="group-hover:text-[#888]"
              >
                {tool.tag}
              </p>

              {/* Ligne rouge bas au hover */}
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full"
                style={{
                  background: "linear-gradient(90deg, #FC1235, transparent)",
                  boxShadow: "0 0 10px rgba(252,18,53,0.4)",
                  transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
