import { useState, useRef, useCallback } from "react";
import { submitReflection } from "../services/api";

/**
 * EmbedReflectionPage — Minimal reflection interface for iframe embedding.
 *
 * Reuses the existing Aurelius submission pipeline (submitReflection → API Gateway
 * → aureliusSubmitReflection Lambda → privacy/moderation/DynamoDB).
 *
 * Suppresses: Atlante guide, global atmosphere, particles, detonation effects,
 * full-app navigation, and other heavy chrome.
 *
 * Preserves: input validation, existing backend behavior, moderation-aware messaging,
 * keyboard accessibility, responsive sizing.
 */

const PROMPTS = [
  "What wants to leave the room with you?",
  "What are you carrying today?",
  "What would you say if no one remembered?",
];

/* CSS for the breathing glow animation */
const EMBED_STYLES = `
  @keyframes aureliusLabelBreathe {
    0%, 100% { text-shadow: 0 0 12px rgba(242, 106, 46, 0.15); }
    50% { text-shadow: 0 0 22px rgba(242, 106, 46, 0.30), 0 0 40px rgba(242, 106, 46, 0.08); }
  }
  @keyframes signalPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }
  @media (prefers-reduced-motion: reduce) {
    .aurelius-embed-label { animation: none !important; text-shadow: 0 0 14px rgba(242, 106, 46, 0.18) !important; }
    .aurelius-signal-dot { animation: none !important; opacity: 0.7 !important; }
  }
`;

