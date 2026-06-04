import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { ToolIconLiquid } from "./ToolIconLiquid";
import { cn } from "./utils";

interface Logo {
  id: string;
  name: string;
  Icon: IconType;
}

interface Logos3Props {
  logos: Logo[];
  className?: string;
}

const marqueeStyles = `
  @keyframes tools-marquee-left {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(-50%, 0, 0); }
  }

  @keyframes tools-marquee-right {
    from { transform: translate3d(-50%, 0, 0); }
    to { transform: translate3d(0, 0, 0); }
  }

  .tools-marquee-left {
    animation: tools-marquee-left 56s linear infinite;
  }
`;

export function Logos3({ logos, className }: Logos3Props) {
  const loopedLogos = [...logos, ...logos, ...logos, ...logos];
  const rootRef = useRef<HTMLDivElement>(null);
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
      { rootMargin: "120px 0px" }
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

  return (
    <div ref={rootRef} className={cn("relative w-full overflow-hidden", className)}>
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />
      <div className="relative">
        <IconRow logos={loopedLogos} direction="left" active={isActive} />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32"
        style={{
          background:
            "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.86) 34%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32"
        style={{
          background:
            "linear-gradient(270deg, #000 0%, rgba(0,0,0,0.86) 34%, transparent 100%)",
        }}
      />
    </div>
  );
}

function IconRow({
  logos,
  active,
}: {
  logos: Logo[];
  direction: "left";
  active: boolean;
}) {
  return (
    <div className="flex w-max">
      <div
        className="tools-marquee-left flex w-max items-center gap-9 sm:gap-12 md:gap-14 lg:gap-16"
        aria-hidden="true"
        style={{ animationPlayState: active ? "running" : "paused" }}
      >
        {logos.map((logo, index) => (
          <ToolIconLiquid
            key={`left-${logo.id}-${index}`}
            name={logo.name}
            Icon={logo.Icon}
            active={active}
          />
        ))}
      </div>
    </div>
  );
}
