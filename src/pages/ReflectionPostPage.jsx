import { submitReflection } from "../services/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import LivingTitle from "../components/LivingTitle";
import CelestialField from "../components/CelestialField";

export default function ReflectionPostPage() {
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      const result = await submitReflection({
        content,
        categories: ["general"],
        anonymous_user_id: "web-user-1",
      });
      console.log("SUCCESS:", result);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 40%, rgba(120, 15, 15, 0.2), transparent 30%), rgba(2, 1, 1, 0.82)",
      color: "rgba(255, 245, 245, 0.86)",
      padding: "72px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <CelestialField density="sparse" speed={0.5} />

      <section style={{ position: "relative", zIndex: 1, textAlign: "center", width: "100%", maxWidth: 640 }}>
        <LivingTitle cycle={14} intensity="low">
          Reflection
        </LivingTitle>

        {!submitted ? (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              style={{
                width: "100%",
                padding: 20,
                background: "rgba(20, 2, 2, 0.34)",
                border: "1px solid rgba(155, 35, 35, 0.28)",
                borderRadius: 4,
                color: "rgba(255, 245, 245, 0.9)",
                fontSize: "1rem",
                lineHeight: 1.8,
                resize: "vertical",
                outline: "none",
                marginBottom: 24,
              }}
            />
            <button className="aurelius-btn" onClick={handleSubmit}>
              Submit Reflection
            </button>
          </>
        ) : (
          <>
            <p style={{ color: "rgba(255, 220, 220, 0.5)", marginBottom: 30 }}>
              Your reflection has been received.
            </p>
            <Link className="aurelius-link" to="/" style={{ display: "inline-block" }}>
              Return to Offering
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