export default function EmbedReflectionPage() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [moderationInfo, setModerationInfo] = useState(null);
  const textareaRef = useRef(null);
  const [promptIndex] = useState(() => Math.floor(Math.random() * PROMPTS.length));

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setSubmitMessage("");
    setIsSubmitting(true);

    const payload = {
      content,
      categories: [],
      location: {},
      theme: "",
      perspective: "",
      timestamp: new Date().toISOString(),
    };

    try {
      const result = await submitReflection(payload);

      setModerationInfo({
        status: result.moderation_status || "approved",
        reason: result.moderation_reason || "public_safe",
        visibility: result.visibility || "public",
      });

      setContent("");
      setSubmitted(true);
    } catch (err) {
      const errorMessage =
        err?.message ||
        "This reflection could not be accepted right now. Please revise and try again.";
      setSubmitMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, isSubmitting]);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setModerationInfo(null);
    setSubmitMessage("");
  }, []);

  // ─── SUCCESS STATE ───
  if (submitted) {
    return (
      <div style={styles.container}>
        <style>{EMBED_STYLES}</style>
        <div style={styles.inner}>
          <div style={styles.successState}>
            <p style={styles.successMessage}>
              Your reflection entered the experiment.
            </p>
            {moderationInfo && moderationInfo.visibility === "public" && (
              <p style={styles.successDetail}>
                It is now part of the collective.
              </p>
            )}
            {moderationInfo && moderationInfo.visibility === "hidden" && (
              <p style={styles.successDetail}>
                It has been received and preserved.
              </p>
            )}
            <div style={styles.successActions}>
              <button onClick={handleReset} style={styles.secondaryBtn}>
                Offer another
              </button>
              <a
                href="https://main.d3tw4yi1uootow.amplifyapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.externalLink}
              >
                Open Aurelius →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── REFLECTION FORM ───
  return (
    <div style={styles.container}>
      <style>{EMBED_STYLES}</style>
      <div style={styles.inner}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.labelRow}>
            <span className="aurelius-signal-dot" style={styles.signalDot} aria-hidden="true" />
            <p className="aurelius-embed-label" style={styles.label}>The Aurelius Experiment</p>
          </div>
          <p style={styles.prompt}>{PROMPTS[promptIndex]}</p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Begin your reflection..."
            maxLength={5000}
            rows={6}
            style={styles.textarea}
            aria-label="Write your reflection"
            disabled={isSubmitting}
          />

          {/* Character count */}
          <div style={styles.meta}>
            <span style={styles.charCount}>
              {content.length} / 5000
            </span>
          </div>

          {/* Error */}
          {submitMessage && (
            <p style={styles.error} role="alert">
              {submitMessage}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            style={{
              ...styles.submitBtn,
              opacity: !content.trim() || isSubmitting ? 0.5 : 1,
              cursor: !content.trim() || isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Entering..." : "Enter the experiment"}
          </button>
        </form>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Anonymous · Privacy-first · No account required
          </p>
        </footer>
      </div>
    </div>
  );
}

// ─── STYLES ───
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem 1rem",
    background: "#110707",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "rgba(255, 235, 235, 0.85)",
  },
  inner: {
    width: "100%",
    maxWidth: "540px",
  },
  header: {
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginBottom: "0.6rem",
  },
  signalDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "rgba(245, 241, 236, 0.7)",
    boxShadow: "0 0 6px rgba(242, 106, 46, 0.5), 0 0 12px rgba(242, 106, 46, 0.2)",
    animation: "signalPulse 6s ease-in-out infinite",
    flexShrink: 0,
  },
  label: {
    fontSize: "0.62rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(245, 241, 236, 0.82)",
    margin: 0,
    animation: "aureliusLabelBreathe 6s ease-in-out infinite alternate",
  },
  prompt: {
    fontSize: "1.05rem",
    fontWeight: 300,
    color: "rgba(255, 235, 235, 0.6)",
    fontStyle: "italic",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  textarea: {
    width: "100%",
    minHeight: "160px",
    padding: "1rem",
    fontSize: "0.95rem",
    lineHeight: 1.7,
    color: "rgba(255, 235, 235, 0.88)",
    background: "rgba(30, 8, 8, 0.5)",
    border: "1px solid rgba(155, 35, 35, 0.2)",
    borderRadius: "6px",
    resize: "vertical",
    outline: "none",
    transition: "border-color 200ms ease",
    fontFamily: "inherit",
  },
  meta: {
    display: "flex",
    justifyContent: "flex-end",
  },
  charCount: {
    fontSize: "0.6rem",
    letterSpacing: "0.08em",
    color: "rgba(255, 235, 235, 0.3)",
  },
  error: {
    fontSize: "0.8rem",
    color: "rgba(255, 100, 100, 0.85)",
    padding: "0.5rem 0.75rem",
    background: "rgba(80, 10, 10, 0.3)",
    borderRadius: "4px",
    border: "1px solid rgba(155, 35, 35, 0.25)",
  },
  submitBtn: {
    padding: "0.85rem 1.5rem",
    fontSize: "0.78rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255, 235, 235, 0.85)",
    background: "rgba(105, 14, 14, 0.48)",
    border: "1px solid rgba(255, 90, 90, 0.28)",
    borderRadius: "5px",
    transition: "background 200ms ease, border-color 200ms ease",
    fontFamily: "inherit",
  },
  successState: {
    textAlign: "center",
    padding: "2rem 1rem",
  },
  successMessage: {
    fontSize: "1.1rem",
    fontWeight: 300,
    color: "rgba(255, 235, 235, 0.85)",
    marginBottom: "0.5rem",
  },
  successDetail: {
    fontSize: "0.82rem",
    color: "rgba(255, 235, 235, 0.5)",
    marginBottom: "1.5rem",
  },
  successActions: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
  },
  secondaryBtn: {
    padding: "0.7rem 1.4rem",
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255, 235, 235, 0.7)",
    background: "rgba(45, 4, 4, 0.4)",
    border: "1px solid rgba(155, 35, 35, 0.25)",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  externalLink: {
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(155, 35, 35, 0.65)",
    textDecoration: "none",
  },
  footer: {
    marginTop: "1.5rem",
    textAlign: "center",
  },
  footerText: {
    fontSize: "0.56rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255, 235, 235, 0.25)",
  },
};
