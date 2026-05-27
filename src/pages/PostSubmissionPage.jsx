import { Link, useLocation } from "react-router-dom";

const particles = [
  { left: "46%", top: "41%", size: 4, delay: "0s", distanceX: "-110px", distanceY: "-70px" },
  { left: "49%", top: "39%", size: 3, delay: "0.04s", distanceX: "-58px", distanceY: "-112px" },
  { left: "52%", top: "41%", size: 5, delay: "0.08s", distanceX: "82px", distanceY: "-92px" },
  { left: "54%", top: "44%", size: 3, delay: "0.12s", distanceX: "118px", distanceY: "-28px" },
  { left: "47%", top: "46%", size: 4, delay: "0.16s", distanceX: "-122px", distanceY: "32px" },
  { left: "51%", top: "46%", size: 3, delay: "0.2s", distanceX: "32px", distanceY: "98px" },
  { left: "50%", top: "42%", size: 5, delay: "0.24s", distanceX: "0px", distanceY: "-138px" },
  { left: "53%", top: "40%", size: 3, delay: "0.28s", distanceX: "142px", distanceY: "-74px" },
  { left: "45%", top: "44%", size: 3, delay: "0.32s", distanceX: "-158px", distanceY: "-16px" },
  { left: "55%", top: "46%", size: 4, delay: "0.36s", distanceX: "144px", distanceY: "62px" },
  { left: "48%", top: "39%", size: 2, delay: "0.4s", distanceX: "-86px", distanceY: "-134px" },
  { left: "51%", top: "43%", size: 3, delay: "0.44s", distanceX: "64px", distanceY: "124px" },
  { left: "50%", top: "40%", size: 4, delay: "0.48s", distanceX: "22px", distanceY: "-112px" },
  { left: "49%", top: "45%", size: 2, delay: "0.52s", distanceX: "-36px", distanceY: "118px" },
  { left: "52%", top: "44%", size: 3, delay: "0.56s", distanceX: "108px", distanceY: "38px" },
  { left: "47%", top: "42%", size: 2, delay: "0.6s", distanceX: "-126px", distanceY: "-52px" },
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
            #020101;
          color: rgba(255, 245, 245, 0.86);
          padding: 72px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .submission-ambient-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: rgba(255, 45, 45, 0.72);
          box-shadow: 0 0 18px rgba(255, 45, 45, 0.85);
          animation: floatDot 9s ease-in-out infinite alternate;
          opacity: 0.72;
        }

        .submission-burst-dot {
          position: absolute;
          width: var(--size);
          height: var(--size);
          left: var(--left);
          top: var(--top);
          border-radius: 999px;
          background: rgba(255, 40, 40, 0.95);
          box-shadow: 0 0 20px rgba(255, 45, 45, 0.95);
          animation: particleSmash 1.8s ease-out forwards;
          animation-delay: var(--delay);
          opacity: 0;
        }

        .submission-panel {
          width: 100%;
          max-width: 640px;
          position: relative;
          z-index: 2;
        }

        .submission-title {
          margin: 0;
          font-size: clamp(1.8rem, 4vw, 3.1rem);
          font-weight: 300;
          letter-spacing: 0.04em;
          color: rgba(255, 240, 240, 0.82);
        }

        .submission-subtitle {
          margin: 20px 0 56px;
          color: rgba(255, 220, 220, 0.42);
          font-size: 1.05rem;
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
        }

        .submission-label {
          margin-bottom: 22px;
          color: rgba(255, 220, 220, 0.34);
          font-size: 0.85rem;
        }

        .submission-links {
          display: grid;
          gap: 16px;
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
        }

        .submission-link {
          display: block;
          padding: 16px 20px;
          border: 1px solid rgba(155, 35, 35, 0.24);
          background: rgba(55, 4, 4, 0.34);
          color: rgba(255, 235, 235, 0.76);
          text-decoration: none;
          box-shadow: 0 0 24px rgba(115, 8, 8, 0.16);
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .submission-link:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 80, 80, 0.42);
          background: rgba(95, 10, 10, 0.42);
          box-shadow: 0 0 36px rgba(155, 18, 18, 0.34);
        }

        .submission-footnote {
          margin-top: 54px;
          color: rgba(255, 220, 220, 0.26);
          font-size: 0.82rem;
        }

        @keyframes particleSmash {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.4);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--distanceX), var(--distanceY)) scale(1.6);
          }
        }

        @keyframes floatDot {
          from {
            transform: translate3d(0, 0, 0) scale(0.8);
            opacity: 0.35;
          }
          to {
            transform: translate3d(18px, -24px, 0) scale(1.15);
            opacity: 0.82;
          }
        }
      `}</style>

      <span className="submission-ambient-dot" style={{ left: "18%", top: "28%" }} />
      <span className="submission-ambient-dot" style={{ left: "72%", top: "22%", animationDelay: "1.2s" }} />
      <span className="submission-ambient-dot" style={{ left: "28%", top: "72%", animationDelay: "2.4s" }} />
      <span className="submission-ambient-dot" style={{ left: "82%", top: "68%", animationDelay: "3s" }} />

      {particles.map((particle, index) => (
        <span
          key={index}
          className="submission-burst-dot"
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
        </nav>

        <p className="submission-footnote">{copy.footnote}</p>
      </section>
    </main>
  );
}