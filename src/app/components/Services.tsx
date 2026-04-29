import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

/* ─── Polices (cohérentes avec le reste du portfolio) ─────── */
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";
const DOTO = "'Doto', monospace";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Données ─────────────────────────────────────────────── */
type Service = {
  id: string;
  index: string;
  title: string;
  discipline: string;
  summary: string;
  /* Fiche méta affichée dans le panneau gauche quand ce service est actif */
  meta: {
    output: string;
    tools: string;
    delivery: string;
  };
};

const SERVICES: Service[] = [
  {
    id: "web",
    index: "01",
    title: "Web Design",
    discipline: "Sites · Landing · Éditorial",
    summary:
      "Des sites clairs, rapides et bien construits. Chaque page a un rôle précis.",
    meta: {
      output: "Sites sur-mesure",
      tools: "Figma · Framer · Vite",
      delivery: "4 – 8 sem.",
    },
  },
  {
    id: "shopify",
    index: "02",
    title: "Shopify",
    discipline: "E-commerce · Liquid · Direct-to-consumer",
    summary:
      "Des boutiques propres et fluides, pensées pour vendre sans brouiller l'image.",
    meta: {
      output: "Boutiques sur-mesure",
      tools: "Shopify · Liquid · GSAP",
      delivery: "5 – 10 sem.",
    },
  },
  {
    id: "uiux",
    index: "03",
    title: "UI / UX",
    discipline: "Interfaces · Produits · Parcours",
    summary:
      "Des interfaces lisibles, simples à prendre en main et solides dans le temps.",
    meta: {
      output: "Design de produit",
      tools: "Figma · Prototypes · Design systems",
      delivery: "3 – 6 sem.",
    },
  },
  {
    id: "wordpress",
    index: "04",
    title: "WordPress",
    discipline: "CMS · Éditorial · Contenu sur-mesure",
    summary:
      "Un WordPress bien pensé. Un back-office simple, un rendu propre et un site facile à faire vivre.",
    meta: {
      output: "Sites éditoriaux",
      tools: "WordPress · ACF · Custom",
      delivery: "4 – 7 sem.",
    },
  },
  {
    id: "branding",
    index: "05",
    title: "Branding",
    discipline: "Identité · Système · Direction artistique",
    summary:
      "Une identité claire, cohérente et durable. Pas juste un signe, mais un cadre pour la suite.",
    meta: {
      output: "Identité de marque",
      tools: "Illustrator · Figma · Typographie",
      delivery: "3 – 5 sem.",
    },
  },
];

