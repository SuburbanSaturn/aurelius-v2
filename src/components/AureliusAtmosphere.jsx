import { useRef, useEffect } from "react";

/**
 * AureliusAtmosphere — global atmospheric video background layer.
 *
 * Renders a heavily diffused looping video beneath all page content,
 * overlaid with soft circular bloom/lens forms and subtle fractal echoes.
 * Creates a sense of glowing memory moving behind wet glass.
 *
 * Props:
 *   src — path to video asset (default: /media/aurelius-hero-4.mp4)
 */
export default function AureliusAtmosphere({ src = "/media/aurelius-hero-4.mp4" }) {
  const videoRef = useRef(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const video = videoRef.current;
    if (video && !reducedMotion) {
      video.play().catch(() => {});
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

        /* --- Primary video layer --- */
        .aurelius-atmosphere-video {
          position: absolute;
          inset: -3%;
          width: 106%;
          height: 106%;
          object-fit: cover;
          opacity: 0.30;
          filter: blur(5px) saturate(0.6) contrast(0.95) brightness(0.6);
          mix-blend-mode: screen;
          transform: scale(1.03);
        }

        /* --- Circular bloom / lens forms --- */
        .aurelius-atmosphere-lens {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          animation: atmosphereLensDrift 26s ease-in-out infinite alternate;
        }

        .aurelius-lens-disc {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        /* Large off-center crimson disc */
        .aurelius-lens-disc--1 {
          width: 45vw;
          height: 45vw;
          top: -8%;
          left: -12%;
          background: radial-gradient(circle, rgba(140, 30, 25, 0.045) 0%, rgba(140, 30, 25, 0.015) 40%, transparent 70%);
        }

        /* Medium amber halo — lower right */
        .aurelius-lens-disc--2 {
          width: 35vw;
          height: 35vw;
          bottom: -5%;
          right: -8%;
          background: radial-gradient(circle, rgba(180, 110, 40, 0.035) 0%, rgba(180, 110, 40, 0.01) 45%, transparent 72%);
        }

        /* Small violet disc — upper right */
        .aurelius-lens-disc--3 {
          width: 22vw;
          height: 22vw;
          top: 15%;
          right: 12%;
          background: radial-gradient(circle, rgba(120, 70, 140, 0.04) 0%, transparent 60%);
        }

        /* Faint concentric ring — center-left */
        .aurelius-lens-disc--4 {
          width: 30vw;
          height: 30vw;
          top: 35%;
          left: 8%;
          background: radial-gradient(circle, transparent 35%, rgba(160, 50, 40, 0.02) 40%, transparent 45%, rgba(160, 50, 40, 0.012) 52%, transparent 58%);
        }

        /* --- Fractal echo layer (refracted duplicated forms) --- */
        .aurelius-atmosphere-echo {
          position: absolute;
          inset: -5%;
          width: 110%;
          height: 110%;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.12;
          filter: blur(8px) saturate(0.4);
          transform: scale(1.08) rotate(2deg);
          animation: atmosphereEchoDrift 30s ease-in-out infinite alternate;
        }

        /* --- Dark vignette (content readability) --- */
        .aurelius-atmosphere-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at center, transparent 22%, rgba(2, 1, 1, 0.78) 76%),
            linear-gradient(180deg, rgba(2, 1, 1, 0.38) 0%, transparent 10%, transparent 90%, rgba(2, 1, 1, 0.48) 100%);
          pointer-events: none;
        }

        @keyframes atmosphereLensDrift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(8px, -6px) scale(1.015); }
        }

        @keyframes atmosphereEchoDrift {
          from { transform: scale(1.08) rotate(2deg) translate(0, 0); }
          to { transform: scale(1.06) rotate(-1deg) translate(-12px, 8px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .aurelius-atmosphere-video,
          .aurelius-atmosphere-echo {
            display: none;
          }
          .aurelius-atmosphere-lens {
            animation: none !important;
          }
        }
      `}</style>

      {!reducedMotion && (
        <>
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
          {/* Fractal echo: same video, more blur, offset, lower opacity */}
          <video
            className="aurelius-atmosphere-echo"
            src={src}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
          />
        </>
      )}

      {/* Circular bloom / lens overlay */}
      <div className="aurelius-atmosphere-lens">
        <div className="aurelius-lens-disc aurelius-lens-disc--1" />
        <div className="aurelius-lens-disc aurelius-lens-disc--2" />
        <div className="aurelius-lens-disc aurelius-lens-disc--3" />
        <div className="aurelius-lens-disc aurelius-lens-disc--4" />
      </div>

      <div className="aurelius-atmosphere-vignette" />
    </div>
  );
}
