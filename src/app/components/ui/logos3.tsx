import type { IconType } from "react-icons";
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
    animation: tools-marquee-left 38s linear infinite;
  }

  .tools-marquee-right {
    animation: tools-marquee-right 42s linear infinite;
  }
`;

export function Logos3({ logos, className }: Logos3Props) {
  const loopedLogos = [...logos, ...logos, ...logos, ...logos];
  const reversedLogos = [...logos].reverse();
  const loopedReversedLogos = [
    ...reversedLogos,
    ...reversedLogos,
    ...reversedLogos,
    ...reversedLogos,
  ];

  return (
    <div className={cn("relative w-full overflow-hidden bg-black", className)}>
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />
      <div className="relative flex flex-col gap-5 bg-black sm:gap-7">
        <IconRow logos={loopedLogos} direction="left" />
        <IconRow logos={loopedReversedLogos} direction="right" />
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
  direction,
}: {
  logos: Logo[];
  direction: "left" | "right";
}) {
  return (
    <div className="flex w-max bg-black">
      <div
        className={cn(
          "flex w-max items-center gap-8 bg-black sm:gap-11 md:gap-14 lg:gap-16",
          direction === "left" ? "tools-marquee-left" : "tools-marquee-right"
        )}
        aria-hidden="true"
      >
        {logos.map((logo, index) => (
          <div
            key={`${direction}-${logo.id}-${index}`}
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#050505] text-white/72 sm:h-24 sm:w-24 md:h-28 md:w-28"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <logo.Icon className="h-11 w-11 sm:h-13 sm:w-13 md:h-16 md:w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
