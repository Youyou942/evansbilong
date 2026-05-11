import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EVANS_PORTRAIT_ALT, EVANS_PORTRAIT_IMAGE, EVANS_PORTRAIT_MOBILE_IMAGE } from "../assets";

/* ─── Polices ─────────────────────────────────────────────── */
const MANROPE = "'Manrope', sans-serif";
const DOTO    = "'Doto', monospace";

/*
 * ─── Easings ──────────────────────────────────────────────
 *
 * CINEMATIC  — accélération douce, décélération longue
 *              idéal pour les éléments qui "arrivent"
 *
 * SOFT_OUT   — ease-out pur, très doux
 *              idéal pour les fondus et les textes
 */
const CINEMATIC  = [0.16, 1, 0.3, 1] as const;   // expo-out like
const SOFT_OUT   = [0.25, 0.46, 0.45, 0.94] as const; // quad-out

/* ─── Composant principal ─────────────────────────────────── */
export function Hero() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const heroImage = isMobile ? EVANS_PORTRAIT_MOBILE_IMAGE : EVANS_PORTRAIT_IMAGE;

  const headlineLines = [
    {
      key: "intro",
      content: (
        <>
          Rien n'est là
          <br className="sm:hidden" /> par hasard.
        </>
      ),
      delay: 0.20,
    },
    {
      key: "detail",
      content: <>Chaque détail</>,
      delay: 0.34,
    },
    {
      key: "reason",
      content: <>a sa raison.</>,
      delay: 0.48,
    },
  ];

  return (
    <section
      id="accueil"
      className="relative min-h-[100svh] md:min-h-screen overflow-hidden bg-black text-white"
    >
      {/* ══════════════════════════════════════════════════════
          IMAGE
          · scale 1.025 → 1  (quasi invisible, juste de la profondeur)
          · opacity 0 → 1
          · durée longue pour un fondu cinématique
          · démarre immédiatement
      ══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 1.015 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          opacity: { duration: 1.6, delay: 0,    ease: SOFT_OUT  },
          scale:   { duration: 2.0, delay: 0,    ease: CINEMATIC },
        }}
        className="absolute inset-0 z-10"
      >
        {/* Image — légèrement assombrie (brightness 0.82), proportions naturelles */}
        <ImageWithFallback
          src={heroImage}
          alt={EVANS_PORTRAIT_ALT}
          className="h-full w-full object-cover"
          style={{
            filter: "brightness(0.82)",
            objectPosition: "center",
          }}
        />
      </motion.div>

      {/* ── Overlay gradient — z-20, au-dessus de l'image ── */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.32) 28%, rgba(0,0,0,0.08) 52%, rgba(0,0,0,0) 72%)",
        }}
      />

      {/* ══════════════════════════════════════════════════════
          TEXTE PRINCIPAL
          · y réduit à 12px (moins agressif)
          · stagger de 0.14s entre chaque ligne
          · durée 1.0s avec CINEMATIC pour une décélération longue
          · démarre à 0.2s (légèrement après l'image)
      ══════════════════════════════════════════════════════ */}
      <div className="absolute z-30 left-5 right-5 top-[52%] -translate-y-1/2 sm:left-6 sm:right-6 sm:top-[50%] md:left-[clamp(3.25rem,7vw,5.75rem)] md:right-auto md:top-[48%] lg:left-[clamp(3.75rem,7.2vw,7.5rem)]" style={{ maxWidth: "clamp(14rem, 80vw, 36rem)" }}>
        {headlineLines.map(({ key, content, delay }) => (
          <motion.span
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              opacity: { duration: 1.0, delay, ease: SOFT_OUT  },
              y:       { duration: 1.1, delay, ease: CINEMATIC },
            }}
            className="block text-white"
            style={{
              fontFamily: MANROPE,
              fontSize: "clamp(1.45rem, 5.5vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {content}
          </motion.span>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          NOM EN FOND — apparaît en dernier
          · opacity uniquement (pas de translation)
          · durée longue pour un fondu très doux
          · delay 0.7s
      ══════════════════════════════════════════════════════ */}
      {/* ── Mobile : titre en deux lignes, positionné au-dessus du bord ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.7, ease: SOFT_OUT }}
        className="pointer-events-none absolute inset-x-0 z-20 md:hidden"
        style={{
          bottom: "clamp(4rem, 12vw, 7rem)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)",
        }}
      >
        <div
          className="w-full text-center px-4"
          style={{
            fontFamily: DOTO,
            fontWeight: 400,
            fontSize: "clamp(2.6rem, 19vw, 4.5rem)",
            color: "#FC1235",
            opacity: 0.92,
            letterSpacing: "0.04em",
            lineHeight: 0.95,
          }}
        >
          <div>EVANS</div>
          <div>BILONG</div>
        </div>
      </motion.div>

      {/* ── Desktop : titre sur une ligne, collé en bas ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.7, ease: SOFT_OUT }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden hidden md:block"
        style={{
          height: "clamp(72px, 14vw, 190px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0) 100%)",
        }}
      >
        <p
          className="absolute bottom-0 left-1/2 whitespace-nowrap leading-none"
          style={{
            fontFamily: DOTO,
            fontWeight: 400,
            fontSize: "clamp(2.8rem, 18vw, 191.1px)",
            color: "#FC1235",
            opacity: 0.92,
            letterSpacing: "0.04em",
            lineHeight: 1,
            transform: "translateX(-50%)",
          }}
        >
          EVANS BILONG
        </p>
      </motion.div>
    </section>
  );
}
