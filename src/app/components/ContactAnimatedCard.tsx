import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

import { cn } from "./ui/utils";

const MOBILE_TILT_QUERY = "(max-width: 768px), (pointer: coarse)";

type ContactAnimatedCardProps = {
  children: ReactNode;
  className?: string;
};

export function ContactAnimatedCard({ children, className }: ContactAnimatedCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-260, 260], [6, -6]);
  const rotateY = useTransform(mouseX, [-260, 260], [-6, 6]);
  const [enableTilt, setEnableTilt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(MOBILE_TILT_QUERY);
    const updateTiltAvailability = () => setEnableTilt(!mediaQuery.matches);

    updateTiltAvailability();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateTiltAvailability);
      return () => mediaQuery.removeEventListener("change", updateTiltAvailability);
    }

    mediaQuery.addListener(updateTiltAvailability);
    return () => mediaQuery.removeListener(updateTiltAvailability);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt) return;

    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  };

  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ perspective: enableTilt ? "1600px" : undefined }}
    >
      <motion.div
        className="relative"
        style={
          enableTilt
            ? {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
            : undefined
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 rounded-[36px] opacity-80"
          style={{
            background:
              "radial-gradient(circle at top, rgba(252,18,53,0.18) 0%, rgba(252,18,53,0.06) 30%, transparent 68%)",
            filter: "blur(34px)",
          }}
        />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1px] rounded-[30px]"
          animate={{
            boxShadow: [
              "0 0 0 1px rgba(252,18,53,0.12), 0 24px 60px rgba(0,0,0,0.34)",
              "0 0 0 1px rgba(252,18,53,0.22), 0 30px 78px rgba(0,0,0,0.42)",
              "0 0 0 1px rgba(252,18,53,0.12), 0 24px 60px rgba(0,0,0,0.34)",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="pointer-events-none absolute -inset-[1px] overflow-hidden rounded-[30px]">
          <motion.div
            className="absolute left-[-40%] top-0 h-px w-[34%] bg-gradient-to-r from-transparent via-[#FC1235] to-transparent opacity-80 blur-[0.8px]"
            animate={{ left: ["-40%", "106%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-0 top-[-42%] h-[34%] w-px bg-gradient-to-b from-transparent via-[#FC1235] to-transparent opacity-70 blur-[0.8px]"
            animate={{ top: ["-42%", "106%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.85 }}
          />
          <motion.div
            className="absolute bottom-0 right-[-40%] h-px w-[34%] bg-gradient-to-r from-transparent via-[#FC1235] to-transparent opacity-80 blur-[0.8px]"
            animate={{ right: ["-40%", "106%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
          />
          <motion.div
            className="absolute bottom-[-42%] left-0 h-[34%] w-px bg-gradient-to-b from-transparent via-[#FC1235] to-transparent opacity-70 blur-[0.8px]"
            animate={{ bottom: ["-42%", "106%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 2.55 }}
          />
        </div>

        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-[#FC1235]/20 bg-[linear-gradient(180deg,rgba(0,0,0,0.68)_0%,rgba(8,8,8,0.52)_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl"
          whileHover={enableTilt ? { y: -2 } : undefined}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.85) 0.5px, transparent 0.5px), linear-gradient(45deg, rgba(255,255,255,0.85) 0.5px, transparent 0.5px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top, rgba(252,18,53,0.18) 0%, transparent 42%), radial-gradient(circle at 100% 100%, rgba(252,18,53,0.1) 0%, transparent 36%)",
            }}
          />

          <div className="relative z-10">{children}</div>
        </motion.div>
      </motion.div>
    </div>
  );
}