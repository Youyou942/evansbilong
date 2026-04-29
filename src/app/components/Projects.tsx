import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PROJECTS } from "../data/projects";
import type { Project } from "../data/projects";
import { setCursorState } from "./CustomCursor";

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Bloc projet individuel ──────────────────────────────── */
function ProjectBlock({
  project,
  index: i,
}: {
  project: Project;
  index: number;
}) {
  const blockRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    return () => {
      setCursorState("default");
    };
  }, []);

  const isInView = useInView(blockRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });

  const rawImageY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const imageY = useSpring(rawImageY, { stiffness: 55, damping: 22, mass: 0.9 });

  const rawImageScale = useTransform(scrollYProgress, [0, 0.4], [1.07, 1]);
  const imageScale = useSpring(rawImageScale, { stiffness: 50, damping: 24, mass: 1 });

  const isEven = i % 2 === 0;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE },
    },
  };

  return (
    <Link
      ref={blockRef}
      to={`/projects/${project.slug}`}
      aria-label={`Voir le projet ${project.title}`}
      className="group relative block w-full"
      style={{ cursor: "none", textDecoration: "none" }}
      onMouseEnter={() => { setHovered(true); setCursorState("project"); }}
      onMouseLeave={() => { setHovered(false); setCursorState("default"); }}
    >
      {/* Séparateur */}
      <motion.div
        className="h-px w-full"
        style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
        initial={{ scaleX: 0, originX: isEven ? 0 : 1 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE }}
      />

      <div
        className="relative flex flex-col lg:flex-row lg:h-[min(72vw,780px)]"
      >
        {/* ── IMAGE ── */}
        <div
          className={`relative overflow-hidden flex-shrink-0 h-[clamp(18rem,62vw,34rem)] sm:h-[clamp(22rem,56vw,38rem)] lg:h-full w-full lg:w-[65%] ${isEven ? "lg:order-1" : "lg:order-2"}`}
        >
          {/* Fade-in wrapper */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, ease: EASE }}
          >
            {/* Parallax + hover scale */}
            <motion.div
              className="absolute inset-0"
              style={{ y: imageY, scale: imageScale }}
              animate={{ scale: hovered ? 1.022 : 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ImageWithFallback
                src={project.coverImage ?? project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: project.objectPosition,
                  filter: hovered
                    ? "brightness(0.68) contrast(1.1) saturate(0.88)"
                    : "brightness(0.58) contrast(1.08) saturate(0.82)",
                  transition: "filter 0.4s ease",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Fondu latéral — vers le panneau texte */}
          <div
            className="absolute inset-0 z-10 hidden lg:block pointer-events-none"
            style={{
              background: isEven
                ? "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.97) 100%)"
                : "linear-gradient(to left,  rgba(0,0,0,0) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.97) 100%)",
            }}
          />
          <div
            className="absolute inset-0 z-10 lg:hidden pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.18) 32%, rgba(0,0,0,0) 62%)",
            }}
          />

          {/* Fondu haut */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, transparent 18%)",
            }}
          />

          {/* Fondu bas */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 22%)",
            }}
          />

          {/* Lueur rouge — côté opposé au texte */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: isEven
                ? "radial-gradient(ellipse 45% 55% at 18% 55%, rgba(252,18,53,0.055) 0%, transparent 65%)"
                : "radial-gradient(ellipse 45% 55% at 82% 55%, rgba(252,18,53,0.055) 0%, transparent 65%)",
            }}
          />

          {/* Numéro filigrane */}
          <div
            className="absolute z-10 pointer-events-none select-none"
            style={{
              bottom: 0,
              [isEven ? "left" : "right"]: "clamp(1rem, 3vw, 2.5rem)",
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1.6, delay: 0.25, ease: EASE }}
              style={{
                fontFamily: SANS,
                fontSize: "clamp(4.5rem, 17vw, 13rem)",
                fontWeight: 700,
                color: "rgba(255,255,255,0.028)",
                lineHeight: 1,
                letterSpacing: "-0.06em",
                display: "block",
              }}
            >
              {project.index}
            </motion.span>
          </div>
        </div>

        {/* ── TEXTE ── */}
        <motion.div
          className={`relative z-20 flex flex-col justify-center bg-black flex-1 ${
            isEven ? "lg:order-2" : "lg:order-1"
          }`}
          style={{
            padding: "clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 5vw, 4.5rem)",
          }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Catégorie */}
          <motion.div variants={itemVariants} className="flex items-center gap-2.5 mb-6 sm:mb-9">
            <div
              style={{
                width: "18px",
                height: "1px",
                backgroundColor: "#FC1235",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: "0.47rem",
                color: "#FC1235",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {project.category}
            </span>
          </motion.div>

          {/* Titre */}
          <motion.h3
            variants={itemVariants}
            style={{
              fontFamily: SANS,
              fontSize: "clamp(1.9rem, 7vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.96,
              color: "#FFFFFF",
              margin: 0,
              marginBottom: "clamp(1rem, 4vw, 1.5rem)",
            }}
          >
            {project.title}
          </motion.h3>

          {/* Séparateur titre/description */}
          <motion.div
            variants={itemVariants}
            style={{
              width: "28px",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.09)",
              marginBottom: "clamp(1rem, 3vw, 1.25rem)",
            }}
          />

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="max-w-[34ch] lg:max-w-[28ch]"
            style={{
              fontFamily: SANS,
              fontSize: "clamp(0.92rem, 2.2vw, 0.98rem)",
              lineHeight: 1.8,
              color: "#5A5A5A",
              margin: 0,
              marginBottom: "clamp(2rem, 5vw, 2.75rem)",
            }}
          >
            {project.description}
          </motion.p>

          {/* CTA — lien vers la page projet */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-3 self-start">
              <div
                className="flex items-center justify-center rounded-full transition-all duration-500"
                style={{
                  width: "36px",
                  height: "36px",
                  border: hovered ? "1px solid #FC1235" : "1px solid rgba(252,18,53,0.22)",
                  backgroundColor: hovered ? "#FC1235" : "transparent",
                  boxShadow: hovered ? "0 0 18px rgba(252,18,53,0.28)" : "none",
                  flexShrink: 0,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M1 12L12 1M12 1H5M12 1V8"
                    stroke="#FC1235"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:stroke-white transition-all duration-300"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.48rem",
                  color: "#4A4A4A",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
                className="group-hover:text-white transition-colors duration-300"
              >
                Voir le projet
              </span>
            </div>
          </motion.div>

          {/* Année — alignée en bas du panneau */}
          <motion.span
            variants={itemVariants}
            className="hidden lg:block"
            style={{
              fontFamily: MONO,
              fontSize: "0.44rem",
              color: "#2E2E2E",
              letterSpacing: "0.2em",
              position: "absolute",
              bottom: "clamp(1.5rem, 3vw, 2.5rem)",
              [isEven ? "right" : "left"]: "clamp(2rem, 5vw, 4.5rem)",
              lineHeight: 1,
            }}
          >
            {project.year}
          </motion.span>
        </motion.div>
      </div>
    </Link>
  );
}

/* ─── Section principale ──────────────────────────────────── */
export function Projects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section id="projets" className="bg-black relative">
      {/* ── Header ── */}
      <div
        ref={headerRef}
        style={{
          padding: "clamp(4.5rem, 10.5vw, 8.75rem) clamp(1.25rem, 6.9vw, 6.25rem) clamp(2.25rem, 4.75vw, 3.75rem)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}
        >
          <div
            style={{
              width: "18px",
              height: "1px",
              backgroundColor: "#FC1235",
              boxShadow: "0 0 5px rgba(252,18,53,0.35)",
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
            Projets choisis
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          style={{
            fontFamily: SANS,
            fontSize: "clamp(2rem, 4.6vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Des projets qui comptent.
        </motion.h2>
      </div>

      {/* ── Blocs empilés ── */}
      <div>
        {PROJECTS.map((project, i) => (
          <ProjectBlock key={project.slug} project={project} index={i} />
        ))}
        {/* Séparateur final */}
        <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.07)" }} />
      </div>
    </section>
  );
}
