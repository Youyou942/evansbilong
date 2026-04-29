import { motion } from "motion/react";

interface PulseElementProps {
  size?: number;
  color?: string;
  className?: string;
  delay?: number;
  rings?: number;
}

export function PulseElement({ size = 8, color = "#FC1235", className = "", delay = 0, rings = 2 }: PulseElementProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {Array.from({ length: rings }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * (3 + i),
            height: size * (3 + i),
            border: `1px solid ${color}`,
          }}
          animate={{
            scale: [0.4, 2],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2.5 + i * 0.5,
            repeat: Infinity,
            delay: delay + i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 3,
          height: size * 3,
          background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
      />
      <motion.div
        className="rounded-full relative z-10"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `0 0 ${size * 2}px ${color}88, 0 0 ${size * 4}px ${color}44`,
        }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay, ease: "easeInOut" }}
      />
    </div>
  );
}