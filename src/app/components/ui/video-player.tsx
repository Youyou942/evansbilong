import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";

import { Button } from "./button";
import { cn } from "./utils";

const MOBILE_BREAKPOINT_QUERY = "(max-width: 768px)";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

type CustomSliderProps = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  ariaLabel: string;
};

function CustomSlider({ value, onChange, className, ariaLabel }: CustomSliderProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const updateFromClientX = (clientX: number, rect: DOMRect) => {
    const nextValue = ((clientX - rect.left) / rect.width) * 100;
    onChange(Math.min(Math.max(nextValue, 0), 100));
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clampedValue)}
      className={cn("relative h-1.5 w-full cursor-pointer rounded-full bg-white/18", className)}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        updateFromClientX(event.clientX, rect);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
          event.preventDefault();
          onChange(Math.max(clampedValue - 5, 0));
        }

        if (event.key === "ArrowRight" || event.key === "ArrowUp") {
          event.preventDefault();
          onChange(Math.min(clampedValue + 5, 100));
        }

        if (event.key === "Home") {
          event.preventDefault();
          onChange(0);
        }

        if (event.key === "End") {
          event.preventDefault();
          onChange(100);
        }
      }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-[#FC1235] shadow-[0_0_14px_rgba(252,18,53,0.35)]"
        initial={false}
        animate={{ width: `${clampedValue}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}
      />

      <motion.span
        className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-white/60 bg-white shadow-[0_0_12px_rgba(252,18,53,0.28)]"
        initial={false}
        animate={{ left: `${clampedValue}%` }}
        transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}
        style={{ x: "-50%" }}
      />
    </div>
  );
}

type VideoPlayerProps = {
  src: string;
  fallbackSrc?: string;
  className?: string;
};

export function VideoPlayer({ src, fallbackSrc, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousVolumeRef = useRef(1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
  });

  const useNativeControls = isMobileViewport;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateViewport);
      return () => mediaQuery.removeEventListener("change", updateViewport);
    }

    mediaQuery.addListener(updateViewport);
    return () => mediaQuery.removeListener(updateViewport);
  }, []);

  const controlsVisible = !useNativeControls && (showControls || !isPlaying);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  const handleVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    const nextVolume = value / 100;
    video.volume = nextVolume;
    video.muted = nextVolume === 0;

    if (nextVolume > 0) {
      previousVolumeRef.current = nextVolume;
    }

    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextDuration = Number.isFinite(video.duration) ? video.duration : 0;
    const nextProgress = nextDuration > 0 ? (video.currentTime / nextDuration) * 100 : 0;

    setCurrentTime(video.currentTime);
    setDuration(nextDuration);
    setProgress(Number.isFinite(nextProgress) ? nextProgress : 0);
  };

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    const nextTime = (value / 100) * video.duration;
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
    setProgress(value);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted || volume === 0) {
      const restoredVolume = previousVolumeRef.current > 0 ? previousVolumeRef.current : 1;
      video.muted = false;
      video.volume = restoredVolume;
      setVolume(restoredVolume);
      setIsMuted(false);
      return;
    }

    previousVolumeRef.current = volume > 0 ? volume : previousVolumeRef.current;
    video.muted = true;
    video.volume = 0;
    setVolume(0);
    setIsMuted(true);
  };

  const updatePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  return (
    <motion.div
      className={cn(
        "relative mx-auto w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] shadow-[0_28px_80px_rgba(0,0,0,0.45)]",
        className,
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (!isMobileViewport) {
          setShowControls(false);
        }
      }}
      onTouchStart={() => setShowControls(true)}
      style={{ maxWidth: "100%" }}
    >
      <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9", maxHeight: isMobileViewport ? "75dvh" : undefined }}>
        <video
          ref={videoRef}
          className="h-full w-full bg-black object-contain"
          controls={useNativeControls}
          autoPlay={false}
          playsInline
          preload="metadata"
          style={{ width: "100%", height: useNativeControls ? "auto" : "100%", maxHeight: isMobileViewport ? "75dvh" : undefined, objectFit: "contain" }}
          onClick={() => {
            if (!useNativeControls) {
              setShowControls(true);
              void togglePlay();
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setShowControls(true);
          }}
          onLoadedMetadata={handleTimeUpdate}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleTimeUpdate}
        >
          <source src={src} type="video/webm" />
          {fallbackSrc ? <source src={fallbackSrc} type="video/mp4" /> : null}
        </video>

        {!useNativeControls && (
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),transparent_28%,transparent_66%,rgba(0,0,0,0.72))]" />
        )}

        <AnimatePresence>
          {controlsVisible && (
            <motion.div
              className="absolute inset-x-3 bottom-3 rounded-[22px] border border-white/10 bg-[rgba(8,8,8,0.78)] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:inset-x-4 sm:bottom-4 sm:p-4"
              initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 14, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: isMobileViewport ? "calc(100% - 24px)" : undefined,
                marginInline: "auto",
              }}
            >
              <div className="mb-3 flex items-center gap-2 sm:gap-3">
                <span className="min-w-[2.75rem] font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/72 sm:text-[0.7rem]">
                  {formatTime(currentTime)}
                </span>
                <CustomSlider value={progress} onChange={handleSeek} className="flex-1" ariaLabel="Progression vidéo" />
                <span className="min-w-[2.75rem] text-right font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/72 sm:text-[0.7rem]">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Button
                    type="button"
                    onClick={() => void togglePlay()}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-[#FC1235]/14 hover:text-white"
                  >
                    {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5" />}
                  </Button>

                  <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
                    <Button
                      type="button"
                      onClick={toggleMute}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full border border-white/10 bg-white/5 text-white hover:bg-[#FC1235]/14 hover:text-white"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-4.5 w-4.5" />
                      ) : volume > 0.5 ? (
                        <Volume2 className="h-4.5 w-4.5" />
                      ) : (
                        <Volume1 className="h-4.5 w-4.5" />
                      )}
                    </Button>

                    <div className="w-[72px] max-w-[26vw] sm:w-28 sm:max-w-none">
                      <CustomSlider value={volume * 100} onChange={handleVolumeChange} ariaLabel="Volume" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <Button
                      key={speed}
                      type="button"
                      onClick={() => updatePlaybackSpeed(speed)}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 rounded-full border border-white/8 bg-white/5 px-2 text-[0.68rem] font-medium text-white/82 hover:bg-[#FC1235]/14 hover:text-white sm:px-3 sm:text-[0.72rem]",
                        playbackSpeed === speed &&
                          "border-[#FC1235]/45 bg-[#FC1235]/16 text-white shadow-[inset_0_0_0_1px_rgba(252,18,53,0.12)]",
                      )}
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}