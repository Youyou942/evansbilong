import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  SiAdobeaftereffects,
  SiAdobeillustrator,
  SiAdobeindesign,
  SiAdobelightroom,
  SiAdobephotoshop,
  SiAdobepremierepro,
  SiFigma,
  SiShopify,
  SiVisualstudiocode,
  SiWordpress,
} from "react-icons/si";
import { Logos3 } from "./ui/logos3";
import { ToolsBeamsBackground } from "./ui/ToolsBeamsBackground";

const SANS = "'Space Grotesk', sans-serif";
const EASE = [0.22, 1, 0.36, 1] as const;

const TOOLS = [
  { id: "figma", name: "Figma", Icon: SiFigma },
  { id: "photoshop", name: "Photoshop", Icon: SiAdobephotoshop },
  { id: "illustrator", name: "Illustrator", Icon: SiAdobeillustrator },
  { id: "after-effects", name: "After Effects", Icon: SiAdobeaftereffects },
  { id: "premiere-pro", name: "Premiere Pro", Icon: SiAdobepremierepro },
  { id: "indesign", name: "InDesign", Icon: SiAdobeindesign },
  { id: "lightroom", name: "Lightroom", Icon: SiAdobelightroom },
  { id: "shopify", name: "Shopify", Icon: SiShopify },
  { id: "wordpress", name: "WordPress", Icon: SiWordpress },
  { id: "vs-code", name: "VS Code", Icon: SiVisualstudiocode },
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
        backgroundColor: "#000000",
        paddingTop: "clamp(4.75rem, 10vw, 7rem)",
        paddingBottom: "clamp(4.75rem, 10vw, 7rem)",
      }}
    >
      <ToolsBeamsBackground />

      <div
        className="pointer-events-none absolute left-[-8%] top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full"
        style={{
          background: "transparent",
        }}
      />
      <div
        className="pointer-events-none absolute right-[-8%] top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full"
        style={{
          background: "transparent",
        }}
      />

      <div className="relative z-10 mx-auto mb-14 max-w-[1400px] px-5 sm:mb-16 sm:px-6 md:px-10 lg:mb-20 lg:px-12">
        <div className="flex flex-col justify-between gap-6 sm:gap-8 lg:flex-row lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="max-w-2xl lg:max-w-xl"
          >
            <h2
              style={{
                fontFamily: SANS,
                fontSize: "clamp(2rem, 4.6vw, 4rem)",
                fontWeight: 700,
                lineHeight: 0.92,
                letterSpacing: "-0.045em",
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
        className="relative z-10 mb-0 h-px origin-left bg-black"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, delay: 0.18, ease: EASE }}
        className="relative z-10 mx-auto mt-8 max-w-[1400px] py-6 sm:mt-10 sm:py-8 lg:mt-12"
      >
        <Logos3 logos={TOOLS} />
      </motion.div>
    </section>
  );
}
