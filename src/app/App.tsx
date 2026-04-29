import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useLocation, useNavigationType } from "react-router";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Footer } from "./components/Footer";
import { StickyNav } from "./components/StickyNav";
import { FloatingCTA } from "./components/FloatingCTA";
import { CustomCursor } from "./components/CustomCursor";

/*
 * SectionReveal — wrapper cinématique réutilisable
 * · fade opacity 0 → 1
 * · translateY 24px → 0
 * · easing expo-out [0.16, 1, 0.3, 1]
 * · déclenché une seule fois à l'entrée dans le viewport
 */
function SectionReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        opacity: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] },
        y:       { duration: 1.0,  ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (!location.hash) return;
    if (navigationType === "POP") return;

    const targetId = location.hash.replace("#", "");
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, navigationType]);

  return (
    <div
      className="min-h-screen bg-black"
      style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
    >
      {/* Curseur custom — au-dessus de tout, pointer-events: none */}
      <CustomCursor />

      {/* Navbar sticky globale — au-dessus de tout */}
      <StickyNav />

      {/* CTA flottant persistant — bas droite */}
      <FloatingCTA />

      {/* Hero — pas de SectionReveal, il a ses propres animations d'entrée */}
      <Hero />

      {/* Sections suivantes — révélation cinématique au scroll */}
      <SectionReveal><Projects /></SectionReveal>
      <SectionReveal><About /></SectionReveal>
      <SectionReveal><Services /></SectionReveal>
      <SectionReveal><Footer /></SectionReveal>
    </div>
  );
}
