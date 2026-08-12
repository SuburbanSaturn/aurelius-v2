import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEcho } from "../services/api";
import LivingTitle from "../components/LivingTitle";
import CelestialField from "../components/CelestialField";

const subtitles = [
  "A transmuted reflection drawn from many voices.",
  "This is not a truth. It is one way the Collective speaks.",
  "Listen to what emerges between the voices.",
  "Fragments of reflection continue to reverberate.",
];

export default function EchoesPage() {
  const [echo, setEcho] = useState("");
  const [tone, setTone] = useState("");
  const [sourceCount, setSourceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  const loadEcho = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getEcho();
      setEcho(data.echo || "The Collective is quiet right now.");
      setTone(data.tone || "reflective");
      setSourceCount(data.sourceCount || 0);
    } catch (err) {
      console.error("Echo fetch error:", err);
      setError("Unable to hear the echoes right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEcho(); }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setSubtitleIndex((i) => (i + 1) % subtitles.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="echoes-page">
      <style>{`
        .echoes-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 30%, rgba(120, 15, 15, 0.24), transparent 30%),
            radial-gradient(circle at 50% 82%, rgba(80, 5, 5, 0.22), transparent 36%),
            rgba(2, 1, 1, 0.82);
          color: rgba(255, 245, 245, 0.86);
          padding: 64px 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .echoes-shell {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .echoes-subtitle-wrap {
          min-height: 50px;
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .echoes-subtitle {
          margin: 0;
          color: rgba(255, 220, 220, 0.38);
          line-height: 1.8;
          animation: echoSubFade 4.5s ease-in-out infinite;
        }

        .echoes-status {
          color: rgba(255, 220, 220, 0.44);
          margin: 72px 0;
        }

        .echoes-result {
          max-width: 760px;
          margin: 0 auto;
          animation: echoFadeUp 420ms ease both;
        }

        .echoes-quote {
          margin: 0 auto 36px;
          color: rgba(255, 238, 238, 0.82);
          font-size: clamp(1.3rem, 3vw, 2.2rem);
          line-height: 1.8;
          font-style: italic;
          font-weight: 300;
          text-shadow: 0 0 18px rgba(255, 90, 90, 0.08);
        }

        .echoes-meta {
          display: grid;
          gap: 8px;
          margin-bottom: 36px;
          color: rgba(255, 220, 220, 0.34);
          font-size: 0.9rem;
        }

        .echoes-footer {
          width: 100%;
          max-width: 860px;
          margin: 84px auto 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        @keyframes echoSubFade {
          0% { opacity: 0; transform: translateY(5px); }
          14% { opacity: 1; transform: translateY(0); }
          82% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-5px); }
        }

        @keyframes echoFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 720px) {
          .echoes-page { padding: 48px 18px; }
          .echoes-footer { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .echoes-subtitle { animation: none !important; }
        }
      `}</style>

      <CelestialField density="sparse" speed={0.7} />

      <section className="echoes-shell">
        <LivingTitle kicker="Listening" cycle={11} intensity="medium">
          Echoes from the Collective
        </LivingTitle>

        <div className="echoes-subtitle-wrap">
          <p key={subtitleIndex} className="echoes-subtitle">
            {subtitles[subtitleIndex]}
          </p>
        </div>

        {loading && <p className="echoes-status">Listening for echoes...</p>}
        {error && <p className="echoes-status">{error}</p>}

        {!loading && !error && (
          <article className="echoes-result">
            <blockquote className="echoes-quote">&ldquo;{echo}&rdquo;</blockquote>
            <div className="echoes-meta">
              <p>Tone: {tone}</p>
              <p>Drawn from {sourceCount} reflections</p>
            </div>
            <button className="aurelius-btn" onClick={loadEcho} disabled={loading}>
              {loading ? "Listening..." : "Generate another echo"}
            </button>
          </article>
        )}
      </section>

      <footer className="echoes-footer">
        <Link className="aurelius-link" to="/insights">Explore Patterns</Link>
        <Link className="aurelius-link" to="/witness-the-collective">Witness the Collective</Link>
        <Link className="aurelius-link" to="/scripture">Compose Scripture</Link>
        <Link className="aurelius-link" to="/">Offer a Reflection</Link>
      </footer>
    </main>
  );
}
