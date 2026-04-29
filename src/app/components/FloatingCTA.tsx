import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EVANS_PORTRAIT_ALT, EVANS_PORTRAIT_IMAGE } from "../assets";

const SANS = "'Space Grotesk', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const EASE = [0.22, 1, 0.36, 1] as const;

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /* Apparaît après 120px de scroll */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goToContactPage = () => {
    if (location.pathname === "/contact") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate("/contact");
  };

  return (
    <AnimatePresence>
      {visible && location.pathname !== "/contact" && (
        <motion.button
          key="floating-cta"
          type="button"
          onClick={goToContactPage}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed z-50 flex max-w-[calc(100vw-1rem)] items-center gap-2.5 cursor-pointer sm:gap-3"
          style={{
            bottom: "clamp(0.85rem, 3vw, 2rem)",
            right: "clamp(0.75rem, 3vw, 2rem)",
            padding: "8px clamp(14px, 4vw, 20px) 8px 8px",
            borderRadius: "9999px",
            border: hovered
              ? "1px solid rgba(252,18,53,0.35)"
              : "1px solid rgba(255,255,255,0.08)",
            backgroundColor: hovered
              ? "rgba(8,8,8,0.97)"
              : "rgba(6,6,6,0.94)",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            boxShadow: hovered
              ? "0 0 28px rgba(252,18,53,0.10), 0 16px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)"
              : "0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.025)",
            transform: hovered ? "translateY(-2px)" : "translateY(0)",
            transition:
              "border-color 0.35s ease, background-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease",
          }}
          aria-label="Réserver un appel"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="h-9 w-9 overflow-hidden rounded-full sm:h-10 sm:w-10"
              style={{
                border: hovered
                  ? "1.5px solid rgba(252,18,53,0.5)"
                  : "1.5px solid rgba(252,18,53,0.18)",
                boxShadow: hovered
                  ? "0 0 14px rgba(252,18,53,0.22)"
                  : "0 0 4px rgba(252,18,53,0.06)",
                transition: "border-color 0.35s ease, box-shadow 0.35s ease",
              }}
            >
              <ImageWithFallback
                src={EVANS_PORTRAIT_IMAGE}
                alt={EVANS_PORTRAIT_ALT}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: "50% 20%",
                  filter: "brightness(0.88) contrast(1.04)",
                }}
              />
            </div>
            {/* Indicateur en ligne */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-[1.5px] border-black"
              style={{
                backgroundColor: "#FC1235",
                boxShadow: hovered
                  ? "0 0 8px rgba(252,18,53,0.7)"
                  : "0 0 4px rgba(252,18,53,0.45)",
                transition: "box-shadow 0.35s ease",
              }}
            />
          </div>

          {/* Texte */}
          <div className="flex flex-col items-start">
            <span
              style={{
                fontFamily: SANS,
                fontSize: "clamp(0.82rem, 2.8vw, 0.9rem)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: hovered ? "#fff" : "#D8D8D8",
                lineHeight: 1.2,
                transition: "color 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              Réserver un appel
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: "clamp(0.5rem, 1.8vw, 0.55rem)",
                color: hovered ? "#FC1235" : "#888",
                letterSpacing: "0.02em",
                marginTop: "2px",
                transition: "color 0.3s ease",
                whiteSpace: "nowrap",
              }}
            >
              Parlons de votre projet
            </span>
          </div>

          {/* Flèche */}
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8"
            style={{
              backgroundColor: hovered
                ? "rgba(252,18,53,0.15)"
                : "rgba(255,255,255,0.05)",
              border: hovered
                ? "1px solid rgba(252,18,53,0.3)"
                : "1px solid rgba(255,255,255,0.07)",
              transition:
                "background-color 0.35s ease, border-color 0.35s ease",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                transform: hovered ? "translateX(1px)" : "translateX(0)",
                transition: "transform 0.3s ease",
              }}
            >
              <path
                d="M1 6H11M11 6L7 2M11 6L7 10"
                stroke={hovered ? "#FC1235" : "#888"}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transition: "stroke 0.3s ease" }}
              />
            </svg>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
