import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MarqueeSection from "@/components/MarqueeSection";
import CreativeHero from "@/components/CreativeHero";
import Solutions from "@/components/Solutions";
import ProjectBanner from "@/components/ProjectBanner";
import ProjectList from "@/components/ProjectList";
import CaseStudies from "@/components/CaseStudies";
import ImpactSection from "@/components/ImpactSection";
import StepSection from "@/components/StepSection";
import WorkStrip from "@/components/WorkStrip";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import ProjectBannerTwo from "@/components/ProjectBannerTwo";
// import MeetTheTeam from "@/components/MeetTheTeam";

const marqueeItems = [
  { text: "INFOGRAPHIC AND OTHER" },
  { text: "BRANDING & IDENTITY" },
  { text: "WEB DESIGN & DEVELOPMENT" },
  { text: "UI / UX DESIGN" },
  { text: "COMPLEX BRAND DESIGN" },
];

export default function Home() {
  return (
    <main>
      <Navbar />
      <CreativeHero />
      {/* <MarqueeSection items={marqueeItems} /> */}
      <Solutions />
      <ProjectBanner />
      {/* <ProjectBannerTwo /> */}
      <ProjectList />
      <Banner />
      <WorkStrip />
      <CaseStudies />
      {/* <MeetTheTeam /> */}
      <StepSection />
      <ImpactSection />
      {/* <Team /> */}
      <Footer />
    </main>
  );
}
