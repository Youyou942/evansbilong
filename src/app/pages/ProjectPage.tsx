import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { getProjectBySlug, getAdjacentProjects, PROJECTS } from "../data/projects";
import type { Project } from "../data/projects";
import type { ProjectPageImage } from "../assets";
import { JAPAN_VIDEO } from "../assets";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { StickyNav } from "../components/StickyNav";
import { CustomCursor, setCursorState } from "../components/CustomCursor";

/* ─── Design tokens ──────────────────────────────────────── */
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";
/** Easing expo-out — cinématique, jamais de rebond */
const E = [0.22, 1, 0.36, 1] as const;

const FALLBACK_GALLERY_ASPECTS = ["4 / 3", "3 / 4", "16 / 10", "16 / 10", "16 / 10"];

function getAspectValue(aspect: string): number {
  const [width, height] = aspect.split("/").map((part) => Number(part.trim()));
  if (!width || !height) return 16 / 9;
  return width / height;
}

function getProjectPageImages(project: Project): ProjectPageImage[] {
  if (project.pageImages?.length) {
    return project.pageImages;
  }

  return [
    {
      src: project.image,
      alt: project.title,
      aspect: "16 / 9",
      objectFit: "cover",
      objectPosition: project.objectPosition,
    },
    ...project.gallery.map((src, index) => ({
      src,
      alt: `${project.title} — visuel ${String(index + 1).padStart(2, "0")}`,
      aspect: FALLBACK_GALLERY_ASPECTS[index] ?? "16 / 10",
      objectFit: "cover" as const,
      objectPosition: "center",
    })),
  ];
}

/*
  SYSTÈME VISUEL — 7 moments, 4 traitements d'image distincts :

  ① HERO          — texte pur, grille 12 col, stagger mot-par-mot
  ② OPENING SHOT  — full-bleed bord à bord, fade+scale, parallaxe ±4 %
  ③ CASE STUDY    — texte, 3 blocs staggerés, décalage éditorial
  ④ VISUAL FEATURE— clip-path wipe horizontal (image 7/12 + annotation 5/12)
  ⑤ GALLERY PAIR  — portrait 5/12 + paysage 7/12 décalé, clip-path wipe
  ⑥ CTA           — texte, barre rouge déployante
  ⑦ NAVIGATION    — preview image au hover, titre animé
*/

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = getProjectBySlug(slug ?? "");
  const { prev, next } = getAdjacentProjects(slug ?? "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!project) return <NotFound />;

  return (
    <div className="min-h-screen bg-black overflow-x-hidden" style={{ fontFamily: SANS }}>
      <CustomCursor />
      <StickyNav />
      <main>
        <Hero project={project} />
        <OpeningShot project={project} />
        <CaseStudy project={project} />
        {project.slug !== "sundance" && <VisualFeature project={project} />}
        {project.slug === "0xrui"
          ? <OxruiGallery project={project} />
          : project.slug === "sundance"
          ? <JapanGallery project={project} />
          : <GalleryPair project={project} />
        }
        <LiveSite project={project} />
        <FooterNav prev={prev} next={next} />
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ① HERO — texte pur, grille 12 col
   L'image arrive après — l'impact est différé, intentionnel.
═══════════════════════════════════════════════════════════ */
function Hero({ project }: { project: Project }) {
  const showTopSiteCta = project.slug === "0xrui" && project.externalUrl === "https://0xrui.com";
  const showVideoBtn   = project.slug === "sundance";
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
    {showVideoBtn && <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} src={JAPAN_VIDEO} />}
    <section
      className="mx-auto px-6 md:px-12"
      style={{ maxWidth: "1400px", paddingTop: "clamp(7rem, 14vw, 11rem)", paddingBottom: "clamp(4rem, 8vw, 6rem)" }}
    >
      {/* Barre retour + compteur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: E }}
        className="flex items-center justify-between mb-16 md:mb-20"
      >
        <BackLink />
        <span style={{ fontFamily: MONO, fontSize: "0.44rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.32em", textTransform: "uppercase" }}>
          {project.index} / {String(PROJECTS.length).padStart(2, "0")}
        </span>
      </motion.div>

      {/* Catégorie — ligne rouge + label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: E }}
        className="flex items-center gap-3 mb-10"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: E }}
          style={{ width: "18px", height: "1px", backgroundColor: "#FC1235", transformOrigin: "left" }}
        />
        <span style={{ fontFamily: MONO, fontSize: "0.48rem", color: "#FC1235", letterSpacing: "0.42em", textTransform: "uppercase" }}>
          {project.category}
        </span>
      </motion.div>

      {/* Grille 12 : titre (9) + méta (3) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-end">
        <div className="md:col-span-9">
          <TitleReveal title={project.title} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.6, ease: E }}
          className="md:col-span-3 flex flex-col gap-7"
        >
          <MetaLine label="Année" value={project.year} />
          <MetaLine label="Rôle" value={project.role} />
          {showTopSiteCta && project.externalUrl && <HeroSiteLink url={project.externalUrl} />}
          {showVideoBtn && <VideoBtn onClick={() => setVideoOpen(true)} />}
          <div>
            <span style={{ fontFamily: MONO, fontSize: "0.44rem", color: "#555", letterSpacing: "0.3em", textTransform: "uppercase", display: "block", marginBottom: "0.65rem" }}>
              {project.slug === "sundance" ? "Outils" : "Services"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} style={{ fontFamily: MONO, fontSize: "0.44rem", color: "#C0C0C0", letterSpacing: "0.2em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.13)", padding: "0.35rem 0.65rem", borderRadius: "9999px", lineHeight: 1 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Description — décalée col-start-8 */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.72, ease: E }}
        className="grid grid-cols-1 md:grid-cols-12 mt-14 md:mt-20"
      >
        <div className="md:col-span-5 md:col-start-8">
          <p style={{ fontFamily: SANS, fontSize: "clamp(1rem, 1.25vw, 1.2rem)", lineHeight: 1.65, color: "#B8B8B8", letterSpacing: "-0.005em", margin: 0 }}>
            {project.description}
          </p>
        </div>
      </motion.div>
    </section>
    </>
  );
}

