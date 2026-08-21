import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { motion, useInView } from "motion/react";
import type { ProjectVideo } from "../data/projects";

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";
const E = [0.22, 1, 0.36, 1] as const;

export function VideoProjectGallery({ videos }: { videos: ProjectVideo[] }) {
  const [activeVideo, setActiveVideo] = useState<ProjectVideo | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  if (!videos.length) return null;

  return (
    <>
      <section
        ref={ref}
        className="mx-auto px-6 md:px-12"
        style={{
          maxWidth: "1400px",
          paddingTop: "clamp(5rem, 10vw, 8rem)",
          paddingBottom: "clamp(5rem, 10vw, 8rem)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: E }}
            className="md:col-span-5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: "18px", height: "1px", backgroundColor: "#FC1235" }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: "0.48rem",
                  color: "#FC1235",
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                }}
              >
                Sélection
              </span>
            </div>
            <h2
              style={{
                fontFamily: SANS,
                fontSize: "clamp(2.1rem, 5vw, 4.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.045em",
                lineHeight: 0.95,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Montage, rythme, atmosphère.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.08, ease: E }}
            className="md:col-span-5 md:col-start-8"
            style={{
              fontFamily: SANS,
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "#8A8A8A",
              letterSpacing: "-0.005em",
              margin: 0,
            }}
          >
            Une sélection pensée comme une table de montage : peu d'éléments, un contraste fort,
            et des formats courts qui laissent le rythme prendre la place.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {videos.map((video, index) => (
            <VideoCard
              key={video.src}
              video={video}
              index={index}
              active={inView}
              onOpen={() => setActiveVideo(video)}
            />
          ))}
        </div>
      </section>

      <VideoApproach />

      {activeVideo && (
        <VideoLightbox
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  );
}

function VideoCard({
  video,
  index,
  active,
  onOpen,
}: {
  video: ProjectVideo;
  index: number;
  active: boolean;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <motion.button
      type="button"
      aria-label={`Ouvrir la vidéo ${video.title}`}
      initial={{ opacity: 0, y: 22 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.08, ease: E }}
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative block w-full overflow-hidden text-left"
      style={{
        aspectRatio: index === 0 ? "16 / 9" : "16 / 10",
        backgroundColor: "#050505",
        border: hover ? "1px solid rgba(252,18,53,0.42)" : "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
      }}
    >
      <img
        src={video.poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          filter: hover
            ? "brightness(0.7) contrast(1.1) saturate(0.86)"
            : "brightness(0.52) contrast(1.08) saturate(0.78)",
          transform: hover ? "scale(1.025)" : "scale(1)",
          transition: "filter 0.45s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.36) 38%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      <div className="absolute left-4 top-4 md:left-5 md:top-5">
        <span
          style={{
            fontFamily: MONO,
            fontSize: "0.44rem",
            color: hover ? "#FC1235" : "rgba(255,255,255,0.36)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            transition: "color 0.3s ease",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-5 p-4 md:p-6">
        <div className="min-w-0">
          <h3
            style={{
              fontFamily: SANS,
              fontSize: "clamp(1.2rem, 2.2vw, 1.8rem)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1,
              color: "#FFFFFF",
              margin: 0,
              marginBottom: "0.55rem",
            }}
          >
            {video.title}
          </h3>
          <p
            style={{
              fontFamily: MONO,
              fontSize: "0.44rem",
              color: "rgba(255,255,255,0.42)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {video.description}
          </p>
        </div>

        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{
            border: hover ? "1px solid #FC1235" : "1px solid rgba(255,255,255,0.18)",
            backgroundColor: hover ? "#FC1235" : "rgba(0,0,0,0.42)",
            color: "#FFFFFF",
            transition: "all 0.35s ease",
          }}
          aria-hidden="true"
        >
          <Play size={15} fill="currentColor" strokeWidth={1.6} />
        </span>
      </div>
    </motion.button>
  );
}

function VideoLightbox({
  video,
  onClose,
}: {
  video: ProjectVideo;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      videoRef.current?.pause();
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [video.src]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto px-3 py-5 md:px-8"
      style={{
        backgroundColor: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(8px)",
        minHeight: "100dvh",
        overscrollBehavior: "contain",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Lecteur vidéo ${video.title}`}
    >
      <div
        className="relative w-full"
        style={{ maxWidth: "min(1180px, 100%)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la vidéo"
          className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 md:-top-14 md:right-0"
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            backgroundColor: "rgba(0,0,0,0.58)",
            color: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          <X size={18} strokeWidth={1.8} />
        </button>

        <div
          className="overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.11)",
            backgroundColor: "#030303",
            boxShadow: "0 24px 90px rgba(0,0,0,0.62)",
          }}
        >
          <video
            ref={videoRef}
            key={video.src}
            controls
            playsInline
            preload="none"
            poster={video.poster}
            className="block h-auto w-full"
            style={{ maxHeight: "calc(100dvh - 8rem)", backgroundColor: "#000000" }}
          >
            <source src={video.src} type="video/mp4" />
            Votre navigateur ne peut pas lire cette vidéo.
          </video>
        </div>

        <div className="mt-4 flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
          <h2
            style={{
              fontFamily: SANS,
              fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            {video.title}
          </h2>
          <p
            style={{
              fontFamily: MONO,
              fontSize: "0.44rem",
              color: "rgba(255,255,255,0.38)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function VideoApproach() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="mx-auto px-6 md:px-12"
      style={{
        maxWidth: "1400px",
        paddingBottom: "clamp(6rem, 12vw, 10rem)",
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: E }}
        className="h-px bg-white/[0.07] origin-left"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 pt-14 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: E }}
          className="md:col-span-4"
        >
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: "18px", height: "1px", backgroundColor: "#FC1235" }} />
            <span
              style={{
                fontFamily: MONO,
                fontSize: "0.48rem",
                color: "#FC1235",
                letterSpacing: "0.42em",
                textTransform: "uppercase",
              }}
            >
              Approche
            </span>
          </div>
          <h2
            style={{
              fontFamily: SANS,
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 1,
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Rythme et direction.
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.08, ease: E }}
          className="md:col-span-6 md:col-start-7"
          style={{
            fontFamily: SANS,
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "#9A9A9A",
            letterSpacing: "-0.005em",
            margin: 0,
          }}
        >
          Ces vidéos mettent l'accent sur le rythme, le montage, l'ambiance et la cohérence
          visuelle. Chaque format est pensé comme une courte séquence avec une direction claire :
          capter l'attention, installer une atmosphère et donner du caractère à l'image.
        </motion.p>
      </div>
    </section>
  );
}
