import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReflections } from "../services/api";
import LivingTitle from "../components/LivingTitle";
import CelestialField from "../components/CelestialField";
import CelestialMarker from "../components/CelestialMarker";

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
            rgba(2, 1, 1, 0.82);
          color: rgba(255, 245, 245, 0.86);
          padding: 64px 24px;
          position: relative;
          overflow: hidden;
        }

        .collective-shell {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .collective-list {
          display: grid;
          gap: 72px;
          max-width: 760px;
          margin: 0 auto;
        }

        .collective-card {
          width: min(100%, 620px);
          padding: 12px 0;
          border: none;
          background: transparent;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          border-radius: 4px;
          transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1), background 250ms ease, box-shadow 250ms ease;
        }

        .collective-card .celestial-marker {
          flex-shrink: 0;
          margin-top: 5px;
          transition: opacity 250ms ease, transform 250ms ease;
        }

        .collective-card:hover .celestial-marker {
          opacity: 0.85 !important;
          transform: scale(1.2) rotate(15deg);
        }

        .collective-card-content {
          flex: 1;
          min-width: 0;
        }

        .collective-card:nth-child(3n + 1) { justify-self: start; }
        .collective-card:nth-child(3n + 2) { justify-self: end; transform: translateY(18px); }
        .collective-card:nth-child(3n) { justify-self: center; transform: translateY(-6px); }

        .collective-card:hover {
          transform: translateX(4px) translateY(-3px);
          background: rgba(80, 15, 12, 0.06);
          box-shadow: 0 0 20px rgba(150, 30, 20, 0.05);
        }
        .collective-card:nth-child(3n + 2):hover { transform: translateX(4px) translateY(15px); }
        .collective-card:nth-child(3n):hover { transform: translateX(4px) translateY(-9px); }

        .collective-quote {
          margin: 0;
          color: rgba(255, 240, 240, 0.72);
          font-size: clamp(1rem, 1.8vw, 1.28rem);
          line-height: 1.8;
          text-shadow: 0 0 14px rgba(255, 90, 90, 0.05);
          transition: color 250ms ease, text-shadow 250ms ease;
        }

        .collective-card:hover .collective-quote {
          color: rgba(255, 248, 248, 0.94);
          text-shadow: 0 0 22px rgba(255, 100, 80, 0.14);
        }

        .collective-meta {
          display: block;
          margin-top: 14px;
          color: rgba(255, 220, 220, 0.18);
          font-size: 0.76rem;
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 250ms ease, transform 250ms ease, color 200ms ease;
        }

        .collective-card:hover .collective-meta {
          opacity: 1;
          transform: translateY(0);
          color: rgba(255, 220, 220, 0.44);
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

        @media (max-width: 720px) {
          .collective-page { padding: 48px 18px; }
          .collective-list { gap: 42px; }
          .collective-card,
          .collective-card:nth-child(3n + 1),
          .collective-card:nth-child(3n + 2),
          .collective-card:nth-child(3n) {
            width: 100%; justify-self: center; transform: none;
          }
          .collective-card:hover,
          .collective-card:nth-child(3n + 2):hover,
          .collective-card:nth-child(3n):hover { transform: translateY(-2px); }
          .collective-meta { opacity: 1; transform: none; }
          .collective-footer { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .collective-card { transition: none !important; }
        }
      `}</style>

      <CelestialField density="sparse" speed={0.8} />

      <section className="collective-shell">
        <CelestialMarker variant="star" size={30} intensity="medium" />
        <LivingTitle
          kicker="Witnessing"
          subtitle="You are not alone in this pattern."
          cycle={12}
          intensity="medium"
        >
          Witness the Collective
        </LivingTitle>

        {loading && <p className="collective-loading">Gathering reflections...</p>}
        {error && <p className="collective-error">{error}</p>}

        {!loading && !error && reflections.length === 0 && (
          <p className="collective-empty">The Collective is quiet. Be the first signal.</p>
        )}

        {!loading && !error && reflections.length > 0 && (
          <div className="collective-list">
            {reflections.map((r, idx) => (
              <article key={r.reflection_id} className="collective-card">
                <CelestialMarker variant={["orb","planet","ring","vortex","constellation","star"][idx % 6]} size={14} intensity="low" />
                <div className="collective-card-content">
                  <p className="collective-quote">&ldquo;{r.content}&rdquo;</p>
                  <small className="collective-meta">
                    {r.location?.city || "Unknown location"} &middot; {new Date(r.timestamp).toLocaleString()}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="collective-footer">
          <Link className="aurelius-link" to="/insights">Explore Patterns</Link>
          <Link className="aurelius-link" to="/echoes">Listen to Echoes</Link>
          <Link className="aurelius-link" to="/scripture">Compose Scripture</Link>
          <Link className="aurelius-link" to="/">Offer a Reflection</Link>
        </footer>
      </section>
    </main>
  );
}