/* ─── Titre — reveal mot par mot (mask vertical) ─────────── */
function TitleReveal({ title }: { title: string }) {
  const words = title.split(" ");
  return (
    <h1
      aria-label={title}
      style={{ fontFamily: SANS, fontSize: "clamp(3rem, 10vw, 9.5rem)", fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 0.9, color: "#FFFFFF", margin: 0 }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: "0.06em" }}>
          <motion.span
            className="inline-block"
            initial={{ y: "108%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.05, delay: 0.2 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}{i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/* ─── Bouton "Voir la vidéo" ─────────────────────────────── */
function VideoBtn({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        alignSelf: "flex-start",
        padding: "0.65rem 1rem 0.65rem 0.85rem",
        borderRadius: "4px",
        border: hover ? "1px solid #FC1235" : "1px solid rgba(255,255,255,0.1)",
        backgroundColor: hover ? "#FC1235" : "rgba(255,255,255,0.04)",
        boxShadow: hover ? "0 0 22px rgba(252,18,53,0.22)" : "none",
        transform: hover ? "scale(1.03)" : "scale(1)",
        transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: "0.46rem", color: "#fff", letterSpacing: "0.22em", textTransform: "uppercase", lineHeight: 1, fontWeight: 500 }}>
        Voir la vidéo
      </span>
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, opacity: hover ? 1 : 0.65, transition: "opacity 0.25s" }}>
        <path d="M3 2L8 5L3 8V2Z" fill="white" />
      </svg>
    </button>
  );
}

/* ─── Modal vidéo ────────────────────────────────────────── */
function VideoModal({ open, onClose, src }: { open: boolean; onClose: () => void; src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Fermer avec Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* Pause + reset à la fermeture */
  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full"
        style={{ maxWidth: "min(92vw, 1100px)", padding: "0 1rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-4 flex items-center gap-2 group"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <span style={{ fontFamily: MONO, fontSize: "0.44rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.3em", textTransform: "uppercase" }}
            className="group-hover:text-white transition-colors duration-300">
            Fermer
          </span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/[0.15] group-hover:border-white/40 transition-all duration-300">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M1 1L8 8M8 1L1 8" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </span>
        </button>

        {/* Vidéo */}
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay={false}
          playsInline
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            borderRadius: "2px",
            outline: "none",
            backgroundColor: "#000",
          }}
        />
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/#projets" className="group inline-flex items-center gap-2.5" style={{ textDecoration: "none" }}>
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.15] group-hover:border-white/40 group-hover:bg-white/[0.04] transition-all duration-300">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M8 5H2M2 5L5 2M2 5L5 8" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span style={{ fontFamily: MONO, fontSize: "0.46rem", color: "rgba(255,255,255,0.42)", letterSpacing: "0.3em", textTransform: "uppercase" }}
        className="group-hover:text-white/75 transition-colors duration-300">
        Tous les projets
      </span>
    </Link>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={{ fontFamily: MONO, fontSize: "0.44rem", color: "#555", letterSpacing: "0.3em", textTransform: "uppercase", lineHeight: 1 }}>{label}</span>
      <span style={{ fontFamily: SANS, fontSize: "0.92rem", fontWeight: 500, color: "#E0E0E0", letterSpacing: "-0.005em", lineHeight: 1.3 }}>{value}</span>
    </div>
  );
}

