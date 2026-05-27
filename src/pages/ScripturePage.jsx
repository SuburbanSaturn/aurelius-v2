import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { generateScripture } from "../services/api";

const ambientDots = [
  { left: "12%", top: "22%", size: 4, delay: "0s" },
  { left: "24%", top: "74%", size: 3, delay: "1.2s" },
  { left: "38%", top: "36%", size: 5, delay: "2s" },
  { left: "61%", top: "18%", size: 3, delay: "0.8s" },
  { left: "77%", top: "58%", size: 4, delay: "1.7s" },
  { left: "88%", top: "78%", size: 3, delay: "2.8s" },
];

const subtitles = [
  "Offer a theme and allow the Collective to form a longer passage.",
  "A ritual reading shaped from many anonymous reflections.",
  "Not doctrine. Not decree. A passage from the shared signal.",
  "Let the Collective gather itself into language.",
];

export default function ScripturePage() {
  const [theme, setTheme] = useState("");
  const [title, setTitle] = useState("");
  const [scripture, setScripture] = useState("");
  const [tone, setTone] = useState("");
  const [sourceCount, setSourceCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const subtitleTimer = setInterval(() => {
      setSubtitleIndex((currentIndex) => (currentIndex + 1) % subtitles.length);
    }, 4500);

    return () => clearInterval(subtitleTimer);
  }, []);

  const handleGenerate = async () => {
    const requestedTheme =
      theme.trim() || "what the Collective is trying to understand";

    try {
      setLoading(true);
      setError("");
      setTitle("");
      setScripture("");
      setTone("");
      setSourceCount(0);

      const data = await generateScripture(requestedTheme);

      setTitle(data.title || "Untitled Passage");
      setScripture(data.scripture || "The Collective is quiet right now.");
      setTone(data.tone || "reflective");
      setSourceCount(data.sourceCount || 0);
    } catch (err) {
      console.error("Scripture generation error:", err);
      setError(
        "The Collective could not form a passage right now. Try again shortly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="scripture-page">
      <style>{`
        .scripture-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 30%, rgba(120, 15, 15, 0.24), transparent 30%),
            radial-gradient(circle at 50% 82%, rgba(80, 5, 5, 0.22), transparent 36%),
            #020101;
          color: rgba(255, 245, 245, 0.86);
          padding: 64px 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .scripture-dot {
          position: absolute;
          width: var(--size);
          height: var(--size);
          left: var(--left);
          top: var(--top);
          border-radius: 999px;
          background: rgba(255, 45, 45, 0.72);
          box-shadow: 0 0 20px rgba(255, 45, 45, 0.85);
          opacity: 0.48;
          animation: scriptureFloat 8s ease-in-out infinite alternate;
          animation-delay: var(--delay);
          pointer-events: none;
        }

        .scripture-shell {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .scripture-kicker {
          margin: 0 0 14px;
          letter-spacing: 3px;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: rgba(255, 220, 220, 0.36);
        }

        .scripture-title {
          margin: 0;
          font-size: clamp(2rem, 5vw, 3.7rem);
          font-weight: 300;
          letter-spacing: 0.12em;
          color: rgba(255, 240, 240, 0.86);
        }

        .scripture-subtitle-wrap {
          min-height: 58px;
          margin-top: 20px;
          margin-bottom: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scripture-subtitle {
          margin: 0;
          color: rgba(255, 220, 220, 0.42);
          line-height: 1.8;
          animation: subtitleFade 4.5s ease-in-out infinite;
        }

        .scripture-input {
          width: 100%;
          max-width: 640px;
          padding: 18px;
          text-align: center;
          margin-bottom: 26px;
          border: 1px solid rgba(155, 35, 35, 0.28);
          outline: none;
          background: rgba(20, 2, 2, 0.34);
          box-shadow:
            inset 0 0 32px rgba(70, 0, 0, 0.24),
            0 0 42px rgba(125, 10, 10, 0.14);
          color: rgba(255, 245, 245, 0.88);
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }

        .scripture-input:focus {
          border-color: rgba(255, 80, 80, 0.42);
          box-shadow:
            inset 0 0 32px rgba(70, 0, 0, 0.28),
            0 0 52px rgba(145, 22, 22, 0.24);
        }

        .scripture-button {
          padding: 12px 34px;
          border-radius: 4px;
          border: 1px solid rgba(255, 90, 90, 0.28);
          background: rgba(105, 14, 14, 0.48);
          color: rgba(255, 235, 235, 0.8);
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .scripture-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: rgba(125, 18, 18, 0.56);
          box-shadow: 0 0 32px rgba(145, 22, 22, 0.34);
        }

        .scripture-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .scripture-error {
          margin-top: 32px;
          color: rgba(255, 180, 180, 0.74);
        }

        .scripture-result {
          max-width: 760px;
          margin: 72px auto 0;
          padding: 34px 0 0;
          border-top: 1px solid rgba(255, 80, 80, 0.16);
          animation: fadeUp 420ms ease both;
        }

        .scripture-result-title {
          margin: 0 0 28px;
          font-size: clamp(1.7rem, 3vw, 2.6rem);
          font-weight: 400;
          color: rgba(255, 240, 240, 0.88);
          text-shadow: 0 0 18px rgba(255, 90, 90, 0.08);
        }

        .scripture-body {
          color: rgba(255, 235, 235, 0.76);
          line-height: 2;
          font-size: clamp(1.02rem, 1.8vw, 1.16rem);
          white-space: pre-line;
          text-align: left;
          text-shadow: 0 0 18px rgba(255, 90, 90, 0.06);
        }

        .scripture-meta {
          margin-top: 42px;
          display: grid;
          gap: 10px;
          color: rgba(255, 220, 220, 0.42);
          font-size: 0.92rem;
        }

        .scripture-footer {
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

        .scripture-footer a {
          padding: 14px 12px;
          border: 1px solid rgba(155, 35, 35, 0.2);
          background: rgba(45, 4, 4, 0.24);
          color: rgba(255, 235, 235, 0.68);
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .scripture-footer a:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 80, 80, 0.38);
          background: rgba(85, 8, 8, 0.34);
          box-shadow: 0 0 30px rgba(145, 18, 18, 0.22);
        }

        @keyframes scriptureFloat {
          from {
            transform: translate3d(0, 0, 0) scale(0.82);
            opacity: 0.26;
          }
          to {
            transform: translate3d(18px, -28px, 0) scale(1.14);
            opacity: 0.72;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes subtitleFade {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          14% {
            opacity: 1;
            transform: translateY(0);
          }
          82% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-6px);
          }
        }

        @media (max-width: 720px) {
          .scripture-page {
            padding: 48px 18px;
          }

          .scripture-footer {
            grid-template-columns: 1fr;
          }

          .scripture-body {
            text-align: left;
          }
        }
      `}</style>

      {ambientDots.map((dot, index) => (
        <span
          key={index}
          className="scripture-dot"
          style={{
            "--left": dot.left,
            "--top": dot.top,
            "--size": `${dot.size}px`,
            "--delay": dot.delay,
          }}
        />
      ))}

      <section className="scripture-shell">
        <p className="scripture-kicker">Composing</p>

        <h1 className="scripture-title">Scripture from the Collective</h1>

        <div className="scripture-subtitle-wrap">
          <p key={subtitleIndex} className="scripture-subtitle">
            {subtitles[subtitleIndex]}
          </p>
        </div>

        <input
          className="scripture-input"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGenerate();
            }
          }}
          placeholder="fear of being replaceable, uncertainty, belonging..."
        />

        <div>
          <button
            className="scripture-button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Composing..." : "Generate scripture"}
          </button>
        </div>

        {error && <p className="scripture-error">{error}</p>}

        {scripture && !error && (
          <article className="scripture-result">
            <h2 className="scripture-result-title">{title}</h2>

            <div className="scripture-body">{scripture}</div>

            <div className="scripture-meta">
              <p>Tone: {tone}</p>
              <p>Drawn from {sourceCount} reflections</p>
            </div>
          </article>
        )}
      </section>

      <footer className="scripture-footer">
        <Link to="/insights">Explore Patterns</Link>
        <Link to="/echoes">Listen to Echoes</Link>
        <Link to="/witness-the-collective">
          Witness the Collective
        </Link>
        <Link to="/">Offer a Reflection</Link>
      </footer>
    </main>
  );
}
