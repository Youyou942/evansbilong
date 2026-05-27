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

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />
      <div className="relative">
        <IconRow logos={loopedLogos} direction="left" />
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
}: {
  logos: Logo[];
  direction: "left";
}) {
  return (
    <div className="flex w-max">
      <div
        className="tools-marquee-left flex w-max items-center gap-9 sm:gap-12 md:gap-14 lg:gap-16"
        aria-hidden="true"
      >
        {logos.map((logo, index) => (
          <ToolIconLiquid
            key={`left-${logo.id}-${index}`}
            name={logo.name}
            Icon={logo.Icon}
          />
        ))}
      </div>
    </div>
  );
}
