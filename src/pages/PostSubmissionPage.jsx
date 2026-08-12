import { Link, useLocation } from "react-router-dom";

// Particles resolve inward then settle — feels like fragments reassembling
const particles = [
  { left: "46%", top: "41%", size: 4, delay: "0s", distanceX: "-90px", distanceY: "-55px" },
  { left: "49%", top: "39%", size: 3, delay: "0.03s", distanceX: "-42px", distanceY: "-88px" },
  { left: "52%", top: "41%", size: 5, delay: "0.06s", distanceX: "64px", distanceY: "-72px" },
  { left: "54%", top: "44%", size: 3, delay: "0.09s", distanceX: "96px", distanceY: "-20px" },
  { left: "47%", top: "46%", size: 4, delay: "0.12s", distanceX: "-98px", distanceY: "24px" },
  { left: "51%", top: "46%", size: 3, delay: "0.15s", distanceX: "24px", distanceY: "78px" },
  { left: "50%", top: "42%", size: 5, delay: "0.18s", distanceX: "0px", distanceY: "-108px" },
  { left: "53%", top: "40%", size: 3, delay: "0.21s", distanceX: "112px", distanceY: "-56px" },
  { left: "45%", top: "44%", size: 3, delay: "0.24s", distanceX: "-126px", distanceY: "-12px" },
  { left: "55%", top: "46%", size: 4, delay: "0.27s", distanceX: "114px", distanceY: "48px" },
  { left: "48%", top: "39%", size: 2, delay: "0.3s", distanceX: "-66px", distanceY: "-104px" },
  { left: "51%", top: "43%", size: 3, delay: "0.33s", distanceX: "50px", distanceY: "96px" },
  { left: "50%", top: "40%", size: 4, delay: "0.36s", distanceX: "16px", distanceY: "-86px" },
  { left: "49%", top: "45%", size: 2, delay: "0.39s", distanceX: "-28px", distanceY: "92px" },
  { left: "52%", top: "44%", size: 3, delay: "0.42s", distanceX: "84px", distanceY: "30px" },
  { left: "47%", top: "42%", size: 2, delay: "0.45s", distanceX: "-100px", distanceY: "-40px" },
  { left: "50%", top: "43%", size: 2, delay: "0.1s", distanceX: "38px", distanceY: "-62px" },
  { left: "48%", top: "44%", size: 3, delay: "0.2s", distanceX: "-72px", distanceY: "54px" },
  { left: "53%", top: "42%", size: 2, delay: "0.35s", distanceX: "92px", distanceY: "-34px" },
  { left: "46%", top: "45%", size: 3, delay: "0.05s", distanceX: "-54px", distanceY: "72px" },
];

// Deeper ambient dots with varied depth
const ambientDots = [
  { left: "14%", top: "22%", size: 3, delay: "0s", duration: "11s", opacity: 0.3 },
  { left: "78%", top: "18%", size: 4, delay: "1.4s", duration: "9s", opacity: 0.45 },
  { left: "24%", top: "74%", size: 2, delay: "2.2s", duration: "13s", opacity: 0.22 },
  { left: "86%", top: "66%", size: 3, delay: "0.8s", duration: "10s", opacity: 0.35 },
  { left: "8%", top: "52%", size: 2, delay: "3.1s", duration: "14s", opacity: 0.2 },
  { left: "92%", top: "38%", size: 3, delay: "1.8s", duration: "12s", opacity: 0.28 },
  { left: "32%", top: "86%", size: 2, delay: "2.8s", duration: "11s", opacity: 0.24 },
  { left: "68%", top: "82%", size: 3, delay: "0.4s", duration: "10s", opacity: 0.32 },
];