function HeroSiteLink({ url }: { url: string }) {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    return () => {
      setCursorState("default");
    };
  }, []);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => {
        setHover(true);
        setCursorState("site");
      }}
      onMouseLeave={() => {
        setHover(false);
        setCursorState("default");
      }}
      style={{
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        alignSelf: "flex-start",
        padding: "0.65rem 1rem 0.65rem 0.85rem",
        borderRadius: "4px",
        border: hover ? "1px solid #FC1235" : "1px solid rgba(255,255,255,0.1)",
        backgroundColor: hover ? "#FC1235" : "rgba(255,255,255,0.04)",
        boxShadow: hover ? "0 0 22px rgba(252,18,53,0.22)" : "none",
        transform: hover ? "scale(1.03)" : "scale(1)",
        transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: "0.46rem", color: "#fff", letterSpacing: "0.22em", textTransform: "uppercase", lineHeight: 1, fontWeight: 500 }}>
        Voir le site
      </span>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: hover ? 1 : 0.65, transition: "opacity 0.25s, transform 0.25s", transform: hover ? "translate(1px, -1px)" : "translate(0,0)" }}>
        <path d="M1 11L11 1M11 1H5M11 1V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════
   ② OPENING SHOT — full-bleed, fade+scale, parallaxe ±4 %
   Pas de padding — l'image casse le conteneur.
═══════════════════════════════════════════════════════════ */
function OpeningShot({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const openingImage = getProjectPageImages(project)[0];
  const openingAspect = getAspectValue(openingImage?.aspect ?? "16 / 9");
  const openingHeight = openingImage?.objectFit === "contain"
    ? `min(calc(100vw / ${openingAspect}), 840px)`
    : "min(86vh, 840px)";

  /* Parallaxe très subtil — ±4 % seulement */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const y = useSpring(rawY, { stiffness: 55, damping: 28, mass: 1 });

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-black" style={{ height: openingHeight }}>
      {/* Fade-in + léger dézoom à l'entrée */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div className="absolute inset-0" style={{ y }}>
          <ImageWithFallback
            src={openingImage?.src ?? project.image}
            alt={openingImage?.alt ?? project.title}
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: openingImage?.objectFit ?? "cover",
              objectPosition: openingImage?.objectPosition ?? project.objectPosition,
              filter: "brightness(0.68) contrast(1.06) saturate(0.88)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Vignette haut + bas */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, transparent 22%, transparent 70%, rgba(0,0,0,0.92) 100%)" }} />

      {/* Numéro filigrane bas-droite */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 2, delay: 0.6, ease: E }}
        className="absolute select-none pointer-events-none"
        style={{ right: "clamp(1.5rem, 4vw, 3.5rem)", bottom: "clamp(1rem, 3vw, 2.5rem)" }}
      >
        <span style={{ fontFamily: SANS, fontSize: "clamp(5rem, 12vw, 11rem)", fontWeight: 700, color: "rgba(255,255,255,0.06)", lineHeight: 1, letterSpacing: "-0.055em" }}>
          {project.index}
        </span>
      </motion.div>

    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ③ CASE STUDY — 3 blocs staggerés, décalage éditorial
