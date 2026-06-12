import React, { useState } from "react";
import { submitFeedback } from "../services/api";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    understanding: "",
    experience_notes: "",
    privacy_trust: "",
    improvement_priority: "",
    return_likelihood: "",
    email: "",
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      await submitFeedback(formData);
      setStatus("success");
      setFormData({
        understanding: "",
        experience_notes: "",
        privacy_trust: "",
        improvement_priority: "",
        return_likelihood: "",
        email: "",
      });
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong while saving feedback.");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(120, 20, 28, 0.35), transparent 42%), linear-gradient(180deg, #090506 0%, #12070a 45%, #050303 100%)",
        color: "#f7ece8",
        padding: "64px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          border: "1px solid rgba(255, 210, 190, 0.18)",
          borderRadius: "28px",
          padding: "36px",
          background: "rgba(10, 6, 8, 0.72)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            color: "#d88b7f",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontSize: "0.78rem",
          }}
        >
          Beta feedback
        </p>

        <h1
          style={{
            margin: "0 0 18px",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          Help Shape Aurelius
        </h1>

        <p
          style={{
            margin: "0 0 28px",
            color: "rgba(247, 236, 232, 0.78)",
            fontSize: "1.05rem",
            lineHeight: 1.7,
          }}
        >
          Aurelius is in beta. Your feedback helps shape the commons before it
          opens wider. Please do not include sensitive personal information
          here.
        </p>

        <div
          style={{
            marginBottom: "28px",
            padding: "18px",
            borderRadius: "18px",
            background: "rgba(180, 42, 42, 0.1)",
            border: "1px solid rgba(255, 180, 160, 0.14)",
            color: "rgba(247, 236, 232, 0.76)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#ffd7ce" }}>
            Reflections feed the Collective.
          </strong>{" "}
          Feedback improves the vessel.
        </div>

        {status === "success" ? (
          <div
            style={{
              padding: "28px",
              borderRadius: "22px",
              border: "1px solid rgba(150, 255, 190, 0.25)",
              background: "rgba(40, 120, 80, 0.12)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Received with gratitude.</h2>
            <p style={{ color: "rgba(247, 236, 232, 0.78)", lineHeight: 1.7 }}>
              Thank you for helping shape Aurelius. This feedback will not enter
              the Collective. It will only be used to improve the beta.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              style={buttonStyle}
            >
              Submit another note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FeedbackTextarea
              label="What did you understand Aurelius to be?"
              value={formData.understanding}
              onChange={(value) => updateField("understanding", value)}
            />

            <FeedbackTextarea
              label="What felt meaningful, strange, confusing, or broken?"
              value={formData.experience_notes}
              onChange={(value) => updateField("experience_notes", value)}
              large
            />

            <FeedbackTextarea
              label="Did the privacy explanation feel clear enough to trust?"
              value={formData.privacy_trust}
              onChange={(value) => updateField("privacy_trust", value)}
            />

            <FeedbackTextarea
              label="Which part should be improved first?"
              value={formData.improvement_priority}
              onChange={(value) => updateField("improvement_priority", value)}
            />

            <label style={labelStyle}>
              Would you return or contribute again?
              <select
                value={formData.return_likelihood}
                onChange={(event) =>
                  updateField("return_likelihood", event.target.value)
                }
                style={inputStyle}
              >
                <option value="">Choose one</option>
                <option value="Yes">Yes</option>
                <option value="Maybe">Maybe</option>
                <option value="Not right now">Not right now</option>
              </select>
            </label>

            <label style={labelStyle}>
              Optional email for follow-up
              <input
                type="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </label>

            {status === "error" && (
              <p
                style={{
                  color: "#ffb4a8",
                  marginBottom: "18px",
                  lineHeight: 1.6,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                ...buttonStyle,
                opacity: status === "submitting" ? 0.7 : 1,
                cursor: status === "submitting" ? "not-allowed" : "pointer",
              }}
            >
              {status === "submitting" ? "Sending..." : "Send feedback"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function FeedbackTextarea({ label, value, onChange, large = false }) {
  return (
    <label style={labelStyle}>
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={large ? 6 : 4}
        style={{
          ...inputStyle,
          resize: "vertical",
          lineHeight: 1.55,
        }}
      />
    </label>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "22px",
  color: "rgba(247, 236, 232, 0.86)",
  fontSize: "0.98rem",
  lineHeight: 1.5,
};

const inputStyle = {
  width: "100%",
  marginTop: "10px",
  padding: "14px 15px",
  borderRadius: "16px",
  border: "1px solid rgba(255, 220, 210, 0.16)",
  background: "rgba(255, 255, 255, 0.045)",
  color: "#f7ece8",
  outline: "none",
  fontSize: "1rem",
  boxSizing: "border-box",
};

const buttonStyle = {
  border: "1px solid rgba(255, 210, 190, 0.28)",
  background:
    "linear-gradient(135deg, rgba(175, 45, 45, 0.95), rgba(90, 16, 24, 0.95))",
  color: "#fff8f5",
  padding: "14px 20px",
  borderRadius: "999px",
  fontSize: "1rem",
  fontWeight: 650,
  boxShadow: "0 14px 34px rgba(120, 20, 20, 0.35)",
};