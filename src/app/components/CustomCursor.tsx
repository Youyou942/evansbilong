import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/*
  CUSTOM CURSOR — signature brand (anneau + point rouge)
  ──────────────────────────────────────────────────────────────
  4 ÉTATS :
    • default  — anneau fin + point rouge central (signature)
    • hover    — anneau élargi teinté rouge (sur liens/boutons, auto)
    • project  — pill horizontale avec "Voir le projet" + flèche
    • site     — petite étoile brillante animée

  MOBILE :
    • Désactivé sur les appareils touch (pointer: coarse)
    • Retourne null — aucun rendu, aucune boucle RAF

  PERFORMANCE :
    • 2 boucles RAF indépendantes (lerp différenciés)
    • translate3d uniquement pour la position → GPU compositing
    • Glow trail : lerp plus lent → effet organique discret

  IDENTITÉ BRAND :
    • #FC1235 intégré subtilement dans les 3 états
    • Dark premium : fond noir translucide en project state
    • Aucun dégradé tape-à-l'œil, aucun glow excessif

  API PUBLIQUE :
    • setCursorState("project" | "site" | "default") — déclenché manuellement
    • État "hover" auto-détecté sur a, button, [role=button], input…
*/

/* ─── Lerp ──────────────────────────────────────────────── */
const LERP_MAIN  = 0.14;
const LERP_TRAIL = 0.08;

/* ─── Easings ───────────────────────────────────────────── */
const E      = [0.25, 0.46, 0.45, 0.94] as const;
const E_TEXT = [0.22, 1,    0.36, 1   ] as const;

/* ─── Typo ──────────────────────────────────────────────── */
const MONO = "'JetBrains Mono', monospace";

/* ─── Sélecteur éléments interactifs (auto-hover) ───────── */
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label[for], [data-cursor-hover]';

const SITE_STAR_PATH =
  "M13 2L15.7 10.3L24 13L15.7 15.7L13 24L10.3 15.7L2 13L10.3 10.3L13 2Z";

const SITE_STAR_DEPTH = 2.35;

/* ═══════════════════════════════════════════════════════════
   SPECS VISUELS PAR ÉTAT
═══════════════════════════════════════════════════════════ */
type CursorState = "default" | "hover" | "project" | "site";

const SPECS: Record<CursorState, {
  width:       number;
  height:      number;
  borderColor: string;
  background:  string;
  dotScale:    number;
  dotOpacity:  number;
  textOpacity: number;
  glowOpacity: number;
  glowScale:   number;
}> = {
  default: {
    width: 28, height: 28,
    borderColor: "rgba(255,255,255,0.38)",
    background:  "rgba(0,0,0,0)",
    dotScale: 1,   dotOpacity: 1,
    textOpacity: 0,
    glowOpacity: 0.10, glowScale: 1,
  },
  hover: {
    width: 42, height: 42,
    borderColor: "rgba(252,18,53,0.62)",
    background:  "rgba(252,18,53,0.04)",
    dotScale: 1.55, dotOpacity: 1,
    textOpacity: 0,
    glowOpacity: 0.18, glowScale: 1.1,
  },
  project: {
    width: 128, height: 40,
    borderColor: "rgba(252,18,53,0.55)",
    background:  "rgba(10,10,10,0.82)",
    dotScale: 0, dotOpacity: 0,
    textOpacity: 1,
    glowOpacity: 0.22, glowScale: 1.25,
  },
  site: {
    width: 28, height: 28,
    borderColor: "rgba(252,18,53,0)",
    background:  "rgba(0,0,0,0)",
    dotScale: 0, dotOpacity: 0,
    textOpacity: 0,
    glowOpacity: 0.1, glowScale: 0.78,
  },
};

/* ═══════════════════════════════════════════════════════════
   ÉTAT GLOBAL
═══════════════════════════════════════════════════════════ */
type ExplicitState = "default" | "project" | "site";

let _explicit: ExplicitState = "default";
let _autoHover = false;
const _listeners = new Set<() => void>();

