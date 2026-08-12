import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNarrative, askInquiry } from "../services/api";
import LivingTitle from "../components/LivingTitle";
import CelestialField from "../components/CelestialField";
import CelestialMarker from "../components/CelestialMarker";

export default function InsightsPage() {
  const [mode, setMode] = useState("patterns");

  // Tone-to-color mapping for the orb
  const getToneColor = (tone) => {
    const t = (tone || "").toLowerCase();
    if (t.includes("hopeful") || t.includes("warm") || t.includes("gratitude")) return "rgba(210, 160, 60, 0.7)";
    if (t.includes("uncertain") || t.includes("anxious") || t.includes("fear")) return "rgba(140, 170, 210, 0.7)";
    if (t.includes("grief") || t.includes("heavy") || t.includes("pain")) return "rgba(200, 50, 40, 0.7)";
    if (t.includes("calm") || t.includes("accept") || t.includes("peace")) return "rgba(100, 160, 140, 0.7)";
    if (t.includes("mixed") || t.includes("bittersweet") || t.includes("complex")) return "rgba(170, 90, 140, 0.7)";
    if (t.includes("reflect") || t.includes("introspec") || t.includes("contemplat")) return "rgba(140, 90, 160, 0.7)";
    return "rgba(180, 100, 120, 0.6)"; // default muted rose
  };
  const [question, setQuestion] = useState("");
  const [narrative, setNarrative] = useState("");
  const [patterns, setPatterns] = useState([]);
  const [dominantTone, setDominantTone] = useState("");
  const [humanInsight, setHumanInsight] = useState("");
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [narrativeError, setNarrativeError] = useState("");
  const [inquiryAnswer, setInquiryAnswer] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState("");

  useEffect(() => {
    if ((mode !== "narrative" && mode !== "patterns") || narrative) return;

    const fetchNarrative = async () => {
      try {
        setNarrativeLoading(true);
        setNarrativeError("");

        const data = await getNarrative();
        console.log("🧠 Narrative fetched:", data);

        setNarrative(data.narrative || "No narrative has surfaced yet.");
        setPatterns(Array.isArray(data.patterns) ? data.patterns : []);
        setDominantTone(data.dominantTone || "");
        setHumanInsight(data.humanInsight || "");
      } catch (err) {
        console.error("Narrative fetch error:", err);
        setNarrativeError("The Collective narrative is quiet right now. Try again shortly.");
      } finally {
        setNarrativeLoading(false);
      }
    };

    fetchNarrative();
  }, [mode, narrative]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setInquiryLoading(true);
      setInquiryError("");
      setInquiryAnswer("");

      const data = await askInquiry(question);
      setInquiryAnswer(data.answer || "The Collective is quiet right now.");
    } catch (err) {
      console.error("Inquiry error:", err);
      setInquiryError("The Collective could not answer right now. Try again shortly.");
    } finally {
      setInquiryLoading(false);
    }
  };

  return (
    <main className="insights-page">
      <style>{`
        .insights-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 34%, rgba(120, 15, 15, 0.24), transparent 30%),
            radial-gradient(circle at 50% 84%, rgba(80, 5, 5, 0.22), transparent 36%),
            rgba(2, 1, 1, 0.82);
          color: rgba(255, 245, 245, 0.86);
          padding: 64px 24px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .insights-shell {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .insights-kicker {
          margin: 0 0 14px;
          letter-spacing: 3px;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: rgba(255, 220, 220, 0.36);
        }

        .insights-mode-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin: 0 0 96px;
        }

        .insights-mode-nav span {
          color: rgba(255, 220, 220, 0.22);
        }

        .insights-mode-button {
          border: none;
          background: transparent;
          color: rgba(255, 220, 220, 0.44);
          cursor: pointer;
          font-size: 0.95rem;
          transition: color 180ms ease, text-shadow 180ms ease, transform 180ms ease;
        }

        .insights-mode-button:hover,
        .insights-mode-button.active {
          color: rgba(255, 240, 240, 0.82);
          text-shadow: 0 0 22px rgba(255, 80, 80, 0.28);
          transform: translateY(-1px);
        }

        .insights-section {
          min-height: 360px;
          animation: fadeUp 420ms ease both;
        }

        .insights-title {
          margin: 0 0 18px;
          font-size: clamp(1.7rem, 3.5vw, 2.6rem);
          font-weight: 400;
          color: rgba(255, 240, 240, 0.86);
        }

        .insights-muted {
          color: rgba(255, 220, 220, 0.42);
          line-height: 1.8;
        }

        .patterns-list {
          display: grid;
          gap: 64px;
          max-width: 760px;
          margin: 52px auto 0;
        }

        .pattern-card {
          width: min(100%, 620px);
          text-align: left;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .pattern-card .celestial-marker {
          flex-shrink: 0;
          margin-top: 4px;
          transition: opacity 250ms ease, transform 250ms ease;
        }

        .pattern-card:hover .celestial-marker {
          opacity: 0.85 !important;
          transform: scale(1.15);
        }

        .pattern-card-content {
          flex: 1;
          min-width: 0;
        }

        .pattern-card:nth-child(3n + 1) {
          justify-self: start;
        }

        .pattern-card:nth-child(3n + 2) {
          justify-self: end;
          transform: translateY(18px);
        }

        .pattern-card:nth-child(3n) {
          justify-self: center;
          transform: translateY(-8px);
        }

        .pattern-card:hover {
          transform: translateY(-4px) scale(1.015);
        }

        .pattern-card:nth-child(3n + 2):hover {
          transform: translateY(14px) scale(1.015);
        }

        .pattern-card:nth-child(3n):hover {
          transform: translateY(-12px) scale(1.015);
        }

        .pattern-title {
          margin: 0 0 12px;
          color: rgba(255, 240, 240, 0.84);
          font-size: 1.25rem;
          font-weight: 500;
        }

        .pattern-description {
          margin: 0;
          color: rgba(255, 230, 230, 0.58);
          line-height: 1.75;
        }

        .pattern-evidence {
          margin: 18px 0 0;
          padding-left: 18px;
          border-left: 1px solid rgba(255, 80, 80, 0.2);
          color: rgba(255, 220, 220, 0.34);
          font-style: italic;
          line-height: 1.7;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 200ms ease, transform 200ms ease, color 200ms ease;
        }

        .pattern-card:hover .pattern-evidence {
          opacity: 1;
          transform: translateY(0);
          color: rgba(255, 230, 230, 0.54);
        }

        .insight-meta {
          max-width: 720px;
          margin: 58px auto 0;
          display: grid;
          gap: 14px;
          color: rgba(255, 220, 220, 0.44);
          line-height: 1.7;
        }

        .tone-orb {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--tone-color, rgba(180, 100, 120, 0.6));
          box-shadow: 0 0 8px var(--tone-color, rgba(180, 100, 120, 0.4)),
                      0 0 16px var(--tone-color, rgba(180, 100, 120, 0.2));
          animation: toneOrbPulse 3s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes toneOrbPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        .narrative-body,
        .inquiry-answer {
          max-width: 720px;
          margin: 38px auto 0;
          color: rgba(255, 235, 235, 0.72);
          line-height: 1.9;
          font-size: 1.05rem;
          text-align: center;
        }

        .inquiry-input {
          width: 100%;
          max-width: 620px;
          padding: 18px;
          text-align: center;
          margin: 22px auto 24px;
          border: 1px solid rgba(155, 35, 35, 0.28);
          outline: none;
          background: rgba(20, 2, 2, 0.34);
          box-shadow: inset 0 0 32px rgba(70, 0, 0, 0.24), 0 0 42px rgba(125, 10, 10, 0.14);
          color: rgba(255, 245, 245, 0.88);
        }

        .insights-action-button {
          padding: 12px 34px;
          border-radius: 4px;
          border: 1px solid rgba(255, 90, 90, 0.28);
          background: rgba(105, 14, 14, 0.48);
          color: rgba(255, 235, 235, 0.8);
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .insights-action-button:hover:not(:disabled) {
          transform: translateY(-2px);
          background: rgba(125, 18, 18, 0.56);
          box-shadow: 0 0 32px rgba(145, 22, 22, 0.34);
        }

        .insights-action-button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .insights-footer {
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

        .insights-footer a {
          padding: 14px 12px;
          border: 1px solid rgba(155, 35, 35, 0.2);
          background: rgba(45, 4, 4, 0.24);
          color: rgba(255, 235, 235, 0.68);
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .insights-footer a:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 80, 80, 0.38);
          background: rgba(85, 8, 8, 0.34);
          box-shadow: 0 0 30px rgba(145, 18, 18, 0.22);
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

        @media (max-width: 720px) {
          .insights-page {
            padding: 48px 18px;
          }

          .insights-mode-nav {
            margin-bottom: 58px;
            gap: 10px;
          }

          .patterns-list {
            gap: 42px;
          }

          .pattern-card,
          .pattern-card:nth-child(3n + 1),
          .pattern-card:nth-child(3n + 2),
          .pattern-card:nth-child(3n) {
            width: 100%;
            justify-self: center;
            transform: none;
          }

          .pattern-card:hover,
          .pattern-card:nth-child(3n + 2):hover,
          .pattern-card:nth-child(3n):hover {
            transform: translateY(-2px);
          }

          .pattern-evidence {
            opacity: 1;
            transform: none;
          }

          .insights-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <CelestialField density="sparse" speed={0.6} />

      <section className="insights-shell">
        <LivingTitle kicker="Viewing" cycle={13} intensity="low">
          Insights
        </LivingTitle>

        <nav className="insights-mode-nav">
          <button
            className={`insights-mode-button ${mode === "patterns" ? "active" : ""}`}
            onClick={() => setMode("patterns")}
          >
            Patterns
          </button>
          <span>·</span>
          <button
            className={`insights-mode-button ${mode === "narrative" ? "active" : ""}`}
            onClick={() => setMode("narrative")}
          >
            Narrative
          </button>
          <span>·</span>
          <button
            className={`insights-mode-button ${mode === "inquiry" ? "active" : ""}`}
            onClick={() => setMode("inquiry")}
          >
            Inquiry
          </button>
        </nav>

        {mode === "patterns" && (
          <section className="insights-section">
            <CelestialMarker variant="constellation" size={28} intensity="medium" />
            <h2 className="insights-title">Emerging Patterns</h2>

            {narrativeLoading && <p className="insights-muted">Listening for patterns...</p>}

            {narrativeError && <p className="insights-muted">{narrativeError}</p>}

            {!narrativeLoading && !narrativeError && patterns.length === 0 && (
              <p className="insights-muted">
                The Collective is still forming. More meaningful reflections are needed before patterns emerge.
              </p>
            )}

            {!narrativeLoading && !narrativeError && patterns.length > 0 && (
              <div className="patterns-list">
                {patterns.map((pattern, index) => (
                  <article key={index} className="pattern-card">
                    <CelestialMarker variant={["constellation","planet","vortex","ring","orb","star"][index % 6]} size={18} intensity="medium" />
                    <div className="pattern-card-content">
                      <h3 className="pattern-title">{pattern.title}</h3>
                      <p className="pattern-description">{pattern.description}</p>
                      {pattern.evidence?.length > 0 && (
                        <div>
                          {pattern.evidence.map((quote, quoteIndex) => (
                            <blockquote key={quoteIndex} className="pattern-evidence">
                              &ldquo;{quote}&rdquo;
                            </blockquote>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!narrativeLoading && !narrativeError && (dominantTone || humanInsight) && (
              <div className="insight-meta">
                {dominantTone && (
                  <p style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="tone-orb" style={{ "--tone-color": getToneColor(dominantTone) }} />
                    <span><strong>Dominant tone:</strong> {dominantTone}</span>
                  </p>
                )}

                {humanInsight && (
                  <p>
                    <strong>Human insight:</strong> {humanInsight}
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {mode === "narrative" && (
          <section className="insights-section">
            <CelestialMarker variant="orb" size={22} intensity="low" />
            <h2 className="insights-title">Narrative</h2>

            {narrativeLoading && <p className="insights-muted">Listening to the Collective...</p>}

            {narrativeError && <p className="insights-muted">{narrativeError}</p>}

            {!narrativeLoading && !narrativeError && (
              <p className="narrative-body">
                {narrative || "A collective narrative will surface here."}
              </p>
            )}
          </section>
        )}

        {mode === "inquiry" && (
          <section className="insights-section">
            <CelestialMarker variant="vortex" size={22} intensity="low" />
            <h2 className="insights-title">Inquiry</h2>
            <p className="insights-muted">Ask a question of what has been shared within the Collective.</p>

            <input
              className="inquiry-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAsk();
                }
              }}
              placeholder="What would you like to understand?"
            />

            <div>
              <button className="insights-action-button" onClick={handleAsk} disabled={inquiryLoading}>
                {inquiryLoading ? "Listening..." : "Ask"}
              </button>
            </div>

            {inquiryError && <p className="insights-muted">{inquiryError}</p>}

            {inquiryAnswer && <p className="inquiry-answer">{inquiryAnswer}</p>}
          </section>
        )}
      </section>

      <footer className="insights-footer">
        <Link className="aurelius-link" to="/witness-the-collective">Witness the Collective</Link>
        <Link className="aurelius-link" to="/echoes">Listen to Echoes</Link>
        <Link className="aurelius-link" to="/scripture">Compose Scripture</Link>
        <Link className="aurelius-link" to="/">Offer a Reflection</Link>
      </footer>
    </main>
  );
}