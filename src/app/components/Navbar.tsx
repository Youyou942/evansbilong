import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { EVANS_SIGNATURE } from "../assets";

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (id === "accueil") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Accueil",   target: "accueil"  },
    { label: "Projets",   target: "projets"  },
    { label: "À propos",  target: "apropos"  },
    { label: "Services",  target: "services" },
    { label: "Contact",   target: "contact"  },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between"
        style={{
          backgroundColor: scrolled ? "rgba(0,0,0,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(1.4)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.5)" : "none",
          transition: "background-color 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer group flex items-center"
        >
          <span
            className="whitespace-nowrap transition-all duration-300 group-hover:text-white"
            style={{
              fontFamily: SANS,
              fontSize: "0.74rem",
              fontWeight: 500,
              letterSpacing: "0.32em",
              color: "#D0CCC6",
            }}
          >
            {EVANS_SIGNATURE}
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((item, i) => (
            <button
              key={item.target}
              onClick={() => scrollTo(item.target)}
              className="relative group cursor-pointer transition-all duration-300"
              style={{ fontSize: "0.55rem", fontFamily: MONO, color: "#888", letterSpacing: "0.25em" }}
            >
              <span
                className="uppercase transition-colors duration-300 group-hover:text-white"
              >
                <span className="mr-1.5 transition-colors duration-300" style={{ color: "#444" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </span>
              {/* Underline subtil au hover */}
              <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-[#FC1235]/50 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <motion.div
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-6 h-[1px] bg-white origin-center"
          />
          <motion.div
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2 }}
            className="w-6 h-[1px] bg-white"
          />
          <motion.div
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-6 h-[1px] bg-white origin-center"
          />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={
          menuOpen
            ? { opacity: 1, pointerEvents: "auto" as const }
            : { opacity: 0, pointerEvents: "none" as const }
        }
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-40 bg-black/98 flex flex-col items-center justify-center gap-10"
        style={{ backdropFilter: "blur(20px)" }}
      >
        {links.map((item, i) => (
          <motion.button
            key={item.target}
            initial={{ opacity: 0, y: 24 }}
            animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => scrollTo(item.target)}
            className="text-white/80 uppercase tracking-[0.3em] cursor-pointer hover:text-white transition-colors duration-300"
            style={{ fontSize: "1.15rem", fontFamily: SANS, fontWeight: 500 }}
          >
            {item.label}
          </motion.button>
        ))}
      </motion.div>
    </>
  );
}