function emit() { _listeners.forEach((fn) => fn()); }

export function setCursorState(state: ExplicitState) {
  if (_explicit === state) return;
  _explicit = state;
  emit();
}

function getEffective(): CursorState {
  if (_explicit !== "default") return _explicit;
  return _autoHover ? "hover" : "default";
}

function useEffective() {
  const [state, setState] = useState<CursorState>(getEffective());
  useEffect(() => {
    const upd = () => setState(getEffective());
    _listeners.add(upd);
    return () => { _listeners.delete(upd); };
  }, []);
  return state;
}

/* ─── Détection touch/mobile ────────────────────────────── */
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(
    () => window.matchMedia("(pointer: coarse)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isTouch;
}

/* ═══════════════════════════════════════════════════════════
   COMPOSANT
═══════════════════════════════════════════════════════════ */
export function CustomCursor() {
  const isTouch  = useIsTouch();
  const mainRef  = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const state = useEffective();
  const spec  = SPECS[state];

  /* ── Boucle RAF : position + auto-hover detection ────── */
  useEffect(() => {
    /* Sur mobile/touch, on ne démarre pas la boucle */
    if (isTouch) return;

    const target   = { x: -200, y: -200 };
    const posMain  = { x: -200, y: -200 };
    const posTrail = { x: -200, y: -200 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      if (_explicit === "default") {
        const el = e.target as HTMLElement | null;
        const isInteractive = !!(el && el.closest(INTERACTIVE_SELECTOR));
        if (isInteractive !== _autoHover) {
          _autoHover = isInteractive;
          emit();
        }
      }
    };

    const tick = () => {
      posMain.x  += (target.x - posMain.x)  * LERP_MAIN;
      posMain.y  += (target.y - posMain.y)  * LERP_MAIN;
      posTrail.x += (target.x - posTrail.x) * LERP_TRAIL;
      posTrail.y += (target.y - posTrail.y) * LERP_TRAIL;

      if (mainRef.current)
        mainRef.current.style.transform  = `translate3d(${posMain.x}px, ${posMain.y}px, 0)`;
      if (trailRef.current)
        trailRef.current.style.transform = `translate3d(${posTrail.x}px, ${posTrail.y}px, 0)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  /* Sur mobile/touch, on ne rend rien */
  if (isTouch) return null;

  return (
    <>
      {/* ═══ LAYER 1 — GLOW ROUGE (traîne lente) ═══════════ */}
      <div
        ref={trailRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          pointerEvents: "none",
          zIndex: 99997,
          willChange: "transform",
        }}
      >
        <motion.div
          animate={{
            opacity: spec.glowOpacity,
            scale:   spec.glowScale,
          }}
          transition={{ duration: 0.6, ease: E }}
          style={{
            width: "100px",
            height: "100px",
            marginTop: "-50px",
            marginLeft: "-50px",
            borderRadius: "9999px",
            background:
              "radial-gradient(circle, rgba(252,18,53,0.55) 0%, transparent 62%)",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* ═══ LAYER 2 — SHAPE PRINCIPALE ═══════════════════ */}
      <div
        ref={mainRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0,
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
        }}
      >
        <motion.div
          animate={{
            width:           spec.width,
            height:          spec.height,
            borderColor:     spec.borderColor,
            backgroundColor: spec.background,
          }}
          transition={{ duration: 0.45, ease: E }}
          style={{
            transform: "translate(-50%, -50%)",
            borderRadius: "9999px",
            borderWidth: state === "site" ? "0px" : "1px",
            borderStyle: "solid",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow:
              state === "project"
                ? "0 6px 28px rgba(252,18,53,0.22), 0 0 0 1px rgba(252,18,53,0.08)"
                : state === "site"
                ? "none"
                : state === "hover"
                ? "0 0 18px rgba(252,18,53,0.18)"
                : "0 0 10px rgba(252,18,53,0.08)",
            backdropFilter:        state === "project" ? "blur(6px)" : "none",
            WebkitBackdropFilter:  state === "project" ? "blur(6px)" : "none",
          }}
        >
          {/* ── POINT ROUGE CENTRAL ──── */}
          <motion.div
            animate={{
              scale:   spec.dotScale,
              opacity: spec.dotOpacity,
            }}
            transition={{ duration: 0.35, ease: E }}
            style={{
              position: "absolute",
              width: "3px",
              height: "3px",
              borderRadius: "9999px",
              backgroundColor: "#FC1235",
              boxShadow: "0 0 6px rgba(252,18,53,0.75)",
            }}
          />

          {/* ── ÉTOILE BRILLANTE (site state) ─────────────── */}
          <motion.div
            animate={{
              opacity: state === "site" ? 1 : 0,
              scale: state === "site" ? 1 : 0.72,
            }}
            transition={{ duration: 0.24, ease: E }}
            style={{
              position: "absolute",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              perspective: "620px",
            }}
          >
            <motion.div
              animate={
                state === "site"
                  ? {
                      scale: [0.985, 1.03, 0.995, 1],
                      rotateY: [0, 90, 180, 270, 360],
                    }
                  : { scale: 0.8, rotateY: 0 }
              }
              transition={
                state === "site"
                  ? {
                      scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                      rotateY: { duration: 4.4, repeat: Infinity, ease: "easeInOut" },
                    }
                  : { duration: 0.2, ease: E }
              }
              style={{
                width: "24px",
                height: "24px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translateZ(-${SITE_STAR_DEPTH}px) rotateY(180deg)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 26 26" fill="none"
                  style={{ overflow: "visible", filter: "drop-shadow(0 0 2px rgba(94,10,27,0.08))" }}>
                  <path d={SITE_STAR_PATH} fill="url(#cursor-site-star-back-fill)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" />
                  <path d="M13 2L15.7 10.3L13 13L10.3 10.3L13 2Z" fill="rgba(255,255,255,0.05)" />
                  <path d="M10.3 15.7L13 24L15.7 15.7L13 13L10.3 15.7Z" fill="rgba(49,4,14,0.30)" />
                </svg>
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  style={{
                    width: `${SITE_STAR_DEPTH * 2 + 0.75}px`,
                    height: "19px",
                    transform: "rotateY(90deg)",
                    transformStyle: "preserve-3d",
                    clipPath: "polygon(50% 0%, 86% 16%, 100% 50%, 86% 84%, 50% 100%, 14% 84%, 0% 50%, 14% 16%)",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(252,86,115,0.58) 18%, rgba(188,24,52,0.78) 48%, rgba(108,12,30,0.88) 100%)",
                    borderLeft: "1px solid rgba(255,255,255,0.07)",
                    borderRight: "1px solid rgba(255,255,255,0.04)",
                    boxShadow: "inset 0 0 4px rgba(255,255,255,0.08), inset 0 -2px 3px rgba(51,4,15,0.25)",
                    opacity: 0.95,
                  }}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translateZ(${SITE_STAR_DEPTH}px)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <motion.svg width="24" height="24" viewBox="0 0 26 26" fill="none"
                  style={{ overflow: "visible", filter: "drop-shadow(0 0 4px rgba(252,18,53,0.14))" }}>
                  <defs>
                    <linearGradient id="cursor-site-star-back-fill" x1="7" y1="5" x2="19" y2="22" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#7B0B1F" stopOpacity="0.95" />
                      <stop offset="48%" stopColor="#A6112B" stopOpacity="0.96" />
                      <stop offset="100%" stopColor="#4B0613" stopOpacity="0.96" />
                    </linearGradient>
                    <linearGradient id="cursor-site-star-fill" x1="7" y1="4" x2="19" y2="22" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFF6F8" stopOpacity="0.92" />
                      <stop offset="18%" stopColor="#FFDCE6" stopOpacity="0.88" />
                      <stop offset="44%" stopColor="#FC5E7A" stopOpacity="0.94" />
                      <stop offset="76%" stopColor="#FC1235" stopOpacity="0.96" />
                      <stop offset="100%" stopColor="#8B0B21" stopOpacity="0.96" />
                    </linearGradient>
                    <linearGradient id="cursor-site-star-bevel" x1="6" y1="3" x2="20" y2="23" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
                      <stop offset="16%" stopColor="#FFE8F1" stopOpacity="0.22" />
                      <stop offset="48%" stopColor="#FFFFFF" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="#4A0513" stopOpacity="0.16" />
                    </linearGradient>
                    <linearGradient id="cursor-site-star-prism" x1="4" y1="6" x2="22" y2="18" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                      <stop offset="34%" stopColor="#FFD7F0" stopOpacity="0.16" />
                      <stop offset="52%" stopColor="#FFFFFF" stopOpacity="0.28" />
                      <stop offset="68%" stopColor="#FFCAD8" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id="cursor-site-star-core" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.7 9.8) rotate(90) scale(11.5 10.2)">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.34" />
                      <stop offset="48%" stopColor="#FFF4F7" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="cursor-site-star-inner-shadow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(15.5 17.8) rotate(-135) scale(13.8 11.4)">
                      <stop offset="0%" stopColor="#1E0208" stopOpacity="0" />
                      <stop offset="62%" stopColor="#250209" stopOpacity="0.04" />
                      <stop offset="100%" stopColor="#1B0107" stopOpacity="0.24" />
                    </radialGradient>
                    <clipPath id="cursor-site-star-clip">
                      <path d="M13 2L15.7 10.3L24 13L15.7 15.7L13 24L10.3 15.7L2 13L10.3 10.3L13 2Z" />
                    </clipPath>
                  </defs>
                  <path d={SITE_STAR_PATH} fill="url(#cursor-site-star-fill)" stroke="rgba(255,255,255,0.26)" strokeWidth="0.42" />
                  <path d="M13 2L15.7 10.3L13 13L10.3 10.3L13 2Z" fill="rgba(255,255,255,0.16)" />
                  <path d="M15.7 10.3L24 13L15.7 15.7L13 13L15.7 10.3Z" fill="rgba(255,196,214,0.18)" />
                  <path d="M10.3 15.7L13 24L15.7 15.7L13 13L10.3 15.7Z" fill="rgba(92,8,24,0.28)" />
                  <path d={SITE_STAR_PATH} fill="url(#cursor-site-star-core)" />
                  <path d={SITE_STAR_PATH} fill="url(#cursor-site-star-inner-shadow)" />
                  <path d={SITE_STAR_PATH} fill="none" stroke="url(#cursor-site-star-bevel)" strokeWidth="0.48" />
                  <path d={SITE_STAR_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.18" />
                  <motion.g clipPath="url(#cursor-site-star-clip)">
                    <motion.rect
                      x="-11" y="-8" width="8" height="42" rx="6"
                      fill="url(#cursor-site-star-prism)"
                      transform="rotate(28 13 13)"
                      animate={state === "site" ? { x: [-11, 23] } : { x: -11 }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.g>
                  <motion.path
                    d="M20.5 4.5L21.15 6.35L23 7L21.15 7.65L20.5 9.5L19.85 7.65L18 7L19.85 6.35L20.5 4.5Z"
                    fill="white"
                    animate={state === "site" ? { opacity: [0.14, 0.56, 0.14] } : { opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.svg>
              </div>
            </motion.div>
          </motion.div>

          {/* ── TEXTE + FLÈCHE (project state) ─────────── */}
          <motion.div
            animate={{
              opacity: spec.textOpacity,
              x:       state === "project" ? 0 : -5,
            }}
            transition={{
              duration: 0.3,
              delay:    state === "project" ? 0.14 : 0,
              ease:     E_TEXT,
            }}
            style={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: "0.4rem",
                color: "#FFFFFF",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              Voir le projet
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18px",
                height: "18px",
                borderRadius: "9999px",
                backgroundColor: "#FC1235",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(252,18,53,0.45)",
              }}
            >
              <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                <path d="M1 9L9 1M9 1H3M9 1V7" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
