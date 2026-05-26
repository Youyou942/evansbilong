import AutoScroll from "embla-carousel-auto-scroll";
import type { IconType } from "react-icons";
import { Carousel, CarouselContent, CarouselItem } from "./carousel";
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

export function Logos3({ logos, className }: Logos3Props) {
  return (
    <div className={cn("relative w-full overflow-hidden bg-black", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
        }}
        plugins={[
          AutoScroll({
            playOnInit: true,
            speed: 0.8,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full bg-black"
      >
        <CarouselContent className="ml-0 bg-black">
          {[...logos, ...logos].map((logo, index) => (
            <CarouselItem
              key={`${logo.id}-${index}`}
              className="basis-1/2 pl-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <div className="flex min-h-20 items-center justify-center px-6 sm:min-h-24 sm:px-8 lg:px-10">
                <div className="group flex items-center gap-3 text-white/42 transition-colors duration-300 hover:text-[#FC1235]">
                  <logo.Icon
                    className="h-6 w-6 shrink-0 text-white/70 transition-colors duration-300 group-hover:text-[#FC1235] sm:h-7 sm:w-7"
                    style={{
                      color: "currentColor",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="whitespace-nowrap text-sm font-semibold tracking-[-0.02em] sm:text-base"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {logo.name}
                  </span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24"
        style={{
          background:
            "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.82) 38%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24"
        style={{
          background:
            "linear-gradient(270deg, #000 0%, rgba(0,0,0,0.82) 38%, transparent 100%)",
        }}
      />
    </div>
  );
}
