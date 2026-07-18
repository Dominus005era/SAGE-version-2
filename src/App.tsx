import { Routes, Route } from "react-router-dom";
import PlatformApp from "./PlatformApp";
import { LandingPage } from "./pages/LandingPage";
import { PlatformPage } from "./pages/PlatformPage";
import { MethodologyPage } from "./pages/MethodologyPage";
import { MissionPage } from "./pages/MissionPage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/methodology" element={<MethodologyPage />} />
      <Route path="/mission" element={<MissionPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogPostPage />} />
      
      <Route path="/app/*" element={<PlatformApp />} />
    </Routes>
  );
}
