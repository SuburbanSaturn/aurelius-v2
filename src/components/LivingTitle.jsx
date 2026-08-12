/**
 * LivingTitle — Aurelius animated title with celestial light pass and breathing glow.
 *
 * Props:
 *   children — title text content
 *   kicker — small uppercase label above the title (optional)
 *   subtitle — descriptive text below (optional)
 *   cycle — light pass duration in seconds (default: 10)
 *   intensity — glow intensity "low" | "medium" | "high" (default: "medium")
 */
export default function LivingTitle({
  children,
  kicker,
  subtitle,
  cycle = 10,
  intensity = "medium",
}) {
  const glowOpacity =
    intensity === "low" ? 0.08 : intensity === "high" ? 0.16 : 0.12;
  const breatheMax =
    intensity === "low" ? 0.6 : intensity === "high" ? 0.9 : 0.8;

  return (
    <header className="living-title-header">
      <style>{`
        .living-title-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .living-title-kicker {
          margin: 0 0 14px;
          letter-spacing: 3px;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: rgba(255, 220, 220, 0.36);
        }

        .living-title {
          margin: 0;
          font-size: clamp(2rem, 5vw, 3.8rem);
          font-weight: 300;
          letter-spacing: 0.12em;
          color: rgba(255, 240, 240, 0.88);
          text-shadow: 0 0 22px rgba(255, 90, 90, 0.08);
          position: relative;
          display: inline-block;
        }

        .living-title-text {
          background: linear-gradient(
            90deg,
            rgba(255, 240, 240, 0.88) 0%,
            rgba(255, 240, 240, 0.88) 44%,
            rgba(255, 195, 140, 1) 49%,
            rgba(255, 220, 170, 1) 51%,
            rgba(255, 240, 240, 0.88) 56%,
            rgba(255, 240, 240, 0.88) 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: livingTitlePass var(--lt-cycle, 10s) ease-in-out infinite;
        }

        .living-title-glow {
          position: absolute;
          inset: -8px -16px;
          border-radius: 50%;
          pointer-events: none;
          animation: livingTitleBreathe 8s ease-in-out infinite;
        }

        .living-title-subtitle {
          margin-top: 18px;
          color: rgba(255, 220, 220, 0.38);
          font-size: 1rem;
        }

        @keyframes livingTitlePass {
          0%, 100% { background-position: 100% 0; }
          50% { background-position: -100% 0; }
        }

        @keyframes livingTitleBreathe {
          0%, 100% { opacity: var(--lt-breathe-min, 0.5); transform: scale(1); }
          50% { opacity: var(--lt-breathe-max, 0.8); transform: scale(1.04); }
        }

        @media (prefers-reduced-motion: reduce) {
          .living-title-text {
            animation: none !important;
            -webkit-text-fill-color: rgba(255, 240, 240, 0.88);
            background: none;
          }
          .living-title-glow {
            animation: none !important;
            opacity: 0.5;
          }
        }
      `}</style>

      {kicker && <p className="living-title-kicker">{kicker}</p>}

      <h1
        className="living-title"
        style={{ "--lt-cycle": `${cycle}s`, "--lt-breathe-min": "0.4", "--lt-breathe-max": `${breatheMax}` }}
      >
        <span
          className="living-title-glow"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse at center, rgba(200, 60, 40, ${glowOpacity}), transparent 70%)`,
          }}
        />
        <span className="living-title-text">{children}</span>
      </h1>

      {subtitle && <p className="living-title-subtitle">{subtitle}</p>}
    </header>
  );
}
