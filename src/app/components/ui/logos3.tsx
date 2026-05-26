import AutoScroll from "embla-carousel-auto-scroll";
import { Carousel, CarouselContent, CarouselItem } from "./carousel";
import { cn } from "./utils";

interface Logo {
  id: string;
  name: string;
  mark: string;
}

interface Logos3Props {
  logos: Logo[];
  className?: string;
}

export function Logos3({ logos, className }: Logos3Props) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
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
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {[...logos, ...logos].map((logo, index) => (
            <CarouselItem
              key={`${logo.id}-${index}`}
              className="basis-1/2 pl-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <div className="flex min-h-20 items-center justify-center px-6 sm:min-h-24 sm:px-8 lg:px-10">
                <div className="group flex items-center gap-3 text-white/42 transition-colors duration-300 hover:text-[#FC1235]">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.62rem] font-semibold tracking-[-0.03em] text-white/70 transition-colors duration-300 group-hover:text-[#FC1235] sm:h-9 sm:w-9"
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.01))",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                    aria-hidden="true"
                  >
                    {logo.mark}
                  </span>
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
