import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FrameSequence from "@/components/FrameSequence";
import FrameSequenceScene2 from "@/components/FrameSequenceScene2";
import TopTicker from "@/components/vpo/TopTicker";
import Navigation from "@/components/vpo/Navigation";
import ManifestoSection from "@/components/vpo/ManifestoSection";
import SpacesSection from "@/components/vpo/SpacesSection";
import CurrentSelectionSection from "@/components/vpo/CurrentSelectionSection";
import QuoteSection from "@/components/vpo/QuoteSection";
import RunwaySection from "@/components/vpo/RunwaySection";
import DistrictsSection from "@/components/vpo/DistrictsSection";
import AccessSection from "@/components/vpo/AccessSection";
import JournalSection from "@/components/vpo/JournalSection";
import WaitlistFooter from "@/components/vpo/WaitlistFooter";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  // Refresh ScrollTrigger when page loads and on resize
  useEffect(() => {
    // Wait for fonts and images to load
    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", handleLoad);
    
    // Also refresh on resize with debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <main className="bg-background overflow-hidden">
      <TopTicker />
      <Navigation />
      <FrameSequence />
      <ManifestoSection />
      <SpacesSection />
      <CurrentSelectionSection />
      <FrameSequenceScene2 />
      <QuoteSection />
      <RunwaySection />
      <DistrictsSection />
      <AccessSection />
      <JournalSection />
      <WaitlistFooter />
    </main>
  );
};

export default Index;
