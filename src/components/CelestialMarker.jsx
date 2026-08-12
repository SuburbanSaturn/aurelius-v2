/**
 * CelestialMarker — tiny animated celestial glyph.
 *
 * Props:
 *   variant — "star" | "planet" | "ring" | "constellation" | "vortex" | "orb"
 *   size — pixel size (default: 24)
 *   intensity — "low" | "medium" | "high" (default: "medium")
 *   hover — whether to show enhanced state (default: false)
 */
export default function CelestialMarker({
  variant = "star",
  size = 24,
  intensity = "medium",
  hover = false,
}) {
  const opBase = intensity === "low" ? 0.4 : intensity === "high" ? 0.75 : 0.55;
  const hoverClass = hover ? " celestial-marker--hover" : "";

  return (
    <span
      className={`celestial-marker celestial-marker--${variant}${hoverClass}`}
      aria-hidden="true"
      style={{ "--cm-size": `${size}px`, "--cm-op": opBase }}
    >
      <style>{`
        .celestial-marker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--cm-size);
          height: var(--cm-size);
          position: relative;
          opacity: var(--cm-op);
          transition: opacity 300ms ease, transform 300ms ease;
        }

        .celestial-marker--hover {
          opacity: calc(var(--cm-op) + 0.2);
          transform: scale(1.1);
        }

        .celestial-marker svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* Star */
        .celestial-marker--star svg {
          animation: cmSpin 12s linear infinite, cmPulse 4s ease-in-out infinite;
        }

        /* Planet */
        .celestial-marker--planet svg {
          animation: cmPulse 5s ease-in-out infinite;
        }

        /* Ring */
        .celestial-marker--ring svg {
          animation: cmSpin 16s linear infinite;
        }

        /* Constellation */
        .celestial-marker--constellation svg {
          animation: cmPulse 6s ease-in-out infinite;
        }

        /* Vortex */
        .celestial-marker--vortex svg {
          animation: cmSpin 8s linear infinite, cmPulse 3.5s ease-in-out infinite;
        }

        /* Orb */
        .celestial-marker--orb svg {
          animation: cmBreathe 4s ease-in-out infinite;
        }

        @keyframes cmSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes cmPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes cmBreathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.8; }
        }

        @media (prefers-reduced-motion: reduce) {
          .celestial-marker svg {
            animation: none !important;
          }
        }
      `}</style>

      {variant === "star" && (
        <svg viewBox="0 0 24 24" fill="none">
          <line x1="12" y1="2" x2="12" y2="22" stroke="rgba(255,180,140,0.7)" strokeWidth="0.6" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="rgba(255,180,140,0.7)" strokeWidth="0.6" />
          <line x1="5" y1="5" x2="19" y2="19" stroke="rgba(255,180,140,0.4)" strokeWidth="0.4" />
          <line x1="19" y1="5" x2="5" y2="19" stroke="rgba(255,180,140,0.4)" strokeWidth="0.4" />
          <circle cx="12" cy="12" r="2" fill="rgba(255,200,160,0.8)" />
        </svg>
      )}

      {variant === "planet" && (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill="rgba(200,80,60,0.6)" />
          <circle cx="12" cy="12" r="4" stroke="rgba(255,120,80,0.3)" strokeWidth="0.5" />
          <ellipse cx="12" cy="12" rx="9" ry="3" stroke="rgba(210,160,80,0.4)" strokeWidth="0.5" transform="rotate(-20 12 12)" />
          <circle cx="19" cy="10" r="0.8" fill="rgba(210,160,80,0.6)">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="6s" repeatCount="indefinite" />
          </circle>
        </svg>
      )}

      {variant === "ring" && (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="rgba(180,100,140,0.4)" strokeWidth="0.5" />
          <circle cx="12" cy="12" r="5" stroke="rgba(180,100,140,0.3)" strokeWidth="0.4" strokeDasharray="2 3" />
          <circle cx="12" cy="12" r="1.5" fill="rgba(200,140,180,0.6)" />
          <circle cx="12" cy="4" r="0.7" fill="rgba(200,140,180,0.5)">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="10s" repeatCount="indefinite" />
          </circle>
        </svg>
      )}

      {variant === "constellation" && (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="8" r="1" fill="rgba(180,200,230,0.7)" />
          <circle cx="12" cy="5" r="1.2" fill="rgba(180,200,230,0.8)" />
          <circle cx="18" cy="9" r="0.9" fill="rgba(180,200,230,0.6)" />
          <circle cx="15" cy="16" r="1.1" fill="rgba(180,200,230,0.7)" />
          <circle cx="8" cy="18" r="0.8" fill="rgba(180,200,230,0.5)" />
          <line x1="6" y1="8" x2="12" y2="5" stroke="rgba(180,200,230,0.25)" strokeWidth="0.4" />
          <line x1="12" y1="5" x2="18" y2="9" stroke="rgba(180,200,230,0.25)" strokeWidth="0.4" />
          <line x1="18" y1="9" x2="15" y2="16" stroke="rgba(180,200,230,0.25)" strokeWidth="0.4" />
          <line x1="15" y1="16" x2="8" y2="18" stroke="rgba(180,200,230,0.25)" strokeWidth="0.4" />
        </svg>
      )}

      {variant === "vortex" && (
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 6 A6 6 0 0 1 18 12" stroke="rgba(255,80,50,0.5)" strokeWidth="0.6" fill="none" />
          <path d="M12 8 A4 4 0 0 1 16 12" stroke="rgba(255,80,50,0.4)" strokeWidth="0.5" fill="none" />
          <path d="M12 10 A2 2 0 0 1 14 12" stroke="rgba(255,80,50,0.3)" strokeWidth="0.4" fill="none" />
          <circle cx="12" cy="12" r="1.2" fill="rgba(255,100,60,0.7)" />
        </svg>
      )}

      {variant === "orb" && (
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="rgba(210,160,60,0.15)" />
          <circle cx="12" cy="12" r="3" fill="rgba(210,160,60,0.25)" />
          <circle cx="12" cy="12" r="1.5" fill="rgba(255,200,100,0.6)" />
        </svg>
      )}
    </span>
  );
}
