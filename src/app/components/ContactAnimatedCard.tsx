import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { cn } from "./ui/utils";

type ContactAnimatedCardProps = {
  children: ReactNode;
  className?: string;
};

export function ContactAnimatedCard({ children, className }: ContactAnimatedCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const isInView = useInView(rootRef, { once: false, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const isActive = isInView && isPageVisible && !prefersReducedMotion;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setIsPageVisible(!document.hidden);
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <motion.div
        className="relative"
        initial={isMounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 rounded-[36px] opacity-80"
          style={{
            background:
              "radial-gradient(circle at top, rgba(252,18,53,0.1) 0%, rgba(252,18,53,0.03) 30%, transparent 70%)",
            filter: "blur(42px)",
          }}
        />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1px] rounded-[30px]"
          animate={{
            boxShadow: isActive ? [
              "0 0 0 1px rgba(252,18,53,0.09), 0 24px 60px rgba(0,0,0,0.46)",
              "0 0 0 1px rgba(252,18,53,0.13), 0 28px 70px rgba(0,0,0,0.5)",
              "0 0 0 1px rgba(252,18,53,0.09), 0 24px 60px rgba(0,0,0,0.46)",
            ] : "0 0 0 1px rgba(252,18,53,0.09), 0 24px 60px rgba(0,0,0,0.46)",
          }}
          transition={isActive ? { duration: 9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
        />

        <div className="pointer-events-none absolute -inset-[1px] overflow-hidden rounded-[30px]">
          <motion.div
            className="absolute left-[-40%] top-0 h-px w-[34%] bg-gradient-to-r from-transparent via-[#FC1235] to-transparent opacity-52 blur-[0.8px]"
            animate={isActive ? { left: ["-40%", "106%"] } : { left: "-40%" }}
            transition={isActive ? { duration: 5.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
          />
          <motion.div
            className="absolute right-0 top-[-42%] h-[34%] w-px bg-gradient-to-b from-transparent via-[#FC1235] to-transparent opacity-44 blur-[0.8px]"
            animate={isActive ? { top: ["-42%", "106%"] } : { top: "-42%" }}
            transition={isActive ? { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.45 } : { duration: 0.4 }}
          />
          <motion.div
            className="absolute bottom-0 right-[-40%] h-px w-[34%] bg-gradient-to-r from-transparent via-[#FC1235] to-transparent opacity-52 blur-[0.8px]"
            animate={isActive ? { right: ["-40%", "106%"] } : { right: "-40%" }}
            transition={isActive ? { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 2.9 } : { duration: 0.4 }}
          />
          <motion.div
            className="absolute bottom-[-42%] left-0 h-[34%] w-px bg-gradient-to-b from-transparent via-[#FC1235] to-transparent opacity-44 blur-[0.8px]"
            animate={isActive ? { bottom: ["-42%", "106%"] } : { bottom: "-42%" }}
            transition={isActive ? { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 4.35 } : { duration: 0.4 }}
          />
        </div>

        <motion.div
          className="relative overflow-hidden rounded-[28px] border border-[#FC1235]/16 bg-[rgba(5,5,5,0.98)] shadow-[0_34px_90px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.02)]"
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
                "radial-gradient(circle at top, rgba(252,18,53,0.08) 0%, transparent 38%), radial-gradient(circle at 100% 100%, rgba(252,18,53,0.04) 0%, transparent 32%)",
            }}
          />

          <div className="relative z-10">{children}</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
