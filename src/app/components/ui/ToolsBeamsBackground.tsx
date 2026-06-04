import { useEffect, useRef } from "react";
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

function createBeam(width: number, height: number, isTablet: boolean): Beam {
  return {
    x: Math.random() * width * 1.18 - width * 0.09,
    y: Math.random() * height * 1.18 - height * 0.09,
    width: (isTablet ? 48 : 64) + Math.random() * (isTablet ? 28 : 46),
    length: height * (isTablet ? 1.45 : 1.85),
    angle: -38 + Math.random() * 10,
    speed: (isTablet ? 0.11 : 0.18) + Math.random() * 0.14,
    opacity: (isTablet ? 0.026 : 0.034) + Math.random() * 0.026,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.0035 + Math.random() * 0.0045,
    warmth: Math.random(),
  };
}

function resetBeam(
  beam: Beam,
  index: number,
  totalBeams: number,
  width: number,
  height: number,
  isTablet: boolean
) {
  const columns = Math.max(2, Math.min(4, totalBeams));
  const column = index % columns;
  const spacing = width / columns;

  beam.y = height + 80;
  beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.62;
  beam.width = (isTablet ? 46 : 62) + Math.random() * (isTablet ? 26 : 42);
  beam.length = height * (isTablet ? 1.42 : 1.8);
  beam.speed = (isTablet ? 0.1 : 0.17) + Math.random() * 0.13;
  beam.opacity = (isTablet ? 0.024 : 0.032) + Math.random() * 0.024;
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

  const intensityOpacity = intensity === "medium" ? 1.05 : 0.72;
  const pulseOpacity =
    beam.opacity * (0.9 + Math.sin(beam.pulse) * 0.1) * intensityOpacity;
  const red = beam.warmth > 0.68 ? "252, 18, 53" : "94, 6, 23";

  const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(0.16, `rgba(${red}, ${pulseOpacity * 0.28})`);
  gradient.addColorStop(0.42, `rgba(252, 18, 53, ${pulseOpacity})`);
  gradient.addColorStop(0.68, `rgba(94, 6, 23, ${pulseOpacity * 0.52})`);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
  ctx.restore();
}

export function ToolsBeamsBackground({
  className,
  intensity = "subtle",
}: ToolsBeamsBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const visibleRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const sizeRef = useRef({ width: 0, height: 0, isMobile: false, isTablet: false });

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stop = () => {
      runningRef.current = false;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const updateCanvasSize = () => {
      const rect = root.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      const beamCount = isMobile ? 0 : isTablet ? 5 : 8;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width, height, isMobile, isTablet };
      beamsRef.current = Array.from({ length: beamCount }, () =>
        createBeam(width, height, isTablet)
      );

      if (beamCount === 0) {
        ctx.clearRect(0, 0, width, height);
        stop();
      }
    };

    const animate = () => {
      if (!runningRef.current) return;

      const { width, height, isMobile, isTablet } = sizeRef.current;
      if (!width || !height || isMobile || beamsRef.current.length === 0) {
        stop();
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.filter = isTablet ? "blur(40px)" : "blur(52px)";
      ctx.globalCompositeOperation = "screen";

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -80) {
          resetBeam(beam, index, totalBeams, width, height, isTablet);
        }

        drawBeam(ctx, beam, intensity);
      });

      ctx.globalCompositeOperation = "source-over";
      frameRef.current = requestAnimationFrame(animate);
    };

    const start = () => {
      const { isMobile } = sizeRef.current;
      if (
        runningRef.current ||
        isMobile ||
        !visibleRef.current ||
        document.hidden ||
        reduceMotionRef.current ||
        beamsRef.current.length === 0
      ) {
        return;
      }

      runningRef.current = true;
      frameRef.current = requestAnimationFrame(animate);
    };

    const updateActive = () => {
      if (!visibleRef.current || document.hidden || reduceMotionRef.current) {
        stop();
        return;
      }

      start();
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
      updateActive();
    });
    resizeObserver.observe(root);
    updateCanvasSize();

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        updateActive();
      },
      { rootMargin: "120px 0px" }
    );
    intersectionObserver.observe(root);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = reduceMotion.matches;

    const onReduceMotionChange = () => {
      reduceMotionRef.current = reduceMotion.matches;
      updateActive();
    };

    const onVisibilityChange = () => updateActive();

    reduceMotion.addEventListener("change", onReduceMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reduceMotion.removeEventListener("change", onReduceMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intensity]);

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
        className="absolute inset-0 hidden opacity-[0.13] sm:block md:opacity-[0.15]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(252,18,53,0.052),rgba(18,0,5,0.03)_34%,transparent_62%)] sm:hidden" />
      <div className="absolute inset-0 bg-black/10" style={{ backdropFilter: "blur(42px)" }} />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
