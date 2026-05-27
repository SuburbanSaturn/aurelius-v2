import { Link } from "react-router-dom";

export default function CollectivePage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Reflection Received</h1>
      <p>Your reflection has entered the Collective.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "30px" }}>
        <Link to="/witness-the-collective">Witness the Collective</Link>
        <Link to="/insights">Explore Patterns</Link>
        <Link to="/echoes">Listen to Echoes</Link>
        <Link to="/">Offer Another Reflection</Link>
      </div>
    </div>
  );
}