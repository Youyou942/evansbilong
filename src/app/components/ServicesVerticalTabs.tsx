import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "./ui/utils";

const AUTO_PLAY_DURATION = 5600;
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";
const EASE = [0.22, 1, 0.36, 1] as const;

type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  visual: {
    label: string;
    grid: string;
    glow: string;
    rail: string;
    orb: string;
    line: string;
  };
};

const SERVICES: Service[] = [
  {
    id: "web-design",
    index: "01",
    title: "Web design",
    description:
      "Interfaces claires, visuelles et pensées pour guider l’utilisateur sans perdre l’identité de la marque.",
    visual: {
      label: "Direction visuelle",
      grid: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      glow:
        "radial-gradient(circle at 24% 18%, rgba(252,18,53,0.26), transparent 34%), radial-gradient(circle at 76% 66%, rgba(255,255,255,0.08), transparent 30%)",
      rail: "linear-gradient(90deg, transparent, rgba(252,18,53,0.92), transparent)",
      orb: "radial-gradient(circle, rgba(252,18,53,0.9), rgba(252,18,53,0.08) 42%, transparent 68%)",
      line: "M 40 260 C 180 115 310 360 500 170 C 620 70 710 140 810 72",
    },
  },
  {
    id: "ux-ui",
    index: "02",
    title: "UX/UI",
    description:
      "Structure, hiérarchie et parcours utilisateur pour rendre l’expérience plus lisible et plus fluide.",
    visual: {
      label: "Parcours & structure",
      grid: "linear-gradient(120deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(30deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
      glow:
        "radial-gradient(circle at 34% 72%, rgba(252,18,53,0.2), transparent 34%), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.075), transparent 26%)",
      rail: "linear-gradient(180deg, transparent, rgba(252,18,53,0.95), transparent)",
      orb: "radial-gradient(circle, rgba(255,255,255,0.78), rgba(252,18,53,0.18) 36%, transparent 66%)",
      line: "M 56 98 C 186 98 158 238 286 238 C 410 238 390 118 520 118 C 658 118 650 285 792 285",
    },
  },
  {
    id: "shopify",
    index: "03",
    title: "Shopify",
    description:
      "Boutiques e-commerce sur mesure, pensées pour présenter les produits clairement et faciliter l’achat.",
    visual: {
      label: "E-commerce sur mesure",
      grid: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(252,18,53,0.045) 1px, transparent 1px)",
      glow:
        "radial-gradient(circle at 72% 28%, rgba(252,18,53,0.22), transparent 32%), radial-gradient(circle at 26% 78%, rgba(255,255,255,0.07), transparent 28%)",
      rail: "linear-gradient(90deg, rgba(252,18,53,0.05), rgba(252,18,53,0.85), rgba(252,18,53,0.05))",
      orb: "radial-gradient(circle, rgba(252,18,53,0.8), rgba(252,18,53,0.16) 34%, transparent 70%)",
      line: "M 72 302 L 214 154 L 344 234 L 478 106 L 610 206 L 770 80",
    },
  },
  {
    id: "branding",
    index: "04",
    title: "Branding",
    description:
      "Directions visuelles cohérentes pour donner plus de caractère et de reconnaissance à un projet.",
    visual: {
      label: "Identité & caractère",
      grid: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
      glow:
        "radial-gradient(circle at 50% 48%, rgba(252,18,53,0.2), transparent 34%), radial-gradient(circle at 18% 22%, rgba(255,255,255,0.07), transparent 24%)",
      rail: "conic-gradient(from 120deg, transparent, rgba(252,18,53,0.78), transparent 38%)",
      orb: "radial-gradient(circle, rgba(252,18,53,0.72), rgba(252,18,53,0.12) 40%, transparent 68%)",
      line: "M 90 210 C 210 72 366 72 478 210 C 590 348 714 344 812 198",
    },
  },
  {
    id: "integration-web",
    index: "05",
    title: "Intégration web",
    description:
      "Mise en place propre, responsive et cohérente avec la maquette et la direction graphique.",
    visual: {
      label: "Responsive build",
      grid: "linear-gradient(rgba(255,255,255,0.038) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.038) 1px, transparent 1px)",
      glow:
        "radial-gradient(circle at 20% 24%, rgba(252,18,53,0.19), transparent 30%), radial-gradient(circle at 78% 72%, rgba(252,18,53,0.14), transparent 32%)",
      rail: "linear-gradient(135deg, transparent, rgba(252,18,53,0.85), transparent)",
      orb: "radial-gradient(circle, rgba(255,255,255,0.7), rgba(252,18,53,0.18) 38%, transparent 70%)",
      line: "M 70 82 H 306 V 188 H 508 V 306 H 790",
    },
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "-9%" : "9%",
    opacity: 0,
    scale: 0.985,
    filter: "blur(10px)",
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    y: direction > 0 ? "9%" : "-9%",
    opacity: 0,
    scale: 1.015,
    filter: "blur(10px)",
  }),
};

