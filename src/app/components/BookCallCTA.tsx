import { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EVANS_PORTRAIT_ALT, EVANS_PORTRAIT_IMAGE } from "../assets";

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";

interface BookCallCTAProps {
  className?: string;
  delay?: number;
}

export function BookCallCTA({ className = "", delay = 0 }: BookCallCTAProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="mailto:bilongevans@gmail.com"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`inline-flex items-center gap-4 rounded-full cursor-pointer group relative overflow-hidden ${className}`}
      style={{
        background: hovered
          ? "linear-gradient(135deg, rgba(252,18,53,0.05) 0%, rgba(6,6,6,0.98) 30%, rgba(2,2,2,0.99) 100%)"
          : "linear-gradient(135deg, rgba(8,8,8,0.97) 0%, rgba(2,2,2,0.99) 100%)",
        border: "1px solid",
        borderColor: hovered ? "rgba(252,18,53,0.45)" : "rgba(255,255,255,0.07)",
        padding: "8px 24px 8px 8px",
        boxShadow: hovered
          ? "0 0 36px rgba(252,18,53,0.12), 0 12px 40px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 4px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.025)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 12% 50%, rgba(252,18,53,0.09) 0%, transparent 52%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="w-11 h-11 rounded-full overflow-hidden relative"
          style={{
            border: hovered
              ? "2px solid rgba(252,18,53,0.55)"
              : "2px solid rgba(252,18,53,0.18)",
            boxShadow: hovered
              ? "0 0 18px rgba(252,18,53,0.28)"
              : "0 0 6px rgba(252,18,53,0.06)",
            transition: "border-color 0.45s ease, box-shadow 0.45s ease",
          }}
        >
          <ImageWithFallback
            src={EVANS_PORTRAIT_IMAGE}
            alt={EVANS_PORTRAIT_ALT}
            className="w-full h-full object-cover"
            style={{
              filter: "brightness(0.82) contrast(1.06)",
              objectPosition: "50% 35%",
            }}
          />
        </div>
        {/* Online indicator */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black z-10"
          style={{
            backgroundColor: "#FC1235",
            boxShadow: hovered ? "0 0 10px #FC1235" : "0 0 5px rgba(252,18,53,0.6)",
            transition: "box-shadow 0.45s ease",
          }}
        />
      </div>

      {/* Text */}
      <div className="relative flex flex-col mr-1">
        <span
          style={{
            fontFamily: SANS,
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: hovered ? "#fff" : "#D8D8D8",
            transition: "color 0.35s ease",
          }}
        >
          Prendre rendez-vous
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: "0.625rem",
            color: hovered ? "#FC1235" : "#888",
            letterSpacing: "0.02em",
            marginTop: "3px",
            transition: "color 0.35s ease",
          }}
        >
          parlons de votre projet
        </span>
      </div>

      {/* Arrow */}
      <div
        className="relative flex items-center justify-center w-9 h-9 rounded-full shrink-0"
        style={{
          backgroundColor: hovered
            ? "rgba(252,18,53,0.18)"
            : "rgba(255,255,255,0.05)",
          border: hovered
            ? "1px solid rgba(252,18,53,0.38)"
            : "1px solid rgba(255,255,255,0.08)",
          transition: "background-color 0.45s ease, border-color 0.45s ease",
        }}
      >
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          animate={{ x: hovered ? 2 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <path
            d="M1 7H13M13 7L8 2M13 7L8 12"
            stroke={hovered ? "#FC1235" : "#888"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "stroke 0.35s ease" }}
          />
        </motion.svg>
      </div>
    </motion.a>
  );
}
