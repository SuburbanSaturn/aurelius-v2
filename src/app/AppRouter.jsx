import { BrowserRouter, Routes, Route } from "react-router-dom";

import ReflectionPage from "../pages/ReflectionPage";
import PostSubmissionPage from "../pages/PostSubmissionPage";
import CollectivePage from "../pages/CollectivePage";
import InsightsPage from "../pages/InsightsPage";
import EchoesPage from "../pages/EchoesPage";
import ReflectionPostPage from "../pages/ReflectionPostPage";
import WitnessCollectivePage from "../pages/WitnessCollectivePage";
import ScripturePage from "../pages/ScripturePage";
import FeedbackPage from "../pages/FeedbackPage";
import AtlanteGuide from "../components/AtlanteGuide";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReflectionPage />} />
        <Route path="/submitted" element={<PostSubmissionPage />} />
        <Route path="/collective" element={<CollectivePage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/echoes" element={<EchoesPage />} />
        <Route path="/reflection/:id" element={<ReflectionPostPage />} />
        <Route path="/witness-the-collective" element={<WitnessCollectivePage />} />
        <Route path="/scripture" element={<ScripturePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
      <AtlanteGuide />
    </BrowserRouter>
  );
}