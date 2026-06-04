import { useId } from "react";
import { motion } from "motion/react";
import type { IconType } from "react-icons";
import { cn } from "./utils";

type ColorKey =
  | "color1"
  | "color2"
  | "color3"
  | "color4"
  | "color5"
  | "color6"
  | "color7"
  | "color8";

type Colors = Record<ColorKey, string>;

const LIQUID_COLORS: Colors = {
  color1: "#000000",
  color2: "#120005",
  color3: "#2A000A",
  color4: "#FC1235",
  color5: "#5E0617",
  color6: "#FFFFFF",
  color7: "#8E0A22",
  color8: "#000000",
};

const svgOrder = ["svg1", "svg2", "svg3", "svg2", "svg1"] as const;

type SvgKey = (typeof svgOrder)[number];

type Stop = {
  offset: number;
  stopColor: string;
  stopOpacity?: number;
};

type SvgState = {
  gradientTransform: string;
  stops: Stop[];
};

type SvgStates = Record<SvgKey, SvgState>;

type ToolIconLiquidProps = {
  name: string;
  Icon: IconType;
  className?: string;
  active?: boolean;
};

const createStopsArray = (
  svgStates: SvgStates,
  maxStops: number
): Stop[][] => {
  return Array.from({ length: maxStops }, (_, index) =>
    svgOrder.map((svgKey) => {
      const svg = svgStates[svgKey];
      return svg.stops[index] || svg.stops[svg.stops.length - 1];
    })
  );
};

function LiquidAura({ gradientId, active }: { gradientId: string; active: boolean }) {
  const svgStates: SvgStates = {
    svg1: {
      gradientTransform:
        "translate(42 42) rotate(-24) scale(64 42)",
      stops: [
        { offset: 0, stopColor: LIQUID_COLORS.color6, stopOpacity: 0.3 },
        { offset: 0.18, stopColor: LIQUID_COLORS.color4, stopOpacity: 0.34 },
        { offset: 0.42, stopColor: LIQUID_COLORS.color7, stopOpacity: 0.22 },
        { offset: 0.68, stopColor: LIQUID_COLORS.color2, stopOpacity: 0.18 },
        { offset: 1, stopColor: LIQUID_COLORS.color1, stopOpacity: 0 },
      ],
    },
    svg2: {
      gradientTransform:
        "translate(58 34) rotate(-68) scale(54 68)",
      stops: [
        { offset: 0, stopColor: LIQUID_COLORS.color4, stopOpacity: 0.38 },
        { offset: 0.24, stopColor: LIQUID_COLORS.color5, stopOpacity: 0.28 },
        { offset: 0.5, stopColor: LIQUID_COLORS.color3, stopOpacity: 0.22 },
        { offset: 0.76, stopColor: LIQUID_COLORS.color2, stopOpacity: 0.12 },
        { offset: 1, stopColor: LIQUID_COLORS.color8, stopOpacity: 0 },
      ],
    },
    svg3: {
      gradientTransform:
        "translate(36 56) rotate(-138) scale(72 48)",
      stops: [
        { offset: 0, stopColor: LIQUID_COLORS.color6, stopOpacity: 0.2 },
        { offset: 0.14, stopColor: LIQUID_COLORS.color4, stopOpacity: 0.36 },
        { offset: 0.36, stopColor: LIQUID_COLORS.color7, stopOpacity: 0.26 },
        { offset: 0.7, stopColor: LIQUID_COLORS.color2, stopOpacity: 0.16 },
        { offset: 1, stopColor: LIQUID_COLORS.color1, stopOpacity: 0 },
      ],
    },
  };

  const maxStops = Math.max(
    ...Object.values(svgStates).map((svg) => svg.stops.length)
  );
  const stopsAnimationArray = createStopsArray(svgStates, maxStops);
  const gradientTransform = svgOrder.map(
    (svgKey) => svgStates[svgKey].gradientTransform
  );

  return (
    <svg
      className="h-full w-full"
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="12"
        y="16"
        width="72"
        height="64"
        rx="28"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <motion.radialGradient
          id={gradientId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          animate={active ? { gradientTransform } : { gradientTransform: gradientTransform[0] }}
          transition={active ? { duration: 18, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
        >
          {stopsAnimationArray.map((stopConfigs, index) => (
            <motion.stop
              key={index}
              initial={{
                offset: stopConfigs[0].offset,
                stopColor: stopConfigs[0].stopColor,
                stopOpacity: stopConfigs[0].stopOpacity,
              }}
              animate={{
                offset: active ? stopConfigs.map((config) => config.offset) : stopConfigs[0].offset,
                stopColor: active ? stopConfigs.map((config) => config.stopColor) : stopConfigs[0].stopColor,
                stopOpacity: active ? stopConfigs.map((config) => config.stopOpacity) : stopConfigs[0].stopOpacity,
              }}
              transition={active ? { duration: 18, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
            />
          ))}
        </motion.radialGradient>
      </defs>
    </svg>
  );
}

export function ToolIconLiquid({
  name,
  Icon,
  className,
  active = true,
}: ToolIconLiquidProps) {
  const gradientId = `tool-liquid-${useId().replace(/:/g, "")}`;

  return (
    <div
      className={cn(
        "relative isolate flex h-12 w-12 shrink-0 items-center justify-center overflow-visible sm:h-14 sm:w-14 md:h-16 md:w-16",
        className
      )}
      aria-label={name}
    >
      <div className="pointer-events-none absolute inset-[-18%] -z-10 opacity-75 blur-[13px]">
        <LiquidAura gradientId={gradientId} active={active} />
      </div>
      <Icon className="h-8 w-8 text-[#FC1235] drop-shadow-[0_0_8px_rgba(252,18,53,0.22)] sm:h-10 sm:w-10 md:h-11 md:w-11" />
    </div>
  );
}
