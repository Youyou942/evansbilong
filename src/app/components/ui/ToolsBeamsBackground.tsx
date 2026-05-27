import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "./utils";

interface ToolsBeamsBackgroundProps {
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
  warmth: number;
}

function createBeam(width: number, height: number, isMobile: boolean): Beam {
  return {
    x: Math.random() * width * 1.3 - width * 0.15,
    y: Math.random() * height * 1.35 - height * 0.2,
    width: (isMobile ? 46 : 68) + Math.random() * (isMobile ? 38 : 72),
    length: height * (isMobile ? 1.7 : 2.15),
    angle: -38 + Math.random() * 12,
    speed: (isMobile ? 0.16 : 0.28) + Math.random() * 0.28,
    opacity: (isMobile ? 0.035 : 0.05) + Math.random() * 0.055,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.006 + Math.random() * 0.01,
    warmth: Math.random(),
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
  const spacing = width / Math.max(2, Math.min(4, totalBeams));
  const column = index % Math.max(2, Math.min(4, totalBeams));

  beam.y = height + 80;
  beam.x =
    column * spacing +
    spacing / 2 +
    (Math.random() - 0.5) * spacing * 0.7;
  beam.width = (isMobile ? 44 : 64) + Math.random() * (isMobile ? 36 : 70);
  beam.length = height * (isMobile ? 1.65 : 2.1);
  beam.speed = (isMobile ? 0.14 : 0.26) + Math.random() * 0.26;
  beam.opacity = (isMobile ? 0.03 : 0.045) + Math.random() * 0.05;
  beam.warmth = Math.random();
}

function drawBeam(
  ctx: CanvasRenderingContext2D,
  beam: Beam,
  intensity: "subtle" | "medium"
) {
  ctx.save();
  ctx.translate(beam.x, beam.y);
  ctx.rotate((beam.angle * Math.PI) / 180);

  const intensityOpacity = intensity === "medium" ? 1.15 : 0.78;
  const pulseOpacity =
    beam.opacity * (0.82 + Math.sin(beam.pulse) * 0.18) * intensityOpacity;
  const red = beam.warmth > 0.62 ? "252, 18, 53" : "142, 10, 34";

  const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
  gradient.addColorStop(0, `rgba(18, 0, 5, 0)`);
  gradient.addColorStop(0.14, `rgba(${red}, ${pulseOpacity * 0.36})`);
  gradient.addColorStop(0.42, `rgba(252, 18, 53, ${pulseOpacity})`);
  gradient.addColorStop(0.62, `rgba(94, 6, 23, ${pulseOpacity * 0.72})`);
  gradient.addColorStop(0.86, `rgba(18, 0, 5, ${pulseOpacity * 0.22})`);
  gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
  ctx.restore();
}

export function ToolsBeamsBackground({
  className,
  intensity = "subtle",
}: ToolsBeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, isMobile: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const updateCanvasSize = () => {
      const rect = parent.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const isMobile = width < 640;
      const beamCount = width < 460 ? 0 : isMobile ? 6 : width < 1024 ? 9 : 13;

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

    const animate = () => {
      const { width, height, isMobile } = sizeRef.current;
      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);
      ctx.filter = isMobile ? "blur(40px)" : "blur(52px)";
      ctx.globalCompositeOperation = "screen";

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -80) {
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

    if (!reduceMotion) {
      animate();
    }

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [intensity]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-black",
        className
      )}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-[0.16] sm:opacity-[0.18]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(252,18,53,0.08),rgba(18,0,5,0.04)_34%,transparent_62%)] sm:hidden" />
      <motion.div
        className="absolute inset-0 bg-black/10"
        animate={{ opacity: [0.12, 0.2, 0.12] }}
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        style={{ backdropFilter: "blur(42px)" }}
      />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
