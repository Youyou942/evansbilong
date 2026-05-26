import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "./utils";

type GlowColor = "red";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  width?: string | number;
  height?: string | number;
}

const glowColorMap: Record<GlowColor, { rgb: string }> = {
  red: { rgb: "252 18 53" },
};

type GlowCardStyles = CSSProperties & {
  "--glow-rgb": string;
  "--radius": string;
  "--border": string;
  "--backdrop": string;
  "--backup-border": string;
  "--size": string;
  "--outer": string;
  "--border-size": string;
  "--spotlight-size": string;
};

const glowStyles = `
  [data-glow-card]::before,
  [data-glow-card]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
    -webkit-mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    -webkit-mask-clip: padding-box, border-box;
    -webkit-mask-composite: source-in;
  }

  [data-glow-card]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.72) calc(var(--spotlight-size) * 0.72) at
      calc(var(--x, -9999) * 1px)
      calc(var(--y, -9999) * 1px),
      rgb(var(--glow-rgb) / var(--border-spot-opacity, 0.86)), transparent 100%
    );
    filter: brightness(1.55);
  }

  [data-glow-card]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.38) calc(var(--spotlight-size) * 0.38) at
      calc(var(--x, -9999) * 1px)
      calc(var(--y, -9999) * 1px),
      rgb(255 255 255 / var(--border-light-opacity, 0.24)), transparent 100%
    );
  }

  [data-glow-card] > [data-glow-inner] {
    position: absolute;
    inset: 0;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    filter: blur(calc(var(--border-size) * 8));
    pointer-events: none;
  }

  @media (hover: none) {
    [data-glow-card] {
      background-image: none !important;
    }
  }
`;

export function GlowCard({
  children,
  className,
  glowColor = "red",
  width,
  height,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { rgb } = glowColorMap[glowColor];

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const syncPointer = (event: PointerEvent) => {
      card.style.setProperty("--x", event.clientX.toFixed(2));
      card.style.setProperty("--y", event.clientY.toFixed(2));
    };

    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  const styles: GlowCardStyles = {
    "--glow-rgb": rgb,
    "--radius": "18",
    "--border": "1",
    "--backdrop": "rgb(8 8 8 / 0.88)",
    "--backup-border": "rgb(255 255 255 / 0.08)",
    "--size": "220",
    "--outer": "1",
    "--border-size": "calc(var(--border, 1) * 1px)",
    "--spotlight-size": "calc(var(--size, 220) * 1px)",
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, -9999) * 1px)
      calc(var(--y, -9999) * 1px),
      rgb(var(--glow-rgb) / 0.105), transparent 70%
    )`,
    backgroundColor: "var(--backdrop)",
    backgroundSize:
      "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
    backgroundPosition: "50% 50%",
    backgroundAttachment: "fixed",
    border: "var(--border-size) solid var(--backup-border)",
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: glowStyles }} />
      <div
        ref={cardRef}
        data-glow-card
        style={styles}
        className={cn(
          "relative overflow-hidden rounded-[18px] p-5 shadow-[0_1.5rem_3rem_-2rem_black] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 sm:p-6",
          className
        )}
      >
        <div data-glow-inner />
        {children}
      </div>
    </>
  );
}
