import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

/*
  SECTION CONTACT — impact premium
  ──────────────────────────────────────────────────────────────
  Hiérarchie visuelle :
    1. Titre massif (SANS 700, clamp → 7.5rem) → focus principal
    2. CTA pill blanc/rouge (glow ring subtil)  → action claire
    3. Email (SANS, visible)                     → secondaire
    4. Status, social, meta                      → tertiaire (mono)

  Ajouts :
    · Signature DOTO "CONTACT" en fond (cohérence hero)
    · Top row : label gauche + status droite (axe horizontal)
    · Vertical rhythm plus généreux
    · Right column alignée à la baseline du titre
*/

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";
const DOTO = "'Doto', monospace";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ═══════════════════════════════════════════════════════════
   CTA PILL — plus présent, glow rouge subtil sur idle
═══════════════════════════════════════════════════════════ */
function PrimaryCTA() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href="mailto:bilongevans@gmail.com"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.985 }}
      className="group inline-flex items-center gap-3 self-start"
      style={{
        textDecoration: "none",
        backgroundColor: hovered ? "#FC1235" : "#FFFFFF",
        color: hovered ? "#FFFFFF" : "#0B0B0B",
        padding: "0.95rem clamp(1.35rem, 4vw, 1.75rem) 0.95rem clamp(1.55rem, 4vw, 2.05rem)",
        borderRadius: "9999px",
        /* Idle : ring rouge fin (1px) — signale la vivacité
           Hover : glow rouge large + ring rouge solide */
        boxShadow: hovered
          ? "0 18px 56px rgba(252,18,53,0.42), 0 0 0 1px rgba(252,18,53,0.4)"
          : "0 14px 40px rgba(255,255,255,0.07), 0 0 0 1px rgba(252,18,53,0.18)",
        transition:
          "background-color 0.4s cubic-bezier(0.22,1,0.36,1), color 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontSize: "clamp(0.92rem, 2.4vw, 1.02rem)",
          fontWeight: 600,
          letterSpacing: "-0.015em",
          lineHeight: 1,
        }}
      >
        Démarrer un projet
      </span>

      {/* Disque flèche — plus grand, translate + rotate léger au hover */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "30px",
          height: "30px",
          borderRadius: "9999px",
          backgroundColor: hovered ? "rgba(255,255,255,0.18)" : "#0B0B0B",
          transform: hovered
            ? "translateX(4px) rotate(-8deg)"
            : "translateX(0) rotate(0deg)",
          transition:
            "background-color 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
          <path
            d="M1 12L12 1M12 1H5M12 1V8"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════════════ */
export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="bg-black relative overflow-hidden"
      style={{
        paddingTop:    "clamp(5.5rem, 16vw, 14rem)",
        paddingBottom: "clamp(4.5rem, 10vw, 9rem)",
      }}
    >
      {/* ══ Ligne séparatrice haute — reveal scale-X ══ */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
      />

      {/* ══ Halo rouge central — ambiance ══ */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: "28%",
          width: "700px",
          height: "360px",
          background:
            "radial-gradient(ellipse, rgba(252,18,53,0.09) 0%, transparent 62%)",
          filter: "blur(50px)",
        }}
      />

      {/* ══ Signature DOTO "CONTACT" en fond — cohérence hero ══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 2, delay: 0.4, ease: EASE }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none whitespace-nowrap"
        style={{
          bottom: "-4%",
          fontFamily: DOTO,
          fontWeight: 400,
          fontSize: "clamp(4rem, 22vw, 20rem)",
          color: "#FC1235",
          opacity: 0.05,
          letterSpacing: "0.04em",
          lineHeight: 0.9,
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 100%)",
        }}
      >
        CONTACT
      </motion.div>

      {/* ══ Container ══ */}
      <div
        className="relative z-10 mx-auto px-5 sm:px-6 md:px-10 lg:px-12"
        style={{ maxWidth: "1400px" }}
      >
        {/* ─── TOP ROW — label gauche + status droite (axe horizontal) ─── */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:mb-14 sm:gap-6 lg:mb-20 lg:flex-row lg:items-center">
          {/* Label éditorial */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex items-center gap-3"
          >
            <div
              style={{
                width: "22px",
                height: "1px",
                backgroundColor: "#FC1235",
                boxShadow: "0 0 6px rgba(252,18,53,0.45)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: "0.48rem",
                color: "#FC1235",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Parlons du projet
            </span>
          </motion.div>

          {/* Status — disponibilité + délai */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
            className="flex flex-wrap items-center gap-2.5"
          >
            {/* Dot rouge avec pulse subtil via box-shadow */}
            <span
              style={{
                display: "inline-block",
                width: "7px",
                height: "7px",
                borderRadius: "9999px",
                backgroundColor: "#FC1235",
                boxShadow:
                  "0 0 0 3px rgba(252,18,53,0.15), 0 0 12px rgba(252,18,53,0.5)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: "clamp(0.42rem, 1.6vw, 0.46rem)",
                color: "#B8B8B8",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Disponible · réponse rapide
            </span>
          </motion.div>
        </div>

        {/* ─── MAIN GRID — titre géant gauche + infos droite ─── */}
        <div className="grid grid-cols-1 items-start gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-16">

          {/* ══ COLONNE GAUCHE — titre + sub + CTA (8/12) ══════ */}
          <div className="max-w-4xl lg:col-span-8">

            {/* Titre massif — 2 lignes, mask reveal séquentiel */}
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "108%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
                style={{
                  fontFamily: SANS,
                  fontSize: "clamp(2.45rem, 10vw, 7.2rem)",
                  fontWeight: 700,
                  lineHeight: 0.9,
                  letterSpacing: "-0.05em",
                  color: "#FFFFFF",
                  margin: 0,
                }}
              >
                Parlons de votre
              </motion.h2>
            </div>
            <div className="overflow-hidden mt-0.5">
              <motion.h2
                initial={{ y: "108%" }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
                style={{
                  fontFamily: SANS,
                  fontSize: "clamp(2.45rem, 10vw, 7.2rem)",
                  fontWeight: 700,
                  lineHeight: 0.9,
                  letterSpacing: "-0.05em",
                  color: "#FC1235",
                  textShadow:
                    "0 0 52px rgba(252,18,53,0.28), 0 0 120px rgba(252,18,53,0.1)",
                  margin: 0,
                }}
              >
                projet.
              </motion.h2>
            </div>

            {/* Sub-line — plus respirante */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.38, ease: EASE }}
              style={{
                fontFamily: SANS,
                fontSize: "clamp(0.98rem, 2.4vw, 1.1rem)",
                lineHeight: 1.68,
                color: "#8A8A8A",
                letterSpacing: "-0.005em",
                maxWidth: "40ch",
                margin: "clamp(1.5rem, 5vw, 2.25rem) 0 0",
              }}
            >
              Besoin d'un site clair, fiable et bien pensé ? Discutons-en.
            </motion.p>

            {/* CTA — plus prominent, espace généreux au-dessus */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="mt-10 sm:mt-12"
            >
              <PrimaryCTA />
            </motion.div>
          </div>

          {/* ══ COLONNE DROITE — email + social (4/12) ══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            className="flex max-w-md flex-col gap-8 sm:gap-10 lg:col-span-4 lg:gap-12 lg:pt-3"
          >
            {/* ── EMAIL — bloc premier, plus prominent ── */}
            <div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.46rem",
                  color: "#555",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "1rem",
                }}
              >
                Email direct
              </span>
              <a
                href="mailto:bilongevans@gmail.com"
                className="group relative inline-block break-all sm:break-normal"
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: "clamp(0.98rem, 2.4vw, 1.15rem)",
                    fontWeight: 500,
                    color: "#E8E8E8",
                    letterSpacing: "-0.01em",
                    transition: "color 0.3s ease",
                  }}
                  className="group-hover:text-white"
                >
                  bilongevans@gmail.com
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-4px",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, #FC1235, rgba(252,18,53,0))",
                    transformOrigin: "left center",
                  }}
                  className="scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </a>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "clamp(0.46rem, 1.4vw, 0.5rem)",
                  color: "#4A4A4A",
                  letterSpacing: "0.22em",
                  lineHeight: 1.6,
                  margin: "0.9rem 0 0",
                  textTransform: "uppercase",
                }}
              >
                Projets sur-mesure uniquement
              </p>
            </div>

            {/* ── SOCIAL — demoted, subtil ── */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "clamp(1.25rem, 3vw, 1.5rem)",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.46rem",
                  color: "#555",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "1rem",
                }}
              >
                Présence
              </span>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Dribbble", href: "#" },
                  { label: "Behance",  href: "#" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="group inline-flex items-center gap-3 self-start"
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        height: "1px",
                        width: "14px",
                        backgroundColor: "rgba(255,255,255,0.18)",
                        transition:
                          "width 0.45s cubic-bezier(0.22,1,0.36,1), background-color 0.35s ease",
                      }}
                      className="group-hover:!w-[28px] group-hover:!bg-[#FC1235]/55"
                    />
                    <span
                      style={{
                        fontFamily: SANS,
                        fontSize: "clamp(0.92rem, 2.2vw, 0.98rem)",
                        fontWeight: 500,
                        color: "#7A7A7A",
                        letterSpacing: "-0.005em",
                        transition: "color 0.3s ease",
                      }}
                      className="group-hover:text-white"
                    >
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
