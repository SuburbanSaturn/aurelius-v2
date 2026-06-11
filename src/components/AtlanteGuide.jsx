

import React, { useMemo, useState } from "react";

const STORAGE_KEY = "aurelius_atlante_guide_dismissed_v1";

const guideSteps = [
  {
    eyebrow: "Atlante Guide · 01",
    title: "Welcome to the Aurelius Experiment",
    body:
      "Aurelius is not a social network. It is a reflective commons: a place to contribute anonymous reflections and witness what begins to emerge from the Collective.",
  },
  {
    eyebrow: "Atlante Guide · 02",
    title: "What counts as a reflection?",
    body:
      "A reflection can be a thought, memory, feeling, question, contradiction, or moment you are carrying. It does not need to be polished. It does not need to perform insight.",
  },
  {
    eyebrow: "Atlante Guide · 03",
    title: "What happens when you contribute?",
    body:
      "Before a reflection enters the Collective, Aurelius removes identifying details where possible. Some entries may be hidden if they are unsafe, too sensitive, or not reflective enough for the public commons.",
  },
  {
    eyebrow: "Atlante Guide · 04",
    title: "What is the Collective?",
    body:
      "The Collective is made from public-safe reflections. It is not a profile, feed, or popularity system. It is a shared field of anonymous human thought.",
  },
  {
    eyebrow: "Atlante Guide · 05",
    title: "How to read Echoes, Patterns, Inquiry, and Scripture",
    body:
      "These outputs are not predictions, prophecies, or absolute truths. They are orientation tools: ways of seeing what may be emerging from the reflections people have offered.",
  },
  {
    eyebrow: "Atlante Guide · 06",
    title: "This is still beta",
    body:
      "Aurelius is still forming. Your participation helps shape the commons. The quality of the reflection shapes the quality of what the Collective can reveal.",
  },
];

