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
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.18;
          filter: brightness(0.5) saturate(0.5) blur(0.5px);
          mix-blend-mode: screen;
        }

        .aurelius-atmosphere-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at center, transparent 30%, rgba(2, 1, 1, 0.7) 80%),
            linear-gradient(180deg, rgba(2, 1, 1, 0.3) 0%, transparent 15%, transparent 85%, rgba(2, 1, 1, 0.4) 100%);
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

      <div className="aurelius-atmosphere-vignette" />
    </div>
  );
}