export function ServicesVerticalTabs() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-12%" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((current) => (current + 1) % SERVICES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((current) => (current - 1 + SERVICES.length) % SERVICES.length);
  }, []);

  const handleTabClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(handleNext, AUTO_PLAY_DURATION);
    return () => window.clearInterval(interval);
  }, [handleNext, isPaused, activeIndex]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden bg-black"
      style={{
        paddingTop: "clamp(6rem, 11vw, 10rem)",
        paddingBottom: "clamp(6rem, 11vw, 10rem)",
      }}
    >
      <div
        className="absolute left-[-18%] top-[10%] h-[34rem] w-[34rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(252,18,53,0.075) 0%, transparent 68%)",
        }}
      />
      <div
        className="absolute bottom-[-18%] right-[-14%] h-[36rem] w-[36rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(252,18,53,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 mx-auto px-5 sm:px-6 md:px-10 lg:px-12"
        style={{ maxWidth: "1400px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-10 sm:mb-14 lg:mb-16"
        >
          <div className="mb-5 flex items-center gap-3">
            <span
              className="h-px w-5"
              style={{
                backgroundColor: "#FC1235",
                boxShadow: "0 0 12px rgba(252,18,53,0.45)",
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: "0.48rem",
                color: "#FC1235",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
              }}
            >
              Services
            </span>
          </div>
          <h2
            style={{
              fontFamily: SANS,
              fontSize: "clamp(2.8rem, 7vw, 6.2rem)",
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Mes services
            <span style={{ color: "#FC1235" }}>.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14 xl:gap-20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="order-2 flex flex-col lg:order-1 lg:col-span-5">
            <div className="flex flex-col">
              {SERVICES.map((service, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "group relative flex w-full items-start gap-4 border-t py-5 text-left transition-all duration-500 first:border-t-0 sm:gap-5 sm:py-6 md:py-7",
                      isActive
                        ? "translate-x-1 text-white"
                        : "text-white/45 hover:text-white/80"
                    )}
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    aria-pressed={isActive}
                  >
                    <span
                      className="absolute bottom-0 left-0 top-0 w-px overflow-hidden"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      aria-hidden="true"
                    >
                      {isActive && (
                        <motion.span
                          key={`progress-${service.id}-${isPaused}`}
                          className="absolute left-0 top-0 w-full"
                          style={{
                            backgroundColor: "#FC1235",
                            boxShadow: "0 0 14px rgba(252,18,53,0.45)",
                          }}
                          initial={{ height: "0%" }}
                          animate={{ height: isPaused ? "0%" : "100%" }}
                          transition={{
                            duration: AUTO_PLAY_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </span>

                    <span
                      className="mt-1 w-9 shrink-0 tabular-nums"
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.58rem",
                        letterSpacing: "0.22em",
                        color: isActive ? "#FC1235" : "rgba(255,255,255,0.32)",
                      }}
                    >
                      /{service.index}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className="block transition-colors duration-500"
                        style={{
                          fontFamily: SANS,
                          fontSize: "clamp(1.65rem, 4.5vw, 2.75rem)",
                          fontWeight: 650,
                          letterSpacing: "-0.045em",
                          lineHeight: 0.98,
                        }}
                      >
                        {service.title}
                      </span>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.span
                            initial={{ opacity: 0, height: 0, y: 8 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            transition={{ duration: 0.34, ease: EASE }}
                            className="block overflow-hidden"
                          >
                            <span
                              className="block max-w-md pb-1 pt-3"
                              style={{
                                fontFamily: SANS,
                                color: "rgba(255,255,255,0.56)",
                                fontSize: "clamp(0.95rem, 2vw, 1rem)",
                                lineHeight: 1.7,
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {service.description}
                            </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative">
              <div
                className="relative aspect-[1.08/1] overflow-hidden rounded-[1.65rem] border sm:aspect-[4/3] md:rounded-[2rem] lg:aspect-[16/11] xl:rounded-[2.35rem]"
                style={{
                  background:
                    "linear-gradient(145deg, #050505 0%, #0B0B0B 52%, #050505 100%)",
                  borderColor: "rgba(255,255,255,0.08)",
                  boxShadow:
                    "0 28px 90px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.055)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
                    backgroundSize: "18px 18px",
                  }}
                />
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={SERVICES[activeIndex].id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      y: { type: "spring", stiffness: 240, damping: 30 },
                      scale: { duration: 0.55, ease: EASE },
                      opacity: { duration: 0.38 },
                      filter: { duration: 0.42 },
                    }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={handleNext}
                  >
                    <ServiceVisual service={SERVICES[activeIndex]} />
                  </motion.div>
                </AnimatePresence>

                <div
                  className="absolute inset-x-0 bottom-0 z-10 h-1/3 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, rgba(0,0,0,0.72))",
                  }}
                />

                <div className="absolute bottom-5 right-5 z-20 flex gap-2 sm:bottom-7 sm:right-7 sm:gap-3">
                  <ArrowButton label="Service précédent" onClick={handlePrev}>
                    <ArrowLeft size={18} strokeWidth={1.8} />
                  </ArrowButton>
                  <ArrowButton label="Service suivant" onClick={handleNext}>
                    <ArrowRight size={18} strokeWidth={1.8} />
                  </ArrowButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceVisual({ service }: { service: Service }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.035), transparent 38%), #070707",
        }}
      />
      <div
        className="absolute inset-0 opacity-65"
        style={{
          backgroundImage: service.visual.grid,
          backgroundSize:
            service.id === "branding" ? "34px 34px" : "54px 54px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: service.visual.glow }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[62%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: service.visual.orb }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.48, 0.68, 0.48] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute left-[10%] top-[18%] h-[64%] w-[80%] rounded-[2rem] border"
        style={{
          borderColor: "rgba(255,255,255,0.075)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      />
      <div
        className="absolute left-[13%] right-[13%] top-[26%] h-px"
        style={{ background: service.visual.rail }}
      />
      <div
        className="absolute bottom-[20%] left-[18%] h-px w-[38%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.26), rgba(255,255,255,0))",
        }}
      />
      <div
        className="absolute bottom-[31%] right-[17%] h-px w-[26%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(252,18,53,0), rgba(252,18,53,0.58), rgba(252,18,53,0))",
        }}
      />
      <svg
        className="absolute inset-x-[7%] top-[18%] h-[64%] w-[86%]"
        viewBox="0 0 860 380"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d={service.visual.line}
          fill="none"
          stroke="rgba(252,18,53,0.74)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="7 12"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <path
          d={service.visual.line}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="9"
          strokeLinecap="round"
          filter="blur(10px)"
        />
      </svg>
      <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-7 sm:top-7">
        <span
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: "#FC1235",
            boxShadow: "0 0 18px rgba(252,18,53,0.55)",
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            color: "rgba(255,255,255,0.52)",
            fontSize: "0.52rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          {service.visual.label}
        </span>
      </div>
      <div className="absolute bottom-5 left-5 right-28 z-20 sm:bottom-7 sm:left-7">
        <span
          className="mb-2 block"
          style={{
            fontFamily: MONO,
            color: "#FC1235",
            fontSize: "0.52rem",
            letterSpacing: "0.28em",
          }}
        >
          {service.index}
        </span>
        <p
          style={{
            fontFamily: SANS,
            color: "#FFFFFF",
            fontSize: "clamp(1.55rem, 5vw, 2.8rem)",
            fontWeight: 650,
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
            margin: 0,
          }}
        >
          {service.title}
        </p>
      </div>
    </div>
  );
}

function ArrowButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full border text-white transition-all duration-300 hover:scale-105 active:scale-95 sm:h-12 sm:w-12"
      style={{
        backgroundColor: "rgba(0,0,0,0.56)",
        borderColor: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(14px)",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = "#FC1235";
        event.currentTarget.style.borderColor = "rgba(252,18,53,0.85)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = "rgba(0,0,0,0.56)";
        event.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      }}
    >
      {children}
    </button>
  );
}