═══════════════════════════════════════════════════════════ */
function CaseStudy({ project }: { project: Project }) {
  const blocks = [
    { num: "i.",   label: "Problème", text: project.caseStudy.problem },
    { num: "ii.",  label: "Solution", text: project.caseStudy.solution },
    { num: "iii.", label: "Résultat", text: project.caseStudy.result },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      ref={ref}
      className="mx-auto px-6 md:px-12"
      style={{ maxWidth: "1400px", paddingTop: "clamp(6rem, 12vw, 10rem)", paddingBottom: "clamp(5rem, 10vw, 8rem)" }}
    >
      {/* En-tête de chapitre */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: E }}
        className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 md:mb-24"
      >
        <div className="md:col-span-3 flex items-center gap-3">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, ease: E }}
            style={{ width: "18px", height: "1px", backgroundColor: "#FC1235", transformOrigin: "left" }}
          />
          <span style={{ fontFamily: MONO, fontSize: "0.48rem", color: "#FC1235", letterSpacing: "0.42em", textTransform: "uppercase" }}>
            Étude de cas
          </span>
        </div>
        <div className="md:col-span-7 md:col-start-5">
          <h2 style={{ fontFamily: SANS, fontSize: "clamp(1.6rem, 3.5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, color: "rgba(255,255,255,0.9)", margin: 0, maxWidth: "24ch" }}>
            Ce qu'il fallait régler. Ce qu'on a fait. Ce que ça change.
          </h2>
        </div>
      </motion.div>

      {blocks.map((block, i) => (
        <CaseBlock key={block.label} block={block} index={i} />
      ))}
    </section>
  );
}

function CaseBlock({ block, index }: { block: { num: string; label: string; text: string }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-18%" });
  /* Décalage du 2ᵉ bloc — pas de danse éditorial */
  const offset = index === 1 ? "md:col-start-3" : "md:col-start-1";

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 border-t border-white/[0.07]">
      {/* Numéro romain */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.55, ease: E }}
        className={`md:col-span-1 ${offset}`}
      >
        <span style={{ fontFamily: MONO, fontSize: "0.52rem", color: "rgba(252,18,53,0.65)", letterSpacing: "0.18em", fontStyle: "italic" }}>
          {block.num}
        </span>
      </motion.div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.07, ease: E }}
        className="md:col-span-3"
      >
        <h3 style={{ fontFamily: SANS, fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1, color: "#FFFFFF", margin: 0 }}>
          {block.label}
        </h3>
      </motion.div>

      {/* Corps */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, delay: 0.14, ease: E }}
        className="md:col-span-6"
      >
        <p style={{ fontFamily: SANS, fontSize: "clamp(0.95rem, 1.15vw, 1.05rem)", lineHeight: 1.75, color: "#BFBFBF", letterSpacing: "-0.005em", margin: 0 }}>
          {block.text}
        </p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ④ VISUAL FEATURE — clip-path wipe horizontal
   Image 7/12 + annotation 5/12 côte à côte.
   Traitement : wipe de gauche à droite (éditorial).
═══════════════════════════════════════════════════════════ */
function VisualFeature({ project }: { project: Project }) {
  const img = getProjectPageImages(project)[1];
  if (!img) return null;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="mx-auto px-6 md:px-12"
      style={{ maxWidth: "1400px", paddingTop: "clamp(2rem, 4vw, 3rem)", paddingBottom: "clamp(5rem, 10vw, 8rem)" }}
    >
      {/* Séparateur animé */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.0, ease: E }}
        className="h-px bg-white/[0.07] origin-left mb-14 md:mb-20"
      />

      <div className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: E }}
          className="w-full"
        >
          {img.objectFit === "contain"
            ? <NaturalImage image={img} direction="left" />
            : <ClipImage image={img} direction="left" />
          }
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ⑤-bis OXRUI GALLERY — layout éditorial premium
   Structure :
     A. Full-width : Figures Xrui (identité visuelle)
     B. Duo 2 col  : Mockup 0XRUI (gauche) + Panier Xrui (droite)
     C. Full-width : Contact Xrui
     D. Mobile centré : Mockup 2 Xrui
