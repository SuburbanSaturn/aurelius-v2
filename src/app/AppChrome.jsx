import { useLocation } from "react-router-dom";
import AureliusAtmosphere from "../components/AureliusAtmosphere";

/**
 * AppChrome — Renders global atmosphere layer on non-embed routes.
 * 
 * Preserves the original rendering order:
 * AureliusAtmosphere renders BEFORE the page content (same as pre-embed).
 * AtlanteGuide is handled separately in AppRouter (renders AFTER routes).
 */
export default function AppChrome() {
  const location = useLocation();
  const isEmbed = location.pathname.startsWith("/embed");

  if (isEmbed) return null;

  return <AureliusAtmosphere />;
}