const getSubmissionCopy = (state = {}) => {
  const moderationStatus = state.moderationStatus || "approved";
  const visibility = state.visibility || "public";

  if (moderationStatus === "shadow_candidate") {
    return {
      title: "Your reflection has been received.",
      subtitle:
        "It will not appear publicly, but it may help shape private pattern analysis within Aurelius.",
      label: "You may still",
      footnote:
        "Some reflections are held privately so the Collective can remain safe while still learning from deeper signals.",
      showCollectiveLink: false,
    };
  }

  if (moderationStatus === "flagged" || visibility === "hidden") {
    return {
      title: "Your reflection has been received for review.",
      subtitle:
        "It will not be shown publicly in the Collective right now.",
      label: "You may",
      footnote:
        "Aurelius sometimes holds reflections privately when they may need more care before becoming part of the public stream.",
      showCollectiveLink: false,
    };
  }

  return {
    title: "Your reflection has been received.",
    subtitle: "It now exists within the Collective.",
    label: "You may",
    footnote: "The reflection has entered the stream. Choose where to listen next.",
    showCollectiveLink: true,
  };
};

export default function PostSubmissionPage() {
  const location = useLocation();
  const copy = getSubmissionCopy(location.state);

  return (
    <main className="submission-page">
      <style>{`
        .submission-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 42%, rgba(135, 15, 15, 0.3), transparent 30%),
            radial-gradient(circle at 50% 55%, rgba(80, 4, 4, 0.28), transparent 38%),
            rgba(2, 1, 1, 0.82);
          color: rgba(255, 245, 245, 0.86);
          padding: 72px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        /* Ambient floating dots with depth */
        .submission-ambient-dot {
          position: absolute;
          border-radius: 999px;
          background: rgba(255, 45, 45, 0.72);
          pointer-events: none;
          will-change: transform, opacity;
          animation: floatDot var(--dot-dur, 9s) ease-in-out infinite alternate;
          animation-delay: var(--dot-delay, 0s);
          opacity: var(--dot-opacity, 0.5);
        }

        /* Resolve particles — start displaced, converge to center, then fade */
        .submission-resolve-dot {
          position: absolute;
          width: var(--size);
          height: var(--size);
          left: var(--left);
          top: var(--top);
          border-radius: 999px;
          background: rgba(255, 50, 50, 0.9);
          box-shadow: 0 0 14px rgba(255, 45, 45, 0.8);
          animation: particleResolve 1.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
          animation-delay: var(--delay);
          opacity: 0;
        }

        .submission-panel {
          width: 100%;
          max-width: 640px;
          position: relative;
          z-index: 2;
          animation: panelReveal 1s ease-out 0.4s both;
        }

        .submission-title {
          margin: 0;
          font-size: clamp(1.8rem, 4vw, 3.1rem);
          font-weight: 300;
          letter-spacing: 0.04em;
          color: rgba(255, 240, 240, 0.82);
          animation: contentFadeUp 0.8s ease-out 0.6s both;
        }

        .submission-subtitle {
          margin: 20px 0 56px;
          color: rgba(255, 220, 220, 0.42);
          font-size: 1.05rem;
          animation: contentFadeUp 0.8s ease-out 0.75s both;
        }

        .submission-status-pill {
          display: inline-block;
          margin-bottom: 22px;
          padding: 7px 12px;
          border: 1px solid rgba(255, 80, 80, 0.2);
          background: rgba(55, 4, 4, 0.24);
          color: rgba(255, 220, 220, 0.42);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation: contentFadeUp 0.7s ease-out 0.5s both;
        }

        .submission-label {
          margin-bottom: 22px;
          color: rgba(255, 220, 220, 0.34);
          font-size: 0.85rem;
          animation: contentFadeUp 0.8s ease-out 0.9s both;
        }

        .submission-links {
          display: grid;
          gap: 16px;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          animation: contentFadeUp 0.8s ease-out 1s both;
        }

        .submission-link {
          display: block;
          padding: 16px 20px;
          border: 1px solid rgba(155, 35, 35, 0.24);
          background: rgba(55, 4, 4, 0.34);
          color: rgba(255, 235, 235, 0.76);
          text-decoration: none;
          box-shadow: 0 0 24px rgba(115, 8, 8, 0.16);
          transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), border-color 200ms ease, box-shadow 200ms ease, background 200ms ease;
        }

        .submission-link:hover {
          transform: translateY(-2px) scale(1.01);
          border-color: rgba(255, 80, 80, 0.42);
          background: rgba(95, 10, 10, 0.42);
          box-shadow: 0 0 42px rgba(155, 18, 18, 0.34);
        }

        .submission-link:active {
          transform: translateY(0px) scale(0.98);
          transition-duration: 80ms;
        }

        .submission-feedback-link {
          border-color: rgba(255, 160, 140, 0.32);
          background: rgba(105, 18, 18, 0.24);
          color: rgba(255, 235, 230, 0.82);
        }

        .submission-feedback-note {
          margin: 28px auto 0;
          max-width: 480px;
          color: rgba(255, 220, 220, 0.34);
          font-size: 0.82rem;
          line-height: 1.6;
          animation: contentFadeUp 0.8s ease-out 1.1s both;
        }

        .submission-footnote {
          margin-top: 54px;
          color: rgba(255, 220, 220, 0.26);
          font-size: 0.82rem;
          animation: contentFadeUp 0.8s ease-out 1.2s both;
        }

        /* Keyframes */
        @keyframes particleResolve {
          0% {
            opacity: 0.9;
            transform: translate(var(--distanceX), var(--distanceY)) scale(1.4);
          }
          60% {
            opacity: 0.7;
            transform: translate(calc(var(--distanceX) * 0.1), calc(var(--distanceY) * 0.1)) scale(0.9);
          }
          80% {
            opacity: 0.4;
            transform: translate(0, 0) scale(0.7);
          }
          100% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
        }

        @keyframes floatDot {
          from {
            transform: translate3d(0, 0, 0) scale(0.8);
          }
          to {
            transform: translate3d(14px, -20px, 0) scale(1.12);
          }
        }

        @keyframes panelReveal {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes contentFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .submission-resolve-dot,
          .submission-ambient-dot {
            animation: none !important;
            opacity: 0 !important;
          }
          .submission-panel,
          .submission-title,
          .submission-subtitle,
          .submission-status-pill,
          .submission-label,
          .submission-links,
          .submission-feedback-note,
          .submission-footnote {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .submission-link {
            transition: none !important;
          }
        }

        @media (max-width: 720px) {
          .submission-page {
            padding: 48px 18px;
          }
          .submission-ambient-dot {
            opacity: calc(var(--dot-opacity, 0.5) * 0.6) !important;
          }
          .submission-resolve-dot {
            opacity: 0 !important;
            animation-duration: 0.8s;
          }
        }
      `}</style>

      {/* Deeper ambient dots */}
      {ambientDots.map((dot, index) => (
        <span
          key={`ambient-${index}`}
          className="submission-ambient-dot"
          style={{
            left: dot.left,
            top: dot.top,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            "--dot-dur": dot.duration,
            "--dot-delay": dot.delay,
            "--dot-opacity": dot.opacity,
            boxShadow: `0 0 ${dot.size * 4}px rgba(255, 45, 45, ${dot.opacity * 0.9})`,
          }}
        />
      ))}

      {/* Resolve particles — converge inward to represent reassembly */}
      {particles.map((particle, index) => (
        <span
          key={`resolve-${index}`}
          className="submission-resolve-dot"
          style={{
            "--left": particle.left,
            "--top": particle.top,
            "--size": `${particle.size}px`,
            "--delay": particle.delay,
            "--distanceX": particle.distanceX,
            "--distanceY": particle.distanceY,
          }}
        />
      ))}

      <section className="submission-panel">
        <span className="submission-status-pill">
          {location.state?.moderationStatus || "approved"}
        </span>

        <h1 className="submission-title">{copy.title}</h1>
        <p className="submission-subtitle">{copy.subtitle}</p>

        <p className="submission-label">{copy.label}</p>

        <nav className="submission-links">
          {copy.showCollectiveLink && (
            <Link className="submission-link" to="/witness-the-collective">
              Witness the Collective
            </Link>
          )}
          <Link className="submission-link" to="/echoes">
            Listen to echoes
          </Link>
          <Link className="submission-link" to="/insights">
            Explore patterns
          </Link>
          <Link className="submission-link" to="/scripture">
            Compose scripture
          </Link>
          <Link className="submission-link" to="/">
            Offer another reflection
          </Link>
          <Link className="submission-link submission-feedback-link" to="/feedback">
            Help shape Aurelius
          </Link>
        </nav>

        <p className="submission-feedback-note">
          Beta feedback does not enter the Collective. It helps improve the vessel.
        </p>

        <p className="submission-footnote">{copy.footnote}</p>
      </section>
    </main>
  );
}
