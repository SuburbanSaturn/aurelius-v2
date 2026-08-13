import { useRef, useEffect } from "react";

/**
 * AureliusAtmosphere — global atmospheric video background layer.
 *
 * Renders an extremely dim looping video beneath all page content,
 * creating a sense of slow, alive movement deep in the interface.
 *
 * Props:
 *   src — path to video asset (default: /media/aurelius-hero-4.mp4)
 *
 * Layering (bottom to top):
 *   1. Video element (very low opacity, filtered, blended)
 *   2. Dark vignette overlay
 *   3. [page backgrounds sit above this component]
 */
export default function AureliusAtmosphere({ src = "/media/aurelius-hero-4.mp4" }) {
  const videoRef = useRef(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    // Ensure autoplay even if browser delays it
    const video = videoRef.current;
    if (video && !reducedMotion) {
      video.play().catch(() => {
        // Autoplay blocked — silent fail, static dark bg remains
      });
    }
  }, [reducedMotion]);

  return (
    <div className="aurelius-atmosphere" aria-hidden="true">
      <style>{`
        .aurelius-atmosphere {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .aurelius-atmosphere-video {
          position: absolute;
          inset: -2%;
          width: 104%;
          height: 104%;
          object-fit: cover;
          opacity: 0.34;
          filter: blur(3px) saturate(0.7) contrast(1.06) brightness(0.75);
          mix-blend-mode: screen;
          transform: scale(1.02);
        }

        .aurelius-atmosphere-bloom {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 40% 45%, rgba(160, 40, 30, 0.04), transparent 50%),
            radial-gradient(ellipse at 65% 60%, rgba(180, 100, 40, 0.025), transparent 45%);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .aurelius-atmosphere-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at center, transparent 25%, rgba(2, 1, 1, 0.75) 78%),
            linear-gradient(180deg, rgba(2, 1, 1, 0.35) 0%, transparent 12%, transparent 88%, rgba(2, 1, 1, 0.45) 100%);
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .aurelius-atmosphere-video {
            display: none;
          }
        }
      `}</style>

      {!reducedMotion && (
        <video
          ref={videoRef}
          className="aurelius-atmosphere-video"
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
        />
      )}

      <div className="aurelius-atmosphere-bloom" />
      <div className="aurelius-atmosphere-vignette" />
    </div>
  );
}
