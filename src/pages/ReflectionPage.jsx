import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitReflection } from "../services/api";

const ambientDots = [
  { left: "12%", top: "24%", size: 4, delay: "0s" },
  { left: "23%", top: "72%", size: 3, delay: "1.2s" },
  { left: "36%", top: "38%", size: 5, delay: "2s" },
  { left: "62%", top: "18%", size: 3, delay: "0.7s" },
  { left: "78%", top: "60%", size: 4, delay: "1.7s" },
  { left: "88%", top: "78%", size: 3, delay: "2.8s" },
];

const subtitles = [
  "Some begin with a question.",
  "Some begin with what they can no longer carry.",
  "There is no required form.",
  "Write what wants to leave the room with you.",
];

export default function ReflectionPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [city, setCity] = useState("");
  const [theme, setTheme] = useState("");
  const [perspective, setPerspective] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const subtitleTimer = setInterval(() => {
      setSubtitleIndex((currentIndex) => (currentIndex + 1) % subtitles.length);
    }, 4500);

    return () => clearInterval(subtitleTimer);
  }, []);

  const handleCategoryChange = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;
    setSubmitMessage("");

    const payload = {
      content,
      categories,
      location: { city },
      theme,
      perspective,
      timestamp: new Date().toISOString(),
    };

    console.log("🧠 Reflection Payload:", payload);

    try {
      setIsSubmitting(true);

      const result = await submitReflection(payload);
      console.log("✅ API RESPONSE:", result);

      setContent("");
      setCategories([]);
      setCity("");
      setTheme("");
      setPerspective("");

      navigate("/submitted", {
        state: {
          moderationStatus: result.moderation_status || "approved",
          moderationReason: result.moderation_reason || "public_safe",
          visibility: result.visibility || "public",
          analysisEligible: result.analysis_eligible ?? true,
          shadowEligible: result.shadow_eligible ?? false,
          piiRedacted: result.pii_redacted ?? false,
          semanticPrivacyApplied: result.semantic_privacy_applied ?? false,
        },
      });
    } catch (err) {
      console.error("❌ API ERROR:", err);

      const errorMessage =
        err?.message ||
        "This reflection could not be accepted right now. Please revise and try again.";

      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="reflection-page">
      <style>{`
        .reflection-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 38%, rgba(120, 15, 15, 0.28), transparent 30%),
            radial-gradient(circle at 50% 86%, rgba(80, 5, 5, 0.22), transparent 36%),
            radial-gradient(circle at 18% 28%, rgba(190, 35, 35, 0.14), transparent 8%),
            radial-gradient(circle at 82% 24%, rgba(180, 25, 25, 0.14), transparent 7%),
            #020101;
          color: rgba(255, 245, 245, 0.88);
          padding: 72px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .reflection-dot {
          position: absolute;
          width: var(--size);
          height: var(--size);
          left: var(--left);
          top: var(--top);
          border-radius: 999px;
          background: rgba(255, 45, 45, 0.72);
          box-shadow: 0 0 20px rgba(255, 45, 45, 0.85);
          opacity: 0.48;
          animation: reflectionFloat 8s ease-in-out infinite alternate;
          animation-delay: var(--delay);
          pointer-events: none;
        }

        .reflection-shell {
          width: 100%;
          max-width: 780px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .reflection-kicker {
          margin: 0 0 14px;
          letter-spacing: 3px;
          font-size: 0.72rem;
          text-transform: uppercase;
          color: rgba(255, 220, 220, 0.36);
        }

        .reflection-title {
          margin: 0;
          font-size: clamp(2rem, 5vw, 3.8rem);
          font-weight: 300;
          letter-spacing: 0.16em;
          color: rgba(255, 240, 240, 0.88);
          text-shadow: 0 0 22px rgba(255, 90, 90, 0.08);
        }

        .reflection-subtitle-wrap {
          min-height: 58px;
          margin-top: 20px;
          margin-bottom: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reflection-subtitle {
          margin: 0;
          color: rgba(255, 220, 220, 0.42);
          line-height: 1.8;
          animation: subtitleFade 4.5s ease-in-out infinite;
        }

        .reflection-form {
          animation: fadeUp 420ms ease both;
        }

        .reflection-textarea {
          width: 100%;
          min-height: 230px;
          padding: 28px;
          resize: vertical;
          border-radius: 4px;
          border: 1px solid rgba(155, 35, 35, 0.28);
          outline: none;
          background: rgba(20, 2, 2, 0.34);
          box-shadow:
            0 0 60px rgba(125, 10, 10, 0.24),
            inset 0 0 42px rgba(70, 0, 0, 0.28);
          color: rgba(255, 245, 245, 0.9);
          font-size: 1rem;
          line-height: 1.8;
          transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .reflection-textarea:focus {
          border-color: rgba(255, 80, 80, 0.42);
          background: rgba(24, 3, 3, 0.42);
          box-shadow:
            0 0 74px rgba(145, 22, 22, 0.28),
            inset 0 0 48px rgba(70, 0, 0, 0.32);
        }

        .reflection-fields {
          margin: 30px auto 0;
          max-width: 580px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          text-align: left;
        }

        .reflection-label {
          color: rgba(255, 220, 220, 0.42);
          font-size: 0.78rem;
          letter-spacing: 0.08em;
        }

        .reflection-label span {
          opacity: 0.5;
          font-style: italic;
          letter-spacing: 0;
        }

        .reflection-input {
          width: 100%;
          margin-top: 6px;
          padding: 12px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(155, 35, 35, 0.22);
          color: rgba(255, 245, 245, 0.82);
          outline: none;
          transition: border-color 180ms ease, color 180ms ease;
        }

        .reflection-input:focus {
          border-bottom-color: rgba(255, 80, 80, 0.42);
          color: rgba(255, 245, 245, 0.94);
        }

        .reflection-categories {
          margin-top: 36px;
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .reflection-chip {
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(155, 35, 35, 0.22);
          background: rgba(20, 2, 2, 0.24);
          color: rgba(255, 235, 235, 0.66);
          cursor: pointer;
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .reflection-chip:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 80, 80, 0.34);
          box-shadow: 0 0 24px rgba(145, 22, 22, 0.18);
        }

        .reflection-chip.active {
          border-color: rgba(255, 120, 120, 0.58);
          background: rgba(125, 18, 18, 0.4);
          box-shadow: 0 0 24px rgba(145, 22, 22, 0.22);
        }

        .reflection-submit {
          margin-top: 44px;
          padding: 14px 42px;
          border-radius: 4px;
          border: 1px solid rgba(255, 90, 90, 0.28);
          background: rgba(105, 14, 14, 0.58);
          color: rgba(255, 235, 235, 0.82);
          box-shadow: 0 0 36px rgba(145, 22, 22, 0.24);
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, opacity 180ms ease;
        }

        .reflection-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          background: rgba(125, 18, 18, 0.62);
          box-shadow: 0 0 42px rgba(165, 28, 28, 0.34);
        }

        .reflection-submit:disabled {
          background: rgba(60, 20, 20, 0.22);
          box-shadow: none;
          cursor: not-allowed;
          opacity: 0.58;
        }

        .reflection-footnote {
          margin-top: 18px;
          color: rgba(255, 220, 220, 0.28);
          font-size: 0.82rem;
        }

        .reflection-submit-message {
          max-width: 560px;
          margin: 24px auto 0;
          color: rgba(255, 190, 190, 0.72);
          font-size: 0.92rem;
          line-height: 1.7;
        }

        @keyframes reflectionFloat {
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
          .reflection-page {
            padding: 48px 18px;
            align-items: flex-start;
          }

          .reflection-title {
            letter-spacing: 0.08em;
          }

          .reflection-textarea {
            min-height: 200px;
            padding: 22px;
          }
        }
      `}</style>

      {ambientDots.map((dot, index) => (
        <span
          key={index}
          className="reflection-dot"
          style={{
            "--left": dot.left,
            "--top": dot.top,
            "--size": `${dot.size}px`,
            "--delay": dot.delay,
          }}
        />
      ))}

      <section className="reflection-shell">
        <p className="reflection-kicker">Offering</p>

        <h1 className="reflection-title">What would you like to release?</h1>

        <div className="reflection-subtitle-wrap">
          <p key={subtitleIndex} className="reflection-subtitle">
            {subtitles[subtitleIndex]}
          </p>
        </div>

        <form className="reflection-form" onSubmit={handleSubmit}>
          <textarea
            className="reflection-textarea"
            placeholder=""
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={7}
          />

          <div className="reflection-fields">
            <label className="reflection-label">
              LOCATION <span>optional</span>
              <input
                className="reflection-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </label>

            <label className="reflection-label">
              THEME <span>optional</span>
              <input
                className="reflection-input"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="grief, uncertainty, belonging..."
              />
            </label>

            <label className="reflection-label">
              PERSPECTIVE <span>optional</span>
              <input
                className="reflection-input"
                value={perspective}
                onChange={(e) => setPerspective(e.target.value)}
                placeholder="worker, parent, student, neighbor..."
              />
            </label>
          </div>

          <div className="reflection-categories">
            {["ethical", "cultural", "historical", "interpersonal"].map(
              (cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`reflection-chip ${
                    categories.includes(cat) ? "active" : ""
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="reflection-submit"
          >
            {isSubmitting ? "Offering..." : "Contribute"}
          </button>

          <p className="reflection-footnote">
            Reflections are transformed before being added to the Collective.
          </p>

          {submitMessage && (
            <p className="reflection-submit-message">{submitMessage}</p>
          )}
        </form>
      </section>
    </main>
  );
}