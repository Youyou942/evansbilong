import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router";

const UI_SANS = "'Inter', sans-serif";
const EASE = [0.22, 1, 0.36, 1] as const;
const MOBILE_NAV_BREAKPOINT = 1024;

/* ─── Bouton "Me Contacter" avec hover #FC1235 ────────────── */
function ContactButton({
  scrolled,
  onClick,
}: {
  scrolled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-1 inline-flex shrink-0 items-center rounded-full whitespace-nowrap active:scale-[0.97]"
      style={{
        fontFamily: UI_SANS,
        fontSize: "clamp(0.82rem, 2.2vw, 0.9375rem)",
        fontWeight: 600,
        letterSpacing: "-0.01em",
        lineHeight: 1,
        paddingInline: "clamp(0.95rem, 3vw, 1.25rem)",
        paddingBlock: "0.7rem",
        backgroundColor: scrolled ? "rgba(255,255,255,0.88)" : "#FFFFFF",
        color: "#1A1A1A",
        boxShadow: scrolled
          ? "none"
          : "0 4px 16px rgba(255,255,255,0.12)",
        transition:
          "background-color 0.3s cubic-bezier(0.22, 1, 0.36, 1), color 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1), transform 0.15s ease",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = "#FC1235";
        event.currentTarget.style.color = "#FFFFFF";
        event.currentTarget.style.boxShadow = "0 6px 22px rgba(252,18,53,0.32)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = scrolled ? "rgba(255,255,255,0.88)" : "#FFFFFF";
        event.currentTarget.style.color = "#1A1A1A";
        event.currentTarget.style.boxShadow = scrolled
          ? "none"
          : "0 4px 16px rgba(255,255,255,0.12)";
      }}
    >
      Me Contacter
    </button>
  );
}

const NAV_LINKS = [
  { label: "Accueil",     target: "accueil"  },
  { label: "Mes projets", target: "projets"  },
  { label: "À propos",    target: "apropos"  },
  { label: "Services",    target: "services" },
] as const;

export function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      /* Ferme le menu mobile au scroll */
      if (window.scrollY > 60) setMobileOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= MOBILE_NAV_BREAKPOINT) {
        setMobileOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const scrollTo = (target: string) => {
    setMobileOpen(false);

    if (target === "contact") {
      if (location.pathname === "/contact") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/contact");
      }
      return;
    }

    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: `#${target}` });
      return;
    }

    if (target === "accueil") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex flex-col items-center px-2.5 pt-3.5 sm:px-4 sm:pt-4 md:pt-5"
      style={{ pointerEvents: "none" }}
    >
      {/* ── Pill nav ─────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
        className="flex max-w-[calc(100vw-1rem)] items-center gap-1 rounded-full px-1.5 py-1.5 sm:px-2 sm:py-2 lg:gap-0.5"
        style={{
          pointerEvents: "auto",
          border: scrolled
            ? "1px solid rgba(255,255,255,0.04)"
            : "1px solid rgba(255,255,255,0.10)",
          backgroundColor: scrolled
            ? "rgba(0,0,0,0.38)"
            : "rgba(0,0,0,0.82)",
          backdropFilter: scrolled
            ? "blur(14px) saturate(1.1)"
            : "blur(20px) saturate(1.3)",
          WebkitBackdropFilter: scrolled
            ? "blur(14px) saturate(1.1)"
            : "blur(20px) saturate(1.3)",
          boxShadow: scrolled
            ? "none"
            : "0 12px 40px rgba(0,0,0,0.55)",
          transition:
            "background-color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease, backdrop-filter 0.5s ease",
        }}
      >
        {/* ── Liens desktop — masqués sur mobile ─────────── */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <button
              key={link.target}
              type="button"
              onClick={() => scrollTo(link.target)}
              className="rounded-full px-4 py-2 transition-all duration-300 hover:bg-white/[0.06]"
              style={{
                fontFamily: UI_SANS,
                fontSize: "0.9375rem",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: scrolled ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.62)",
                transition: "color 0.5s ease",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* ── Hamburger mobile — masqué sur desktop ──────── */}
        <button
          type="button"
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-300 hover:bg-white/[0.06]"
          style={{ color: "rgba(255,255,255,0.72)" }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
          aria-controls="sticky-nav-mobile-menu"
        >
          {mobileOpen ? (
            /* X */
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            /* Hamburger */
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path
                d="M0 1H16M0 6H16M0 11H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        <ContactButton scrolled={scrolled} onClick={() => scrollTo("contact")} />
      </motion.nav>

      {/* ── Menu mobile dropdown ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: EASE }}
            id="sticky-nav-mobile-menu"
            className="lg:hidden mt-2 flex flex-col rounded-2xl overflow-hidden"
            style={{
              pointerEvents: "auto",
              width: "min(32rem, calc(100vw - 1rem))",
              backgroundColor: "rgba(0,0,0,0.94)",
              backdropFilter: "blur(20px) saturate(1.3)",
              WebkitBackdropFilter: "blur(20px) saturate(1.3)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.65)",
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <button
                key={link.target}
                type="button"
                onClick={() => scrollTo(link.target)}
                className="px-5 py-4 text-left transition-colors duration-200 hover:bg-white/[0.04] active:bg-white/[0.06]"
                style={{
                  fontFamily: UI_SANS,
                  fontSize: "1rem",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  color: "rgba(255,255,255,0.72)",
                  borderBottom:
                    i < NAV_LINKS.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                }}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