export default function AtlanteGuide() {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "true";
    } catch {
      return true;
    }
  });

  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = guideSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === guideSteps.length - 1;

  const progressLabel = useMemo(
    () => `${stepIndex + 1} / ${guideSteps.length}`,
    [stepIndex]
  );

  const closeGuide = ({ persist = false } = {}) => {
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // localStorage may be unavailable in private browsing or restricted contexts.
      }
    }

    setIsOpen(false);
  };

  const restartGuide = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage may be unavailable in private browsing or restricted contexts.
    }

    setStepIndex(0);
    setIsOpen(true);
  };

  const goBack = () => {
    setStepIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  const goNext = () => {
    if (isLastStep) {
      closeGuide({ persist: true });
      return;
    }

    setStepIndex((previousIndex) =>
      Math.min(previousIndex + 1, guideSteps.length - 1)
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={restartGuide}
        aria-label="Open Atlante guide"
        style={styles.launchButton}
      >
        Atlante
      </button>

      {isOpen && (
        <div style={styles.overlay} role="dialog" aria-modal="true">
          <div style={styles.card}>
            <div style={styles.headerRow}>
              <span style={styles.eyebrow}>{currentStep.eyebrow}</span>
              <button
                type="button"
                onClick={() => closeGuide()}
                aria-label="Close Atlante guide"
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div style={styles.symbol}>✦</div>

            <h2 style={styles.title}>{currentStep.title}</h2>
            <p style={styles.body}>{currentStep.body}</p>

            <div style={styles.progressTrack} aria-hidden="true">
              <div
                style={{
                  ...styles.progressFill,
                  width: `${((stepIndex + 1) / guideSteps.length) * 100}%`,
                }}
              />
            </div>

            <div style={styles.footerRow}>
              <span style={styles.progressText}>{progressLabel}</span>

              <div style={styles.buttonRow}>
                <button
                  type="button"
                  onClick={goBack}
                  disabled={isFirstStep}
                  style={{
                    ...styles.secondaryButton,
                    opacity: isFirstStep ? 0.45 : 1,
                    cursor: isFirstStep ? "not-allowed" : "pointer",
                  }}
                >
                  Back
                </button>

                <button type="button" onClick={goNext} style={styles.primaryButton}>
                  {isLastStep ? "Enter the commons" : "Next"}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => closeGuide({ persist: true })}
              style={styles.dismissButton}
            >
              Do not show this again
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  launchButton: {
    position: "fixed",
    right: "24px",
    bottom: "calc(24px + env(safe-area-inset-bottom))",
    zIndex: 40,
    border: "1px solid rgba(255, 120, 120, 0.45)",
    borderRadius: "999px",
    padding: "10px 16px",
    color: "rgba(255, 235, 235, 0.92)",
    background:
      "linear-gradient(135deg, rgba(80, 10, 10, 0.82), rgba(18, 0, 0, 0.92))",
    boxShadow: "0 0 24px rgba(150, 20, 20, 0.38)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontSize: "11px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at center, rgba(110, 10, 10, 0.22), rgba(0, 0, 0, 0.82) 58%, rgba(0, 0, 0, 0.94))",
    backdropFilter: "blur(8px)",
  },
  card: {
    width: "min(560px, 100%)",
    border: "1px solid rgba(255, 120, 120, 0.28)",
    borderRadius: "28px",
    padding: "28px",
    color: "rgba(255, 238, 238, 0.94)",
    background:
      "linear-gradient(180deg, rgba(22, 0, 0, 0.94), rgba(4, 0, 0, 0.96))",
    boxShadow:
      "0 0 80px rgba(120, 10, 10, 0.34), inset 0 0 40px rgba(120, 20, 20, 0.10)",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  eyebrow: {
    color: "rgba(255, 170, 170, 0.78)",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },
  closeButton: {
    width: "32px",
    height: "32px",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    borderRadius: "999px",
    color: "rgba(255, 235, 235, 0.88)",
    background: "rgba(255, 255, 255, 0.04)",
    fontSize: "22px",
    lineHeight: "28px",
    cursor: "pointer",
  },
  symbol: {
    marginTop: "22px",
    color: "rgba(255, 85, 85, 0.9)",
    fontSize: "26px",
    textShadow: "0 0 18px rgba(255, 30, 30, 0.65)",
  },
  title: {
    margin: "18px 0 12px",
    fontSize: "clamp(26px, 4vw, 42px)",
    lineHeight: 1.04,
    fontWeight: 400,
    letterSpacing: "0.02em",
  },
  body: {
    margin: 0,
    color: "rgba(255, 225, 225, 0.74)",
    fontSize: "16px",
    lineHeight: 1.7,
  },
  progressTrack: {
    height: "1px",
    marginTop: "28px",
    background: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "rgba(255, 80, 80, 0.86)",
    boxShadow: "0 0 16px rgba(255, 50, 50, 0.8)",
    transition: "width 240ms ease",
  },
  footerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    marginTop: "20px",
  },
  progressText: {
    color: "rgba(255, 220, 220, 0.52)",
    fontSize: "12px",
    letterSpacing: "0.12em",
  },
  buttonRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  secondaryButton: {
    border: "1px solid rgba(255, 255, 255, 0.13)",
    borderRadius: "999px",
    padding: "10px 16px",
    color: "rgba(255, 235, 235, 0.82)",
    background: "rgba(255, 255, 255, 0.04)",
  },
  primaryButton: {
    border: "1px solid rgba(255, 120, 120, 0.45)",
    borderRadius: "999px",
    padding: "10px 18px",
    color: "rgba(255, 245, 245, 0.95)",
    background:
      "linear-gradient(135deg, rgba(155, 24, 24, 0.72), rgba(70, 5, 5, 0.82))",
    boxShadow: "0 0 22px rgba(180, 30, 30, 0.32)",
    cursor: "pointer",
  },
  dismissButton: {
    display: "block",
    margin: "18px auto 0",
    border: 0,
    color: "rgba(255, 220, 220, 0.45)",
    background: "transparent",
    fontSize: "12px",
    cursor: "pointer",
  },
};