import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "./utils";

interface ContactBeamsBackgroundProps {
  className?: string;
  intensity?: "subtle" | "medium";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  tone: number;
}

function createBeam(width: number, height: number, isMobile: boolean): Beam {
  return {
    x: Math.random() * width * 1.35 - width * 0.18,
    y: Math.random() * height * 1.35 - height * 0.22,
    width: (isMobile ? 58 : 86) + Math.random() * (isMobile ? 42 : 88),
    length: height * (isMobile ? 1.65 : 2.25),
    angle: -36 + Math.random() * 11,
    speed: (isMobile ? 0.13 : 0.24) + Math.random() * 0.24,
    opacity: (isMobile ? 0.035 : 0.048) + Math.random() * 0.052,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.005 + Math.random() * 0.01,
    tone: Math.random(),
  };
}

function resetBeam(
  beam: Beam,
  index: number,
  totalBeams: number,
  width: number,
  height: number,
  isMobile: boolean
) {
  const columns = isMobile ? 2 : 4;
  const column = index % columns;
  const spacing = width / columns;

  beam.y = height + 90;
  beam.x =
    column * spacing +
    spacing / 2 +
    (Math.random() - 0.5) * spacing * 0.72;
  beam.width = (isMobile ? 54 : 82) + Math.random() * (isMobile ? 40 : 84);
  beam.length = height * (isMobile ? 1.6 : 2.2);
  beam.speed = (isMobile ? 0.12 : 0.22) + Math.random() * 0.22;
  beam.opacity =
    (isMobile ? 0.03 : 0.044) + Math.random() * (totalBeams > 10 ? 0.046 : 0.038);
  beam.tone = Math.random();
}

function drawBeam(
  ctx: CanvasRenderingContext2D,
  beam: Beam,
  intensity: "subtle" | "medium"
) {
  ctx.save();
  ctx.translate(beam.x, beam.y);
  ctx.rotate((beam.angle * Math.PI) / 180);

  const intensityOpacity = intensity === "medium" ? 1.12 : 0.82;
  const pulsingOpacity =
    beam.opacity * (0.84 + Math.sin(beam.pulse) * 0.16) * intensityOpacity;
  const brightRed = beam.tone > 0.64 ? "252, 18, 53" : "142, 10, 34";

  const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.12, `rgba(18, 0, 5, ${pulsingOpacity * 0.32})`);
  gradient.addColorStop(0.38, `rgba(${brightRed}, ${pulsingOpacity})`);
  gradient.addColorStop(0.6, `rgba(252, 18, 53, ${pulsingOpacity * 0.7})`);
  gradient.addColorStop(0.84, `rgba(94, 6, 23, ${pulsingOpacity * 0.2})`);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
  ctx.restore();
}

export function ContactBeamsBackground({
  className,
  intensity = "subtle",
}: ContactBeamsBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, isMobile: false });
  const lastFrameTimeRef = useRef(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;

    const updateActive = () => {
      setIsActive(isVisible && !document.hidden && !reduceMotion.matches);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        updateActive();
      },
      { rootMargin: "160px 0px" }
    );

    observer.observe(root);
    document.addEventListener("visibilitychange", updateActive);
    reduceMotion.addEventListener("change", updateActive);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateActive);
      reduceMotion.removeEventListener("change", updateActive);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = parent.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const isMobile = width < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25);
      const beamCount = width < 430 ? 0 : isMobile ? 2 : width < 1024 ? 4 : 6;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width, height, isMobile };

      beamsRef.current = Array.from({ length: beamCount }, () =>
        createBeam(width, height, isMobile)
      );

      if (beamCount === 0) {
        ctx.clearRect(0, 0, width, height);
      }
    };

    const animate = (time = 0) => {
      const { width, height, isMobile } = sizeRef.current;
      if (!width || !height) return;

      const targetFrameMs = isMobile ? 1000 / 20 : 1000 / 30;
      if (time - lastFrameTimeRef.current < targetFrameMs) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = time;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -90) {
          resetBeam(beam, index, totalBeams, width, height, isMobile);
        }

        drawBeam(ctx, beam, intensity);
      });

      ctx.globalCompositeOperation = "source-over";
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    updateCanvasSize();

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(parent);

    if (isActive) {
      animate();
    }

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = null;
      lastFrameTimeRef.current = 0;
    };
  }, [intensity, isActive]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-black",
        className
      )}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-[0.08] sm:opacity-[0.13]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(252,18,53,0.045),rgba(18,0,5,0.025)_36%,transparent_66%)] sm:hidden" />
      <motion.div
        className="absolute inset-0 bg-black/10"
        animate={isActive ? { opacity: [0.12, 0.2, 0.12] } : { opacity: 0.12 }}
        transition={isActive ? {
          duration: 13,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        } : { duration: 0.4 }}
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(252,18,53,0.035), rgba(18,0,5,0.02) 38%, transparent 68%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