/* ─── Composant principal ─────────────────────────────────── */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });

  /* Service actif = hover (desktop) ; fallback = premier service */
  const [activeId, setActiveId] = useState<string>(SERVICES[0].id);
  const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-black overflow-hidden"
      style={{
        paddingTop: "clamp(6rem, 12vw, 10rem)",
        paddingBottom: "clamp(6rem, 12vw, 10rem)",
      }}
    >
      {/* ── Lueurs d'ambiance (cohérentes avec About / Projects) ── */}
      <div
        className="absolute top-[8%] left-[-10%] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(252,18,53,0.055) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[4%] right-[-12%] w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(252,18,53,0.035) 0%, transparent 70%)",
        }}
      />

      {/* ══════════════════════════════════════════════════════
          HEADER — cohérent avec Projects / About
      ══════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 mx-auto px-5 sm:px-6 md:px-10 lg:px-12"
        style={{ maxWidth: "1400px" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-14 lg:mb-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: EASE }}
              className="flex items-center gap-3 mb-5"
            >
              <div
                style={{
                  width: "18px",
                  height: "1px",
                  backgroundColor: "#FC1235",
                  boxShadow: "0 0 5px rgba(252,18,53,0.35)",
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
                Services — Ce que je fais
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
              style={{
                fontFamily: SANS,
                fontSize: "clamp(2.4rem, 5.5vw, 4.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.045em",
                lineHeight: 0.92,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Disciplines
              <span
                style={{
                  color: "#FC1235",
                  textShadow: "0 0 40px rgba(252,18,53,0.2)",
                }}
              >
                .
              </span>
            </motion.h2>
          </div>

          {/* Colonne descriptive — discrète, à droite du titre */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
            className="max-w-sm lg:ml-auto lg:text-right"
            style={{
              fontFamily: SANS,
              fontSize: "clamp(0.92rem, 1.8vw, 0.95rem)",
              lineHeight: 1.75,
              color: "#5A5A5A",
              margin: 0,
            }}
          >
            Chaque projet demande le bon format. Le but reste le même : un site clair, juste et efficace.
          </motion.p>
        </div>

        {/* ══════════════════════════════════════════════════════
            CORPS — Panneau gauche (sticky) + Index à droite
        ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ── Panneau gauche : numéro géant + fiche méta ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <LeftPanel service={active} inView={inView} />
          </div>

          {/* ── Index à droite : liste verticale des services ── */}
          <div className="lg:col-span-7">
            <ul
              className="flex flex-col"
              style={{ listStyle: "none", margin: 0, padding: 0 }}
              onMouseLeave={() => setActiveId(SERVICES[0].id)}
            >
              {SERVICES.map((service, i) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  index={i}
                  isActive={activeId === service.id}
                  inView={inView}
                  onActivate={() => setActiveId(service.id)}
                />
              ))}
            </ul>

            {/* Petite mention de bas de liste — style éditorial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.9, ease: EASE }}
              className="mt-10 flex items-center gap-3"
            >
              <div
                style={{
                  width: "14px",
                  height: "1px",
                  backgroundColor: "rgba(255,255,255,0.12)",
                }}
              />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.46rem",
                  color: "#4A4A4A",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                }}
              >
                {`0${SERVICES.length}`} disciplines · Sur-mesure uniquement
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   PANNEAU GAUCHE — numéro géant Doto + fiche méta
   Cohérent avec le hero (EVANS BILONG en Doto #FC1235)
══════════════════════════════════════════════════════════ */
function LeftPanel({ service, inView }: { service: Service; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
      className="relative max-w-2xl"
    >
      {/* Fiche méta en haut — tag éditorial */}
      <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
        <div
          style={{
            width: "16px",
            height: "1px",
            backgroundColor: "#FC1235",
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            fontSize: "0.46rem",
            color: "#FC1235",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          Discipline en focus
        </span>
      </div>

      {/* Numéro géant en Doto (dotted), change selon le service actif.
          C'est la signature visuelle du panneau — raccord direct avec le hero. */}
      <div
        className="relative"
        style={{ minHeight: "clamp(6.5rem, 24vw, 15rem)" }}
      >
        <motion.div
          key={service.index}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{
            fontFamily: DOTO,
            fontSize: "clamp(5rem, 24vw, 13rem)",
            fontWeight: 400,
            color: "#FC1235",
            lineHeight: 0.85,
            letterSpacing: "0.02em",
            textShadow: "0 0 60px rgba(252,18,53,0.25)",
          }}
        >
          {service.index}
        </motion.div>
      </div>

      {/* Titre affiché en dessous, en petit, pour "signer" le numéro */}
      <motion.div
        key={`title-${service.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mt-3 mb-8 sm:mt-4 sm:mb-10"
      >
        <h3
          style={{
            fontFamily: SANS,
            fontSize: "clamp(1.35rem, 6vw, 2.1rem)",
            fontWeight: 600,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          {service.title}
        </h3>
      </motion.div>

      {/* Séparateur fin */}
      <div
        style={{
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.07)",
          marginBottom: "1.75rem",
        }}
      />

      {/* Fiche méta — lignes en JetBrains Mono, façon "spec sheet" */}
      <motion.dl
        key={`meta-${service.id}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        style={{ margin: 0 }}
        className="flex flex-col gap-3.5"
      >
        <MetaLine label="Livrable" value={service.meta.output} />
        <MetaLine label="Outils"   value={service.meta.tools}  />
        <MetaLine label="Délai"    value={service.meta.delivery} />
      </motion.dl>
    </motion.div>
  );
}

/* ─── Ligne de méta ──────────────────────────────────────── */
function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
      <dt
        className="sm:w-[4.5rem] sm:shrink-0"
        style={{
          fontFamily: MONO,
          fontSize: "0.46rem",
          color: "#555",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          fontFamily: SANS,
          fontSize: "clamp(0.88rem, 2.1vw, 0.95rem)",
          fontWeight: 500,
          color: "#D0D0D0",
          letterSpacing: "-0.005em",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {value}
      </dd>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LIGNE DE SERVICE — interaction mask reveal + outline hover
══════════════════════════════════════════════════════════ */
function ServiceRow({
  service,
  index: i,
  isActive,
  inView,
  onActivate,
}: {
  service: Service;
  index: number;
  isActive: boolean;
  inView: boolean;
  onActivate: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: 0.35 + i * 0.08, ease: EASE }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      className="relative group cursor-pointer outline-none touch-manipulation"
      role="button"
      aria-expanded={isActive}
      style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        /* Le dernier élément ferme la liste avec un bord bas */
        borderBottom:
          i === SERVICES.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      {/* Ligne rouge qui s'étend sur la largeur au hover */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-1px",
          left: 0,
          height: "1px",
          width: isActive ? "100%" : "0%",
          backgroundColor: "#FC1235",
          boxShadow: isActive ? "0 0 10px rgba(252,18,53,0.45)" : "none",
          transition:
            "width 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease",
        }}
      />

      <div
        className="flex items-start gap-4 sm:items-center sm:gap-5 md:gap-8"
        style={{
          padding: "clamp(1.5rem, 3vw, 2.25rem) 0",
          transform: isActive ? "translateX(6px)" : "translateX(0)",
          transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Code — 01 / 02 / 03 ... */}
        <span
          style={{
            fontFamily: MONO,
            fontSize: "0.5rem",
            letterSpacing: "0.28em",
            color: isActive ? "#FC1235" : "#3A3A3A",
            width: "1.8rem",
            flexShrink: 0,
            transition: "color 0.4s ease",
          }}
        >
          {service.index}
        </span>

        {/* Titre — typographie éditoriale, swap fill → outline au hover */}
        <div className="min-w-0 flex-1">
          <h4
            className="relative"
            style={{
              fontFamily: SANS,
              fontSize: "clamp(1.55rem, 7vw, 3.6rem)",
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.98,
              margin: 0,
              color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.32)",
              WebkitTextStroke: isActive ? "0px transparent" : "0px transparent",
              transition: "color 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {service.title}
            {/* Petit point rouge en suffixe quand actif */}
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                marginLeft: "0.35em",
                color: "#FC1235",
                opacity: isActive ? 1 : 0,
                transform: isActive ? "translateY(0)" : "translateY(4px)",
                transition:
                  "opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              .
            </span>
          </h4>

          <p
            className="mt-2 lg:hidden"
            style={{
              fontFamily: MONO,
              fontSize: "0.52rem",
              color: "#707070",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {service.discipline}
          </p>
        </div>

        {/* Discipline en micro-typographie — n'apparaît qu'au hover */}
        <div
          className="hidden lg:flex items-center gap-3 shrink-0"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateX(0)" : "translateX(-8px)",
            transition:
              "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "1px",
              backgroundColor: "rgba(252,18,53,0.55)",
            }}
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: "0.46rem",
              color: "#888",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {service.discipline}
          </span>
        </div>
      </div>

      {/* Résumé en dessous — se déploie élégamment au hover (mask reveal) */}
      <div
        aria-hidden={!isActive}
        style={{
          display: "grid",
          gridTemplateRows: isActive ? "1fr" : "0fr",
          transition: "grid-template-rows 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
          paddingLeft: "clamp(2.35rem, 7vw, 4.2rem)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              fontFamily: SANS,
              fontSize: "clamp(0.9rem, 2vw, 0.95rem)",
              lineHeight: 1.75,
              color: "#707070",
              maxWidth: "44ch",
              margin: 0,
              paddingBottom: "clamp(1.25rem, 2.5vw, 1.75rem)",
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(8px)",
              transition:
                "opacity 0.55s ease 0.05s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.05s",
            }}
          >
            {service.summary}
          </p>
        </div>
      </div>
    </motion.li>
  );
}
