import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";

/* ─── Polices (cohérentes avec le reste du site) ─────────── */
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";
const DOTO = "'Doto', monospace";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Liens sociaux ───────────────────────────────────────── */
const LINKS = [
  { label: "Dribbble", href: "https://dribbble.com/EvansFFO", newTab: true },
  { label: "Behance", href: "https://www.behance.net/evansbilong", newTab: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/evansbilong/", newTab: true },
];

/* ─── Signature répétée (marquee) ─────────────────────────── */
const NAME_REPEAT = Array(6).fill("EVANS BILONG");

/* ═══════════════════════════════════════════════════════════
   LIEN SOCIAL — hover contrôlé (flèche qui se déploie)
═══════════════════════════════════════════════════════════ */
function FooterLink({ label, href, newTab = false }: { label: string; href: string; newTab?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative inline-flex max-w-full items-center gap-3 self-start lg:self-end"
      style={{ textDecoration: "none" }}
    >
      {/* Petit indicateur — ligne qui grandit */}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          height: "1px",
          width: hovered ? "28px" : "14px",
          backgroundColor: hovered ? "#FC1235" : "rgba(255,255,255,0.18)",
          transition:
            "width 0.45s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.35s ease",
        }}
      />
      <span
        style={{
          fontFamily: SANS,
          fontSize: "clamp(0.95rem, 2.5vw, 1rem)",
          fontWeight: 500,
          letterSpacing: "-0.015em",
          color: hovered ? "#FFFFFF" : "#9A9A9A",
          transition: "color 0.35s ease",
        }}
      >
        {label}
      </span>
      {/* Flèche sortante */}
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          marginLeft: "0.15rem",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translate(0, 0)" : "translate(-6px, 6px)",
          transition:
            "opacity 0.4s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          color: "#FC1235",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M1 9L9 1M9 1H3M9 1V7"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA PRINCIPAL — bouton pill premium avec hover rouge
═══════════════════════════════════════════════════════════ */
function PrimaryCTA() {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href="/contact"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group inline-flex items-center gap-3 self-start"
      whileTap={{ scale: 0.985 }}
      style={{
        textDecoration: "none",
        /* Pill premium — blanc par défaut, rouge au hover */
        backgroundColor: hovered ? "#FC1235" : "#FFFFFF",
        color: hovered ? "#FFFFFF" : "#0B0B0B",
        padding: "0.9rem clamp(1.3rem, 4vw, 1.6rem) 0.9rem clamp(1.45rem, 4vw, 1.9rem)",
        borderRadius: "9999px",
        border: "1px solid transparent",
        boxShadow: hovered
          ? "0 0 0 1px rgba(252,18,53,0.45)"
          : "0 0 0 1px rgba(255,255,255,0.06)",
        transition:
          "background-color 0.35s cubic-bezier(0.22, 1, 0.36, 1), color 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontSize: "clamp(0.9rem, 2.2vw, 0.95rem)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}
      >
        Démarrer un projet
      </span>
      {/* Flèche dans un disque */}
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "26px",
          height: "26px",
          borderRadius: "9999px",
          backgroundColor: hovered ? "rgba(255,255,255,0.18)" : "#0B0B0B",
          color: hovered ? "#FFFFFF" : "#FFFFFF",
          transform: hovered ? "translateX(3px)" : "translateX(0)",
          transition:
            "background-color 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
          <path
            d="M1 12L12 1M12 1H5M12 1V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </motion.a>
  );
}

function DownloadCVCTA() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="/CV%20Evans%20Bilong.pdf"
      download="CV Evans Bilong.pdf"
      aria-label="Télécharger mon CV au format PDF"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group inline-flex items-center gap-3 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC1235] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      whileTap={{ scale: 0.985 }}
      style={{
        textDecoration: "none",
        backgroundColor: hovered ? "rgba(252,18,53,0.12)" : "rgba(255,255,255,0.03)",
        color: hovered ? "#FFFFFF" : "#F3F3F3",
        padding: "0.9rem clamp(1.25rem, 4vw, 1.55rem) 0.9rem clamp(1.4rem, 4vw, 1.8rem)",
        borderRadius: "9999px",
        border: hovered
          ? "1px solid rgba(252,18,53,0.45)"
          : "1px solid rgba(255,255,255,0.1)",
        boxShadow: hovered
          ? "0 14px 34px rgba(252,18,53,0.16), 0 0 0 1px rgba(252,18,53,0.16)"
          : "0 10px 26px rgba(0,0,0,0.32)",
        transition:
          "background-color 0.35s cubic-bezier(0.22, 1, 0.36, 1), color 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontSize: "clamp(0.9rem, 2.2vw, 0.95rem)",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}
      >
        Télécharger mon CV
      </span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "26px",
          height: "26px",
          borderRadius: "9999px",
          backgroundColor: hovered ? "#FC1235" : "rgba(252,18,53,0.18)",
          color: "#FFFFFF",
          transform: hovered ? "translateY(2px)" : "translateY(0)",
          transition:
            "background-color 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
          <path
            d="M6.5 1.5V8.5M6.5 8.5L3.75 5.75M6.5 8.5L9.25 5.75M2 11H11"
            stroke="currentColor"
            strokeWidth="1.5"
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
export function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <footer
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#000000",
        paddingTop: "clamp(5rem, 14vw, 12rem)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* ── Séparation haute — barre fine + dégradé rouge très subtil ── */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(252,18,53,0.18) 45%, rgba(252,18,53,0.18) 55%, transparent 100%)",
        }}
      />

      {/* ══════════════════════════════════════════════════════
          BLOC HAUT — accroche + CTA + liens
      ══════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 mx-auto px-5 sm:px-6 md:px-10 lg:px-12"
        style={{ maxWidth: "1400px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* ── Colonne gauche : accroche + CTA (7/12) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: EASE }}
            className="lg:col-span-7"
          >
            {/* Label éditorial */}
            <div className="flex items-center gap-3 mb-6 sm:mb-7">
              <div
                style={{
                  width: "18px",
                  height: "1px",
                  backgroundColor: "#FC1235",
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
            </div>

            {/* Titre principal */}
            <h2
              style={{
                fontFamily: SANS,
                fontSize: "clamp(2.2rem, 9vw, 5rem)",
                fontWeight: 700,
                lineHeight: 0.94,
                letterSpacing: "-0.045em",
                color: "#FFFFFF",
                margin: 0,
                maxWidth: "17ch",
              }}
            >
              Un bon projet{" "}
              <span
                style={{
                  color: "#FC1235",
                }}
              >
                commence par un échange clair.
              </span>
            </h2>

            {/* Sous-ligne discrète */}
            <p
              style={{
                fontFamily: SANS,
                fontSize: "clamp(0.95rem, 2.4vw, 1rem)",
                fontWeight: 400,
                lineHeight: 1.7,
                color: "#8A8A8A",
                letterSpacing: "-0.005em",
                maxWidth: "44ch",
                margin: "1.5rem 0 0",
              }}
            >
              Si vous cherchez quelque chose de clair, fiable et bien construit, on peut en parler.
            </p>

            {/* CTA + email côte-à-côte */}
            <div className="mt-8 sm:mt-10 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5 lg:gap-8">
              <PrimaryCTA />
              <DownloadCVCTA />

              {/* Email en "secondary link" */}
              <a
                href="mailto:bilongevans@gmail.com"
                className="group relative inline-flex max-w-full items-center gap-2 self-start break-all sm:self-center sm:break-normal"
                style={{ textDecoration: "none" }}
              >
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: "clamp(0.92rem, 2.3vw, 0.96rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                    color: "#D0D0D0",
                  }}
                  className="transition-colors duration-300 group-hover:text-white"
                >
                  bilongevans@gmail.com
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "-3px",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, #FC1235, rgba(252,18,53,0))",
                    transformOrigin: "left center",
                  }}
                  className="scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </a>
            </div>
          </motion.div>

          {/* ── Colonne droite : liens sociaux (5/12) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
            className="lg:col-span-5 lg:pl-10 xl:pl-16 flex flex-col lg:items-end"
          >
            <div className="flex items-center gap-3 mb-6 sm:mb-8 lg:self-end">
              <div
                style={{
                  width: "14px",
                  height: "1px",
                  backgroundColor: "rgba(255,255,255,0.22)",
                }}
              />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.46rem",
                  color: "#777",
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                }}
              >
                Présence
              </span>
            </div>

            <div className="flex flex-col gap-5 md:items-end">
              {LINKS.map((link) => (
                <FooterLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  newTab={link.newTab}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SIGNATURE GÉANTE — EVANS BILONG (marquee + parallax)
      ══════════════════════════════════════════════════════ */}
      <div
        className="relative mt-16 sm:mt-20 lg:mt-32 overflow-hidden select-none pointer-events-none"
      >
        <motion.div style={{ y: nameY }}>
          <motion.div
            className="flex items-center whitespace-nowrap"
            animate={{ x: ["0%", "-16.666%"] }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          >
            {NAME_REPEAT.map((name, i) => (
              <span
                key={`main-${i}`}
                className="shrink-0 inline-block"
                style={{
                  fontFamily: DOTO,
                  fontWeight: 400,
                  fontSize: "clamp(3.75rem, 18vw, 13rem)",
                  letterSpacing: "0.04em",
                  lineHeight: 0.86,
                  color:
                    i % 2 === 0
                      ? "rgba(252,18,53,0.24)"
                      : "rgba(252,18,53,0.18)",
                  paddingRight: "clamp(2rem, 5vw, 5rem)",
                }}
              >
                {name}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center whitespace-nowrap -mt-2 sm:-mt-3 md:-mt-6"
            animate={{ x: ["-16.666%", "0%"] }}
            transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
          >
            {NAME_REPEAT.map((name, i) => (
              <span
                key={`sub-${i}`}
                className="shrink-0 inline-block"
                style={{
                  fontFamily: DOTO,
                  fontWeight: 400,
                  fontSize: "clamp(3.75rem, 18vw, 13rem)",
                  letterSpacing: "0.04em",
                  lineHeight: 0.86,
                  color: i % 2 === 0
                    ? "rgba(252,18,53,0.74)"
                    : "rgba(252,18,53,0.58)",
                  paddingRight: "clamp(2rem, 5vw, 5rem)",
                }}
              >
                {name}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </footer>
  );
}
