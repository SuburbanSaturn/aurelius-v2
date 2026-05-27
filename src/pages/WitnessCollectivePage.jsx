import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReflections } from "../services/api";

const ambientDots = [
  { left: "14%", top: "22%", size: 5, delay: "0s" },
  { left: "27%", top: "72%", size: 3, delay: "1.4s" },
  { left: "39%", top: "34%", size: 4, delay: "2.2s" },
  { left: "64%", top: "18%", size: 3, delay: "0.8s" },
  { left: "78%", top: "58%", size: 5, delay: "1.8s" },
  { left: "88%", top: "76%", size: 3, delay: "2.8s" },
];

export default function WitnessCollectivePage() {
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getReflections();
        setReflections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Collective fetch error:", err);
        setError("The Collective is difficult to reach right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchReflections();
  }, []);

  return (
    <main className="collective-page">
      <style>{`
        .collective-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 22%, rgba(120, 15, 15, 0.22), transparent 28%),
            radial-gradient(circle at 50% 82%, rgba(85, 5, 5, 0.22), transparent 36%),
            #020101;
          color: rgba(255, 245, 245, 0.86);
          padding: 64px 24px;
          position: relative;
          overflow: hidden;
        }

        .collective-dot {
          position: absolute;
          width: var(--size);
          height: var(--size);
          left: var(--left);
          top: var(--top);
          border-radius: 999px;
          background: rgba(255, 45, 45, 0.72);
          box-shadow: 0 0 20px rgba(255, 45, 45, 0.85);
          opacity: 0.5;
          animation: collectiveFloat 8s ease-in-out infinite alternate;
          animation-delay: var(--delay);
          pointer-events: none;
        }

        .collective-shell {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .collective-header {
          text-align: center;
          margin-bottom: 72px;
        }

        .collective-kicker {
          margin-bottom: 14px;
          letter-spacing: 3px;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: rgba(255, 220, 220, 0.36);
        }

        .collective-title {
          margin: 0;
          font-size: clamp(2rem, 5vw, 3.8rem);
          font-weight: 300;
          letter-spacing: 0.12em;
          color: rgba(255, 240, 240, 0.86);
        }

        .collective-subtitle {
          margin-top: 20px;
          color: rgba(255, 220, 220, 0.38);
        }

        .collective-list {
          display: grid;
          gap: 86px;
          max-width: 760px;
          margin: 0 auto;
        }

        .collective-card {
          width: min(100%, 620px);
          padding: 0;
          border: none;
          background: transparent;
          box-shadow: none;
          transition: transform 220ms ease, opacity 220ms ease;
        }

        .collective-card:nth-child(3n + 1) {
          justify-self: start;
        }

        .collective-card:nth-child(3n + 2) {
          justify-self: end;
          transform: translateY(22px);
        }

        .collective-card:nth-child(3n) {
          justify-self: center;
          transform: translateY(-8px);
        }

        .collective-card:hover {
          transform: translateY(-4px) scale(1.015);
        }

        .collective-card:nth-child(3n + 2):hover {
          transform: translateY(18px) scale(1.015);
        }

        .collective-card:nth-child(3n):hover {
          transform: translateY(-12px) scale(1.015);
        }

        .collective-quote {
          margin: 0;
          color: rgba(255, 240, 240, 0.76);
          font-size: clamp(1rem, 1.8vw, 1.28rem);
          line-height: 1.75;
          text-shadow: 0 0 18px rgba(255, 90, 90, 0.08);
          transition: color 180ms ease, text-shadow 180ms ease;
        }

        .collective-card:hover .collective-quote {
          color: rgba(255, 248, 248, 0.94);
          text-shadow: 0 0 24px rgba(255, 90, 90, 0.18);
        }

        .collective-meta {
          display: block;
          margin-top: 18px;
          color: rgba(255, 220, 220, 0.22);
          font-size: 0.78rem;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 200ms ease, transform 200ms ease, color 200ms ease;
        }

        .collective-card:hover .collective-meta {
          opacity: 1;
          transform: translateY(0);
          color: rgba(255, 220, 220, 0.48);
        }

        .collective-empty,
        .collective-loading,
        .collective-error {
          text-align: center;
          color: rgba(255, 220, 220, 0.45);
          margin: 80px 0;
        }

        .collective-footer {
          width: 100%;
          max-width: 820px;
          margin: 84px auto 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          text-align: center;
        }

        .collective-footer a {
          padding: 14px 12px;
          border: 1px solid rgba(155, 35, 35, 0.2);
          background: rgba(45, 4, 4, 0.24);
          color: rgba(255, 235, 235, 0.68);
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .collective-footer a:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 80, 80, 0.38);
          background: rgba(85, 8, 8, 0.34);
          box-shadow: 0 0 30px rgba(145, 18, 18, 0.22);
        }

        @keyframes collectiveFloat {
          from {
            transform: translate3d(0, 0, 0) scale(0.82);
            opacity: 0.28;
          }
          to {
            transform: translate3d(18px, -28px, 0) scale(1.14);
            opacity: 0.78;
          }
        }

        @media (max-width: 720px) {
          .collective-page {
            padding: 48px 18px;
          }

          .collective-list {
            gap: 42px;
          }

          .collective-card,
          .collective-card:nth-child(3n + 1),
          .collective-card:nth-child(3n + 2),
          .collective-card:nth-child(3n) {
            width: 100%;
            justify-self: center;
            transform: none;
          }

          .collective-card:hover,
          .collective-card:nth-child(3n + 2):hover,
          .collective-card:nth-child(3n):hover {
            transform: translateY(-2px);
          }

          .collective-meta {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      {ambientDots.map((dot, index) => (
        <span
          key={index}
          className="collective-dot"
          style={{
            "--left": dot.left,
            "--top": dot.top,
            "--size": `${dot.size}px`,
            "--delay": dot.delay,
          }}
        />
      ))}

      <section className="collective-shell">
        <header className="collective-header">
          <p className="collective-kicker">Witnessing</p>
          <h1 className="collective-title">Witness the Collective</h1>
          <p className="collective-subtitle">You are not alone in this pattern.</p>
        </header>

        {loading && <p className="collective-loading">Gathering reflections...</p>}

        {error && <p className="collective-error">{error}</p>}

        {!loading && !error && reflections.length === 0 && (
          <p className="collective-empty">The Collective is quiet. Be the first signal.</p>
        )}

        {!loading && !error && reflections.length > 0 && (
          <div className="collective-list">
            {reflections.map((r) => (
              <article key={r.reflection_id} className="collective-card">
                <p className="collective-quote">“{r.content}”</p>
                <small className="collective-meta">
                  {r.location?.city || "Unknown location"} • {new Date(r.timestamp).toLocaleString()}
                </small>
              </article>
            ))}
          </div>
        )}

        <footer className="collective-footer">
          <Link to="/insights">Explore Patterns</Link>
          <Link to="/echoes">Listen to Echoes</Link>
          <Link to="/scripture">Compose Scripture</Link>
          <Link to="/">Offer a Reflection</Link>
        </footer>
      </section>
    </main>
  );
}