═══════════════════════════════════════════════════════════ */
function OxruiGallery({ project }: { project: Project }) {
  const imgs = getProjectPageImages(project);
  // imgs[0] = Hero Xrui (opening shot, déjà utilisé)
  // imgs[1] = Figures 2 Xrui (planche 01, déjà utilisé dans VisualFeature)
  // imgs[2] = Figures Xrui
  // imgs[3] = Mockup 0XRUI
  // imgs[4] = Panier Xrui
  // imgs[5] = Contact Xrui
  // imgs[6] = Mockup 2 Xrui (mobile)
  const figuresXrui  = imgs[2];
  const mockup0xrui  = imgs[3];
  const panierXrui   = imgs[4];
  const contactXrui  = imgs[5];
  const mobileXrui   = imgs[6];

  const refA = useRef<HTMLDivElement>(null);
  const refB = useRef<HTMLDivElement>(null);
  const refC = useRef<HTMLDivElement>(null);
  const refD = useRef<HTMLDivElement>(null);
  const inViewA = useInView(refA, { once: true, margin: "-8%" });
  const inViewB = useInView(refB, { once: true, margin: "-8%" });
  const inViewC = useInView(refC, { once: true, margin: "-8%" });
  const inViewD = useInView(refD, { once: true, margin: "-8%" });

  return (
    <div>
      {/* ── A. Full-width : Figures Xrui ── */}
      {figuresXrui && (
        <div
          className="mx-auto px-6 md:px-12"
          style={{ maxWidth: "1400px", paddingTop: "clamp(3rem, 6vw, 5rem)", marginBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <NaturalImage image={figuresXrui} direction="left" delay={0} />
        </div>
      )}

      {/* ── B. Duo 2 colonnes : Mockup + Panier ── */}
      {(mockup0xrui || panierXrui) && (
        <div
          ref={refB}
          className="mx-auto px-6 md:px-12"
          style={{ maxWidth: "1400px", marginBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {mockup0xrui && (
              <div>
                <NaturalImage image={mockup0xrui} direction="left" delay={0} />
              </div>
            )}
            {panierXrui && (
              <div className="md:pt-16">
                <NaturalImage image={panierXrui} direction="right" delay={0.14} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── C. Full-width : Contact Xrui ── */}
      {contactXrui && (
        <div
          ref={refC}
          className="mx-auto px-6 md:px-12"
          style={{ maxWidth: "1400px", marginBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <NaturalImage image={contactXrui} direction="left" delay={0} />
        </div>
      )}

      {/* ── D. Mobile centré : Mockup 2 Xrui ── */}
      {mobileXrui && (
        <div
          ref={refD}
          className="mx-auto px-6 md:px-12"
          style={{ maxWidth: "1400px", paddingBottom: "clamp(6rem, 12vw, 10rem)" }}
        >
          {/* Séparateur fin avant le mobile */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inViewD ? { scaleX: 1 } : {}}
            transition={{ duration: 1.0, ease: E }}
            className="h-px bg-white/[0.06] origin-left mb-14 md:mb-20"
          />
          <div style={{ maxWidth: "min(100%, 26rem)", marginInline: "auto" }}>
            <NaturalImage image={{ ...mobileXrui, maxWidth: undefined }} direction="left" delay={0} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ⑤-ter JAPAN GALLERY — layout éditorial Japan Airlines
   Flux conservé :
     A. Full-width : Maquette homepage
     B. Full-width : Mockup device
     C. Duo 2 col  : Cards solo + Cartes jp
     D. Full-width : Chartes graphiques
     E. Full-width : Variantes logo
   Les exports dupliqués ont été retirés à la source pour éviter
   toute répétition visuelle plus bas dans la page.
═══════════════════════════════════════════════════════════ */
function JapanGallery({ project }: { project: Project }) {
  const imgs = getProjectPageImages(project);
  // imgs[0] = Logo Jp        (opening shot — déjà utilisé dans OpeningShot)
  // imgs[1] = Maquette Jp    (affiché ici — VisualFeature skippé pour sundance)
  // imgs[2] = Mockup Jp
  // imgs[3] = Cards solo Jp
  // imgs[4] = Cartes jp
  // imgs[5] = Chartes Jp
  // imgs[6] = Variantes logo
  const maquetteJp   = imgs[1];
  const mockupJp     = imgs[2];
  const cardsSolo    = imgs[3];
  const cartesJp     = imgs[4];
  const chartesJp    = imgs[5];
  const variantesLogo = imgs[6];

  const gap = "clamp(3rem, 6vw, 5rem)";

  return (
    <div>
      {/* ── A. Full-width : Maquette Jp (VisualFeature skippé pour sundance) ── */}
      {maquetteJp && (
        <div
          className="mx-auto px-6 md:px-12"
          style={{ maxWidth: "1400px", paddingTop: gap, marginBottom: gap }}
        >
          <NaturalImage image={maquetteJp} direction="left" delay={0} />
        </div>
      )}

      {/* ── B. Full-width : Mockup Jp ── */}
      {mockupJp && (
        <div
          className="mx-auto px-6 md:px-12"
          style={{ maxWidth: "1400px", marginBottom: gap }}
        >
          <NaturalImage image={mockupJp} direction="left" delay={0} />
        </div>
      )}

      {/* ── C. Duo 2 col : Cards solo + Cartes jp ── */}
      {(cardsSolo || cartesJp) && (
        <div
          className="mx-auto px-6 md:px-12"
          style={{ maxWidth: "1400px", marginBottom: gap }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {cardsSolo && (
              <div>
                <NaturalImage image={cardsSolo} direction="left" delay={0} />
              </div>
            )}
            {cartesJp && (
              <div className="md:pt-12">
                <NaturalImage image={cartesJp} direction="right" delay={0.12} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── D. Full-width : Chartes graphiques ── */}
      {chartesJp && (
        <div
          className="mx-auto px-6 md:px-12"
          style={{ maxWidth: "1400px", marginBottom: gap }}
        >
          <NaturalImage image={chartesJp} direction="left" delay={0} />
        </div>
      )}

      {/* ── E. Full-width : Variantes logo ── */}
      {variantesLogo && (
        <div
          className="mx-auto px-6 md:px-12"
          style={{ maxWidth: "1400px", paddingBottom: "clamp(6rem, 12vw, 10rem)" }}
        >
          <NaturalImage image={variantesLogo} direction="left" delay={0} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ⑤ GALLERY PAIR — portrait 5/12 + paysage 7/12 décalé
   Deux images en tension visuelle, clip-path wipe.
═══════════════════════════════════════════════════════════ */
function GalleryPair({ project }: { project: Project }) {
  const galleryImages = getProjectPageImages(project).slice(2);
  const img1 = galleryImages[0];
  const img2 = galleryImages[1];
  const extraImages = galleryImages.slice(2);

  if (!img1 && !img2 && extraImages.length === 0) return null;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <section
      ref={ref}
      className="mx-auto px-6 md:px-12"
      style={{ maxWidth: "1400px", paddingTop: "clamp(3rem, 6vw, 5rem)", paddingBottom: "clamp(6rem, 12vw, 10rem)" }}
    >
      {/* Duo asymétrique — portrait + paysage décalé */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
        {/* Portrait — 5 col, ratio 3/4 */}
        {img1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, ease: E }}
            className="md:col-span-5"
          >
            <ClipImage image={img1} direction="left" delay={0} />
          </motion.div>
        )}

        {/* Paysage — 7 col, ratio 16/10, décalé vers le bas */}
        {img2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.15, ease: E }}
            className="md:col-span-7 md:pt-24"
          >
            <ClipImage image={img2} direction="right" delay={0.15} />
          </motion.div>
        )}
      </div>

      {extraImages.length > 0 && (
        <div className="mt-8 md:mt-12 flex flex-col gap-8 md:gap-12">
          {extraImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.08, ease: E }}
            >
              <ClipImage image={image} direction={index % 2 === 0 ? "left" : "right"} delay={0.2 + index * 0.08} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── ClipImage — wipe horizontal (gauche ou droite) ─────── */
function ClipImage({
  image, direction = "left", delay = 0,
}: {
  image: ProjectPageImage;
  direction?: "left" | "right";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const [hover, setHover] = useState(false);

  /* Wipe : inset(0 100% 0 0) → inset(0 0% 0 0) pour gauche
            inset(0 0% 0 100%) → inset(0 0% 0 0%) pour droite */
  const clipStart = direction === "left" ? "inset(0 100% 0 0)" : "inset(0 0% 0 100%)";
  const clipEnd   = "inset(0 0% 0 0%)";

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-[#050505]"
      style={{
        aspectRatio: image.aspect,
        maxWidth: image.maxWidth,
        marginInline: image.maxWidth ? "auto" : undefined,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Clip-path wipe — révèle l'image de gauche à droite */}
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: clipStart }}
        animate={inView ? { clipPath: clipEnd } : {}}
        transition={{ duration: 1.05, delay, ease: E }}
      >
        {/* Zoom lent simultané */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 1.7, delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Hover scale */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hover ? 1.03 : 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageWithFallback
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: image.objectFit ?? "cover",
                objectPosition: image.objectPosition ?? "center",
                filter: hover
                  ? "brightness(0.88) contrast(1.05) saturate(0.92)"
                  : "brightness(0.76) contrast(1.05) saturate(0.88)",
                transition: "filter 0.55s ease",
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── NaturalImage — affiche l'image à son ratio naturel ─── */
/* Utilisé pour les images 0XRUI (contain) : pas de conteneur
   à hauteur fixe, l'image définit elle-même sa hauteur.      */
function NaturalImage({
  image, direction = "left", delay = 0,
}: {
  image: ProjectPageImage;
  direction?: "left" | "right";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const clipStart = direction === "left" ? "inset(0 100% 0 0)" : "inset(0 0% 0 100%)";
  const clipEnd   = "inset(0 0% 0 0%)";

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: clipStart, opacity: 0 }}
      animate={inView ? { clipPath: clipEnd, opacity: 1 } : {}}
      transition={{ duration: 1.05, delay, ease: E }}
      style={{
        width: "100%",
        maxWidth: image.maxWidth ?? "100%",
        marginInline: image.maxWidth ? "auto" : undefined,
      }}
    >
      <motion.div
        initial={{ scale: 1.04 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 1.7, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        <ImageWithFallback
          src={image.src}
          alt={image.alt}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            objectFit: "contain",
            objectPosition: "center",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ⑥ CTA — baseline de fin de chapitre
   Affiché uniquement si externalUrl est défini.
═══════════════════════════════════════════════════════════ */
function LiveSite({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  if (!project.externalUrl) return null;

  return (
    <section
      ref={ref}
      className="mx-auto px-6 md:px-12"
      style={{ maxWidth: "1400px", paddingTop: "clamp(4rem, 8vw, 6rem)", paddingBottom: "clamp(6rem, 12vw, 10rem)" }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.0, ease: E }}
        className="h-px bg-white/[0.07] origin-left"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 pt-14 md:pt-20">
        {/* Texte — 7 col */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: E }}
          className="md:col-span-7 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: E }}
              style={{ width: "18px", height: "1px", backgroundColor: "#FC1235", transformOrigin: "left" }}
            />
            <span style={{ fontFamily: MONO, fontSize: "0.48rem", color: "#FC1235", letterSpacing: "0.42em", textTransform: "uppercase" }}>
              En ligne
            </span>
          </div>
          <h2 style={{ fontFamily: SANS, fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1, color: "#FFFFFF", margin: 0, maxWidth: "14ch" }}>
            Découvrez {project.title}.
          </h2>
          <p style={{ fontFamily: SANS, fontSize: "1rem", lineHeight: 1.7, color: "#9A9A9A", letterSpacing: "-0.005em", margin: 0, maxWidth: "42ch" }}>
            Le projet se comprend mieux en le parcourant. Tout est en place.
          </p>
          <LiveLink url={project.externalUrl} projectSlug={project.slug} />
        </motion.div>

        {/* URL brute — 4 col, alignée à droite */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.12, ease: E }}
          className="md:col-span-4 md:col-start-9 flex flex-col gap-4 md:items-end md:text-right"
        >
          <span style={{ fontFamily: MONO, fontSize: "0.44rem", color: "#555", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Adresse
          </span>
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: MONO, fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.13)", paddingBottom: "3px" }}
            className="hover:text-white hover:border-white/45 transition-colors duration-300"
          >
            {project.externalUrl.replace(/^https?:\/\//, "")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Bouton "Voir le site" — barre rouge déployante ─────── */
function LiveLink({ url, projectSlug }: { url: string; projectSlug: string }) {
  const [hover, setHover] = useState(false);
  const isSpecial0xruiLink = projectSlug === "0xrui" && url === "https://0xrui.com";

  useEffect(() => {
    return () => {
      setCursorState("default");
    };
  }, []);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => {
        setHover(true);
        if (isSpecial0xruiLink) setCursorState("site");
      }}
      onMouseLeave={() => {
        setHover(false);
        if (isSpecial0xruiLink) setCursorState("default");
      }}
      className="inline-flex items-center gap-4 mt-2 self-start relative"
      style={{
        textDecoration: "none",
        padding: "0.95rem 0.8rem 0.95rem 0.2rem",
        borderTop: "1px solid rgba(255,255,255,0.15)",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        minWidth: "260px",
        overflow: "hidden",
      }}
    >
      <span
        className="absolute inset-0 pointer-events-none"
        style={{ width: hover ? "100%" : "0%", backgroundColor: "rgba(252,18,53,0.09)", transition: "width 0.55s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      <span style={{ fontFamily: SANS, fontSize: "0.98rem", fontWeight: 500, color: "#FFFFFF", letterSpacing: "-0.01em", flex: 1, position: "relative", zIndex: 1 }}>
        Voir le site en ligne
      </span>
      <span
        className="relative z-10 inline-flex items-center justify-center rounded-full"
        style={{
          width: "34px", height: "34px",
          backgroundColor: hover ? "#FC1235" : "transparent",
          border: hover ? "1px solid #FC1235" : "1px solid rgba(255,255,255,0.2)",
          transform: hover ? "translateX(3px)" : "translateX(0)",
          transition: "all 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 13 13" fill="none">
          <path d="M1 12L12 1M12 1H5M12 1V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════
   ⑦ NAVIGATION — preview image au hover, titre animé
═══════════════════════════════════════════════════════════ */
function FooterNav({ prev, next }: { prev: Project | null; next: Project | null }) {
  return (
    <nav className="border-t border-white/[0.07]" aria-label="Navigation entre projets">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {prev && <NavCard project={prev} direction="prev" />}
        {!prev && <div className="hidden md:block" />}
        {next && <NavCard project={next} direction="next" />}
      </div>
      <div className="border-t border-white/[0.07]">
        <div className="mx-auto px-6 md:px-12 flex items-center justify-between py-9" style={{ maxWidth: "1400px" }}>
          <Link to="/#projets" className="group" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: MONO, fontSize: "0.46rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.32em", textTransform: "uppercase" }}
              className="group-hover:text-white transition-colors duration-300">
              ← Retour aux projets ({PROJECTS.length})
            </span>
          </Link>
          <span style={{ fontFamily: MONO, fontSize: "0.44rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Evans Bilong · Portfolio
          </span>
        </div>
      </div>
    </nav>
  );
}

function NavCard({ project, direction }: { project: Project; direction: "prev" | "next" }) {
  const [hover, setHover] = useState(false);
  const isNext = direction === "next";

  return (
    <Link
      to={`/projects/${project.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative block overflow-hidden ${isNext ? "md:border-l border-white/[0.07]" : "border-b md:border-b-0 border-white/[0.07]"}`}
      style={{ textDecoration: "none", padding: "clamp(2.5rem, 6vw, 4.5rem) clamp(1.5rem, 4vw, 3rem)", minHeight: "250px" }}
    >
      {/* Preview image — fade-in au hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hover ? 0.3 : 0 }}
        transition={{ duration: 0.6, ease: E }}
      >
        <ImageWithFallback
          src={project.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: project.objectPosition, filter: "brightness(0.5) contrast(1.1) saturate(0.8)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.88) 100%)" }} />
      </motion.div>

      <div className={`relative z-10 flex flex-col gap-3.5 ${isNext ? "md:items-end md:text-right" : ""}`}>
        <span style={{ fontFamily: MONO, fontSize: "0.46rem", letterSpacing: "0.32em", textTransform: "uppercase", transition: "color 0.3s ease", color: hover ? "#FC1235" : "#555" }}>
          {isNext ? "Projet suivant →" : "← Projet précédent"}
        </span>
        <motion.span
          animate={{ x: hover ? (isNext ? -5 : 5) : 0, color: hover ? "#FFFFFF" : "rgba(255,255,255,0.36)" }}
          transition={{ duration: 0.42, ease: E }}
          style={{ fontFamily: SANS, fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1, display: "block" }}
        >
          {project.title}
        </motion.span>
        <span style={{ fontFamily: MONO, fontSize: "0.44rem", letterSpacing: "0.28em", textTransform: "uppercase", transition: "color 0.3s ease", color: hover ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}>
          {project.index} · {project.year}
        </span>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   404
═══════════════════════════════════════════════════════════ */
function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6">
        <span style={{ fontFamily: MONO, fontSize: "0.48rem", color: "#FC1235", letterSpacing: "0.42em", textTransform: "uppercase" }}>
          Projet introuvable
        </span>
        <Link to="/" style={{ fontFamily: SANS, fontSize: "0.95rem", fontWeight: 500 }}
          className="text-white/60 hover:text-white transition-colors duration-300">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
