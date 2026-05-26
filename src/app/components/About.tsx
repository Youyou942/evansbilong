import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Logos3 } from "./ui/logos3";

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";
const DOTO = "'Doto', monospace";
const EASE = [0.22, 1, 0.36, 1] as const;

const TOOLS = [
  { id: "figma", name: "Figma", mark: "Fi" },
  { id: "photoshop", name: "Photoshop", mark: "Ps" },
  { id: "illustrator", name: "Illustrator", mark: "Ai" },
  { id: "after-effects", name: "After Effects", mark: "Ae" },
  { id: "premiere-pro", name: "Premiere Pro", mark: "Pr" },
  { id: "indesign", name: "InDesign", mark: "Id" },
  { id: "lightroom", name: "Lightroom", mark: "Lr" },
  { id: "shopify", name: "Shopify", mark: "Sh" },
  { id: "wordpress", name: "WordPress", mark: "Wp" },
  { id: "vs-code", name: "VS Code", mark: "Vs" },
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

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, delay: 0.18, ease: EASE }}
        className="mx-auto mt-8 max-w-[1400px] py-6 sm:mt-10 sm:py-8 lg:mt-12"
      >
        <Logos3 logos={TOOLS} />
      </motion.div>
    </section>
  );
}
