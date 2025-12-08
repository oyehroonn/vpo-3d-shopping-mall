import FrameSequence from "@/components/FrameSequence";
import FrameSequenceScene2 from "@/components/FrameSequenceScene2";
import TopTicker from "@/components/vpo/TopTicker";
import Navigation from "@/components/vpo/Navigation";
import ManifestoSection from "@/components/vpo/ManifestoSection";
import SpacesSection from "@/components/vpo/SpacesSection";
import CurrentSelectionSection from "@/components/vpo/CurrentSelectionSection";
import QuoteSection from "@/components/vpo/QuoteSection";
import Footer from "@/components/vpo/Footer";

const Index = () => {
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
      <Footer />
    </main>
  );
};

export default Index;
