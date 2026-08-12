import { Link } from "react-router-dom";
import LivingTitle from "../components/LivingTitle";
import CelestialField from "../components/CelestialField";

export default function CollectivePage() {
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

      <section style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 600 }}>
        <LivingTitle cycle={14} intensity="low">
          Reflection Received
        </LivingTitle>

        <p style={{ color: "rgba(255, 220, 220, 0.5)", marginBottom: 40 }}>
          Your reflection has entered the Collective.
        </p>

        <div style={{ display: "grid", gap: 16, maxWidth: 400, margin: "0 auto" }}>
          <Link className="aurelius-link" to="/witness-the-collective">Witness the Collective</Link>
          <Link className="aurelius-link" to="/insights">Explore Patterns</Link>
          <Link className="aurelius-link" to="/echoes">Listen to Echoes</Link>
          <Link className="aurelius-link" to="/">Offer Another Reflection</Link>
        </div>
      </section>
    </main>
  );
}
