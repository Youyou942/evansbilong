import type { IconType } from "react-icons";
import { cn } from "./utils";

type ToolIconLiquidProps = {
  name: string;
  Icon: IconType;
  className?: string;
};

export function ToolIconLiquid({
  name,
  Icon,
  className,
}: ToolIconLiquidProps) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-visible sm:h-14 sm:w-14 md:h-16 md:w-16",
        className
      )}
      aria-label={name}
    >
      <Icon className="h-8 w-8 text-[#FC1235] drop-shadow-[0_0_8px_rgba(252,18,53,0.22)] sm:h-10 sm:w-10 md:h-11 md:w-11" />
    </div>
  );
}
