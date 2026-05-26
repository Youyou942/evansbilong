import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { GlowCard } from "./ui/spotlight-card";

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";
const DOTO = "'Doto', monospace";
const EASE = [0.22, 1, 0.36, 1] as const;

const TOOLS = [
  { name: "Figma", tag: "Design UI" },
  { name: "Adobe Photoshop", tag: "Image" },
  { name: "Adobe Illustrator", tag: "Vectoriel" },
  { name: "After Effects", tag: "Motion" },
  { name: "Premiere Pro", tag: "Montage" },
  { name: "InDesign", tag: "Édition" },
  { name: "Lightroom", tag: "Photo" },
  { name: "Shopify", tag: "E-commerce" },
  { name: "WordPress", tag: "CMS" },
  { name: "VS Code", tag: "Code" },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="apropos"
      ref={ref}
      className="relative overflow-hidden bg-black"
      style={{
        paddingTop: "clamp(4.75rem, 10vw, 7rem)",
        paddingBottom: "clamp(4.75rem, 10vw, 7rem)",
      }}
    >
      <div
        className="pointer-events-none absolute left-[-8%] top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(252,18,53,0.07) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-[-8%] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(252,18,53,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto mb-14 max-w-[1400px] px-5 sm:mb-16 sm:px-6 md:px-10 lg:mb-20 lg:px-12">
        <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:flex-row lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <span
              style={{
                fontFamily: DOTO,
                fontSize: "clamp(2.5rem, 11vw, 5rem)",
                color: "#FC1235",
                opacity: 0.18,
                lineHeight: 1,
                letterSpacing: "0.04em",
              }}
            >
              02
            </span>
            <div className="flex flex-col gap-1">
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.5rem",
                  color: "#FC1235",
                  letterSpacing: "0.4em",
                }}
              >
                MÉTHODE
              </span>
              <div className="h-px w-8 bg-[#FC1235]/30" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="max-w-2xl lg:max-w-xl"
          >
            <h2
              style={{
                fontFamily: SANS,
                fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.035em",
                color: "#fff",
                margin: 0,
              }}
            >
              Mes outils
            </h2>
            <p
              className="mt-4"
              style={{
                fontFamily: SANS,
                fontSize: "clamp(0.95rem, 2vw, 1rem)",
                lineHeight: 1.72,
                color: "#888",
                maxWidth: "38ch",
              }}
            >
              Les logiciels que j’utilise pour concevoir, structurer et donner
              vie à mes projets.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: EASE }}
        className="mb-0 h-px origin-left bg-white/[0.05]"
      />

      <div className="mx-auto mt-10 max-w-[1400px] px-5 sm:mt-12 sm:px-6 md:px-10 lg:mt-16 lg:px-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.62,
                delay: 0.16 + i * 0.055,
                ease: EASE,
              }}
            >
              <GlowCard
                glowColor="red"
                className="group min-h-[126px] cursor-default bg-[#080808]/90"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.04), transparent 42%), radial-gradient(circle at 82% 18%, rgba(252,18,53,0.09), transparent 34%)",
                  }}
                />
                <div className="relative z-10 flex h-full min-h-[84px] flex-col justify-between gap-5">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.48rem",
                        color: "#FC1235",
                        letterSpacing: "0.24em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FC1235] opacity-70 shadow-[0_0_18px_rgba(252,18,53,0.45)]" />
                  </div>

                  <div>
                    <h3
                      className="transition-colors duration-300 group-hover:text-[#FC1235]"
                      style={{
                        fontFamily: SANS,
                        fontSize: "clamp(1.02rem, 3vw, 1.18rem)",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: "#fff",
                        lineHeight: 1.08,
                        margin: 0,
                      }}
                    >
                      {tool.name}
                    </h3>
                    <p
                      className="mt-2 transition-colors duration-300 group-hover:text-white/55"
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.5rem",
                        color: "rgba(255,255,255,0.36)",
                        letterSpacing: "0.18em",
                        lineHeight: 1.5,
                        marginBottom: 0,
                        textTransform: "uppercase",
                      }}
                    >
                      {tool.tag}
                    </p>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
