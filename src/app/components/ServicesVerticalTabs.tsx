import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
  image: string;
  imageAlt: string;
  objectPosition?: string;
};

const SERVICES: Service[] = [
  {
    id: "web-design",
    index: "01",
    title: "Web design",
    description:
      "Interfaces claires, visuelles et pensées pour guider l’utilisateur sans perdre l’identité de la marque.",
    image: "/images/services/service-web-design.jpg",
    imageAlt: "Visual web design premium",
    objectPosition: "center",
  },
  {
    id: "ux-ui",
    index: "02",
    title: "UX/UI",
    description:
      "Structure, hiérarchie et parcours utilisateur pour rendre l’expérience plus lisible et plus fluide.",
    image: "/images/services/service-ux-ui.jpg",
    imageAlt: "Visual UX UI premium",
    objectPosition: "center",
  },
  {
    id: "shopify",
    index: "03",
    title: "Shopify",
    description:
      "Boutiques e-commerce sur mesure, pensées pour présenter les produits clairement et faciliter l’achat.",
    image: "/images/services/service-shopify.jpg",
    imageAlt: "Visual Shopify e-commerce premium",
    objectPosition: "center",
  },
  {
    id: "branding",
    index: "04",
    title: "Branding",
    description:
      "Directions visuelles cohérentes pour donner plus de caractère et de reconnaissance à un projet.",
    image: "/images/services/service-branding.jpg",
    imageAlt: "Visual branding premium",
    objectPosition: "center",
  },
  {
    id: "integration-web",
    index: "05",
    title: "Intégration web",
    description:
      "Mise en place propre, responsive et cohérente avec la maquette et la direction graphique.",
    image: "/images/services/service-integration-web.jpg",
    imageAlt: "Visual intégration web premium",
    objectPosition: "center",
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
              fontSize: "clamp(2rem, 4.6vw, 4rem)",
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
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
                className="relative aspect-[1.08/1] overflow-hidden rounded-[1.65rem] border bg-[#050505] sm:aspect-[4/3] md:rounded-[2rem] lg:aspect-[16/11] xl:rounded-[2.35rem]"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  boxShadow:
                    "0 28px 90px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.055)",
                }}
              >
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
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      {hasImageError ? (
        // Keeps the visual area clean if an expected local image is replaced or missing.
        <div className="absolute inset-0 bg-[#050505]" />
      ) : (
        <img
          src={service.image}
          alt={service.imageAlt}
          className="h-full w-full object-cover"
          style={{ objectPosition: service.objectPosition ?? "center" }}
          onError={() => setHasImageError(true)}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.48) 100%)",
        }}
      />
    </div>
  );
}

function ArrowButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
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
